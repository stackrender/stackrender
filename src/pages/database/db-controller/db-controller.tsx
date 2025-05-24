import React from "react"
import { Outlet } from "react-router-dom"



interface Props { 
 
}


const DBController : React.FC<Props> = ({ }) => {
    console.log ("re-render db controller")
    return(
        <div className="w-[640px] h-full bg-background border-r p-2 pt-[52px] border-default-100">
            <Outlet/>
        </div>
    )
}

export default React.memo(DBController)


