
import { PowerSyncDatabase } from '@powersync/web';
import { PowerSyncContext, usePowerSync } from "@powersync/react";
import { createContext, Suspense, useContext, useEffect, useState } from 'react';
import { AppSchema, drizzleSchema } from '@/lib/schemas/app-schema';
import { StackRenderConnector } from '@/utils/stackrender-connector';
import { CircularProgress } from '@heroui/react';
import { PowerSyncSQLiteDatabase, wrapPowerSyncWithDrizzle } from '@powersync/drizzle-driver';

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
    const [connector] = useState(new StackRenderConnector());

    useEffect(() => {
        const setup = async () => {
            await powerSync.init();
            await powerSync.execute("PRAGMA foreign_keys = ON;");
            powerSync.connect(connector);
        };
        setup();
    }, [powerSync, connector]);


    
    
    return (
        <Suspense fallback={<CircularProgress />}>
            <PowerSyncContext.Provider value={powerSync}>
                <ConnectorContext.Provider value={connector}>
                    {children}
                </ConnectorContext.Provider>
            </PowerSyncContext.Provider>
        </Suspense>
    )
}

