import { Dropdown, DropdownMenu as HeroDropdownMenu, DropdownItem, DropdownTrigger, Button, useDisclosure, Popover, PopoverTrigger, PopoverContent, Divider, DropdownSection } from "@heroui/react";
import { useMemo, useState } from "react";
import SubmenuDropdown from "./submenu-dropdown";










export interface MenuDropdownProps {
    title?: string;
    children?: MenuDropdownProps[];

    theme?: "default" | "danger",
    isDisabled?: boolean,
    divide?: boolean,
    shortcut?: string,
    isOpen?: boolean
}



const DropdownMenu: React.FC<MenuDropdownProps> = ({ title, children, isOpen }) => {



    const disabledChilds: string[] = useMemo(() => {
        return children ? children?.filter((child: MenuDropdownProps) => child.isDisabled && child.title).map((child: MenuDropdownProps) => child.title as string) : []
    }, [children]);


    return <Dropdown radius="sm" >
        {
            title &&
            <DropdownTrigger  >
                <Button size="sm" variant="light"   >
                    <span className=" text-left flex justify-between text-small font-semibold">
                        {title}
                    </span>
                </Button>
            </DropdownTrigger>
        }
        <HeroDropdownMenu disabledKeys={disabledChilds} >

            {
                children ? children?.map((child: MenuDropdownProps) => (

                    <DropdownItem
                        key={child.title as string}
                        className={child.theme == "danger" ? "text-danger" : ""}
                        color={child.theme}
                        shortcut={child.shortcut}
                    >
                        {
                            !child.children ?
                                <div>
                                    {child.title}
                                    {
                                        child.divide &&
                                        <div className="w-full  h-[0.5px] absolute bottom-[-0.5px] left-0 bg-default-200"></div>
                                    }
                                </div>
                                :
                                <div >
                                    <SubmenuDropdown {...child} />
                                    {
                                        child.divide &&
                                        <div className="w-full  h-[0.5px] absolute bottom-[-0.5px] left-0 bg-default-200"></div>
                                    }
                                </div>

                        }
                    </DropdownItem>

                )) : []
            }

        </HeroDropdownMenu>
    </Dropdown>



}


export default DropdownMenu; 