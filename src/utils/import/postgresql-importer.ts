import { DataType } from "@/lib/schemas/data-type-schema";
import { DatabaseDialect } from "@/lib/database";
import { BaseSqlImporter, ExtractedStatments, ParsedDatabaase, ParsedField } from "./base-sql-importer";
import { init, parse, format, validate, Statement } from '@guanmingchiu/sqlparser-ts';
import { TableInsertType } from "@/lib/schemas/table-schema";
import { FieldInsertType } from "@/lib/schemas/field-schema";

interface PostgreSQLType {
    name: string;
    values: string[]
}

export class PostgreSqlImporter extends BaseSqlImporter {

    private enums: PostgreSQLType[] = [];

    public constructor(data_types: DataType[]) {
        super(data_types);
        this.dialect = DatabaseDialect.POSTGRES;
    }

    public parseSql(sql: string) {
        try {

            this.enums = [];

            const cleaned: string = this.cleanSql(sql);

            const { createPostgresTypesStatements, alterSequenceStatments } = this.extractStatments(cleaned);
            if (createPostgresTypesStatements)
                for (const statment of createPostgresTypesStatements) {
                    const astStatment: any = parse(statment, this.dialect as any)?.pop();
                    if (astStatment?.CreateType) {
                        this.enums.push(this.astToEnum(astStatment.CreateType));
                    }
                }

            const parsedDatabaase: ParsedDatabaase = super.parseSql(sql);

            if (alterSequenceStatments) {
                for (const statment of alterSequenceStatments) {
                    try {
                        this.processAlterSequenceStatements(statment, parsedDatabaase.tables);
                    } catch (error) {
                        parsedDatabaase.errors.push(error as Error);
                    }
                }
            }

            
            return parsedDatabaase;
        } catch (error) {
            throw error;
        }
    }


