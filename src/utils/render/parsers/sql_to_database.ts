import { DataTypes, Modifiers, TimeDefaultValues } from "@/lib/field";
import { DataType } from "@/lib/schemas/data-type-schema";
import { FieldInsertType, FieldType } from "@/lib/schemas/field-schema";
import { TableInsertType } from "@/lib/schemas/table-schema";
import { Parser } from "node-sql-parser";
import { v4 } from "uuid";
import { parse } from 'pgsql-ast-parser';
import { DatabaseDialect, getDatabaseByDialect } from "@/lib/database";
import { randomColor } from "@/lib/colors";
import { Cardinality, RelationshipInsertType } from "@/lib/schemas/relationship-schema";
import { IndexInsertType } from "@/lib/schemas/index-schema";
import { relationshipToAst } from "./database_to_ast";
import { DatabaseInsertType } from "@/lib/schemas/database-schema";


export const SqlToDatabase = (sql: string, data_types: DataType[], dialect: DatabaseDialect) => {
    const parser = new Parser();

    const createTableStatements: string[] = [];
    const alterTableStatements: string[] = [];
    const createIndexStatements: string[] = [];
    const createPostgresTypesStatements: string[] = [];

    const tables: TableInsertType[] = [];
    let relationships: RelationshipInsertType[] = [];
    const indices: IndexInsertType[] = []

    const postgresTypes: any[] = [];
    // Clean up SQL: remove comments and normalize
    const cleanedSql = sql
        .replace(/--.*$/gm, '')         // remove single-line comments
        .replace(/\/\*[\s\S]*?\*\//g, '') // remove multi-line comments
        .replace(/\s+/g, ' ')           // normalize whitespace
        .replace(/;\s*/g, ';\n');       // separate statements

    // Split into individual statements
    const statements = cleanedSql
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
        } else if (upper.startsWith('CREATE TYPE')) {
            createPostgresTypesStatements.push(stmt);
        }
    }


    if (dialect == DatabaseDialect.POSTGRES) {
        for (const postgresType of createPostgresTypesStatements) {
            try {
                const instructionAst = parse(postgresType);
                if (Array.isArray(instructionAst) && instructionAst.length > 0) {
                    postgresTypes.push(instructionAst[0]);
                }
            } catch (error) {
                continue;
            }
        }


        for (const createTable of createTableStatements) {
            try {
                const instructionAst = parse(createTable);
                if (Array.isArray(instructionAst) && instructionAst.length > 0) {
                    const table: TableInsertType = postgresAstToTable(instructionAst[0], data_types, postgresTypes);
                    tables.push(table);
                    if ((instructionAst[0] as any).constraints && (instructionAst[0] as any).constraints.length > 0) {
                        const relationshipAst: any = foreignKeyConstraintToAlterTableAst((instructionAst[0] as any).constraints, table)
                        try {
                            const newRelationships = postgresAstToRelationship(relationshipAst, tables);
                            relationships = relationships.concat(newRelationships);
                        } catch (error) {
                            if ((error as any).relationships && (error as any).relationships.length > 0)
                                relationships = relationships.concat((error as any).relationships);
                        }
                    }
                }
            } catch (error) {
                continue;

            }
        }
        for (const createIndex of createIndexStatements) {
            try {
                const instructionAst = parse(createIndex);
                if (Array.isArray(instructionAst) && instructionAst.length > 0) {
                    indices.push(postgresAstToIndex(instructionAst[0], tables));
                }
            } catch (error) {
                continue;
            }
        }
        for (const alterTable of alterTableStatements) {
            try {
                const instructionAst = parse(alterTable);
                if (Array.isArray(instructionAst) && instructionAst.length > 0) {
                    const extractedRelationships: RelationshipInsertType[] = postgresAstToRelationship((instructionAst[0] as any), tables);
                    relationships = relationships.concat(extractedRelationships);
                }
            } catch (error) {
                if ((error as any).relationships && (error as any).relationships.length > 0)
                    relationships = relationships.concat((error as any).relationships);
            }
        }
    } else {
        let foreignKeyConstraints: any[] = [];
        let referenceDefinitions: any[] = [];

        for (let createTable of createTableStatements) {

            try {

                if (dialect == DatabaseDialect.SQLITE) 
                    createTable = createTable.replace(/\btext\s*\(\s*\d+\s*\)/gi, 'TEXT');
                
 
                let instructionAst = parser.astify(createTable, {
                    database: dialect == DatabaseDialect.MARIADB ? getDatabaseByDialect(DatabaseDialect.MYSQL).name : getDatabaseByDialect(dialect).name
                });

                if (Array.isArray(instructionAst) && instructionAst.length > 0) {
                    instructionAst = instructionAst[0];
                }
                console.log (instructionAst)
                if (instructionAst) {
                    const table: TableInsertType = astToTable(instructionAst, data_types);

                    tables.push(table);

                    const tableForeignKeyConstraints = (instructionAst as any).create_definitions.filter((definition: any) => definition.constraint_type == "FOREIGN KEY");
                    const tableReferenceDefinitions = (instructionAst as any).create_definitions.filter((definition: any) => definition.resource == "column" && definition.reference_definition);


                    foreignKeyConstraints = foreignKeyConstraints.concat(
                        tableForeignKeyConstraints.map((constraint: any) => ({ ...constraint, table: (instructionAst as any).table }))
                    )

                    referenceDefinitions = referenceDefinitions.concat(
                        tableReferenceDefinitions.map((constraint: any) => ({ ...constraint, table: (instructionAst as any).table }))
                    )


                }


            } catch (error) {
                console.log(error)
                continue;
            }
        }

        for (const foreignKeyConstraint of foreignKeyConstraints) {
            try {
                relationships.push(astToRelationship(tables, foreignKeyConstraint) as RelationshipInsertType);
            } catch (error) {
                console.log(error);
                continue;
            }
        }
        for (const referenceDefinition of referenceDefinitions) {
            try {
                relationships.push(astToRelationship(tables, undefined, referenceDefinition) as RelationshipInsertType);
            } catch (error) {
                console.log(error);
                continue;
            }
        }

        for (const alterTable of alterTableStatements) {
            try {
                const instructionAst = parser.astify(alterTable, {
                    database: getDatabaseByDialect(dialect).name
                });
                if (instructionAst) {
                    const extractedRelationships: RelationshipInsertType[] = astToRelationship(tables, undefined, undefined, {
                        ...instructionAst,
                        table: (instructionAst as any).table?.[0].table
                    }) as RelationshipInsertType[];

                    relationships = relationships.concat(extractedRelationships)
                }
            } catch (error) {

                if ((error as any).relationships && (error as any).relationships.length > 0)
                    relationships = relationships.concat((error as any).relationships);


            }
        }

        for (const createIndex of createIndexStatements) {
            try {
                let instructionAst = parser.astify(createIndex, {
                    database: getDatabaseByDialect(dialect).name
                });
                if (Array.isArray(instructionAst) && instructionAst.length > 0) {
                    instructionAst = instructionAst[0];
                }
                indices.push(astToIndex(instructionAst, tables));

            } catch (error) {
                continue;
            }
        }
    }


    return { tables, relationships, indices };

}





