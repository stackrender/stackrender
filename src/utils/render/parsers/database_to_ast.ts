

import { DataType } from "@/lib/schemas/data-type-schema";
import { DatabaseType } from "@/lib/schemas/database-schema";
import { FieldType } from "@/lib/schemas/field-schema";
import { FieldIndexType } from "@/lib/schemas/field_index-schema";
import { IndexType } from "@/lib/schemas/index-schema";
import { RelationshipType } from "@/lib/schemas/relationship-schema";
import { TableType } from "@/lib/schemas/table-schema";


export const DatabaseToAst = (database: DatabaseType, data_types: DataType[]) => {
    let dbAst: any = [];
    if (!data_types || data_types.length == 0)
        return dbAst;
    for (const table of database.tables) {
        dbAst.push(TableToAst({
            ...table,
            sourceRelations: database.relationships.filter((relationship: RelationshipType) => relationship.sourceTableId == table.id),
            targetRelations: database.relationships.filter((relationship: RelationshipType) => relationship.targetTableId == table.id),
        }, data_types));

        if (table.indices && table.indices.length > 0)
            for (const index of table.indices)
                dbAst.push(IndexToAst({
                    ...index,
                    fields: index.fieldIndices.map((fieldIndex: FieldIndexType) => table.fields.find((field: FieldType) => field.id == fieldIndex.fieldId)) as FieldType[]
                }, table));
    };

    return dbAst;
}


export const TableToAst = (table: TableType, data_types: DataType[]) => {

    const constraints: any[] = table.sourceRelations ? table.sourceRelations?.map((relationship: RelationshipType) => {
        return {
            constraint_type: "FOREIGN KEY",
            resource: "constraint",
            definition: [
                {
                    type: "column_ref",
                    column: relationship.sourceField.name,

                }
            ],
            reference_definition: {
                on_action: [
                    {
                        "type": "on delete",
                        "value": {
                            "type": "origin",
                            "value": "cascade"
                        }
                    }
                ],
                keyword: "references",
                table: [{
                    table: relationship.targetTable.name,
                }],
                definition: [
                    {
                        type: "column_ref",
                        column: relationship.targetField.name,
                    }
                ],
            }
        }

    }) : [];

    const filed_definitions = table.fields.map((field: FieldType) => FieldToAst({
        ...field,
        type: data_types.find((dataType: DataType) => dataType.id == field.typeId) as DataType,
        sourceRelations: table.sourceRelations?.filter((relationship: RelationshipType) => relationship.sourceFieldId == field.id),
        targetRelations: table.targetRelations?.filter((relationship: RelationshipType) => relationship.targetFieldId == field.id),

    }));
    return {
        keyword: "table",
        type: "create",
        table: [{
            table: table.name
        }],
        create_definitions: [...filed_definitions, ...constraints]
    }

}


export const FieldToAst = (field: FieldType) => {

    return {
        column: {
            type: "column_ref",
            column: {
                expr: {
                    type: "default", value: field.name
                }
            },
        },
        default_val: null,
        unique: field.unique ? "unique" : null,
        nullable: {
            type: field.nullable ? "null" : "not null",
            value: field.nullable ? "null" : "not null",
        },
        definition: {
            dataType: field.type?.name?.toLocaleUpperCase(),

        },
        primary_key: field.isPrimary ? "primary key" : null,
        resource: "column"
    }
}



export const IndexToAst = (index: IndexType, table: TableType) => {

    return {
        index: index.name,
        type: "create",
        table: { table: table.name },
        keyword: "index",
        index_type: index.unique ? "unique" : null,
        index_columns: index.fields.map((field: FieldType) => ({
            column: field.name,
            type: "column_ref"
        }))
    }
}