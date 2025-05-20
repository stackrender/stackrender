import { BookOpen, EarthLock, GitCommitHorizontal, Github, Settings, Sparkles, Table, TableProperties, Waypoints, Workflow, X, Zap } from "lucide-react";
import SidebarItem, { SidebarItemProps } from "./sidebar-item";
import { useMemo } from "react";
import { useLocation } from "react-router-dom";
import { useTranslation } from 'react-i18next';

interface SidebarProps {
    children?: React.ReactNode
}

const sidebarItemClass: string = "text-gray-700 dark:text-default-500 size-4 data-[active=true]:text-primary";

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

        {
            title: "AI",
            icon: <Sparkles className={sidebarItemClass}></Sparkles>,
            href: "/database/bot",
            isActive: location.pathname.endsWith("/database/bot")
        },
        {
            type: "divider"
        },
        {
            title: "API",
            icon: <Zap className={sidebarItemClass}></Zap>,
            href: "/database/ai-bot",
        },
        {
            title: "Authentication",
            icon: <EarthLock className={sidebarItemClass}></EarthLock>,
            href: "/database/ai-bot",
        },
        {
            title: "Controllers",
            icon: <Waypoints className={sidebarItemClass}></Waypoints>,
            href: "/database/ai-bot",
        },
        {
            type: "divider"
        },
        {
            title: "Git",
            icon: <GitCommitHorizontal className={sidebarItemClass}></GitCommitHorizontal>,
            href: "/database/ai-bot",
        },
        {
            type: "divider"
        },
        {
            title: "Project Setting",
            icon: <Settings className={sidebarItemClass}></Settings>,
            href: "/database/ai-bot",
        },
    ], [location])

    const bottomSidebarItems: SidebarItemProps[] = useMemo(() => [
        {
            title: "Github",
            icon: <Github className={sidebarItemClass}></Github>,
            href: "/database/ai-bot",
        },
        {
            title: "Docs",
            icon: <BookOpen className={sidebarItemClass}></BookOpen>,
            href: "/database/ai-bot",
        },
    ], []);

    return (

        <aside className="h-full z-[20] flex flex-col items-between py-2 justify-between sticky top-0 duration-500 w-12 bg-sidebar dark:bg-background border-r pt-[56px] dark:border-default-100">
            <div className="flex flex-col items-center gap-2">
                {
                    sidebarItems.map((item: SidebarItemProps , index : number) => (
                        <SidebarItem
                            key={`top-${index}`}
                            {...item}
                        />
                    ))
                }
            </div>
            <div className="flex flex-col items-center gap-2 ">
                {
                    bottomSidebarItems.map((item: SidebarItemProps, index : number) => (
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