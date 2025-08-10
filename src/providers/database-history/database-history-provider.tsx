import { useCallback, useContext, useEffect, useRef, useState } from "react";
import DatabaseHistoryContext from "./database-history-context";
import useUndo from 'use-undo';
import { useDatabase, useDatabaseOperations } from "../database-provider/database-provider";
import hash from 'object-hash';
import { DBDiffOperation, mapDiffToDBDiffOperation, normalizeDatabase } from "@/utils/database";
import { compare } from 'fast-json-patch';
import { DatabaseType } from "@/lib/schemas/database-schema";

interface Props { children: React.ReactNode };

const DatabaseHistoryProvider: React.FC<Props> = ({ children }) => {

    const udpateDbFlag = useRef(false);
    const { database, isLoading  } = useDatabase();
    const { executeDbDiffOps } = useDatabaseOperations();
    const [isProcessing, setIsProcessing] = useState<boolean>(false);

    const [datatbaseState, { set, undo: undoChanges, redo: redoChanges, canUndo, canRedo, reset }] = useUndo<DatabaseType>(database as DatabaseType);

    useEffect(() => {
        if (database)
            reset(database);
    }, [database?.id]);

    useEffect(() => {
        if (database && datatbaseState.present && !isLoading && !isProcessing &&  database?.id == datatbaseState.present?.id) {
            udpateDbFlag.current = false;

            const presentHash: string | undefined = hash(datatbaseState.present, { algorithm: 'sha1' });
            const databaseHash: string = hash(database, { algorithm: 'sha1' });

            if (presentHash != databaseHash) {

                set(database);
            }
        }
    }, [database]);


    const undo = useCallback(() => {
        if (!isProcessing && !isLoading ) {
            udpateDbFlag.current = true;
            undoChanges();
        }
    }, [undoChanges, udpateDbFlag, isProcessing , isLoading ]);

    const redo = useCallback(() => {
        if (!isProcessing && !isLoading ) {
            udpateDbFlag.current = true;
            redoChanges();
        }
    }, [redoChanges, udpateDbFlag, isProcessing, isLoading]);

    useEffect(() => {

        if (!udpateDbFlag.current) {
            udpateDbFlag.current = true;
            return;
        }

        if (!database || !datatbaseState.present)
            return;
        const normalizedDatabase = normalizeDatabase(database);

        const normalizedPresent = normalizeDatabase(datatbaseState.present);
        const differences = compare(normalizedDatabase, normalizedPresent);


        
        if (differences && differences.length > 0) {
            setIsProcessing(true);

            const operations: DBDiffOperation[] = mapDiffToDBDiffOperation(differences);

            (async () => {
                try {
               
                    await executeDbDiffOps(operations)
                    setIsProcessing(false);
                }
                catch (error) {
                
        
                    setIsProcessing(false);
                }
            })()

        }

    }, [datatbaseState.present]);
    return (
        <DatabaseHistoryContext.Provider
            value={{
                undo,
                redo,
                canUndo,
                canRedo,
                isProcessing,
                present: datatbaseState.present
            }}
        >
            {children}
        </DatabaseHistoryContext.Provider>
    )

}


export const useDatabaseHistory = () => useContext(DatabaseHistoryContext);


export default DatabaseHistoryProvider; 