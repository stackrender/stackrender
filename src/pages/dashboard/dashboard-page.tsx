
import Sidebar from "@/components/sidebar/sidebar";
import DatabasePage from "../database/database-page";
import Navbar from "@/components/navbar/navbar";
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