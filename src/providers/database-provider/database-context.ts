
import { DataType } from "@/lib/schemas/data-type-schema";
import { FieldInsertType, FieldType } from "@/lib/schemas/field-schema";
import { RelationshipInsertType, RelationshipType } from "@/lib/schemas/relationship-schema";
import { TableInsertType, TableType } from "@/lib/schemas/table-schema";
import { QueryResult } from "@powersync/web";
import { createContext } from "react";




export interface DatabaseContextType {
    tables: TableType[],
    data_types: DataType[],
    relationships: RelationshipType[],
    // table operations 
    createTable: (table: TableInsertType) => Promise<QueryResult>,
    editTable: (table: TableInsertType) => Promise<QueryResult>,
    deleteTable: (id: string) => Promise<QueryResult>,
    updateTablePositions: (tables: TableInsertType[]) => Promise<QueryResult> , 
    deleteMultiTables: (ids: string[]) => Promise<QueryResult>
    // field operations
    createField: (field: FieldInsertType) => Promise<QueryResult>,
    editField: (field: FieldInsertType) => Promise<QueryResult>,
    deleteField: (id: string) => Promise<QueryResult>,
    orderTableFields: (fields: FieldType[]) => Promise<QueryResult>,
    // relationship operations
    createRelationship: (relationship: RelationshipInsertType) => Promise<QueryResult>,
    editRelationship: (relationship: RelationshipInsertType) => Promise<QueryResult>,
    deleteRelationship: (id: string) => Promise<QueryResult>,
    deleteMultiRelationships: (ids: string[]) => Promise<QueryResult>

}




export default createContext<DatabaseContextType>({} as DatabaseContextType);

