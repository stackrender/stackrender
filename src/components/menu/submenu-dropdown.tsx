import { Button, Popover, PopoverContent, PopoverTrigger, useDisclosure } from "@heroui/react";
import { MenuDropdownProps } from "./menu-dropdown";
import { ChevronRight } from "lucide-react";

import DropdownMenu from "./menu-dropdown";



const SubmenuDropdown: React.FC<MenuDropdownProps> = ({ title, children }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();

    return (
        <div onMouseEnter={onOpen} onMouseLeave={onClose}  >
            <Popover placement="right" isOpen={isOpen} radius="sm" offset={90} >
                <PopoverTrigger>
                    <Button className="w-full h-6 bg-transparent p-0" size="sm" value={"light"}>
                        <span className="w-full text-left flex justify-between text-small font-normal">
                            {title}
                            <ChevronRight className="size-4 text-icon" />
                        </span>
                    </Button>
                </PopoverTrigger>
                <PopoverContent>
                    <DropdownMenu
                        
                        children={children}
                    />

                </PopoverContent>
            </Popover>
        </div>
    )
};

export default SubmenuDropdown; 