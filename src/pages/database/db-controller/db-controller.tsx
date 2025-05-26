
import React, { useState } from "react"
import { Outlet } from "react-router-dom"
import { ResizableBox as ResizableBoxRaw } from 'react-resizable';
import 'react-resizable/css/styles.css';

const ResizableBox = ResizableBoxRaw as unknown as React.FC<any>;

interface Props {

}


const DBController: React.FC<Props> = ({ }) => {
    const [width, setWidth] = useState<number>(512);
    const onResize = (event: any, params: any) => {
        setWidth(params.size.width);
    }
     
    
    return (
        <ResizableBox
            width={width}
            onResize={onResize} className="min-h-full "
            minConstraints={[512]}
            axis="x"
            handle={
                <div className="w-[6px] h-full absolute right-0 top-0 cursor-ew-resize">
                </div>
            }
        >
            <div className="min-w-[512px] w-full h-full bg-background border-r p-2 pt-[52px] border-default-100">
                <Outlet />
            </div>

        </ResizableBox>
    )
}

export default React.memo(DBController)


