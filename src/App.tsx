

import "@/styles/globals.css"

import { ReactFlowProvider } from "@xyflow/react";
import useAppRoutes from "./routes/app-route";
import { SyncProvider } from "./providers/sync-provider/sync-provider";
import DatabaseProvider from "./providers/database-provider/database-provider";
import DiagramProvider from "./providers/diagram-provider/diagram-provider";
import { ModalProvider } from "./providers/modal-provider/modal-provider";
import DatabaseHotkeysProvider from "./providers/database-hotkeys/database-hotkeys-provider";



function App() {

  const appRoutes = useAppRoutes();
  return (
    <> 
      <SyncProvider>
        <ReactFlowProvider>
          <DatabaseProvider>
            <DiagramProvider>
 
                <ModalProvider>
                  <DatabaseHotkeysProvider>
                    {appRoutes}
                  </DatabaseHotkeysProvider>
                </ModalProvider>
            </DiagramProvider>
          </DatabaseProvider>
        </ReactFlowProvider>
      </SyncProvider>

    </>
  );
}

export default App;
