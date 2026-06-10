import { DataType } from "@/lib/schemas/data-type-schema";
import { BaseSqlImporter, ParsedDatabaase, ParsedField } from "./base-sql-importer";
import { DatabaseDialect } from "@/lib/database";
import { Modifiers, MySQLCharset, MySQLCollation } from "@/lib/field";

export class MysqlImporter extends BaseSqlImporter {

    public constructor(data_types: DataType[]) {
        super(data_types);
        this.dialect = DatabaseDialect.MYSQL;
    }
    
    protected astToField(ast: any, sequence: number): ParsedField {
        try {
            const { field, fk_constraint } = super.astToField(ast, sequence)
            // get the data type 
            const dataType: DataType = this.data_types.find((dataType: DataType) => dataType.id == field.typeId) as DataType;
            // if data type is of type set then extract it's values
            if (dataType.name == "set") {
                if (ast.data_type["Set"] && Array.isArray(ast.data_type["Set"])) {
                    try {
                        field.values = JSON.stringify(ast.data_type["Set"])
                    } catch (error) {
                        console.error("faield to parse Mysql Set values")
                    }
                }

            }
            // get data type modifiers
            const modifiers: string[] = dataType?.modifiers ? JSON.parse(dataType.modifiers) : [];

            const options: any | undefined = [] = ast.options;

            for (const option of options) {
                if (typeof option.option === "object") {
                    if (option.option?.CharacterSet?.[0]?.Identifier?.value && modifiers.includes(Modifiers.CHARSET)) {
                        const charset: string = option.option.CharacterSet[0].Identifier.value;

                        if (Object.values(MySQLCharset).includes(charset as MySQLCharset)) {

                            field.charset = charset;
                        }
                    }
                    if (option.option?.Collation?.[0]?.Identifier?.value && modifiers.includes(Modifiers.COLLATE)) {

                        const collate: string = option.option.Collation[0].Identifier.value;

                        if (Object.values(MySQLCollation).includes(collate as MySQLCollation)) {

                            field.collate = collate;
                        }

                    }

                }
            }

            return { field, fk_constraint };
        } catch (error) {
            throw error;
        }
    }


    protected cleanSql(sql: string): string {
        let cleaned: string = super.cleanSql(sql);
        return cleaned.replace(/\b(?:unsigned|zerofill)\b/gi, '');
    }
}



/*


CREATE TABLE employees (
    id INT PRIMARY KEY AUTO_INCREMENT,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    department_id INT,

    CONSTRAINT uq_employee_name_dept
        UNIQUE (first_name, last_name, department_id)
);

CREATE TABLE products (
    id INT PRIMARY KEY AUTO_INCREMENT,
    sku VARCHAR(100),
    name VARCHAR(255)
);

ALTER TABLE products
ADD CONSTRAINT uq_products_sku
UNIQUE (sku);


*/