
import { FieldType } from "@/lib/schemas/field-schema";
import { TableType } from "@/lib/schemas/table-schema";
import BaseDatabaseRenderer, { ASTStatment } from "./base-database-renderer";
import { DEFAULT_LENGTH_PARAM, ForeignKeyActions, Modifiers } from "@/lib/field";
import { IndexType } from "@/lib/schemas/index-schema";
import { RelationshipType } from "@/lib/schemas/relationship-schema";
import { DataType } from "@/lib/schemas/data-type-schema";
import { DatabaseDialect } from "@/lib/database";
import { format } from 'sql-formatter';
import { AST } from "node-sql-parser";
 
export default class MSSqlRenderer extends BaseDatabaseRenderer {


    public constructor(data_types: DataType[]) {
        super(DatabaseDialect.MSSQL, data_types)
    }

    protected async astToSQL(ast: ASTStatment[]): Promise<string> {
        let sql = ast.join("\n");
        sql = format(sql, { language: 'sql' });
        if (sql.length > 0) {
            sql = `${this.startTransaction()}

${sql}

${this.commit()}
`
        }
        return sql;
    }

    protected createTableAst(table: TableType): ASTStatment[] | ASTStatment {
        const ast: any = super.createTableAst(table);
    
        let indexes: string = ast.indices_ast.filter((index: string) => index != null).join("\n")

        // get primary keys and check if we hame more than one  
        const primaryKeys: FieldType[] = table.fields.filter((field: FieldType) => field.isPrimary);
        let constraints: ASTStatment = "";
        if (primaryKeys.length > 0) {
            constraints = this.getPrimaryKeyContraint(primaryKeys, table)
        }
        return `
        CREATE TABLE ${table.name} (
            ${(ast as any).field_definitions.join(",\n")}
            ${constraints ? ',\n' + constraints : ""}
        );
        ${indexes}
        ` ;
    }


    protected getFieldDefinition(field: FieldType, table: TableType, ignorePkContraint: boolean = false, dropDefaultValue: boolean = false): ASTStatment {

        const ast: any = super.getFieldDefinition(field, table, ignorePkContraint);

        let autoIncrement: string = ast.modifiers.includes(Modifiers.AUTO_INCREMENT) ? (ast.auto_increment ? "IDENTITY(1,1)" : "") : ""

        let nullable: string = ""
        let unique: string = "";

        if (!ast.primary_key)
            nullable = (field.nullable !== undefined) ? (field.nullable ? "NULL" : "NOT NULL") : "";

        let options: number[] | string = [];

        if (ast.length)
            options.push(ast.length);

        else if (ast.modifiers.includes(Modifiers.LENGTH))
            options.push(DEFAULT_LENGTH_PARAM);

        if (ast.scale && ast.scale != "0")
            options.push(ast.scale);

        options = options.length > 0 ? `(${options.join(",")})` : "";

        let defaultValue: any = "";

        if (ast.default_value !== undefined && ast.default_value !== null && !dropDefaultValue) {
            defaultValue = `CONSTRAINT DF_${table.name}_${field.name} DEFAULT ${ast.default_value}`;
        }
        if (!ast.primary_key) {
            unique = field.unique ? `CONSTRAINT UQ_${table.name}_${field.name} UNIQUE` : "";
        }

        const dataType = field.type.name == "uuid" ? "RAW(16)" : ast.dataType;

        return `${field.name} ${dataType}${options} ${autoIncrement} ${nullable} ${defaultValue} ${unique} `;
    }

    protected processDefaultValue(field: FieldType): AST | null {
        const ast: any = super.processDefaultValue(field);
      
        if (ast && ast.default_value_type) { 
            if (ast.default_value_type == "single_quote_string") {
                ast.default_value = `'${ast.default_value}'`
            }
            else if (ast.default_value_type == "number" || ast.default_value_type == "bool")
                ast.default_value = ast.default_value;

            else if (ast.default_value_type == "function") {

                if (ast.default_value == "CURRENT_TIMESTAMP") {

                    switch (field.type.name?.toUpperCase()) {
                        case "DATE":
                            ast.default_value = "CAST(GETDATE() AS DATE)"
                            break;
                        case "DATETIME":
                            ast.default_value = "GETDATE()"
                            break;
                        case "SMALLDATETIME":
                            ast.default_value = "GETDATE()"
                            break;
                        case "DATETIME2":
                            ast.default_value = "SYSDATETIME()"
                            break;
                        case "DATETIMEOFFSET":
                            ast.default_value = "SYSDATETIMEOFFSET()"
                            break;
                    }
                } else if (ast.default_value == "random") {
                    if (field.isPrimary)
                        ast.default_value = "NEWSEQUENTIALID()"
                    else
                        ast.default_value = "NEWID()"
                }
                   
            }
            if ( ast.default_value_type == "bool") {  
                if (ast.default_value) { 
                    ast.default_value = 1 ; 
                }else { 
                    ast.default_value = 0 ; 
                }
            }
            
        }

        return ast;
    }
    
    protected createRelationshipAst(relationship: RelationshipType): ASTStatment {
        const { primaryKey, foreignKey, sourceTable, targetTable } = super.createRelationshipAst(relationship) as any;

        const constraintName: string = relationship.name ? " CONSTRAINT " + relationship.name : "";

        const onDeleteFKAction: string | null = this.foreignKeyActionToAst(relationship.onDelete as ForeignKeyActions);
        const onUpdateFKAction: string | null = this.foreignKeyActionToAst(relationship.onUpdate as ForeignKeyActions);

        const onDeleteAction: string = onDeleteFKAction ? `ON DELETE ${onDeleteFKAction}` : ""
        const onUpdateAction: string = onUpdateFKAction ? `ON UPDATE ${onUpdateFKAction}` : ""

        const FKActions: string = [onDeleteAction, onUpdateAction].join(" ");

        return `
            ALTER TABLE ${targetTable.name}
            ADD ${constraintName} FOREIGN KEY (${foreignKey.name})
            REFERENCES ${sourceTable.name}(${primaryKey.name}) ${FKActions};
        `
    }

    protected foreignKeyActionToAst(action: ForeignKeyActions): string | null {
        switch (action) {
            case ForeignKeyActions.CASCADE:
                return "CASCADE";

            case ForeignKeyActions.SET_NULL:
                return "SET NULL";
            case ForeignKeyActions.SET_DEFAULT:
                return "SET DEFAULT";
        }
        return null;
    }
  
    protected createIndexAst(table: TableType, index: IndexType): ASTStatment {
        const unique: string = index.unique ? " UNIQUE" : "";

        let columns: string[] | string = index.fields.map((field: FieldType) => field.name);
        if (columns.length == 0)
            return null;
        columns = `(${columns.join(",")})`
        return `CREATE${unique} INDEX ${index.name} ON ${table.name} ${columns} ;`

    }
  
    protected getPrimaryKeyContraint(fields: FieldType[], table?: TableType): ASTStatment {
        const pks: string[] = fields.map((field: FieldType) => field.name);
        return `CONSTRAINT PK_${table?.name} PRIMARY KEY (${pks.join(",")})`
    } 
     
    protected startTransaction(): string {
        return `BEGIN TRANSACTION;`
    }
    protected commit(): string {
        return "COMMIT;"
    }
 
   
} 