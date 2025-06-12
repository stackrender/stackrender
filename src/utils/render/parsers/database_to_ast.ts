

import { DatabaseDialect } from "@/lib/database";
import { DataType } from "@/lib/schemas/data-type-schema";
import { DatabaseType } from "@/lib/schemas/database-schema";
import { FieldType } from "@/lib/schemas/field-schema";
import { FieldIndexType } from "@/lib/schemas/field_index-schema";
import { IndexType } from "@/lib/schemas/index-schema";
import { Cardinality, RelationshipType } from "@/lib/schemas/relationship-schema";
import { TableType } from "@/lib/schemas/table-schema";
import { RenderableTable, SortableTable, toRenderableTable, toSortableTable } from "@/lib/table";
import { getForeignRelationships } from "@/utils/relationship";
import { orderTables } from "@/utils/tables";


export const DatabaseToAst = (database: DatabaseType, data_types: DataType[]) => {
    let dbAst: any = [];
    if (!data_types || data_types.length == 0)
        return dbAst;

    let renderableTables: RenderableTable[] = database.tables.map((table: TableType) => toRenderableTable(table, database));
    let sortableTables: SortableTable[] = renderableTables.map((table: RenderableTable) => toSortableTable(table));
    try {
        const sortedTablesIds: string[] = orderTables(sortableTables)
        const sortedTables: TableType[] = sortedTablesIds.map((id: string) =>
            renderableTables.find((table: TableType) => table.id == id) as TableType
        );


        for (const table of sortedTables) {
            dbAst.push(TableToAst(table, data_types));

            if (table.indices && table.indices.length > 0)
                for (const index of table.indices)
                    dbAst.push(IndexToAst({
                        ...index,
                        fields: index.fieldIndices.map((fieldIndex: FieldIndexType) =>
                            table.fields.find((field: FieldType) => field.id == fieldIndex.fieldId)
                        ) as FieldType[],
                    }, table));
        };
    } catch (error) {
        console.log(error);
    }   
    return dbAst;
}


export const TableToAst = (table: TableType, data_types: DataType[]) => {

    const primaryKeys: FieldType[] = table.fields.filter((field: FieldType) => field.isPrimary);
    const multiPrimaryKeys: boolean = primaryKeys.length > 1;
    const primaryKeysConstraints: any[] | undefined = multiPrimaryKeys ? [{
        constraint_type: "primary key",
        resource: "constraint",
        definition: primaryKeys.map((field: FieldType) => ({
            column: field.name,
            type: "column_ref"
        }))
    }] : [];

    let foreignRelationships = getForeignRelationships(table);

    const foreignKeysConstraints = foreignRelationships.map((relationship: RelationshipType) => relationshipToAst(relationship));
    const constraints: any[] = [...primaryKeysConstraints, ...foreignKeysConstraints];
    const filed_definitions = table.fields.map((field: FieldType) => FieldToAst({
        ...field,
        type: data_types.find((dataType: DataType) => dataType.id == field.typeId) as DataType,
    }, multiPrimaryKeys));
    return {
        keyword: "table",
        type: "create",
        table: [{
            table: table.name
        }],
        create_definitions: [...filed_definitions, ...constraints]
    }
}
export const FieldToAst = (field: FieldType, ignorePrimaryKey: boolean = false) => {
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
            length: field.type?.name == "varchar" && (field.type?.dialect == DatabaseDialect.MYSQL || field.type?.dialect == DatabaseDialect.MARIADB)   ? 255 : null,


        },
        primary_key: field.isPrimary && !ignorePrimaryKey ? "primary key" : null,
        resource: "column"
    }
}



export const IndexToAst = (index: IndexType, table: TableType) => {

    return {
        index: index.name,
        type: "create",
        table: { table: table.name },
        keyword: "index",
        on_kw: "on",
        index_type: index.unique ? "unique" : null,
        index_columns: index.fields.map((field: FieldType) => ({
            column: field.name,
            type: "column_ref"
        }))
    }
}






export const relationshipToAst = (relationship: RelationshipType) => {

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
        constraint: null,
        definition: [
            {
                type: "column_ref",
                column: foreignKey.name,

            }
        ],
        constraint_type: "FOREIGN KEY",
        resource: "constraint",
        reference_definition: {
            definition: [
                {
                    type: "column_ref",
                    column: primaryKey.name,
                }
            ],
            table: [
                {
                    table: sourceTable.name,
                }
            ],
            keyword: "references",
            on_action: []
        }
    }


}