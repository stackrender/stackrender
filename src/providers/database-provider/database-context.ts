
import { DatabaseDialect } from "@/lib/database";
import { DataType } from "@/lib/schemas/data-type-schema";
import { DatabaseInsertType, DatabaseType } from "@/lib/schemas/database-schema";
import { FieldInsertType, FieldType } from "@/lib/schemas/field-schema";
import { IndexInsertType } from "@/lib/schemas/index-schema";
import { RelationshipInsertType } from "@/lib/schemas/relationship-schema";
import { TableInsertType } from "@/lib/schemas/table-schema";
import { DBDiffOperation } from "@/utils/database";
import { QueryResult } from "@powersync/web";
import { createContext } from "react";




interface DatabaseDataContextType {

    database: DatabaseType | undefined ,
    currentDatabaseId: string | undefined,
    databases: DatabaseType[],
    isLoading: boolean,
    isSwitchingDatabase: boolean,
    getField: (tableId: string, id: string) => FieldType | undefined,
    getDefaultPrimaryKeyType : (dialect? : DatabaseDialect) => DataType | undefined  

}


interface DatabaseOperationsContextType {
    data_types: DataType[],
    grouped_data_types : any ; 
    // database operations 
    createDatabase: (database: DatabaseInsertType) => Promise<QueryResult>,
    editDatabase: (database: DatabaseInsertType) => Promise<QueryResult>,
    deleteDatabase: (id: string) => Promise<void>,
    switchDatabase: (databaseId: string | undefined ) => void,

    createTable: (table: TableInsertType) => Promise<void>,
    editTable: (table: TableInsertType) => Promise<QueryResult>,
    deleteTable: (id: string) => Promise<void>,
    updateTablePositions: (tables: TableInsertType[]) => Promise<void>,
    deleteMultiTables: (ids: string[]) => Promise<void>
    // field operations
    createField: (field: FieldInsertType) => Promise<QueryResult>,
    editField: (field: FieldInsertType) => Promise<QueryResult>,
    deleteField: (id: string) => Promise<void>,
    orderTableFields: (fields: FieldType[]) => Promise<void>,

    // index operations
    createIndex: (index: IndexInsertType) => Promise<QueryResult>,
    editIndex: (index: IndexInsertType) => Promise<QueryResult>,
    deleteIndex: (id: string) => Promise<QueryResult>,
    editFieldIndices: (indexId: string, fieldIds: string[]) => Promise<void>,
    // relationship operations
    createRelationship: (relationship: RelationshipInsertType) => Promise<QueryResult>,
    editRelationship: (relationship: RelationshipInsertType) => Promise<QueryResult>,
    deleteRelationship: (id: string) => Promise<QueryResult>,
    deleteMultiRelationships: (ids: string[]) => Promise<QueryResult>,
    // execute the diff operation whenver user click in undo or redo
    executeDbDiffOps: (operations: DBDiffOperation[]) => void,
}

export const DatabaseDataContext = createContext<DatabaseDataContextType>({} as DatabaseDataContextType);
export const DatabaseOperationsContext = createContext<DatabaseOperationsContextType>({} as DatabaseOperationsContextType);



