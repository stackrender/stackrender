
import DatabaseContext from "./database-context";
import { useCallback, useContext } from "react";
import { db, powerSyncDb } from "../sync-provider/sync-provider";
import { TableInsertType, tables, TableType } from "@/lib/schemas/table-schema";
import { useQuery } from "@powersync/react";
import { toCompilableQuery } from "@powersync/drizzle-driver";
import { asc, desc, eq, inArray, sql } from "drizzle-orm";
import { QueryResult } from "@powersync/web";
import { FieldInsertType, fields, FieldType } from "@/lib/schemas/field-schema";
import { RelationshipInsertType, relationships, RelationshipType } from "@/lib/schemas/relationship-schema";

interface Props { children: React.ReactNode }


const DatabaseProvider: React.FC<Props> = ({ children }) => {


    const { data: tablesList } = useQuery(toCompilableQuery(
        db.query.tables.findMany({
            with: {
                fields: {
                    orderBy: asc(fields.sequence),
                    with: {
                        type: true
                    }
                }
            },
            orderBy: desc(tables.createdAt)
        })
    ));


    const { data: relationshipsList } = useQuery(toCompilableQuery(
        db.query.relationships.findMany({
            with: {
                sourceTable: true,
                targetTable: true,
                sourceField: true,
                targetField: true,
            },
            orderBy: desc(tables.createdAt)
        })
    ));
    const { data: data_types } = useQuery(toCompilableQuery(
        db.query.data_types.findMany()
    ));


    const createTable = useCallback(async (table: TableInsertType): Promise<QueryResult> => {
        return await db.insert(tables).values(table);
    }, [db]);

    const editTable = useCallback(async (table: TableInsertType): Promise<QueryResult> => {
        return await db.update(tables).set(table).where(eq(tables.id, table.id));
    }, [db]);

    const deleteTable = useCallback(async (id: string): Promise<QueryResult> => {
        return await db.delete(tables).where(eq(tables.id, id));
    }, [db]);

    const deleteMultiTables = useCallback(async (ids: string[]): Promise<QueryResult> => {
        return await db.delete(tables).where(inArray(tables.id, ids));
    }, [db]);

    const createField = useCallback(async (field: FieldInsertType): Promise<QueryResult> => {
        return await db.insert(fields).values(field);
    }, [db]);

    const editField = useCallback(async (field: FieldInsertType): Promise<QueryResult> => {
        return await db.update(fields).set(field).where(eq(fields.id, field.id));
    }, [db]);

    const deleteField = useCallback(async (id: string): Promise<QueryResult> => {
        return await db.delete(fields).where(eq(fields.id, id));
    }, [db]);

    const orderTableFields = useCallback(async (fieldsList: FieldType[]): Promise<QueryResult> => {
        const caseStatements = fieldsList
            .map((field, index) => `WHEN '${field.id}' THEN ${index}`)
            .join('\n  ');
        const ids = fieldsList.map(u => `'${u.id}'`).join(',\n  ');
        const sql = `
        UPDATE fields
        SET sequence = CASE id
          ${caseStatements}
        END
        WHERE id IN (
          ${ids}
        );`;
        return await powerSyncDb.execute(sql);
    }, [powerSyncDb]);

    const createRelationship = useCallback(async (relationship: RelationshipInsertType): Promise<QueryResult> => {
        return await db.insert(relationships).values(relationship);
    }, [db]);

    const editRelationship = useCallback(async (relationship: RelationshipInsertType): Promise<QueryResult> => {
        return await db.update(relationships).set(relationship).where(eq(relationships.id, relationship.id));
    }, [db]);

    const deleteRelationship = useCallback(async (id: string): Promise<QueryResult> => {
        return await db.delete(relationships).where(eq(relationships.id, id));
    }, [db]);

    const deleteMultiRelationships = useCallback(async (ids: string[]): Promise<QueryResult> => {
        return await db.delete(relationships).where(inArray(relationships.id, ids));
    }, [db]);

    const updateTablePositions = useCallback(async (tableList: TableInsertType[]): Promise<QueryResult> => {
        const posXCases = tableList
            .map(table => `WHEN '${table.id}' THEN ${table.posX}`)
            .join('\n  ');
        const posYCases = tableList
            .map(table => `WHEN '${table.id}' THEN ${table.posY}`)
            .join('\n  ');
        const ids = tableList.map(table => `'${table.id}'`).join(',\n  ');
        const sql = `
        UPDATE tables
        SET 
        posX = CASE id
          ${posXCases}
        END,
        posY = CASE id
          ${posYCases}
        END
        WHERE id IN (
          ${ids}
        );`;
        return await powerSyncDb.execute(sql);
    }, [powerSyncDb]);
    return (

        <DatabaseContext.Provider value={{
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

            tables: tablesList as TableType[],
            relationships: relationshipsList as RelationshipType[],
            data_types
        }}>
            {children}
        </DatabaseContext.Provider>
    )
}

export const useDatabase = () => useContext(DatabaseContext);

export default DatabaseProvider;



