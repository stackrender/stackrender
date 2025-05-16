import { Route, Routes } from "react-router-dom";
import "@/styles/globals.css"
import { TooltipProvider } from "./components/tooltip/tooltip";
import { ReactFlowProvider } from "@xyflow/react";
import useAppRoutes from "./routes/app-route";
import { SyncProvider } from "./providers/sync-provider/sync-provider";
import DatabaseProvider from "./providers/database-provider/database-provider";
import DiagramProvider from "./providers/diagram-provider/diagram-provider";

function App() {
  const appRoutes = useAppRoutes();
  return (
    <SyncProvider>
      <ReactFlowProvider>
        <DatabaseProvider>
          <DiagramProvider>
            <TooltipProvider delayDuration={0}>
              {appRoutes}
            </TooltipProvider>
          </DiagramProvider>
        </DatabaseProvider>
      </ReactFlowProvider>
    </SyncProvider>
  );
}

export default App;
