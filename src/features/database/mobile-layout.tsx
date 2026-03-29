
import { Outlet } from "react-router-dom";
import DatabaseDiagram from "./components/database-diagram";
import { useDiagramOps } from "@/providers/diagram-provider/diagram-provider";
import {
    Drawer, 
    DrawerContent, 
} from "@/components/ui/drawer"




export const DatabaseMobileLayout: React.FC = () => {
    const { showController, openController } = useDiagramOps()

    return (
        <div className="w-full h-full">

            <DatabaseDiagram/>
            <Drawer open={showController} onOpenChange={openController} >
                <DrawerContent  className=" min-h-[80vh] h-[80vh]  bg-card">
                    <div className="mt-2 h-full overflow-hidden flex flex-col ">
                        <Outlet />
                    </div>
                </DrawerContent>
            </Drawer>
        </div>
    );
};

export default DatabaseMobileLayout;
