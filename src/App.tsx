import { Route, Routes } from "react-router-dom";
import "@/styles/globals.css"
import { TooltipProvider } from "./components/tooltip/tooltip";
import { ReactFlowProvider } from "@xyflow/react";
import useAppRoutes from "./routes/app-route";

function App() {
  const appRoutes = useAppRoutes() ; 
  return (
    <ReactFlowProvider>
      <TooltipProvider delayDuration={0}>
        {appRoutes}
      </TooltipProvider>
    </ReactFlowProvider>
  );
}

export default App;
