import type React from "react";
import {
    Menubar,
    MenubarMenu,
    MenubarTrigger,
    MenubarContent,
    MenubarItem,
    MenubarSeparator,
    MenubarShortcut,
    MenubarSub,
    MenubarSubTrigger,
    MenubarSubContent,
} from "@/components/ui/menubar"
import { useMenuData } from "./data/menu-data";
import { MenuItem } from "../types";
import { Check } from "lucide-react"
const Menu: React.FC = ({ }) => {
    const menuData = useMenuData();
    return (
        <Menubar className="bg-card">
            {
                menuData.map((menuItem: MenuItem) => (
                    <MenubarMenu key={menuItem.id}>
                        <MenubarTrigger
                            onClick={menuItem.clickHandler}
                        >
                            {menuItem.title}
                        </MenubarTrigger>
                        {
                            menuItem.children &&
                            <MenubarContent>
                                {
                                    menuItem.children.map((subMenuItem: MenuItem) => (
                                        <div key={subMenuItem.id}>
                                            {
                                                !subMenuItem.children ?
                                                    <>
                                                        <MenubarItem
                                                            variant={subMenuItem.theme}
                                                            disabled={subMenuItem.isDisabled}
                                                            onClick={subMenuItem.clickHandler}
                                                        >
                                                            {subMenuItem.title}
                                                            {
                                                                subMenuItem.shortcut &&
                                                                <MenubarShortcut>{subMenuItem.shortcut}</MenubarShortcut>
                                                            }
                                                        </MenubarItem>
                                                        {
                                                            subMenuItem.divide &&
                                                            <MenubarSeparator />
                                                        }
                                                    </>
                                                    :
                                                    <>
                                                        <MenubarSub>
                                                            <MenubarSubTrigger>{subMenuItem.title}</MenubarSubTrigger>

                                                            <MenubarSubContent>
                                                                {
                                                                    subMenuItem.children.map((child: MenuItem) => (

                                                                        <MenubarItem

                                                                            disabled={child.isDisabled}
                                                                            onClick={child.clickHandler}
                                                                            key={child.id}
                                                                            className="flex items-center justify-between"

                                                                        >
                                                                            {
                                                                                child.title
                                                                            }
                                                                            {
                                                                                child.selected &&
                                                                                <Check className="h-4 w-4" />
                                                                            }

                                                                        </MenubarItem>
                                                                    ))
                                                                }
                                                            </MenubarSubContent>
                                                        </MenubarSub>
                                                        {
                                                            subMenuItem.divide &&
                                                            <MenubarSeparator />
                                                        }
                                                    </>
                                            }
                                        </div>

                                    ))
                                }
                            </MenubarContent>
                        }
                    </MenubarMenu>
                ))
            }
        </Menubar>
    )
}

export default Menu;  