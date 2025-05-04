import { Link } from "react-router-dom";
import { Tooltip, TooltipContent, TooltipTrigger } from "../tooltip/tooltip";
import { Divider } from "@heroui/react";
import React from "react";



export interface SidebarItemProps {
    type?: "item" | "divider"
    title?: string;
    icon?: React.ReactNode;
    href?: string;
    isActive? : boolean 
}


const SidebarItem: React.FC<SidebarItemProps> = ({ title, icon, href , type = "item" , isActive}) => {

    if (type == "item")


        return (
            <Tooltip delayDuration={0} >
                <TooltipTrigger asChild>
                    <Link to={href as string} className="p-2 rounded-md hover:bg-default-200 sidebar-item" data-active={isActive}>
                        {icon}
                    </Link>
                </TooltipTrigger>
                <TooltipContent
                    side="left"
                    align="center"
                >
                    {title}
                </TooltipContent>
            </Tooltip>

        )
    else {
        return <Divider className="bg-default-200" />
    }
}


export default SidebarItem