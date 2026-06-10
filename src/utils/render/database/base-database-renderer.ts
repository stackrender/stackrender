import { DatabaseDialect } from "@/lib/database";
import { DataTypes, ForeignKeyActions, Modifiers, MYSQL_MAX_VAR_LENGTH, TimeDefaultValues } from "@/lib/field";
import { DataType } from "@/lib/schemas/data-type-schema";
import { DatabaseType } from "@/lib/schemas/database-schema";
import { FieldType } from "@/lib/schemas/field-schema";
import { IndexType } from "@/lib/schemas/index-schema";
import { Cardinality, RelationshipType } from "@/lib/schemas/relationship-schema";
import { TableType } from "@/lib/schemas/table-schema";
import { DBDiffOperation,  mapDiffToDBDiffOperation, normalizeDatabase } from "@/utils/database";
import { optimizeOps, prepareForMigration } from "@/utils/migration";
import {   compare } from "fast-json-patch";
import { AST } from "node-sql-parser";
import { Statement } from "pgsql-ast-parser";
import { getPostgresEnumName } from "../render-uttils"; 
import { emptyDb } from "@/lib/database";

export default abstract class BaseDatabaseRenderer {

    protected dialect: DatabaseDialect;
    protected data_types: DataType[];
    protected schema?: DatabaseType | undefined;
    protected parser: any;
    protected readyPromise: Promise<void>;

    public constructor(dialect: DatabaseDialect, data_types: DataType[]) {
        this.dialect = dialect;
        this.data_types = data_types;

        this.readyPromise = import("node-sql-parser").then((sqlParser) => {
            this.parser = new sqlParser.Parser();
        })

    }

    public getDialect(): DatabaseDialect {
        return this.dialect;
    }
 
    public async renderDDL(database: DatabaseType): Promise<string> {

        const previousDatabase = emptyDb(database);

        // we prepare both databases by enriching them and removing some UI elements that can interfear with json fast path
        const preparedCurrentDatabase = prepareForMigration(database);
        const preparedPreviousDatabse = prepareForMigration(previousDatabase);

        // notmalize both just ignore array elements order diff 
        const normalizedPreviousDatabase = normalizeDatabase(preparedPreviousDatabse);
        const normalizedCurrentDatabase = normalizeDatabase(preparedCurrentDatabase);

        // perform a comparison to extract the diff between the previous database and the current one . 
        const diff_json = compare(normalizedPreviousDatabase, normalizedCurrentDatabase);
        // map the diff to DB Diff operations to facilate the rendering 
        // optimize the operations by enriching each operation 
        let operations: DBDiffOperation[] = mapDiffToDBDiffOperation(diff_json)
        operations = optimizeOps(operations, preparedCurrentDatabase, preparedPreviousDatabse, this.data_types);

        // extract the ast based on the dialect 
        const ast: ASTStatment[] = this.operationsToAst(operations, database);
        // render ast from sql  
        const sql = await this.astToSQL(ast);

        return sql;
    }

    protected operationsToAst(operations: DBDiffOperation[], database?: DatabaseType): ASTStatment[] {
        const ast: ASTStatment[] = [];
        // we basiclly loop over all operations , and turn them into ast . 
        // some operation can return multiple statments . 
        // so for that we need to check our input if its one AST or an object AST 
        for (const operation of operations) {
            const statmentAst = this.operationToAst(operation);
            if (!statmentAst)
                continue;
            else if (Array.isArray(statmentAst))
                ast.push(...statmentAst);
            else
                ast.push(statmentAst);
        }
        return ast;
    }

    protected operationToAst(operation: DBDiffOperation): ASTStatment | ASTStatment[] | null {
        switch (operation.type) {
            case "CREATE_TABLE":
                return this.createTableAst(
                    operation.table
                );

            case "CREATE_RELATIONSHIP":
                if (operation.relationship.cardinality == Cardinality.many_to_many)
                    break;
                return this.createRelationshipAst(
                    operation.relationship,
                );
 
        }
        return null;
    }

    protected abstract astToSQL(ast: ASTStatment[]): Promise<string>;

    protected createTableAst(table: TableType): ASTStatment[] | ASTStatment {
        let indices_ast: ASTStatment[] = [];
        // get primary keys and check if we hame more than one  
        const primaryKeys: FieldType[] = table.fields.filter((field: FieldType) => field.isPrimary);
        const multiPrimaryKeys: boolean = primaryKeys.length > 1;
        // check if we have multiple primary keys if so we need to create a contraint
        const constraints: ASTStatment[] = multiPrimaryKeys ? [this.getPrimaryKeyContraint(primaryKeys)] : [];
        // get field dification 
        const field_definitions = table.fields.map((field: FieldType) => this.getFieldDefinition(field, table, multiPrimaryKeys))
        // the base table ast contain only the field dification and the contraints , then child renderer turn it to ast
        // check if the table have indices
        if (table.indices && table.indices.length > 0) {
            // if so loop over it indices and ignore the index with no columns since that will cause an SQl Syntax error . 
            // finally get the ast of the index and push it to the indices_ast 
            for (const index of table.indices) {
                if (index.fieldIndices.length == 0)
                    continue;
                indices_ast.push(this.createIndexAst(
                    table,
                    index
                ))
            }
        }

        return {
            field_definitions,
            constraints,
            indices_ast
        } as any;
    }
 

