
import { PowerSyncDatabase } from '@powersync/web';
import { PowerSyncContext, usePowerSync } from "@powersync/react";
import { createContext, Suspense, useContext, useEffect, useState } from 'react';
import { AppSchema, drizzleSchema } from '@/lib/schemas/app-schema';
import { StackRenderConnector } from '@/utils/stackrender-connector';
 
import { PowerSyncSQLiteDatabase, wrapPowerSyncWithDrizzle } from '@powersync/drizzle-driver';
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
        <Suspense >
            <PowerSyncContext.Provider value={powerSync}>
                {children}
            </PowerSyncContext.Provider>
        </Suspense>
    )
}

