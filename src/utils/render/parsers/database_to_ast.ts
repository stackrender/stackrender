

import { DataType } from "@/lib/schemas/data-type-schema";
import { DatabaseType } from "@/lib/schemas/database-schema";
import { FieldType } from "@/lib/schemas/field-schema";
import { TableType } from "@/lib/schemas/table-schema";


export const DatabaseToAst = (database: DatabaseType , data_types : DataType[]) => {
    let dbAst: any = [];
    if ( ! data_types || data_types.length == 0) 
        return dbAst ;  
    for (const table of database.tables) {
        dbAst.push(TableToAst(table , data_types ))
    };

    return dbAst;
}


export const TableToAst = (table: TableType ,  data_types : DataType[]) => {
    return {
        keyword: "table",
        type: "create",
        table: [{
            table: table.name
        }],
        create_definitions: table.fields.map((field: FieldType) => FieldToAst({
            ...field , 
            type : data_types.find((dataType : DataType) => dataType.id == field.typeId) as DataType 
        } ))
    }

}


export const FieldToAst = (field: FieldType ) => {
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
            dataType: field.type?.name?.toLocaleUpperCase() ,

        },
        primary_key: field.isPrimary ? "primary key" : null,
        resource: "column"
    }
}