    protected updateFieldAst(table: TableType, field: FieldType, changes: FieldType): ASTStatment | ASTStatment[] {
        // get the previous type 
        let type = field.type;

        const ast: any = {
            length: null,
            scale: null,
            dataType: null,
            auto_increment: null,
        }
        // if there is changes in the type , max length , scale or precision or auto incrrement . 
        // in this case SQL Database treat this as a type changes  
        if (changes.typeId || changes.maxLength || changes.scale || changes.precision || changes.autoIncrement !== undefined || changes.values) {
            // if the type changes  , get the new type 
            if (changes.typeId)
                type = changes.type;

            // get the new or the old type name  
            ast.dataType = (this.dialect == DatabaseDialect.POSTGRES && type.name == "enum") ? getPostgresEnumName(table, field) : type.name?.toLocaleUpperCase();
            // get the new or old type modifiers
            const modifiers: string[] = type.modifiers ? JSON.parse(type.modifiers) : [];
            // if the type support length as VARCHAR(length) and we either have an old max length , or new max length , then set it in the ast
            if (modifiers.includes(Modifiers.LENGTH) && (changes.maxLength || field.maxLength)) {
                if (changes.maxLength)
                    ast.length = changes.maxLength
                else
                    ast.length = field.maxLength;
            }
            // if the field support precision and we either have a previous precision or the user add new one .
            // then set the precision in the AST .
            if (modifiers.includes(Modifiers.PRECISION) && (changes.precision || field.precision)) {
                if (changes.precision) {
                    ast.length = changes.precision;
                } else {
                    ast.length = field.precision;
                }
                if (modifiers.includes(Modifiers.SCALE) && !(changes.scale || field.scale)) {
                    // if the scale is not set , we have to set it as O 
                    ast.scale = "0";
                }
            }
            // if the type support scale , and scale is set then add it to the ast 
            if (modifiers.includes(Modifiers.SCALE) && (changes.scale || field.scale)) {
                if (changes.scale) {
                    ast.scale = changes.scale;
                } else {
                    ast.scale = field.scale;
                }
            }
            //  okay if the field is auto increment in postgres we need to switch the type ro serial type . 
            if (modifiers.includes(Modifiers.AUTO_INCREMENT) && (field.autoIncrement || changes.autoIncrement) && this.dialect == DatabaseDialect.POSTGRES) {
                if (changes.autoIncrement !== false) {
                    if (ast.dataType == "INTEGER")
                        ast.dataType = "SERIAL";
                    else
                        ast.dataType = ast.dataType.replace("INT", "SERIAL");
                }
            }
            // if there changes in the values 
            if (modifiers.includes(Modifiers.VALUES) && changes.values && this.dialect != DatabaseDialect.POSTGRES) {
                try {
                    ast.values = JSON.parse(changes.values);
                } catch (error) {
                    ast.value = [];
                }
            }
        }
        return ast as AST;
    }

 

    protected createRelationshipAst(relationship: RelationshipType): ASTStatment {

        let primaryKey: FieldType = relationship.sourceField;
        let foreignKey: FieldType = relationship.targetField;

        let sourceTable: TableType = relationship.sourceTable;
        let targetTable: TableType = relationship.targetTable;

        if (relationship.cardinality == Cardinality.many_to_one) {
            primaryKey = relationship.targetField;
            foreignKey = relationship.sourceField;
            sourceTable = relationship.targetTable;
            targetTable = relationship.sourceTable;
        }
        return {
            primaryKey,
            foreignKey,
            sourceTable,
            targetTable
        } as any
    }

 

    protected abstract createIndexAst(table: TableType, index: IndexType): ASTStatment;

    protected abstract getPrimaryKeyContraint(field: FieldType[], table?: TableType): ASTStatment;

    protected abstract startTransaction(): string;

    protected abstract commit(): string;


