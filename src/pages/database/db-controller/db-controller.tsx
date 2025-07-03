
import React, { useEffect, useState } from "react"
import { Outlet } from "react-router-dom"
import { ResizableBox as ResizableBoxRaw } from 'react-resizable';
import 'react-resizable/css/styles.css';
import { GripVertical } from "lucide-react";
import 'react-resizable/css/styles.css';
import { useDiagramOps } from "@/providers/diagram-provider/diagram-provider";

const ResizableBox = ResizableBoxRaw as unknown as React.FC<any>;

interface Props {

}


const DBController: React.FC<Props> = ({ }) => {
    const [width, setWidth] = useState<number>(512);
    const { showController } = useDiagramOps()
    const [show, setShow] = useState<boolean>(!showController);
    const [style, setStyle] = useState<any>(undefined);
    const onResize = (event: any, params: any) => {
        setWidth(params.size.width);
    }

    useEffect(() => {
        if (!showController) {
            setWidth(0);
            setStyle({
                transition: 'width 0.5s',
            })
            setTimeout(() => {
                setShow(false);
            }, 500);

        } else if (showController) {
            setShow(true);
            setTimeout(() => setWidth(512))
            ;
         
            setTimeout(() => {
                setStyle(undefined);
            }, 500) 
        }
    }, [showController])
   
    if (show)
        return (

            <ResizableBox
                width={width}
                onResize={onResize} className="min-h-full overflow-hidden "
                minConstraints={[512]}
                axis="x"
                style={style}
                handle={
                    <div className="w-[6px] border-r-2 border-transparent  h-full absolute right-0 top-0 cursor-ew-resize hover:border-primary-300 active:border-primary-400 transition-colors duration-200 ">
                    </div>
                }
            >
                <div className="min-w-[512px] w-full h-full bg-background dark:bg-background-50 border-r p-2 pt-[52px] border-default-100 dark:border-divider">
                    <Outlet />
                </div>

            </ResizableBox>
        )
    else
        return;
}

export default React.memo(DBController)