    protected processAlterSequenceStatements(statment: string, tables: TableInsertType[]) {

        const regex =
            /ALTER\s+SEQUENCE\s+[\w"]+\.[\w"]+\s+OWNED\s+BY\s+("?[\w]+"?)\.("?[\w]+"?)\.("?[\w]+"?)/i;

        const match = statment.match(regex);

        if (!match) {
            return;
        }

        const schema = match[1].replace(/"/g, '');
        const tableName = match[2].replace(/"/g, '');
        const columnName = match[3].replace(/"/g, '');


        const table: TableInsertType | undefined = tables.find((table: TableInsertType) => table.name == tableName);
        if (!table) {
            throw Error(`table ${tableName} not found in : ${statment}`);
        }

        const index = table.fields?.findIndex((field: FieldInsertType) => field.name == columnName) ?? -1;
        if (index < 0) {
            throw Error(`field ${columnName} not found in : ${statment}`);
        }
 
        (table.fields as FieldInsertType[])[index].autoIncrement = true ; 

  

    }

    protected astToField(ast: any, sequence: number): ParsedField {
        const { field, fk_constraint } = super.astToField(ast, sequence);

        if (typeof ast.data_type === "object" && ast.data_type.Custom) {
            const typeName = ast.data_type.Custom[0]?.[0]?.Identifier?.value.toLowerCase();
            // it's a serial type
            if (typeName?.toLowerCase().includes("serial")) {

                field.autoIncrement = true;
            }
            else {
                const postgreSqlType: PostgreSQLType | undefined = this.enums.find((postgreSqlType: PostgreSQLType) => postgreSqlType.name == typeName);
                if (postgreSqlType && postgreSqlType.values.length > 0) {
                    try {
                        field.values = JSON.stringify(postgreSqlType.values);
                    } catch (error) {
                        console.error("failed to parse postgresql type values")
                    }
                }

            }
        }


        return { field, fk_constraint };
    }

    protected processDefaultValue(ast: any, dataType: DataType): string | undefined {

        let defaultValue: string | undefined = super.processDefaultValue(ast, dataType);

        if (!defaultValue) {
            if (ast.Function) {
                if (ast.Function.name?.[0]?.Identifier?.value == "gen_random_uuid") {
                    return "random";
                }
            }
        }

        return defaultValue
    }


    protected processDataType(typeName: string): DataType | undefined {
        let dataType: DataType | undefined = super.processDataType(typeName);

        if (!dataType) {
            if (typeName?.toLowerCase().includes("serial")) {
                // if it's a serial type , then get the base integer type (integer , smallint , bigint) 
                let baseType: string = typeName.toLowerCase() == "serial" ? "integer" : typeName.toLowerCase().replace("serial", "int");
                return super.processDataType(baseType);
            }
            else {
                const isEnum: boolean = Boolean(this.enums.find((postgreSqlType: PostgreSQLType) => postgreSqlType.name == typeName));
                if (isEnum) {
                    return this.data_types.find((dataType: DataType) => dataType.name == "enum")
                }
            }

        }
        return dataType
    }

    private astToEnum(ast: any): PostgreSQLType {

        const values: string[] | undefined = ast.representation?.Enum?.labels?.map((label: any) => label.value);

        return {
            name: ast.name?.[0]?.Identifier?.value,
            values
        } as PostgreSQLType;
    }

    protected extractStatments(sql: string): ExtractedStatments {

        const createPostgresTypesStatements: string[] = [];
        const alterSequenceStatments: string[] = [];
        const { createIndexStatements, createTableStatements, alterTableStatements } = super.extractStatments(sql);

        // Split into individual statements
        const statements = sql
            .split('\n')
            .map(s => s.trim())
            .filter(Boolean);

        for (const stmt of statements) {
            const upper = stmt.toUpperCase();
            if (upper.startsWith('CREATE TYPE')) {
                createPostgresTypesStatements.push(stmt);
            }
            if (upper.startsWith("ALTER SEQUENCE")) {
                alterSequenceStatments.push(stmt);
            }
        }

        return {
            createIndexStatements,
            createTableStatements,
            alterTableStatements,
            createPostgresTypesStatements,
            alterSequenceStatments
        };
    }
}


/*


CREATE TYPE "users_user_type_enum" AS ENUM (
  'individual',
  'agency',
  'developer',
  'admin',
  'employee'
);

CREATE TYPE "users_provider_enum" AS ENUM (
  'google.com',
  'facebook.com',
  'password',
  'anonymous'
);

CREATE TABLE "users" (
  id INTEGER NOT NULL PRIMARY KEY,
  full_name VARCHAR NOT NULL,
  email VARCHAR NOT NULL,
  picture_url VARCHAR NULL,
  phone_number VARCHAR NULL,
  password_hash VARCHAR NOT NULL,
  user_type users_user_type_enum NOT NULL DEFAULT 'individual',
  provider users_provider_enum NOT NULL DEFAULT 'password',
  birthday TIMESTAMP(3) NULL,
  gender BOOLEAN NULL,
  created_at TIMESTAMPTZ (6) NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ (6) NULL,
  is_email_verified BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE all_postgres_types (
  id BIGSERIAL PRIMARY KEY,

  -- Numeric types
  col_smallint       SMALLINT     NOT NULL DEFAULT 1,
  col_integer        INTEGER      NOT NULL UNIQUE DEFAULT 1000,
  col_bigint         BIGINT       NULL DEFAULT 10000,

  col_decimal        DECIMAL(10,2) NOT NULL DEFAULT 99.99,
  col_numeric        NUMERIC(8,3)  NULL DEFAULT 123.456,

  col_real           REAL         NULL DEFAULT 1.23,
  col_double         DOUBLE PRECISION NOT NULL DEFAULT 2.3456,

  col_boolean        BOOLEAN      NOT NULL DEFAULT TRUE,

  -- Date & time types
  col_date           DATE         NOT NULL DEFAULT DATE '2024-01-01',
  col_timestamp      TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  col_timestamptz    TIMESTAMPTZ  NOT NULL DEFAULT CURRENT_TIMESTAMP,
  col_time           TIME(6)      NULL DEFAULT TIME '12:34:56.123456',

  -- String types
  col_char           CHAR(10)     NOT NULL DEFAULT 'charval',
  col_varchar        VARCHAR(255) NULL UNIQUE DEFAULT 'varchar value',
  col_text           TEXT         NULL DEFAULT 'some text',

  -- Binary
  col_bytea          BYTEA        NULL,

  -- Enum (PostgreSQL requires type creation first)
  col_enum           TEXT         NOT NULL DEFAULT 'A',

  -- JSON
  col_json           JSON         NULL,
  col_jsonb          JSONB        NULL,

  -- UUID
  col_uuid           UUID         NOT NULL UNIQUE DEFAULT gen_random_uuid(),

  -- Array
  col_text_array     TEXT[]       NULL DEFAULT ARRAY['a','b','c'],

  -- Range types
  col_int_range      INT4RANGE    NULL,
  col_ts_range       TSRANGE      NULL,

  -- XML
  col_xml            XML          NULL,

  -- Some extra UNIQUE inline
  col_unique_text    TEXT         UNIQUE
);

*/