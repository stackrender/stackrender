
import { PowerSyncDatabase } from '@powersync/web';
import { PowerSyncContext, usePowerSync } from "@powersync/react";
import { createContext, Suspense, useContext, useEffect, useState } from 'react';
import { AppSchema, drizzleSchema } from '@/lib/schemas/app-schema';
import { StackRenderConnector } from '@/utils/stackrender-connector';
import { CircularProgress } from '@heroui/react';
import { PowerSyncSQLiteDatabase, wrapPowerSyncWithDrizzle } from '@powersync/drizzle-driver';
import { data_types, DataInsertType } from '@/lib/schemas/data-type-schema';
import { MysqlDataType } from '@/lib/data_types/mysql_data_types';
import { PostgresDataType } from '@/lib/data_types/postgres_data_types';
import { SqliteDataTypes } from '@/lib/data_types/sqlite_data_types';
import { MariaDbDataType } from '@/lib/data_types/mariadb_data_types';
import { DatabaseDialect } from '@/lib/database';
import { seedDataTypes } from '@/lib/data_types/seed_datatypes';



export const powerSyncDb = new PowerSyncDatabase({
    database: {
        dbFilename: 'stackrender.sqlite',
    },
    schema: AppSchema,
});

export const db: PowerSyncSQLiteDatabase<typeof drizzleSchema> = wrapPowerSyncWithDrizzle(powerSyncDb, {
    schema: drizzleSchema,
});
const ConnectorContext = createContext<StackRenderConnector | null>(null);
export const useConnector = () => useContext(ConnectorContext);

interface SyncProviderProps {
    children: React.ReactNode;
}

export const SyncProvider: React.FC<SyncProviderProps> = ({ children }) => {

    const [powerSync] = useState(powerSyncDb);

    useEffect(() => {
        const seed = async () => {
            await seedDataTypes(db) ; 
        }
        seed();
    }, [db])
    return (
        <Suspense fallback={<CircularProgress />}>
            <PowerSyncContext.Provider value={powerSync}>
                {children}
            </PowerSyncContext.Provider>
        </Suspense>
    )
}

