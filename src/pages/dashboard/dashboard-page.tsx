
import Navbar from "@/components/navbar/navbar";
import Sidebar from "@/components/sidebar/sidebar"; 
 
import { Outlet } from "react-router-dom";



interface Props {

}

const DashboardPage: React.FC<Props> = ({ }) => {
    return (
        <div className="flex flex-col justify-between h-full  h-screen">
            <Navbar />
            <div className="flex">
                <Sidebar />
                <Outlet />
            </div>
        </div>
    )
}



export default DashboardPage; 