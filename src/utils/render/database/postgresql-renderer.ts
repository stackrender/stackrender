import { DataType } from "@/lib/schemas/data-type-schema";
import { DatabaseDialect, getDatabaseByDialect } from "@/lib/database";
import { FieldType } from "@/lib/schemas/field-schema";
import { TableType } from "@/lib/schemas/table-schema";
import { BaseSQLRenderer } from "./base-sql-renderer";
import { AST  } from "node-sql-parser";
import { getPostgresEnumName } from "../render-uttils";
import { Cardinality, RelationshipType } from "@/lib/schemas/relationship-schema";
import { IndexType } from "@/lib/schemas/index-schema";
import { Statement, toSql } from "pgsql-ast-parser";
import { ASTStatment } from "./base-database-renderer";
import { format } from "sql-formatter";
import { DBDiffOperation } from "@/utils/database";
import { DataTypes } from "@/lib/field";

 
export default class PostgresqlRenderer extends BaseSQLRenderer {

    public constructor(data_types: DataType[]) {
        super(DatabaseDialect.POSTGRES, data_types)
    }

    protected async astToSQL(ast: ASTStatment[]): Promise<string> {
        // postgres renderer is different , we use a different parser pgsql-ast-parser for index , enum renaming . 
        // those kind of operations return Statment not AST . 
        // so the we pass AST to the default parser and Statment to Postgres parser  

        await this.readyPromise ; 
        let sql: string[] = [];
        
        for (const statment of ast) {
            if ((statment as Statement)?.type == "alter index" || (statment as Statement)?.type == "alter enum") {
                // index renaming 
                sql.push(toSql.statement(statment as Statement) + ";");
            }
            else {
                const statment_sql = this.parser.sqlify(statment as AST, {
                    database: getDatabaseByDialect(this.dialect).name
                });
                sql.push(statment_sql + ";");
            }
        }

        if (sql.length > 0) {
            sql = [this.startTransaction( ) , ...sql , this.commit()]
        }
        return format(sql.join(""), { language: 'postgresql' });
    }

 
    protected createTableAst(table: TableType): AST[] | AST {
        // the only difference in create table statment in postgres is we need to get declare all enums before creating the table 
        const definition: AST[] = super.createTableAst(table) as any
        // so we need an enum ast 
        const enumsAst: AST[] = [];
        // get fields to type enum 
        let postgresEnums: FieldType[] = table.fields.filter((field: FieldType) => field.type?.name == "enum");
        if (postgresEnums.length > 0) {
            // loop over them and intiat them one by one 
            for (const postgresEnum of postgresEnums) {
                (postgresEnum as any).table = table;
                enumsAst.push(this.createEnumAst(postgresEnum));
            }
        }
        definition.splice(0, 0, ...enumsAst);
        return definition;
    }
 
 
    protected getFieldDefinition(field: FieldType, table: TableType, ignorePkContraint: boolean): AST {
        // we get the base field definition from the parent renderer 
        const definition: any = super.getFieldDefinition(field, table, ignorePkContraint);

        // since postrges uses the serial data types , then there is not need for auto incrmenet attribute 
        definition.auto_increment = undefined;
        // postgres handle enums diffrently , we need to create the enum first then reference to it in the column line 
        if (definition.definition.dataType == "ENUM") {
            definition.definition.dataType = getPostgresEnumName(table, field);
            definition.definition.expr = undefined;
        }
        return definition;
    }
 


    private createEnumAst(field: FieldType): AST {
        // get the enum values , and cast it into an array 
        const jsonValues = field.values ? JSON.parse(field.values) : [];
        // return the ast of creating a table
        return {
            as: "as",
            type: "create",
            resource: "enum",
            name: {
                schema: null,
                name: `${(field as any).table.name}_${field.name.toLowerCase()}_enum`
            },
            keyword: "type",
            create_definitions: {
                parentheses: true,
                type: "expr_list",
                value: jsonValues.map((value: string) => ({
                    type: "single_quote_string",
                    value
                }))
            }
        } as any
    }

    protected getUsingAst(table: TableType, field: FieldType, newDataType: DataType): AST | null {

        const oldType: DataTypes = field.type.type as DataTypes;
        const newType: DataTypes = newDataType.type as DataTypes;

        if (oldType === newType && oldType != DataTypes.ENUM) return null;

        if (
            (oldType === DataTypes.INTEGER && newType === DataTypes.NUMERIC) ||
            (oldType === DataTypes.NUMERIC && newType === DataTypes.INTEGER)
        ) return null;


        let dataType = newDataType.name?.toUpperCase();

        if (newDataType.name == "enum")
            dataType = "TEXT::" + getPostgresEnumName(table, field);
        else if (newDataType.name != "text")
            dataType = "TEXT::" + newDataType.name?.toUpperCase();

        return {
            as: null,
            symbol: "::",
            target: [
                {
                    dataType
                }
            ],
            type: "cast",
            keyword: "cast",
            expr: {
                type: "column_ref",
                table: null,
                column: {
                    expr: {
                        type: "default",
                        value: field.name
                    }
                },
                collate: null
            }
        } as any;
    }

    protected startTransaction(): string {
        return "BEGIN;" ;  
    } 
}