export const astToRelationship = (tables: TableInsertType[], constraintAst?: any, columnAst?: any, alterTableAst?: any): RelationshipInsertType | RelationshipInsertType[] => {

    let targetField: FieldInsertType | undefined;
    let sourceTable: TableInsertType | undefined;
    let sourceField: FieldInsertType | undefined;
    let targetTable: TableInsertType | undefined;


    let relationships: RelationshipInsertType[] = [];

    if (constraintAst) {

        targetTable = tables.find((table: TableInsertType) => table.name == constraintAst.table?.[0].table);
        targetField = targetTable?.fields?.find((field: FieldInsertType) => field.name == constraintAst.definition?.[0].column);
        sourceTable = tables.find((table: TableInsertType) => table.name == constraintAst.reference_definition?.table?.[0].table);
        sourceField = sourceTable?.fields?.find((field: FieldInsertType) => field.name == constraintAst.reference_definition?.definition?.[0].column);

    }

    if (columnAst) {

        targetTable = tables.find((table: TableInsertType) => table.name == columnAst.table?.[0].table);
        targetField = targetTable?.fields?.find((field: FieldInsertType) => field.name == columnAst.column?.column);
        sourceTable = tables.find((table: TableInsertType) => table.name == columnAst.reference_definition?.table?.[0].table);
        sourceField = sourceTable?.fields?.find((field: FieldInsertType) => field.name == columnAst.reference_definition?.definition?.[0].column);
    }

    if (alterTableAst) {
        const expressions = alterTableAst.expr;
        const foreignKeyExpressions = expressions.filter((expression: any) => expression.resource == "constraint" && expression.create_definitions?.constraint_type == "FOREIGN KEY")
        targetTable = tables.find((table: TableInsertType) => table.name == alterTableAst.table?.[0].table);
        for (const expression of foreignKeyExpressions) {

            const targetField: FieldInsertType | undefined = targetTable?.fields?.find((field: FieldInsertType) => field.name == expression.create_definitions?.definition?.[0].column);
            const sourceTable: TableInsertType | undefined = tables.find((table: TableInsertType) => table.name == expression.create_definitions?.reference_definition?.table?.[0].table)
            const sourceField: FieldInsertType | undefined = sourceTable?.fields?.find((field: FieldInsertType) => field.name == expression.create_definitions?.reference_definition?.definition?.[0].column);


            if (!targetField || !sourceField || !sourceTable)
                continue;

            relationships.push({
                id: v4(),
                targetTableId: targetTable?.id,
                targetFieldId: targetField.id,
                sourceTableId: sourceTable.id,
                sourceFieldId: sourceField.id,
                cardinality: targetField.unique ? Cardinality.one_to_one : Cardinality.one_to_many
            } as RelationshipInsertType)
        }

        if (relationships.length == foreignKeyExpressions.length)
            return relationships;
        else
            throw Error({
                success: false,
                message: "Failed to Extract all relationships",
                relationships
            } as any)
    }

    if (!targetField || !sourceField || !sourceTable)
        throw Error("Failed to extract relationship");


    return {
        id: v4(),
        targetTableId: targetTable?.id,
        targetFieldId: targetField.id,
        sourceTableId: sourceTable.id,
        sourceFieldId: sourceField.id,
        cardinality: targetField.unique ? Cardinality.one_to_one : Cardinality.one_to_many
    } as RelationshipInsertType;

}



