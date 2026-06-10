
import { randomColor } from '@/lib/colors';
import { DatabaseDialect } from '@/lib/database';
import { DataTypes, ForeignKeyActions, Modifiers, TimeDefaultValues } from '@/lib/field';
import { DataType } from '@/lib/schemas/data-type-schema';
import { FieldInsertType } from '@/lib/schemas/field-schema';
import { IndexInsertType } from '@/lib/schemas/index-schema';
import { Cardinality, RelationshipInsertType } from '@/lib/schemas/relationship-schema';
import { TableInsertType  } from '@/lib/schemas/table-schema';
import { init, parse, ReferentialAction } from '@guanmingchiu/sqlparser-ts';
import { v4 } from 'uuid';


export class BaseSqlImporter {


    protected data_types: DataType[] = [];
    protected dialect: DatabaseDialect | undefined;

    public constructor(data_types: DataType[]) {
        this.data_types = data_types;
        init();
    }

    public parseSql(sql: string) {

        let errors: Error[] = [];

        const tables: TableInsertType[] = [];
        const relationships: RelationshipInsertType[] = [];
        const indexes: IndexInsertType[] = [];
        const fk_constraints: any[] = [];

        const cleaned = this.cleanSql(sql);

        const { createIndexStatements, alterTableStatements, createTableStatements } = this.extractStatments(cleaned);

        try {
            for (const statment of createTableStatements) {

                try {
                    const astStatment: any = parse(statment, this.dialect as any)?.pop();

                    if (astStatment?.CreateTable) {
                        const { table, errors: tableErrors, fk_constraints: tableFkConstraints } = this.astToTable(astStatment);
                        if (table)
                            tables.push(table);
                        errors.push(...tableErrors);

                        if (tableFkConstraints)
                            fk_constraints.push(...tableFkConstraints);

                    }
                } catch (error) { 
                    errors.push(error as Error);
                }

            }
            for (const statment of alterTableStatements) {
                try {
                    const astStatment: any = parse(statment, this.dialect as any)?.pop();

                    if (astStatment?.AlterTable) {

                        for (const operation of astStatment.AlterTable.operations) {

                            if (operation.AddConstraint?.constraint?.ForeignKey) {

                                const targetTableName: string | undefined = astStatment.AlterTable.name?.at(-1)?.Identifier?.value;
                                if (!targetTableName)
                                    continue;

                                fk_constraints.push({
                                    ...operation.AddConstraint.constraint.ForeignKey,
                                    target_table: targetTableName
                                })

                            }
                            else if (operation.AddConstraint?.constraint?.Unique) {

                                const table: TableInsertType | undefined = tables.find((table: TableInsertType) => table.name == astStatment.AlterTable.name?.at(-1)?.Identifier?.value);

                                const columns: any[] | undefined = operation.AddConstraint?.constraint?.Unique?.columns;

                                if (!table || !columns) {
                                    continue;
                                }
                                if (columns && columns.length > 0 && table.fields) {

                                    for (const { column } of columns) {
                                        const index = table.fields.findIndex((field: FieldInsertType) => field.name == column?.expr?.Identifier?.value);
                                        if (index >= 0) {
                                            table.fields[index].unique = true;
                                        }
                                    }

                                }
                            } else if (operation.AddConstraint?.constraint.PrimaryKey) {

                                const table: TableInsertType | undefined = tables.find((table: TableInsertType) => table.name == astStatment.AlterTable.name?.at(-1)?.Identifier?.value);

                                const columns: any[] | undefined = operation.AddConstraint?.constraint?.PrimaryKey?.columns;

                                if (!table || !columns) {
                                    continue;
                                }
                                if (columns && columns.length > 0 && table.fields) {
                                    for (const { column } of columns) {
                                        const index = table.fields.findIndex((field: FieldInsertType) => field.name == column?.expr?.Identifier?.value);
                                        if (index >= 0) {
                                            table.fields[index].isPrimary = true;
                                        }
                                    }
                                }
                            }
                        }
                    }
                } catch (error) {
                    errors.push(error as Error)
                    continue;
                }

            }
            for (const statment of createIndexStatements) {
                try {
                    const astStatment: any = parse(statment, this.dialect as any)?.pop();

                    if (astStatment.CreateIndex) {
                        const { index, error: indexErrors } = this.astToIndex(astStatment, tables);


                        if (indexErrors)
                            errors.push(indexErrors);

                        if (index)
                            indexes.push(index)
                    }
                } catch (error) {
                    errors.push(error as Error);
                }
            }
            for (const constraint of fk_constraints) {
                try {
                    relationships.push(this.astToRelationship(constraint, tables))
                } catch (error) {
                    errors.push(error as Error);
                }
            } 

            if (tables.length == 0)
                throw Error("Can't parse sql") 
            return {
                tables,
                relationships,
                indexes,
                errors
            }

        } catch (error) {
            throw error;
        }


    }

