

import { DatabaseDialect } from "@/lib/database";
import { DataTypes, Modifiers, TimeDefaultValues } from "@/lib/field";
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

    const modifiers: string[] = field?.type.modifiers ? JSON.parse(field?.type.modifiers) : [];
    let suffix: string[] = [];
    if (modifiers.includes(Modifiers.ZEROFILL) && field.zeroFill) {
        suffix.push(Modifiers.ZEROFILL.toUpperCase());
    }
    if (modifiers.includes(Modifiers.UNSIGNED) && field.unsigned) {
        suffix.push(Modifiers.UNSIGNED.toUpperCase());
    }


    let length: number | null = null;
    let scale: number | string | null = null;

    let character_set: any | null = null;
    let collate: any | null = null;

    let values: any[] = [];
    let valuesExpr: any | null;

    let default_val: any | null = null;

    if (modifiers.includes(Modifiers.PRECISION) && field.precision) {
        length = field.precision;
        if (modifiers.includes(Modifiers.SCALE) && !field.scale)
            scale = "0";
    }

    if (modifiers.includes(Modifiers.SCALE) && field.scale)
        scale = field.scale;

    if (modifiers.includes(Modifiers.LENGTH) && field.maxLength)
        length = field.maxLength;


    if (modifiers.includes(Modifiers.CHARSET) && field.charset)
        character_set = {
            type: "CHARACTER SET",
            value: {
                type: "default",
                value: field.charset
            }
        }

    if (modifiers.includes(Modifiers.COLLATE) && field.collate)
        collate = {
            keyword: "collate",
            type: "collate",
            collate: {
                name: field.collate,
            }
        }

    if (modifiers.includes(Modifiers.VALUES) && field.values) {

        const jsonValues = JSON.parse(field.values);
        if (jsonValues.length > 0) {
            values = jsonValues.map((value: string) => ({
                type: "single_quote_string",
                value
            }));

            valuesExpr = {
                parentheses: true,
                type: "expr_list",
                value: values
            }
        }
    }

    if (field.defaultValue && field.defaultValue.trim().length > 0) {
        default_val = {
            type: "default",
            value: {
                type: "single_quote_string",
                value: field.defaultValue
            }
        }
        if (field.type.type == DataTypes.TIME && field.defaultValue == TimeDefaultValues.NOW)
            default_val = {
                type: "default",
                value: {
                    type: "function",
                    name: {
                        name: [
                            {
                                type: "origin",
                                value: "CURRENT_TIMESTAMP"
                            }
                        ]
                    },
                    over: null
                }
            }

        else if (field.defaultValue == "true" || field.defaultValue == "false") {

            default_val.value.type = "bool"
            default_val.value.value = field.defaultValue == "true" ? true : false;
        }

        // Check if it's a number (but not empty string or just whitespace)
        else if (!isNaN(Number(field.defaultValue))) {
            default_val.value.type = "number"
            default_val.value.value = Number(field.defaultValue);
        }
    }

    // field.type?.name == "varchar" && (field.type?.dialect == DatabaseDialect.MYSQL || field.type?.dialect == DatabaseDialect.MARIADB) ? 255 : null
    return {
        column: {
            type: "column_ref",
            column: {
                expr: {
                    type: "default", value: field.name,
                }
            },
        },
        collate,
        character_set,
        default_val,
        unique: field.unique ? "unique" : null,
        auto_increment: (modifiers.includes(Modifiers.AUTO_INCREMENT) && field.autoIncrement) ? "auto_increment" : null,

        nullable: {
            type: field.nullable ? "null" : "not null",
            value: field.nullable ? "null" : "not null",
        },
        definition: {
            dataType: field.type?.name?.toLocaleUpperCase(),
            length,
            scale,
            suffix,
            expr: valuesExpr
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