const astToTable = (ast: any, data_types: DataType[]): TableInsertType => {

    return {
        id: v4(),
        name: ast.table[0]?.table,
        fields: ast.create_definitions.filter((column: any) => column.resource == "column")
            .map((fieldAst: any, index: number) => astToField(fieldAst, data_types, index)),
        color: randomColor()
    } as TableInsertType;
}


export const astToField = (ast: any, data_types: DataType[], sequence: number): FieldInsertType => {



    const dataType: DataType | undefined = data_types.find((dataType: DataType) => {
        const synonyms: string[] = dataType.synonyms ? JSON.parse(dataType.synonyms) : [];
        return dataType.name == ast.definition.dataType?.toLowerCase() || synonyms.includes(ast.definition.dataType?.toLowerCase())
    });

    let values: string | undefined = undefined;

    const modifiers: string[] = dataType?.modifiers ? JSON.parse(dataType.modifiers) : [];

    const { length, scale } = ast.definition;
    const { character_set, collate: collation } = ast;

    let charset: string | undefined;
    let collate: string | undefined;

    let defaultValue: string | undefined = ast.default_val?.value?.value ? ast.default_val?.value?.value : undefined;

    let maxLength: number | null = null;
    let precision: number | null = null;

    if (modifiers.includes(Modifiers.LENGTH) && length)
        maxLength = length;

    if (modifiers.includes(Modifiers.PRECISION) && length)
        precision = length;


    if (modifiers.includes(Modifiers.CHARSET) && character_set)
        charset = character_set.value?.value;

    if (modifiers.includes(Modifiers.COLLATE) && collation)
        collate = collation.collate?.name;

    if (modifiers.includes(Modifiers.VALUES)) {


        const value = ast.definition?.expr?.value.map((value: any) => value.value);
        if (value)
            values = JSON.stringify(value);
    }

    if (dataType?.type == DataTypes.TIME &&
        ast.default_val?.value?.type == "function" &&
        ast.default_val?.value?.name?.name?.length > 0 &&
        ast.default_val?.value?.name?.name[0].value == "CURRENT_TIMESTAMP")
        defaultValue = TimeDefaultValues.NOW;

    return {
        id: v4(),
        name: ast.column.column,
        defaultValue,
        typeId: dataType?.id,
        nullable: ast.nullable?.value != "not null",
        unique: ast.unique == "unique",
        maxLength,
        precision,
        scale,
        sequence,
        autoIncrement: ast.auto_increment == "auto_increment",
        isPrimary: ast.primary_key == "primary key",
        values,
        charset,
        collate,
    } as FieldInsertType;


}


