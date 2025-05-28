import { DatabaseDataContext, DatabaseOperationsContext } from "./database-context";
import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { db } from "../sync-provider/sync-provider";
import { TableInsertType, tables, TableType } from "@/lib/schemas/table-schema";
import { useQuery } from "@powersync/react";
import { toCompilableQuery } from "@powersync/drizzle-driver";
import { asc, desc, eq, inArray, or } from "drizzle-orm";
import { QueryResult } from "@powersync/web";
import { FieldInsertType, fields, FieldType } from "@/lib/schemas/field-schema";
import { RelationshipInsertType, relationships } from "@/lib/schemas/relationship-schema";
import DatabaseHistoryProvider from "../database-history/database-history-provider";
import { DBDiffOperation } from "@/utils/database";
import { DatabaseType } from "@/lib/schemas/database-schema";
import { getTimestamp } from "@/utils/utils";
import { IndexInsertType, indices } from "@/lib/schemas/index-schema";
import { field_indices } from "@/lib/schemas/field_index-schema";
import { v4 } from "uuid";

interface Props { children: React.ReactNode }

const DatabaseProvider: React.FC<Props> = ({ children }) => {

    const [currentDatabaseId, setCurrentDatabaseId] = useState<string | undefined>(undefined);

    // Fetch all databases
    const { data: databases, isLoading: loadingDatabases } = useQuery(toCompilableQuery(
        db.query.databases.findMany()
    ));

    // Fetch all data types
    const { data: data_types, isLoading: loadingDataTypes } = useQuery(toCompilableQuery(
        db.query.data_types.findMany()
    ));

    // Fetch the current database with nested tables, fields, and relationships
    let { data: database, isLoading: loadingCurrentDatabase } = useQuery(
        toCompilableQuery(
            db.query.databases.findFirst({
                where: (databases, { eq }) => eq(databases.id, currentDatabaseId as string),
                with: {
                    tables: {
                        orderBy: desc(tables.createdAt),
                        with: {
                            fields: {
                                orderBy: asc(fields.sequence),
                                with: {
                                    type: true
                                }
                            },
                            indices: {
                                orderBy: asc(indices.createdAt),
                                with: {
                                    fieldIndices: true
                                }
                            }
                        }
                    },
                    relationships: {
                        with: {
                            sourceTable: true,
                            targetTable: true,
                            sourceField: true,
                            targetField: true,
                        },
                        orderBy: desc(relationships.createdAt)
                    }
                }
            })
        )
    );



    // Normalize result to single object
    if (database.length == 1)
        database = database[0] as any;

    // Auto-select first database if none is selected
    useEffect(() => {
        if (databases.length > 0 && !currentDatabaseId) {
            setCurrentDatabaseId(databases[0].id);
        }
    }, [currentDatabaseId, databases])

    const isLoading: boolean = loadingDataTypes || loadingDatabases || loadingCurrentDatabase;

    // CRUD operations for Tables
    const createTable = useCallback(async (table: TableInsertType): Promise<void> => {
        if (currentDatabaseId) {
            await db.transaction(async (tx) => {
                await tx.insert(tables).values({
                    ...table,
                    databaseId: currentDatabaseId,
                    createdAt: table.createdAt || getTimestamp()
                });
                if (table.fields) {
                    await tx.insert(fields).values(
                        table.fields.map((field: FieldInsertType) => ({ ...field, tableId: table.id }))
                    );
                }
            })
        } else {
            throw Error("No Database selected");
        }
    }, [db, currentDatabaseId]);

    const editTable = useCallback(async (table: TableInsertType): Promise<QueryResult> => {
        return await db.update(tables).set(table).where(eq(tables.id, table.id));
    }, [db]);

    const deleteTable = useCallback(async (id: string): Promise<void> => {
        await db.delete(tables).where(eq(tables.id, id));
    }, [db]);

    const deleteMultiTables = useCallback(async (ids: string[]): Promise<QueryResult> => {
        return await db.delete(tables).where(inArray(tables.id, ids));
    }, [db]);

    // CRUD operations for Fields
    const createField = useCallback(async (field: FieldInsertType): Promise<QueryResult> => {
        return await db.insert(fields).values(field);
    }, [db]);

    const editField = useCallback(async (field: FieldInsertType): Promise<QueryResult> => {
        return await db.update(fields).set(field).where(eq(fields.id, field.id));
    }, [db]);

    // Delete field and its related relationships
    const deleteField = useCallback(async (id: string): Promise<void> => {
        return await db.transaction(async (tx) => {
            await tx.delete(relationships).where(or(eq(relationships.sourceFieldId, id), eq(relationships.targetFieldId, id)));
            await tx.delete(fields).where(eq(fields.id, id));
        })
    }, [db]);

    // Helper to find a field by table and field ID
    const getField = useCallback((tableId: string, id: string) => {
        const table: TableType | undefined = (database as any).tables.find((table: TableType) => table.id == tableId);
        if (table)
            return table.fields.find((field: FieldType) => field.id == id);
    }, [database])

    // Reorder fields in a table
    const orderTableFields = useCallback(async (fieldsList: FieldType[]): Promise<void> => {
        return await db.transaction(async (tx) => {
            for (let index = 0; index < fieldsList.length; index++) {
                await tx.update(fields).set({
                    sequence: index
                }).where(eq(fields.id, fieldsList[index].id))
            }
        })
    }, [db]);

    // CRUD operations for indices
    const createIndex = useCallback(async (index: IndexInsertType): Promise<QueryResult> => {
        return await db.insert(indices).values({
            ...index,
            createdAt: index.createdAt ? index.createdAt : getTimestamp()
        });
    }, [db]);


    const deleteIndex = useCallback(async (id: string): Promise<QueryResult> => {
        return await db.delete(indices).where(eq(indices.id, id))
    }, [db])

    const editIndex = useCallback(async (index: IndexInsertType): Promise<QueryResult> => {
        return await db.update(indices).set(index).where(eq(indices.id, index.id));
    }, [db]);

    const editFieldIndices = useCallback((indexId: string, fieldIds: string[]): Promise<void> => {
        return db.transaction(async (tx) => {
            await tx.delete(field_indices).where(eq(field_indices.indexId, indexId));
            if (fieldIds.length > 0)
                await tx.insert(field_indices).values(fieldIds.map((fieldId: string) => ({
                    id: v4(),
                    fieldId,
                    indexId,

                })))
        })
    }, [db])
    // CRUD operations for Relationships
    const createRelationship = useCallback(async (relationship: RelationshipInsertType): Promise<QueryResult> => {
        if (currentDatabaseId) {
            return await db.insert(relationships).values({
                ...relationship,
                databaseId: currentDatabaseId,
                createdAt: relationship.createdAt || getTimestamp()
            });
        }
        throw Error("No database selected");
    }, [db, currentDatabaseId]);

    const editRelationship = useCallback(async (relationship: RelationshipInsertType): Promise<QueryResult> => {
        return await db.update(relationships).set(relationship).where(eq(relationships.id, relationship.id));
    }, [db]);

    const deleteRelationship = useCallback(async (id: string): Promise<QueryResult> => {
        return await db.delete(relationships).where(eq(relationships.id, id));
    }, [db]);

    const deleteMultiRelationships = useCallback(async (ids: string[]): Promise<QueryResult> => {
        return await db.delete(relationships).where(inArray(relationships.id, ids));
    }, [db]);

    // Update table positions (for UI layout)
    const updateTablePositions = useCallback(async (tableList: TableInsertType[]): Promise<void> => {
        return await db.transaction(async (tx) => {
            for (const table of tableList) {
                await tx.update(tables).set({
                    posX: (table as any).posX,
                    posY: (table as any).posY
                }).where(eq(tables.id, (table as any).id))
            }
        })
    }, [db]);

    // Apply a list of diff operations to sync database
    const executeDbDiffOps = useCallback(async (operations: DBDiffOperation[]) => {
        try {
            await db.transaction(async (tx) => {
                for (const operation of operations) {
                    if (operation.type == "CREATE_TABLE") {
                        await tx.insert(tables).values(operation.table);
                        if (operation.table.fields && Object.values(operation.table.fields).length > 0)
                            await tx.insert(fields).values(Object.values(operation.table.fields));

                    } else if (operation.type === "UPDATE_TABLE") {
                        await tx.update(tables).set(operation.changes).where(eq(tables.id, operation.tableId));

                    } else if (operation.type === "DELETE_TABLE") {
                        await tx.delete(tables).where(eq(tables.id, operation.tableId));

                    } else if (operation.type === "CREATE_FIELD") {
                        await tx.insert(fields).values(operation.field);

                    } else if (operation.type === "DELETE_FIELD") {
                        await tx.delete(relationships).where(or(eq(relationships.sourceFieldId, operation.fieldId), eq(relationships.targetFieldId, operation.fieldId)));
                        await tx.delete(fields).where(eq(fields.id, operation.fieldId));

                    } else if (operation.type === "UPDATE_FIELD") {
                        await tx.update(fields).set(operation.changes).where(eq(fields.id, operation.fieldId));

                    } else if (operation.type === "CREATE_RELATIONSHIP") {
                        await tx.insert(relationships).values(operation.relationship);

                    } else if (operation.type === "DELETE_RELATIONSHIP") {
                        await tx.delete(relationships).where(eq(relationships.id, operation.relationshipId));

                    } else if (operation.type === "UPDATE_RELATIONSHIP") {
                        await tx.update(relationships).set(operation.changes).where(eq(relationships.id, operation.relationshipId));
                    }
                    else if (operation.type == "CREATE_INDEX") {
                        await tx.insert(indices).values(operation.index);
                        if (operation.index.fieldIndices && Object.values(operation.index.fieldIndices).length > 0) 
                             await tx.insert(field_indices).values(Object.values(operation.index.fieldIndices));
                            
                    }
                    else if (operation.type == "DELETE_INDEX") {
                        await tx.delete(indices).where(eq(indices.id, operation.indexId));
                    }
                    else if (operation.type == "UPDATE_INDEX") {
                        await tx.update(indices).set(operation.changes).where(eq(indices.id, operation.indexId));

                    } else if (operation.type == "UPDATE_FIELD_INDICES") {
                        if (operation.delete.length > 0) {
                            await tx.delete(field_indices).where(inArray(field_indices.id, operation.delete))
                        }
                        if (operation.create.length > 0) {
                            await tx.insert(field_indices).values(operation.create);
                        }
                    }
                }
            })
        } catch (error) {
            throw error
        }
    }, [db]);

    const databaseOpsValue = useMemo(() => ({
        createTable,
        editTable,
        deleteTable,
        updateTablePositions,
        deleteMultiTables,
        createField,
        editField,
        deleteField,
        orderTableFields,
        createRelationship,
        editRelationship,
        deleteRelationship,
        deleteMultiRelationships,
        executeDbDiffOps,
        createIndex,
        editIndex,
        deleteIndex,
        editFieldIndices,
        data_types
    }), [
        createTable,
        editTable,
        deleteTable,
        updateTablePositions,
        deleteMultiTables,
        createField,
        editField,
        deleteField,
        orderTableFields,
        createRelationship,
        editRelationship,
        deleteRelationship,
        deleteMultiRelationships,
        executeDbDiffOps,
        createIndex,
        editIndex,
        deleteIndex,
        editFieldIndices,
        data_types
    ]);

    return (
        <DatabaseDataContext.Provider value={{

            database: database as unknown as DatabaseType,
            isLoading,
            getField,
        }}>
            <DatabaseOperationsContext.Provider value={databaseOpsValue}>
                {
                    !isLoading && database &&
                    <DatabaseHistoryProvider>
                        {children}
                    </DatabaseHistoryProvider>
                }
            </DatabaseOperationsContext.Provider>
        </DatabaseDataContext.Provider>
    )
}

export const useDatabase = () => useContext(DatabaseDataContext);
export const useDatabaseOperations = () => useContext(DatabaseOperationsContext);

export default DatabaseProvider;
