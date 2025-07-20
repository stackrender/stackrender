import { Link } from "react-router-dom";
import { Tooltip, TooltipContent, TooltipTrigger } from "../tooltip/tooltip";
import { Divider } from "@heroui/react";
import React from "react";



export interface SidebarItemProps {
    type?: "item" | "divider"
    title?: string;
    icon?: React.ReactNode;
    href?: string;
    isActive?: boolean,
    newTab?: boolean
}


const SidebarItem: React.FC<SidebarItemProps> = ({ title, icon, href, type = "item", isActive, newTab }) => {


    if (type == "item")


        return (
            <Tooltip delayDuration={0} >
                {
                    !newTab &&
                    <TooltipTrigger asChild>

                        <Link
                            to={href as string}
                            target=""
                            className="p-2 rounded-md hover:bg-default-100 dark:hover:bg-background-50 sidebar-item " data-active={isActive}>
                            {icon}
                        </Link>
                    </TooltipTrigger>
                }
                {
                    newTab &&
                    <TooltipTrigger asChild>
                        <a
                            href={href as string}
                            target="_blank" 
                            className="p-2 rounded-md hover:bg-default-100 dark:hover:bg-background-50 sidebar-item " data-active={isActive}>
                            {icon}
                        </a>
                    </TooltipTrigger>
                }

                <TooltipContent
                    side="left"
                    align="center"
                >
                    {title}
                </TooltipContent>
            </Tooltip >

        )
    else {
        return <Divider className="bg-default-200 dark:bg-divider" />
    }
}


export default SidebarItem