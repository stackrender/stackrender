
import DatabaseContext from "./database-context";
import { useContext } from "react";
import { db, powerSyncDb } from "../sync-provider/sync-provider";
import { TableInsertType, tables, TableType } from "@/lib/schemas/table-schema";
import { useQuery } from "@powersync/react";
import { toCompilableQuery } from "@powersync/drizzle-driver";
import { asc, desc, eq, sql } from "drizzle-orm";
import { QueryResult } from "@powersync/web";
import { FieldInsertType, fields, FieldType } from "@/lib/schemas/field-schema";

interface Props { children: React.ReactNode }


const DatabaseProvider: React.FC<Props> = ({ children }) => {


    const { data: tablesList, isLoading, error } = useQuery(toCompilableQuery(
        db.query.tables.findMany({
            with: {
                fields: {
                    orderBy: asc(fields.sequence),
                }
            },
            orderBy: desc(tables.createdAt)
        })
    ));

    const { data: data_types } = useQuery(toCompilableQuery(
        db.query.data_types.findMany()
    ));


    const createTable = async (table: TableInsertType): Promise<QueryResult> => {
        return await db.insert(tables).values(table)
    }
    const editTable = async (table: TableInsertType): Promise<QueryResult> => {
        return await db.update(tables).set(table).where(eq(tables.id, table.id))
    }
    const deleteTable = async (id: string): Promise<QueryResult> => {
        return await db.delete(tables).where(eq(tables.id, id));
    }

    const createField = async (field: FieldInsertType): Promise<QueryResult> => {
        return await db.insert(fields).values(field);
    }
    const editField = async (field: FieldInsertType): Promise<QueryResult> => {
        return await db.update(fields).set(field).where(eq(fields.id, field.id))
    }
    const deleteField = async (id: string): Promise<QueryResult> => {
        return await db.delete(fields).where(eq(fields.id, id));
    }

    const orderTableFields = async (fields: FieldType[]): Promise<QueryResult> => {

        const caseStatements = fields
            .map((field: FieldType, index: number) => `WHEN '${field.id}' THEN ${index}`)
            .join('\n  ');

        const ids = fields.map(u => `'${u.id}'`).join(',\n  ');

        const sql = `
      UPDATE fields
      SET sequence = CASE id
        ${caseStatements}
      END
      WHERE id IN (
        ${ids}
      );`;

        return await powerSyncDb.execute(sql)
    }
    return (

        <DatabaseContext.Provider value={{
            createTable,
            editTable,
            deleteTable,

            createField,
            editField,
            deleteField,
            orderTableFields,
            tables: tablesList as TableType[],
            data_types
        }}>
            {children}
        </DatabaseContext.Provider>
    )
}

export const useDatabase = () => useContext(DatabaseContext);

export default DatabaseProvider;



