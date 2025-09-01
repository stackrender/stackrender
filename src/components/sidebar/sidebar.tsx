import { Github, TableProperties, Workflow } from "lucide-react";
import SidebarItem, { SidebarItemProps } from "./sidebar-item";
import { useMemo } from "react";
import { useLocation } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import { Discord } from "../icon/discord";
import { X } from "../icon/x";

interface SidebarProps {
    children?: React.ReactNode
}

const sidebarItemClass: string = "text-font  size-4 data-[active=true]:text-primary-900";

const Sidebar: React.FC<SidebarProps> = ({ }) => {
    
    const { t } = useTranslation();
    const location = useLocation();

    const sidebarItems: SidebarItemProps[] = useMemo(() => [
        {
            title: t("sidebar.tables"),
            icon: <TableProperties className={sidebarItemClass}></TableProperties>,
            href: "/database/tables",
            isActive: location.pathname.endsWith("/database/tables")
        },
        {
            title: t("sidebar.relationships"),
            icon: <Workflow className={sidebarItemClass}></Workflow>,
            href: "/database/relationships",
            isActive: location.pathname.endsWith("/database/relationships")
        },
    ], [location , t])

    const bottomSidebarItems: SidebarItemProps[] = useMemo(() => [
        {
            title: "X",
            icon: <X className={sidebarItemClass}></X>,
            href: "https://x.com/Iam_The_Dev",
            newTab : true , 
        },
        {
            title: "Discord",
            icon: <Discord className={sidebarItemClass}></Discord>,
            href: "https://discord.gg/DsN8RcPR6Y",
            newTab : true , 
        },
        {
            title: "Github",
            icon: <Github className={sidebarItemClass}></Github>,
            href: "https://github.com/stackrender/stackrender",
            newTab : true , 
        },
    ], []);




    return (
        <aside className="h-full z-[20] flex flex-col items-between py-2 justify-between sticky top-0 duration-500 w-12 bg-sidebar  pt-[56px] dark:bg-background">
            <div className="flex flex-col items-center gap-2">
                {
                    sidebarItems.map((item: SidebarItemProps, index: number) => (
                        <SidebarItem
                            key={`top-${index}`}
                            {...item}
                        />
                    ))
                }
            </div>
            <div className="flex flex-col items-center gap-2 ">
                {
                    bottomSidebarItems.map((item: SidebarItemProps, index: number) => (
                        <SidebarItem
                            key={`bottom-${index}`}
                            {...item}
                        />
                    ))
                }
            </div>
        </aside>
    )
}



export default Sidebar; 