    protected astToTable(ast: any): ParsedTable {
        const errors: Error[] = []
        const tableName: string | undefined = ast.CreateTable.name?.at(-1)?.Identifier?.value;
        const columns: any[] = ast.CreateTable.columns;
        const fk_constraints: any[] = [];


        if (!tableName || !columns)
            throw Error("Invalid table defintiion");

        const fields: FieldInsertType[] = []

        for (let index = 0; index < columns.length; index++) {
            try {

                const { field, fk_constraint } = this.astToField(columns[index], index);
                fields.push(field);

                if (fk_constraint) {
                    fk_constraints.push({
                        ...fk_constraint,
                        columns: [{
                            value: field.name
                        }],
                        target_table: tableName
                    })
                }
            } catch (error) {
                errors.push(error as Error);
                continue
            }
        }

        if (ast.CreateTable.constraints && ast.CreateTable.constraints.length > 0) {
            for (const constraint of ast.CreateTable.constraints) {
                if (constraint.ForeignKey) {
                    fk_constraints.push({
                        ...constraint.ForeignKey,
                        target_table: tableName
                    });
                }
                else if (constraint.PrimaryKey) {
                    for (const { column } of constraint.PrimaryKey.columns) {

                        const columnName: string | undefined = column.expr?.Identifier?.value;
                        if (!columnName)
                            continue;
                        const index = fields.findIndex((field: FieldInsertType) => field.name === columnName);
                        if (index >= 0) {
                            fields[index].isPrimary = true;
                        }
                    }
                } else if (constraint.Unique) {
                    const columns: any[] | undefined = constraint.Unique?.columns;
                    if (columns && columns.length > 0) {

                        for (const { column } of columns) {
                            const index = fields.findIndex((field: FieldInsertType) => field.name == column?.expr?.Identifier?.value);
                            if (index >= 0) {
                                fields[index].unique = true;
                            }
                        }

                    }
                }
            }
        }
        return {
            table: {
                id: v4(),
                name: tableName,
                fields: fields,
                color: randomColor()
            } as TableInsertType,
            errors,
            fk_constraints
        }
    }