    protected getFieldDefinition(field: FieldType, table: TableType, ignorePkContraint: boolean): ASTStatment {
        // get the modifiers based on the field data type
        const modifiers: string[] = field?.type?.modifiers ? JSON.parse(field?.type.modifiers) : [];

        const ast: any = {
            length: null,
            scale: null,
            default_value: null,
            dataType: null,
            values: null,
            default_value_type: null,
            auto_increment: null,
            primary_key: ignorePkContraint ? false : field.isPrimary,
            modifiers: null
        }



        // data types by the defaut the field data type name , except for Postgres types needs to be handled diffrenet
        ast.dataType = field.type?.name?.toLocaleUpperCase();

        // if the field support PRECISION & SCALE modifiers set the length to precision 
        if (modifiers.includes(Modifiers.PRECISION) && field.precision) {
            ast.length = field.precision;
            if (modifiers.includes(Modifiers.SCALE) && !field.scale)
                ast.scale = "0";
        }
        // if the field support sclae and sclae is set then set the scale
        if (modifiers.includes(Modifiers.SCALE) && field.scale)
            ast.scale = field.scale;

        // the field support dynamic length , set the length ast 
        // but in case the max length is not set, and the dielect (Mysql , MariaDb ) require a length , then set the default length 
        if (modifiers.includes(Modifiers.LENGTH) && field.maxLength)
            ast.length = field.maxLength;

        else if (
            modifiers.includes(Modifiers.LENGTH) &&
            (field.type.dialect == DatabaseDialect.MYSQL || field.type.dialect == DatabaseDialect.MARIADB) &&
            field.type.name?.startsWith('var') &&
            !field.maxLength
        )
            ast.length = MYSQL_MAX_VAR_LENGTH;

        // if the field is an enum type just parse the enum values 
        if (modifiers.includes(Modifiers.VALUES) && field.values) {
            try {
                ast.values = JSON.parse(field.values);
            } catch (error) {
                ast.value = [];
            }
        }
        const default_value_defintition = this.processDefaultValue(field) as any

        if (default_value_defintition) {
            const { default_value_type, default_value } = default_value_defintition;
            ast.default_value_type = default_value_type;
            ast.default_value = default_value;

        }

        // if the field support auto increment and if the field it is , then set aut increment ast to true . 
        // but if the dialect is Postgres , then we have to change the type from INTEGERS to SERIALS 
        if (modifiers.includes(Modifiers.AUTO_INCREMENT) && field.autoIncrement && field.type.dialect != DatabaseDialect.POSTGRES) {
            ast.auto_increment = true
        } else if (modifiers.includes(Modifiers.AUTO_INCREMENT) && field.autoIncrement && field.type.dialect == DatabaseDialect.POSTGRES) {
            ast.auto_increment = true;
            if (ast.dataType == "INTEGER")
                ast.dataType = "SERIAL";
            else
                ast.dataType = ast.dataType.replace("INT", "SERIAL");
        } else {
            ast.auto_increment = false;
        }

        ast.modifiers = modifiers;
        return ast;
    }

    protected processDefaultValue(field: FieldType): AST | null {
        // if the field have a default value  then we need to proccess it based on it type 
        if (field.defaultValue && field.defaultValue.trim().length > 0) {

            const ast: any = {
                default_value_type: null,
                default_value: null
            }

            if ((field.type.type == DataTypes.INTEGER || field.type.type == DataTypes.NUMERIC) && !isNaN(Number(field.defaultValue))) {
                ast.default_value_type = "number"
                if (field.type.type == DataTypes.NUMERIC)
                    ast.default_value = parseFloat(field.defaultValue);
                else
                    ast.default_value = parseInt(field.defaultValue);
            }
            else if (field.type.type == DataTypes.TEXT || field.type.type == DataTypes.ENUM) {
                if (field.type.type == DataTypes.ENUM) {
                    const values = field.values ? JSON.parse(field.values) : [];

                    if (field.type.name == "set") {
                        ast.default_value_type = "single_quote_string";
                        ast.default_value = field.defaultValue;

                    }
                    else if (values.includes(field.defaultValue)) {
                        ast.default_value_type = "single_quote_string";
                        ast.default_value = field.defaultValue;
                    }
                }
                else {
                    ast.default_value_type = "single_quote_string";
                    ast.default_value = field.defaultValue;
                }

            }
            // if we have a field of type time and the default value is Now , then the default value is the fucntion CURRENT_TIME or NOW()
            else if (field.type.type == DataTypes.TIME && field.defaultValue == TimeDefaultValues.NOW) {
                ast.default_value_type = "function";
                ast.default_value = "CURRENT_TIMESTAMP";
            }

            else if ((field.type.name == "uuid" || field.type.name == "uniqueidentifier") && field.defaultValue == "random") {
                ast.default_value_type = "function";
                ast.default_value = "random";

            }
            else if (field.type.type == DataTypes.TIME) {
                ast.default_value_type = "single_quote_string";
                ast.default_value = field.defaultValue;
            }
            // the field have a boolean value 
            else if (field.defaultValue == "true" || field.defaultValue == "false") {
                ast.default_value_type = "bool"
                ast.default_value = field.defaultValue == "true" ? true : false;
            }
            return ast;
        }
        return null;
    }
}

export interface DBRenderOutput {
    schema: DatabaseType,
    diff_json: any[],
    sql: string;
    operations: DBDiffOperation[];
}


export type ASTStatment = AST | Statement | string | null   