export const postgresAstToTable = (ast: any, data_types: DataType[], postgresTypes: any[]): TableInsertType => {

    return {
        id: v4(),
        name: ast.name.name,
        fields: ast.columns.filter((column: any) => column.kind == "column")
            .map((fieldAst: any, index: number) => postgresAstToField(fieldAst, data_types, index, postgresTypes)),
        color: randomColor(),
    } as TableInsertType;
}



export const postgresAstToField = (ast: any, data_types: DataType[], sequence: number, postgresTypes: any[]): FieldInsertType => {

    let dataType: DataType | undefined = data_types.find((dataType: DataType) => {
        const synonyms: string[] = dataType.synonyms ? JSON.parse(dataType.synonyms) : [];
        return dataType.name == ast.dataType.name?.toLowerCase() || synonyms.includes(ast.dataType.name?.toLowerCase())
    });

    let values: string | undefined;
    let autoIncrement: boolean = false;

    if (!dataType && postgresTypes && postgresTypes.length > 0) {
        const postgresType: any = postgresTypes.find((type: any) => type.name.name == ast.dataType.name);
        if (postgresType) {
            dataType = data_types.find((dataType: DataType) => dataType.name == "enum") as DataType;
            values = JSON.stringify(postgresType.values.map((value: any) => value.value));
        };
    }

    if (ast.dataType.name?.toLowerCase().includes("serial")) {

        let baseType: string = ast.dataType.name?.toLowerCase() == "serial" ? "integer" : ast.dataType.name?.toLowerCase().replace("serial", "int");
        dataType = data_types.find((dataType: DataType) => {
            return dataType.name == baseType;
        });
        autoIncrement = true;
    }
    const modifiers: string[] = dataType?.modifiers ? JSON.parse(dataType.modifiers) : [];

    let length: number | undefined;
    let scale: number | undefined;
    let unique: boolean = false;
    let primaryKey: boolean = false;

    if (ast.dataType.config && ast.dataType.config.length > 0) {
        if (ast.dataType.config.length >= 1)
            length = ast.dataType.config[0];

        if (ast.dataType.config.length == 2)
            scale = ast.dataType.config[1];
    }


    let maxLength: number | null = null;
    let precision: number | null = null;

    if (modifiers.includes(Modifiers.LENGTH) && length)
        maxLength = length;

    if (modifiers.includes(Modifiers.PRECISION) && length)
        precision = length;

    let defaultValue: string | undefined;
    let nullable: boolean = true;;

    const constraints: any[] | undefined = ast.constraints;
    if (constraints && constraints.length > 0) {

        const nullableConstraints: any | undefined = constraints.find((c: any) => c.type == "not null");
        if (nullableConstraints)
            nullable = false;

        const defaultValueConstraints: any | undefined = constraints.find((c: any) => c.type == "default");
        if (defaultValueConstraints) {
            if (defaultValueConstraints.default.type == "keyword" && defaultValueConstraints.default.keyword == "current_timestamp")
                defaultValue = TimeDefaultValues.NOW;
            else if (defaultValueConstraints.default.type == "cast" && defaultValueConstraints.default.operand)
                defaultValue = String(defaultValueConstraints.default.operand.value)
            else
                defaultValue = String(defaultValueConstraints.default.value);
        }
        const uniqueConstraints: any | undefined = constraints.find((c: any) => c.type == "unique");
        const primryKeyConstraints: any | undefined = constraints.find((c: any) => c.type == "primary key");

        if (uniqueConstraints)
            unique = true;
        if (primryKeyConstraints)
            primaryKey = true;

    }

    return {
        id: v4(),
        name: ast.name.name,
        defaultValue,
        typeId: dataType?.id,
        nullable,
        unique,
        maxLength,
        precision,
        scale,
        isPrimary: primaryKey,
        sequence,
        values,
        autoIncrement
    } as FieldInsertType;
}



