import { useDatabase } from "@/providers/database-provider/database-provider";
import Menu from "../menu/menu";
import RenameDatabase from "./rename-database";
import LanguagesDropdown from "./languages-dropdown";



const Navbar: React.FC = ({ }) => {
    const { database } = useDatabase();
    return (
        <nav className="h-12 fixed z-50 bg-background w-full flex  items-center p-4 border-b  border-divider  ">
            <img
                src={`/stackrender.png`}
                width={22}
                alt="logo"
            />
            <h3 className="font-semibold ml-2 text-slate-900 text-sm dark:text-white">StackRender</h3>
            <div className="ml-4  w-full">
                <div className="flex w-full justify-between items-center gap-2">

                    <Menu />
                    <div className="  absolute left-[50%] -translate-x-[50%]">
                        {database && <RenameDatabase database={database} />}
                    </div>
                    <div className="flex gap-2 items-center">
                        <a className="gh-button text-font font-medium bg-background text-xs p-4 px-2 pr-2.5   flex justif-center items-center"
                            target="_blank"
                            href="https://github.com/KarimTamani/stackrender">
                            <span className="gh-button__icon"></span>

                        </a>

                        <LanguagesDropdown />
                    </div>
                </div>
            </div>
        </nav>

    )
}


export default Navbar; 