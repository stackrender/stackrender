
import React, { useEffect, useState } from "react"
import { Outlet } from "react-router-dom"
import { ResizableBox as ResizableBoxRaw } from 'react-resizable';
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
            setTimeout(() => setWidth(486));
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
                minConstraints={[486]}
                axis="x"
                style={style}
                handle={
                    <div className="w-[6px] border-r-2 border-transparent  h-full absolute right-0 top-0 cursor-ew-resize  hover:border-primary/50 active:border-primary transition-colors duration-200 ">
                    </div>
                }
            >
                <div className="min-w-[486px] w-full h-full bg-background dark:bg-card border-r  ">
                    <Outlet />
                </div>
            </ResizableBox>
        )
    else
        return;
}

export default React.memo(DBController)