export const postgresAstToRelationship = (ast: any, tables: TableInsertType[]): RelationshipInsertType[] => {


    const relationships: RelationshipInsertType[] = [];
    const changes = ast.changes;

    const targetTable: TableInsertType | undefined = tables.find((table: TableInsertType) => table.name == ast.table.name);

    if (!targetTable)
        throw Error("source table not found");

    const foreignKeyConstraints = changes.filter((change: any) => change.type == 'add constraint' && change.constraint && change.constraint.type == "foreign key").map((change: any) => change.constraint);

    for (const foreignKeyConstraint of foreignKeyConstraints) {

        const sourceTable: TableInsertType | undefined = tables.find((table: TableInsertType) => table.name == foreignKeyConstraint.foreignTable.name);

        const targetField: FieldInsertType | undefined = targetTable.fields?.find((field: FieldInsertType) => field.name == foreignKeyConstraint.localColumns[0]?.name)

        const sourceField: FieldInsertType | undefined = sourceTable?.fields?.find((field: FieldInsertType) => field.name == foreignKeyConstraint.foreignColumns[0]?.name)

        if (!sourceField || !targetField || !sourceTable)
            continue;

        relationships.push({
            id: v4(),
            sourceTableId: sourceTable.id,
            targetTableId: targetTable.id,
            sourceFieldId: sourceField.id,
            targetFieldId: targetField.id,
            cardinality: targetField.unique ? Cardinality.one_to_one : Cardinality.one_to_many
        } as RelationshipInsertType)
    }


    if (relationships.length == foreignKeyConstraints.length)
        return relationships;
    else
        throw Error({
            success: false,
            message: "Failed to Extract all relationships",
            relationships
        } as any)


}


const foreignKeyConstraintToAlterTableAst = (constraints: any[], table: TableInsertType) => {

    const changes: any[] = constraints.map((constraint: any) => ({
        type: "add constraint",
        constraint: {
            type: "foreign key",
            localColumns: [
                {
                    name: constraint.localColumns?.[0].name
                }
            ],
            foreignTable: {
                name: constraint.foreignTable.name,
            },
            foreignColumns: [
                {
                    name: constraint.foreignColumns?.[0].name
                }
            ]
        }
    }))

    return {
        type: "alter table",
        only: true,
        table: {
            name: table.name
        },
        changes

    }
}

export const astToIndex = (ast: any, tables: TableInsertType[]): IndexInsertType => {
    const table: TableInsertType | undefined = tables.find((table: TableInsertType) => table.name == ast.table.table);

    if (!table)
        throw Error("table not found");

    const fieldNames: string[] = ast.index_columns.map((column: any) => column.column);


    const fieldIds: string[] | undefined = table.fields?.filter((field: FieldInsertType) => fieldNames.includes(field.name))
        .map((field: FieldInsertType) => field.id);


    return {
        id: v4(),
        name: ast.index,
        tableId: table.id,
        unique: ast.index_type == "unique",
        fieldIndices: fieldIds?.map((id: string) => ({
            id: v4(),
            fieldId: id
        }))
    } as IndexInsertType
}

export const postgresAstToIndex = (ast: any, tables: TableInsertType[]): IndexInsertType => {
    const table: TableInsertType | undefined = tables.find((table: TableInsertType) => table.name == ast.table.name);

    if (!table)
        throw Error("table not found");

    const fieldNames: string[] = ast.expressions.map((expression: any) => expression.expression.name);


    const fieldIds: string[] | undefined = table.fields?.filter((field: FieldInsertType) => fieldNames.includes(field.name))
        .map((field: FieldInsertType) => field.id);

    return {
        id: v4(),
        name: ast.indexName.name,
        tableId: table.id,
        unique: ast.unique,
        fieldIndices: fieldIds?.map((id: string) => ({
            id: v4(),
            fieldId: id
        }))
    } as IndexInsertType
}

