import { Dropdown, DropdownMenu as HeroDropdownMenu, DropdownItem, DropdownTrigger, Button } from "@heroui/react";
import { useMemo  } from "react";
import SubmenuDropdown from "./submenu-dropdown";










export interface MenuDropdownProps {
    title?: string;
    children?: MenuDropdownProps[];

    theme?: "default" | "danger",
    isDisabled?: boolean,
    divide?: boolean,
    shortcut?: string,
    isOpen?: boolean , 
    clickHandler? : () => void 
}
const DropdownMenu: React.FC<MenuDropdownProps> = ({ title, children,  clickHandler }) => {
    const disabledChilds: string[] = useMemo(() => {
        return children ? children?.filter((child: MenuDropdownProps) => child.isDisabled && child.title).map((child: MenuDropdownProps) => child.title as string) : []
    }, [children]);

    return <Dropdown radius="sm" shadow="sm" showArrow >
        {
            title &&
            <DropdownTrigger   onPressEnd={clickHandler}>
                <Button size="sm" variant="light" className="min-w-[42px]"  >
                    <span className=" text-left flex justify-between text-small font-semibold text-font/90">
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

                        color={child.theme}
                        shortcut={child.shortcut}
                        classNames={{
                            shortcut : "dark:border-font/10"
                        }}
                        className="text-font/90"
                        onPressEnd={ child.clickHandler }
                    > 
                        {
                        
                            !child.children ?
                                <div >
                                    {child.title}
                                    {
                                        child.divide &&
                                        <div className="w-full  h-[0.5px] absolute bottom-[-0.5px] left-0 bg-divider  "></div>
                                    }
                                </div>
                                :
                                <div >
                                    <SubmenuDropdown {...child}  />
                                    {
                                        child.divide &&
                                        <div className="w-full  h-[0.5px] absolute bottom-[-0.5px] left-0 bg-divider  "></div>
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