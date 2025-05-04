import { NavbarBrand, NavbarContent, Navbar as NavbarContainer, Image, Dropdown, DropdownTrigger, Button, DropdownMenu, DropdownItem } from "@heroui/react";
import Menu from "../menu/menu";

interface Props {

}


const Navbar: React.FC<Props> = ({ }) => {
    return (

        <nav className="h-12 fixed z-50 bg-background w-full flex  items-center p-4 border-b border-default-200">
            <img
                src="/stackrender.png"
                width={22}
                alt="logo"


            />
            <h3 className="font-semibold ml-2 text-slate-900 text-sm">StackRender</h3>
            <div className="ml-4">
                <Menu/>
                
            </div>
        </nav>

    )
}


export default Navbar; 