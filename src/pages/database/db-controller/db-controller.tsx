import { Outlet } from "react-router-dom"



interface Props { 
 
}


const DBController : React.FC<Props> = ({ }) => {
    return(
        <div className="w-[640px] h-full bg-background border-r p-2 pt-[52px] border-default-100">
            <Outlet/>
        </div>
    )
}

export default DBController