    protected astToField(ast: any, sequence: number): ParsedField {

        let isPrimary: boolean = false;
        let nullable: boolean = true;
        let unique: boolean = false;
        let autoIncrement: boolean = false;
        let maxLength: number | undefined;
        let precision: number | undefined;
        let scale: number | undefined;
        let values: any[] | string | undefined = undefined;
        let defaultValue: string | undefined;
        let typeName: string | undefined;
        let extraParam: number | undefined;
        let fk_constraint: any | undefined;
        let params: any[] | undefined;

      
        // if it's a basic type like (texts , booleans .. ect) we get the name directly
        // if it's a type that take params , the data type become an object
        if (typeof ast.data_type === "string") {
            typeName = ast.data_type.toLowerCase();
            

        } else if (typeof ast.data_type === "object" && !ast.data_type.Custom) {
            const attributeName = Object.keys(ast.data_type)[0];
            if (ast.data_type[attributeName]?.IntegerLength) {

                maxLength = ast.data_type[attributeName]?.IntegerLength?.length;
            }
            if (ast.data_type[attributeName]?.Precision) {
                precision = ast.data_type[attributeName]?.Precision;
            }

            if (ast.data_type[attributeName]?.PrecisionAndScale && ast.data_type[attributeName]?.PrecisionAndScale?.length == 2) {
                precision = ast.data_type[attributeName]?.PrecisionAndScale[0];
                scale = ast.data_type[attributeName]?.PrecisionAndScale[1];
            }

            if (typeof ast.data_type[attributeName] == "number") {
                extraParam = ast.data_type[attributeName];
            }

            if (Array.isArray(ast.data_type[attributeName])) {
                params = ast.data_type[attributeName];
            }
            typeName = attributeName.toLowerCase();

            
            if (typeName == "timestamp" && this.dialect == DatabaseDialect.ORACLE && ast.data_type[attributeName].length >= 2 && ast.data_type[attributeName][1] == "WithTimeZone") { 
                typeName += "withtimezone" ; 
            } 
        }

        else if (ast.data_type.Custom && Array.isArray(ast.data_type.Custom)) {
            if (ast.data_type.Custom.length > 1 && ast.data_type.Custom[1]?.[0] && !isNaN(Number(ast.data_type.Custom[1]?.[0])))
                extraParam = Number(ast.data_type.Custom[1]?.[0]);

            typeName = ast.data_type.Custom[0]?.[0]?.Identifier?.value.toLowerCase();
            
        }
 
        const dataType: DataType | undefined = this.processDataType(typeName as string);

        if (!dataType) {
            throw Error("Data type not found");
        }
        // get data type modifiers
        const modifiers: string[] = dataType?.modifiers ? JSON.parse(dataType.modifiers) : [];
        // the parser pass an extra param in case if the type is cutsom , that extra param can be either a length or precision 
        // to know which one we have to test what kind of modifier the data type support 
        if (extraParam && modifiers.includes(Modifiers.LENGTH))
            maxLength = extraParam;

        if (extraParam && modifiers.includes(Modifiers.PRECISION))
            precision = extraParam;

        if (params && params.length > 0 && Array.isArray(params[0]) && modifiers.includes(Modifiers.VALUES)) {

            const paramValues = params[0].filter((value: any) => value.Name !== undefined).map((value: any) => value.Name);
            if (paramValues.every(v => typeof v === "string")) {
                values = JSON.stringify(paramValues);
            }
        }

        if (modifiers.includes(Modifiers.PRECISION) && params && params.length > 0 && !isNaN(params[0]) && !precision) {
            precision = params[0];
        }

        // get field defintion options
        const options: any | undefined = [] = ast.options;

        try {
            for (const option of options) {
                if (typeof option.option == "string") {

                    if (option.option == "Null")
                        nullable = true;

                    if (option.option == "NotNull")
                        nullable = false;

                    continue;
                }
                else if (typeof option.option === "object") {

                    if (option.option.PrimaryKey) {
                        isPrimary = true;
                        continue;
                    }
                    if (option.option.Unique) {
                        unique = true;
                        continue;
                    }
                    if (option.option.Default) {

                        defaultValue = this.processDefaultValue(option.option.Default, dataType);
                        continue;
                    }
                    if (option.option.DialectSpecific && option.option.DialectSpecific.length > 0) {
                        for (const { Word } of option.option.DialectSpecific) {
                            if (Word?.keyword == "AUTO_INCREMENT") {
                                autoIncrement = true;
                                break;
                            }
                        }
                    }
                    if (option.option.ForeignKey) {
                        fk_constraint = option.option.ForeignKey;
                    }
                }
            }
        } catch (error) {
            throw Error("Failed to extract column options")
        }

        if (isPrimary) {
            nullable = false;
        }

        return {
            field: {
                id: v4(),
                name: ast.name.value,
                typeId: dataType?.id,
                nullable,
                autoIncrement,
                unique,
                isPrimary,
                maxLength,
                precision,
                scale,
                defaultValue,
                sequence,
                values
            } as FieldInsertType,
            fk_constraint
        };

    }
    protected astToRelationship(ast: any, tables: TableInsertType[]): RelationshipInsertType {


        let targetTable: TableInsertType | undefined = tables.find((table: TableInsertType) => table.name == ast.target_table);
        let sourceTable: TableInsertType | undefined = tables.find((table: TableInsertType) => table.name == ast.foreign_table?.at(-1)?.Identifier?.value);
        let sourceField: FieldInsertType | undefined = sourceTable?.fields?.find((field: FieldInsertType) => field.name == ast.referred_columns?.[0]?.value);
        let targetField: FieldInsertType | undefined = targetTable?.fields?.find((field: FieldInsertType) => field.name == ast.columns?.[0]?.value);

        if (!sourceTable || !sourceField || !targetField || !targetTable) {
            throw Error("Inavlid FK Constraint")

        }

        const onDelete: ForeignKeyActions | undefined = ast.on_delete ? this.astToForiegnKeyAction(ast.on_delete) : undefined;
        const onUpdate: ForeignKeyActions | undefined = ast.on_update ? this.astToForiegnKeyAction(ast.on_update) : undefined;
        const name: string | undefined = ast.name?.value;

        return {
            id: v4(),
            name,
            sourceFieldId: sourceField.id,
            targetFieldId: targetField.id,
            sourceTableId: sourceTable.id,
            targetTableId: targetTable.id,
            cardinality: targetField.unique ? Cardinality.one_to_one : Cardinality.one_to_many,
            onDelete,
            onUpdate
        } as RelationshipInsertType
    }
    protected astToIndex(ast: any, tables: TableInsertType[]): ParsedIndex {

        const tableName: string = ast.CreateIndex.table_name?.at(-1)?.Identifier?.value;
        const table: TableInsertType | undefined = tables.find((table: TableInsertType) => table.name == tableName);

        if (!table)
            throw Error("index table not found");

        const columnNames: string[] = ast.CreateIndex.columns.map(({ column }: any) => column.expr?.Identifier?.value)
            .filter((column: string | undefined) => column != undefined);

        const fieldIds: string[] = (table.fields?.filter((field: FieldInsertType) => columnNames.includes(field.name)) as FieldInsertType[])
            .map((field: FieldInsertType) => field.id);

        let indexName: string = ast.CreateIndex.name?.[0]?.Identifier?.value;
        if (!indexName) {
            indexName = `${tableName}_${columnNames.join("_")}_index`;
        }

        return {
            index: {
                id: v4(),
                name: indexName,
                tableId: table.id,
                unique: ast.CreateIndex.unique,
                fieldIndices: fieldIds?.map((id: string) => ({
                    id: v4(),
                    fieldId: id
                }))
            } as IndexInsertType,
            error: undefined
        }
    }

