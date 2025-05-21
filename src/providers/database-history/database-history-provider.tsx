import { useCallback, useContext, useEffect, useRef } from "react";
import DatabaseHistoryContext from "./database-history-context";
import useUndo from 'use-undo';
import { useDatabase, useDatabaseOperations } from "../database-provider/database-provider";
import hash from 'object-hash';
import { DBDiffOperation, mapDiffToDBDiffOperation, normalizeDatabase } from "@/utils/database";
import { compare } from 'fast-json-patch';
import {   DatabaseType } from "@/lib/schemas/database-schema";

interface Props { children: React.ReactNode };

const DatabaseHistoryProvider: React.FC<Props> = ({ children }) => {

    const udpateDbFlag = useRef(false);
    const { database } = useDatabase();
    const { executeDbDiffOps} = useDatabaseOperations() ; 
    
    const [datatbaseState, { set, undo: undoChanges, redo: redoChanges, canUndo, canRedo }] = useUndo<DatabaseType>(database);

    useEffect(() => {
        udpateDbFlag.current = false;
        const presentHash: string = hash(datatbaseState.present, { algorithm: 'sha1' });
        const databaseHash: string = hash(database, { algorithm: 'sha1' });
        if (presentHash != databaseHash)
            set(database);
    }, [database]);


    const undo = useCallback(() => {
        udpateDbFlag.current = true;
        undoChanges();
    }, [undoChanges, udpateDbFlag]);

    const redo = useCallback(() => {
        udpateDbFlag.current = true;
        redoChanges();
    }, [redoChanges, udpateDbFlag]);

    useEffect(() => {
        if (!udpateDbFlag.current) {
            udpateDbFlag.current = true;
            return;
        }

        const normalizedDatabase = normalizeDatabase(database);
        const normalizedPresent = normalizeDatabase(datatbaseState.present);
        const differences = compare(normalizedDatabase, normalizedPresent);

        if (differences && differences.length > 0) {
            const operations: DBDiffOperation[] = mapDiffToDBDiffOperation(differences);
            executeDbDiffOps(operations)
        }

    }, [datatbaseState.present]);
    return (
        <DatabaseHistoryContext.Provider
            value={{
                undo,
                redo,
                canUndo,
                canRedo,
                present: datatbaseState.present
            }}
        >
            {children}
        </DatabaseHistoryContext.Provider>
    )

}


export const useDatabaseHistory = () => useContext(DatabaseHistoryContext);


export default DatabaseHistoryProvider; 