import { Route, Routes } from "react-router-dom";
import "@/styles/globals.css"
import { TooltipProvider } from "./components/tooltip/tooltip";
import { ReactFlowProvider } from "@xyflow/react";
import useAppRoutes from "./routes/app-route";
import { SyncProvider } from "./providers/sync-provider/sync-provider";
import DatabaseProvider from "./providers/database-provider/database-provider";

function App() {
  const appRoutes = useAppRoutes();
  return (
    <SyncProvider>
      <ReactFlowProvider>
        <DatabaseProvider>
          <TooltipProvider delayDuration={0}>
            {appRoutes}
          </TooltipProvider>
        </DatabaseProvider>
      </ReactFlowProvider>
    </SyncProvider>
  );
}

export default App;
