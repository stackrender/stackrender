

import "@/styles/globals.css"
import { TooltipProvider } from "./components/tooltip/tooltip";
import { ReactFlowProvider } from "@xyflow/react";
import useAppRoutes from "./routes/app-route";
import { SyncProvider } from "./providers/sync-provider/sync-provider";
import DatabaseProvider from "./providers/database-provider/database-provider";
import DiagramProvider from "./providers/diagram-provider/diagram-provider";
import { NextUIProvider } from "@nextui-org/react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { HeroUIProvider, ToastProvider } from "@heroui/react";



function App() {

  const appRoutes = useAppRoutes();
  return (
    <HeroUIProvider>
      <ToastProvider placement="bottom-right"/>
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
    </HeroUIProvider>
  );
}

export default App;
