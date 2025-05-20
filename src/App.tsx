

import "@/styles/globals.css"
import { TooltipProvider } from "./components/tooltip/tooltip";
import { ReactFlowProvider } from "@xyflow/react";
import useAppRoutes from "./routes/app-route";
import { SyncProvider } from "./providers/sync-provider/sync-provider";
import DatabaseProvider from "./providers/database-provider/database-provider";
import DiagramProvider from "./providers/diagram-provider/diagram-provider";
import { NextUIProvider } from "@nextui-org/react";
import { ThemeProvider as NextThemesProvider } from "next-themes";



function App() {

  const appRoutes = useAppRoutes();
  return (
    <NextUIProvider>
      <NextThemesProvider
        defaultTheme='system'
        attribute='class'
      >
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
      </NextThemesProvider>
    </NextUIProvider>
  );
}

export default App;
