
import { PowerSyncDatabase } from '@powersync/web';
import { PowerSyncContext } from "@powersync/react";
import { createContext, Suspense, useContext, useEffect, useState } from 'react';
import { AppSchema } from '@/lib/schemas/app-schema';
import { StackRenderConnector } from '@/utils/stackrender-connector';
import { CircularProgress } from '@heroui/react';
 
export const db = new PowerSyncDatabase({
    database: {
        dbFilename: 'stackrender'
    },
    schema: AppSchema,
 

});


const ConnectorContext = createContext<StackRenderConnector | null>(null);
export const useConnector = () => useContext(ConnectorContext);


interface SyncProviderProps {
    children: React.ReactNode;
}

export const SyncProvider: React.FC<SyncProviderProps> = ({ children }) => {

    const [powerSync] = useState(db);
    const [connector] = useState(new StackRenderConnector());
    useEffect(() => {

        powerSync.init();
        powerSync.connect(connector);
    }, [powerSync, connector])
    return (
        <Suspense fallback={<CircularProgress/>}>
            <PowerSyncContext.Provider value={powerSync}>
                <ConnectorContext.Provider value={connector}>
                    {children}
                </ConnectorContext.Provider>
            </PowerSyncContext.Provider>
        </Suspense>
    )
}