    protected astToForiegnKeyAction(ast: ReferentialAction): ForeignKeyActions {
        switch (ast) {
            case "Cascade":
                return ForeignKeyActions.CASCADE;
            case "SetNull":
                return ForeignKeyActions.SET_NULL;
            case 'Restrict':
                return ForeignKeyActions.RESTRICT;
            case "SetDefault":
                return ForeignKeyActions.SET_DEFAULT;
        }
        return ForeignKeyActions.NO_ACTION;
    }

    protected processDataType(typeName: string): DataType | undefined   {
        
        
        // get data type from the supported ones
        return this.data_types.find((dataType: DataType) => {
            let synonyms: string[] = dataType.synonyms ? JSON.parse(dataType.synonyms) : [];
            synonyms = synonyms.map((synonym: string) => synonym.replace(/ /g, ''));
            return (dataType.name as string).replace(/ /g, '') == typeName || synonyms.includes(typeName as string)
        });

    }

    protected processDefaultValue(ast: any, dataType: DataType): string | undefined {
       
        if (ast.Value && ast.Value.value) {
        
            const value: any = ast.Value.value;
            if (value.Number && Array.isArray(value.Number) && value.Number.length > 0 && !isNaN(Number(value.Number[0]))) {
                return value.Number[0];
            }
        
            else if (value.SingleQuotedString || value.DoubleQuotedString) {
                const valuesArray = Object.values(value);
                if (valuesArray.length > 0)
                    return valuesArray[0] as string;
            }
        
            else if (value.Boolean) {
                return "true";
            }
        
            else if (value.NationalStringLiteral) {
                return value.NationalStringLiteral
            }
        
        } else if (ast.Function) {
            if (dataType.type == DataTypes.TIME) {
                if (ast.Function.name?.[0]?.Identifier?.value && this.isCurrentTimesTampFunction(ast.Function.name?.[0]?.Identifier?.value))
                    return TimeDefaultValues.NOW;

            }
        } else if (ast.TypedString) {

            const value = ast.TypedString.value?.value;

            if (value.SingleQuotedString || value.DoubleQuotedString) {
                const valuesArray = Object.values(value);
                if (valuesArray.length > 0)
                    return valuesArray[0] as string;
            }
        }
        
        return undefined;
    }

