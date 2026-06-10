import { FieldType } from "@/lib/schemas/field-schema";
import { AST } from "node-sql-parser";
import { DataType } from "@/lib/schemas/data-type-schema";
import { DatabaseDialect } from "@/lib/database";
import { fixCharsetPlacement } from "../render-uttils";
import { format } from 'sql-formatter';
import { Modifiers } from "@/lib/field";
import { TableType } from "@/lib/schemas/table-schema";
import { BaseSQLRenderer } from "./base-sql-renderer";
import { IndexType } from "@/lib/schemas/index-schema";


export default class MysqlRenderer extends BaseSQLRenderer {

    public constructor(data_types: DataType[], dialect: DatabaseDialect = DatabaseDialect.MYSQL) {
        super(dialect, data_types)
    }
    protected async  astToSQL(ast: AST[]): Promise<string> {
        // for Mysql , MariaDB , we use node-sql-parser to turn AST to SQL , 
        // the package have a bug which is CHARSET and COLLATION missplacementts 
        // so we patch it using fixCharsetPlacement function 
        // and finally we format the code 
        try {
            let sql: string = await super.astToSQL(ast);
            sql = fixCharsetPlacement(format(sql, { language: "sql" }));
            sql = format(sql, { language: 'sql' });

            if (sql.length > 0) {
                sql = `${this.startTransaction()}

${sql};

${this.commit()}
`
            }
            return sql;
        } catch (error) {
            throw error;
        }

    }

    protected getFieldDefinition(field: FieldType, table: TableType, ignorePkContraint: boolean): AST {
        // get the modifiers based on the field data type
        const modifiers: string[] = field?.type.modifiers ? JSON.parse(field?.type.modifiers) : [];

        // we get the base field definition from the parent renderer 
        const definition: any = super.getFieldDefinition(field, table, ignorePkContraint)
        // Mysql , MariaDB ,Have some additional attributes such as charset collation , the enum values are inline unlike Postgres , Unsigned , and ZERO FILL  
        // also we need default value expression that it is compatible with node-sql-parser 
        let suffix: string[] = [];

        // check if the field support ZEROFILL and if it set , and the same thing for unsigned 
        if (modifiers.includes(Modifiers.ZEROFILL) && field.zeroFill) {
            suffix.push(Modifiers.ZEROFILL.toUpperCase());
        }
        if (modifiers.includes(Modifiers.UNSIGNED) && field.unsigned) {
            suffix.push(Modifiers.UNSIGNED.toUpperCase());
        }
        // if it support charset and charset is set , then generate it expression
        if (modifiers.includes(Modifiers.CHARSET) && field.charset)

            definition.character_set = {
                type: "CHARACTER SET",
                value: {
                    type: "default",
                    value: field.charset
                }
            }
        // if it support collate and collate is set , then generate it expression
        if (modifiers.includes(Modifiers.COLLATE) && field.collate)

            definition.collate = {
                keyword: "collate",
                type: "collate",
                collate: {
                    name: field.collate,
                }
            }

        if (suffix.length > 0) {
            definition.definition.suffix = suffix
        }
        return definition;

    }

    protected getUsingAst(table: TableType, field: FieldType, dataType: DataType): AST | null {
        return null;
    }
}