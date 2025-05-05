import { Route, Routes } from "react-router-dom";
import "@/styles/globals.css"
import { TooltipProvider } from "./components/tooltip/tooltip";
import { ReactFlowProvider } from "@xyflow/react";
import useAppRoutes from "./routes/app-route";
import { SyncProvider } from "./providers/sync-provider";

function App() {
  const appRoutes = useAppRoutes();
  return (
    <SyncProvider>
      <ReactFlowProvider>
        <TooltipProvider delayDuration={0}>
          {appRoutes}
        </TooltipProvider>
      </ReactFlowProvider>
    </SyncProvider>
  );
}

export default App;
