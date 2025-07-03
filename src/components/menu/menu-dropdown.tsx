import { Dropdown, DropdownMenu as HeroDropdownMenu, DropdownItem, DropdownTrigger, Button, Popover, PopoverTrigger, PopoverContent, cn } from "@heroui/react";
import { useCallback, useMemo } from "react";
import SubmenuDropdown from "./submenu-dropdown";
import { Check } from "lucide-react";










export interface MenuDropdownProps {
    id: string;
    title?: string;
    children?: MenuDropdownProps[];
    theme?: "default" | "danger",
    isDisabled?: boolean,
    divide?: boolean,
    shortcut?: string,
    isOpen?: boolean,
    selected?: boolean;
    clickHandler?: () => void
}
const DropdownMenu: React.FC<MenuDropdownProps> = ({ title, children, clickHandler, selected = false }) => {

    const disabledChilds: string[] = useMemo(() => {
        return children ? children?.filter((child: MenuDropdownProps) => child.isDisabled).map((child: MenuDropdownProps) => child.id as string) : []
    }, [children]);

    return <Dropdown radius="sm" shadow="sm" showArrow>
        {
            title &&
            <DropdownTrigger onPressEnd={clickHandler}>
                <Button size="sm" variant="light" className="min-w-[42px]" aria-label={title} >
                    <span className=" text-left flex justify-between text-small font-semibold text-font/90">
                        {title}
                    </span>
                </Button>
            </DropdownTrigger>
        }
        <HeroDropdownMenu
            disabledKeys={disabledChilds}
        >
            {
                children ? children?.map((child: MenuDropdownProps) => (
                    <DropdownItem
                        key={child.id as string}
                        color={child.theme}
                        shortcut={child.shortcut}
                        classNames={{
                            shortcut: "dark:border-font/10",
                            base: child.children ? "p-0" : "p-2"
                        }}
                        textValue={child.title}
                        endContent={
                            child.selected ? <Check className="text-icon size-4" /> : undefined
                        }
                        className={child.theme == "danger" ? "text-danger" : "text-font/90"}
                        onPressEnd={child.clickHandler}
                    >
                        {
                            !child.children ?
                                <div >
                                    {child.title}
                                    {
                                        child.divide &&
                                        <div className="w-full  h-[0.5px] absolute bottom-[-0.5px] left-0 bg-divider "></div>
                                    }
                                </div>
                                :
                                <div >

                                    <SubmenuDropdown {...child} />
                                    {
                                        child.divide &&
                                        <div className="w-full  h-[0.5px] absolute bottom-[-0.5px] left-0 bg-divider"></div>
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