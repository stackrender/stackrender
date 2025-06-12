

import "@/styles/globals.css"
import { TooltipProvider } from "./components/tooltip/tooltip";
import { ReactFlowProvider } from "@xyflow/react";
import useAppRoutes from "./routes/app-route";
import { SyncProvider } from "./providers/sync-provider/sync-provider";
import DatabaseProvider from "./providers/database-provider/database-provider";
import DiagramProvider from "./providers/diagram-provider/diagram-provider";

import { ToastProvider } from "@heroui/react";
import { ModalProvider } from "./providers/modal-provider/modal-provider";



function App() {

  const appRoutes = useAppRoutes();
  return (
    <>
      <ToastProvider placement="bottom-right" />
      <SyncProvider>
        <ReactFlowProvider>
          <DatabaseProvider>
            <DiagramProvider>
              <ModalProvider>
                <TooltipProvider delayDuration={0}>
                  {appRoutes}
                </TooltipProvider>
              </ModalProvider>
            </DiagramProvider>
          </DatabaseProvider>
        </ReactFlowProvider>
      </SyncProvider>

    </>
  );
}

export default App;
