import { Modifiers, TimeDefaultValues } from "@/lib/field";
import { DataType } from "@/lib/schemas/data-type-schema";
import { FieldInsertType, FieldType } from "@/lib/schemas/field-schema";
import { TableInsertType } from "@/lib/schemas/table-schema";
import { Parser } from "node-sql-parser";
import { v4 } from "uuid";
import { parse } from 'pgsql-ast-parser';
import { DatabaseDialect } from "@/lib/database";
import { randomColor } from "@/lib/colors";
import { Cardinality, RelationshipInsertType } from "@/lib/schemas/relationship-schema";


export const SqlToDatabase = (sql: string, data_types: DataType[], dialect: DatabaseDialect) => {
    const parser = new Parser();
    const createTableStatements: string[] = [];
    const alterTableStatements: string[] = [];
    const createIndexStatements: string[] = [];
    const createPostgresTypesStatements: string[] = [];
    const tables: TableInsertType[] = [];
    let relationships: RelationshipInsertType[] = [];
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
        } else if (upper.startsWith('CREATE INDEX')) {
            createIndexStatements.push(stmt);
        } else if (upper.startsWith('CREATE TYPE')) {
            createPostgresTypesStatements.push(stmt);
        }
    }

    if (dialect == DatabaseDialect.POSTGRES)
        for (const postgresType of createPostgresTypesStatements) {
            try {
                const instructionAst = parse(postgresType);
                if (Array.isArray(instructionAst) && instructionAst.length > 0) {
                    postgresTypes.push(instructionAst[0]);
                }
            } catch (error) {
                console.log(error);
            }
        }

    if (dialect == DatabaseDialect.POSTGRES)
        for (const createTable of createTableStatements) {

            try {
                const instructionAst = parse(createTable);
                if (Array.isArray(instructionAst) && instructionAst.length > 0) {
                    tables.push(postgresAstToTable(instructionAst[0], data_types, postgresTypes));
                }

                /*

            const instructionAst = parser.astify(createTable, {
                database: "MySql"
            });
            if (Array.isArray(instructionAst) && instructionAst.length > 0) {
                tables.push(astToTable(instructionAst[0], data_types));
            }*/
            } catch (error) {
                console.log(error);

            }
        }

    for (const alterTable of alterTableStatements) {
        try {
            const instructionAst = parse(alterTable);
            if (Array.isArray(instructionAst) && instructionAst.length > 0) {
                const extractedRelationships: RelationshipInsertType[] = astToRelationship((instructionAst[0] as any), tables);
                relationships = relationships.concat(extractedRelationships);
            }
        } catch (error) {
            if ((error as any).relationships && (error as any).relationships.length > 0)
                relationships = relationships.concat((error as any).relationships);
        }
    }
 

    return {tables , relationships};

}





export const postgresAstToTable = (ast: any, data_types: DataType[], postgresTypes: any[]): TableInsertType => {
    //  console.log(ast);
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

    if (!dataType && postgresTypes && postgresTypes.length > 0) {

        const postgresType: any = postgresTypes.find((type: any) => type.name.name == ast.dataType.name);
        if (postgresType) {
            dataType = data_types.find((dataType: DataType) => dataType.name == "enum") as DataType;
            values = JSON.stringify(postgresType.values.map((value: any) => value.value));
        };
    }

    const modifiers: string[] = dataType?.modifiers ? JSON.parse(dataType.modifiers) : [];

    let length: number | undefined;
    let scale: number | undefined;

    if (ast.dataType.config && ast.dataType.config.length > 0)
        if (ast.dataType.config.length == 1)
            length = ast.dataType.config[0];
        else if (ast.dataType.config.length == 2)
            scale = ast.dataType.config[1];


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
    }

    return {
        id: v4(),
        name: ast.name.name,
        defaultValue,
        typeId: dataType?.id,
        nullable,
        unique: ast.unique,
        maxLength,
        precision,
        scale,
        sequence,
        values
    } as FieldInsertType;
}


const astToTable = (ast: any, data_types: DataType[]): TableInsertType => {


    return {
        id: v4(),
        name: ast.table[0]?.table,
        fields: ast.create_definitions.filter((column: any) => column.resource == "column")
            .map((fieldAst: any) => astToField(fieldAst, data_types))
    } as TableInsertType;
}


export const astToField = (ast: any, data_types: DataType[]): FieldInsertType => {
    const dataType: DataType | undefined = data_types.find((dataType: DataType) => dataType.name == ast.definition.dataType?.toLowerCase());
    const modifiers: string[] = dataType?.modifiers ? JSON.parse(dataType.modifiers) : [];

    const { length, scale } = ast.definition;

    let maxLength: number | null = null;
    let precision: number | null = null;

    if (modifiers.includes(Modifiers.LENGTH) && length)
        maxLength = length;

    if (modifiers.includes(Modifiers.PRECISION) && length)
        precision = length;


    return {
        id: v4(),
        name: ast.column.column,
        defaultValue: ast.default_val,
        typeId: dataType?.id,
        nullable: ast.nullable?.value == "not null",
        unique: ast.unique,
        maxLength,
        precision,
        scale: scale,

    } as FieldInsertType;
}



export const astToRelationship = (ast: any, tables: TableInsertType[]): RelationshipInsertType[] => {

    const relationships: RelationshipInsertType[] = [];
    const changes = ast.changes;



    const targetTable: TableInsertType | undefined = tables.find((table: TableInsertType) => table.name == ast.table.name);

    if (!targetTable)
        throw Error("source table not found");

    const foreignKeyConstraints = changes.filter((change: any) => change.type == 'add constraint' && change.constraint && change.constraint.type == "foreign key").map((change: any) => change.constraint);

    for (const foreignKeyConstraint of foreignKeyConstraints) {

        const sourceTable: TableInsertType | undefined = tables.find((table: TableInsertType) => table.name == foreignKeyConstraint.foreignTable.name);

        const targetField: FieldInsertType | undefined = targetTable.fields?.find((field: FieldInsertType) => field.name == foreignKeyConstraint.localColumns[0]?.name)

        const sourceField : FieldInsertType | undefined = sourceTable?.fields?.find((field: FieldInsertType) => field.name == foreignKeyConstraint.foreignColumns[0]?.name)



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