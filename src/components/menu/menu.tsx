
import DropdownMenu, { MenuDropdownProps } from "./menu-dropdown";






const menu: MenuDropdownProps[] = [
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
    } , {
        title : "View" , 
        children : [{
            title : "Hide Controller" , 
            shortcut : "Ctnl + B" , 
            divide : true 
        } , { 
            title : "Zoom on scroll" , 
            divide : true , 
            children : [{
                title : "On"
            } , {
                title : "Off"
            }]  , 

        } , { 
            title : "Theme" ,
     
            children : [{
                title : "Light"
            } , {
                title : "Dark"
            }]
        }]
    } , {
        title : "Help" , 
        children : [{
            title : "Show Docs" , 
        } , { 
            title : "Join Discord"
        }]
    }
]





interface MenuProps {

}



const Menu: React.FC<MenuProps> = ({ }) => {
    return menu.map(menuItem => (
        <DropdownMenu {...menuItem} />
    ))
}


export default Menu; 