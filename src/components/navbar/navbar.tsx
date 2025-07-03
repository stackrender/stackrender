

import { useDatabase } from "@/providers/database-provider/database-provider";
import Menu from "../menu/menu";
import ConnectionStatus from "./connection-status";
import RenameDatabase from "./rename-database";

interface Props {

}


const Navbar: React.FC<Props> = ({ }) => {
    const { database } = useDatabase();

    return (

        <nav className="h-12 fixed z-50 bg-background w-full flex  items-center p-4 border-b  border-divider ">
            <img
                src={`/stackrender.png`}
                width={22}
                alt="logo"
            />
            <h3 className="font-semibold ml-2 text-slate-900 text-sm dark:text-white">StackRender</h3>
            <div className="ml-4  w-full">
                <div className="flex w-full justify-between items-center">

                    <Menu />
                    <div className=" w-full h-full flex items-center justify-center">
                        {database && <RenameDatabase database={database} />}
                    </div>
                
                    <ConnectionStatus />
                </div>
            </div>
        </nav>

    )
}


export default Navbar; 