    protected isCurrentTimesTampFunction(value: string): boolean {
        const upper: string = value.toUpperCase();

        return upper == "CURRENT_TIMESTAMP" || upper == "NOW";
    }


    protected cleanSql(sql: string): string {
        // Clean up SQL: remove comments and normalize
        const cleanedSql = sql
            .replace(/--.*$/gm, '')         // remove single-line comments
            .replace(/\/\*[\s\S]*?\*\//g, '') // remove multi-line comments
            .replace(/\s+/g, ' ')           // normalize whitespace
            .replace(/;\s*/g, ';\n');       // separate statements
        return cleanedSql;
    }

    protected extractStatments(sql: string): ExtractedStatments {

        const createTableStatements: string[] = [];
        const alterTableStatements: string[] = [];
        const createIndexStatements: string[] = [];

        // Split into individual statements
        const statements = sql
            .split('\n')
            .map(s => s.trim())
            .filter(Boolean);


        for (const stmt of statements) {
            const upper = stmt.toUpperCase();

            if (upper.startsWith('CREATE TABLE')) {
                createTableStatements.push(stmt);
            } else if (upper.startsWith('ALTER TABLE')) {
                alterTableStatements.push(stmt);
            } else if (upper.startsWith('CREATE INDEX') || upper.startsWith('CREATE UNIQUE INDEX')) {
                createIndexStatements.push(stmt);
            }
        }
        return {
            createTableStatements,
            alterTableStatements,
            createIndexStatements
        } as ExtractedStatments;
    }

}

export type ParsedDatabaase = {
    tables: TableInsertType[],
    relationships: RelationshipInsertType[],
    indexes: IndexInsertType[],
    errors: Error[]
}

export type ParsedTable = {
    table: TableInsertType;
    errors: Error[];
    fk_constraints: any[] | undefined,
}

export type ParsedIndex = {
    index: IndexInsertType;
    error?: Error;

}

export type ParsedField = {
    field: FieldInsertType,
    fk_constraint: any | undefined
}

export type ExtractedStatments = {
    createTableStatements: string[],
    alterTableStatements: string[],
    createIndexStatements: string[],
    createPostgresTypesStatements?: string[],
    alterSequenceStatments?: string[]
}





/*


START TRANSACTION;

CREATE TABLE `users` (
  id INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(255) NOT NULL
);

CREATE UNIQUE INDEX `users_usernae_index` ON `users` (`username`);

COMMIT;


CREATE TABLE `users` (
  id INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(255) NOT NULL UNIQUE,
  email VARCHAR(255) NOT NULL UNIQUE,
  created_at DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
  last_login_at DATETIME NULL,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  updated_at TEXT NULL DEFAULT 'Hello world' UNIQUE
);

CREATE INDEX `idx_users_created_at_index` ON `users` (`created_at`);

CREATE INDEX `idx_users_last_login_at` ON `users` (`last_login_at`);

CREATE TABLE `categories` (
  id INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL UNIQUE,
  description TEXT NULL
);

CREATE TABLE `tags` (
  id INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL UNIQUE
);

CREATE TABLE `projects` (
  id INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT NULL,
  category_id INTEGER NULL,
  created_at DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
  user_id INTEGER NULL,
  due_date DATETIME NULL,
  status ENUM (
    'planning',
    'in_progress',
    'completed',
    'on_hold',
    'draft'
  ) NOT NULL DEFAULT 'draft',
  FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`),
  FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
);

CREATE TABLE `tasks` (
  id INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT NULL,
  status ENUM ('todo', 'in_progress', 'done') NOT NULL DEFAULT 'todo',
  priority ENUM ('low', 'medium', 'high') NULL DEFAULT 'medium',
  due_date DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
  project_id INTEGER NULL,
  assigned_to_user_id INTEGER NULL,
  completed_at DATETIME NULL,
  created_at DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`),
  FOREIGN KEY (`assigned_to_user_id`) REFERENCES `users` (`id`)
);

CREATE TABLE `comments` (
  id INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY,
  task_id INTEGER NOT NULL,
  comment TEXT NOT NULL,
  created_at DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
  user_id INTEGER NOT NULL,
  updated_at DATETIME NULL,
  FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  FOREIGN KEY (`task_id`) REFERENCES `tasks` (`id`)
);

CREATE INDEX `idx_comments_created_at` ON `comments` (`created_at`);

CREATE INDEX `idx_comments_user_id` ON `comments` (`user_id`);

CREATE INDEX `idx_comments_task_id` ON `comments` (`task_id`);

CREATE TABLE `task_tags` (
  task_id INTEGER NOT NULL,
  tag_id INTEGER NOT NULL,
  FOREIGN KEY (`tag_id`) REFERENCES `tags` (`id`),
  FOREIGN KEY (`task_id`) REFERENCES `tasks` (`id`)
)
  
CREATE TABLE all_mysql_types (
  -- Numeric types
  col_tinyint        TINYINT(3),
  col_smallint       SMALLINT(5),
  col_mediumint      MEDIUMINT(7),
  col_int            INT(11),
  col_bigint         BIGINT(20),

  col_decimal        DECIMAL(10, 2),
  col_numeric        NUMERIC(8, 3),

  col_float          FLOAT(7, 4),
  col_double         DOUBLE(15, 8),
  col_real           REAL,
 
  col_boolean        BOOLEAN,

  -- Date & time types
  col_date           DATE,
  col_datetime       DATETIME(6),
  col_timestamp      TIMESTAMP(6),
  col_time           TIME(6),
  col_year           YEAR,

  -- String types
  col_char           CHAR(10),
  col_varchar        VARCHAR(255),

  col_binary         BINARY(16),
  col_varbinary      VARBINARY(255),

  col_tinytext       TINYTEXT,
  col_text           TEXT,
  col_mediumtext     MEDIUMTEXT,
  col_longtext       LONGTEXT,

  col_tinyblob       TINYBLOB,
  col_blob           BLOB,
  col_mediumblob     MEDIUMBLOB,
  col_longblob       LONGBLOB,

  col_enum           ENUM('A', 'B', 'C'),
  col_set            SET('X', 'Y', 'Z'),

  -- JSON
  col_json           JSON,

  -- Spatial types
  col_geometry       GEOMETRY,
  col_point          POINT,
  col_linestring     LINESTRING,
  col_polygon        POLYGON 
);




*/