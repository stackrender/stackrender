
import { DataType } from "@/lib/schemas/data-type-schema";
import { FieldInsertType, FieldType } from "@/lib/schemas/field-schema";
import { TableInsertType, TableType } from "@/lib/schemas/table-schema";
import { QueryResult } from "@powersync/web";
import { createContext } from "react";




export interface DatabaseContextType {
    tables: TableType[],
    data_types: DataType[]

    createTable: (table: TableInsertType) => Promise<QueryResult>,
    editTable: (table: TableInsertType) => Promise<QueryResult>,
    deleteTable: (id: string) => Promise<QueryResult>,

    createField: (field: FieldInsertType) => Promise<QueryResult>,
    editField: (field: FieldInsertType) => Promise<QueryResult>,
    deleteField: (id: string) => Promise<QueryResult>,
    orderTableFields: (fields: FieldType[]) => Promise<QueryResult>

}




export default createContext<DatabaseContextType>({} as DatabaseContextType);

/*

   return Promise.all(
            fields.map((field : FieldType , index : number) => editField({id : field.id , sequence : index} as FieldType))
        )
       


*/