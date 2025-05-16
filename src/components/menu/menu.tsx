
import { useTheme } from "next-themes";
import DropdownMenu, { MenuDropdownProps } from "./menu-dropdown";
import { useMemo } from "react";
import { menuItem } from "@heroui/react";









interface MenuProps {
}

const Menu: React.FC<MenuProps> = ({ }) => {

    const { resolvedTheme, setTheme } = useTheme()




    const menu: MenuDropdownProps[] = useMemo(() => [
        {
            title: "File",

            children: [{
                title: "New"
            },
            {
                title: "Open",
                shortcut: "Ctnl + O"
            }, {
                title: "Save",
                shortcut: "Ctnl + S",
                divide: true
            }, {
                title: "Import",
                divide: true,
                children: [{
                    title: ".json",
                }, {
                    title: ".dbml"
                }, {
                    title: "MySql"
                }, {
                    title: "Postgresql"
                }]
            }, {
                title: "Export SQL",
                children: [{
                    title: "Generic",
                }, {
                    title: "MySql"
                }, {
                    title: "Postgresql"
                }]
            }, {
                title: "Export ORM Models",
                divide: true
            }, {
                title: "Delete Project",
                theme: "danger"
            }]
        }, {
            title: "Edit",
            clickHandler: () => {
                console.log("hello wo")
            },

            children: [{
                title: "Undo",
                isDisabled: true,
            },
            {
                title: "Redo",

                isDisabled: true,
            }, {
                title: "Clear",

            }]
        }, {
            title: "View",
            children: [{
                title: "Hide Controller",
                shortcut: "Ctnl + B",
                divide: true
            }, {
                title: "Zoom on scroll",
                divide: true,
                children: [{
                    title: "On"
                }, {
                    title: "Off"
                }],

            }, {
                title: "Theme",
                clickHandler: () => {
                    console.log("hello wo")
                },
                children: [{
                    title: "Light",
                    clickHandler: () => {
                        
                        setTheme("light") ;
                    }
                }, {
                    title: "Dark",
                    clickHandler: () => {
                    
                        setTheme("dark") ;
                    }
                }]
            }]
        }, {
            title: "Help",
            children: [{
                title: "Show Docs",
            }, {
                title: "Join Discord"
            }]
        }
    ], []);


    return menu.map(menuItem => (
        <DropdownMenu  {...menuItem} />
    ))
}


export default Menu; 