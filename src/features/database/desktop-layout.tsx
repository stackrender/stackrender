import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { cn } from "@/lib/utils";
import { Outlet } from "react-router-dom"; 
import { useDiagramOps } from "@/providers/diagram-provider/diagram-provider";
import DatabaseDiagram from "./components/database-diagram";

export const DatabaseDesktopLayout: React.FC = () => {
    const { showController } = useDiagramOps()

    return (
        <ResizablePanelGroup direction="horizontal">
            <ResizablePanel

                minSize={25}
                maxSize={showController ? 99 : 0}
                className={cn('transition-[flex-grow] duration-500 bg-card ', {
                    "min-w-[460px]": showController
                })}
            >
                <div className="min-w-[460px] h-full">
                    <Outlet />
                </div>
            </ResizablePanel>
            <ResizableHandle
                disabled={!showController}
                className={cn("h-full cursor-ew-resize hover:bg-primary/50 active:border-primary transition-colors duration-200", !showController ? 'hidden' : '')}
            />
            <ResizablePanel defaultSize={75} >

                <DatabaseDiagram/>

            </ResizablePanel>
        </ResizablePanelGroup>
    );
};

export default DatabaseDesktopLayout;
