import { Button, Popover, PopoverContent, PopoverTrigger, useDisclosure } from "@heroui/react";
import { MenuDropdownProps } from "./menu-dropdown";
import { Check, ChevronRight } from "lucide-react";

import DropdownMenu from "./menu-dropdown";



const SubmenuDropdown: React.FC<MenuDropdownProps> = ({ id , title, children }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    
   
    return (    
 
        <div onMouseEnter={onOpen} onMouseLeave={onClose} className="p-2">
            <Popover placement="right" isOpen={isOpen} radius="sm" shadow="sm" >
                <PopoverTrigger >
                    <Button  className="w-full h-6 bg-transparent p-0 text-font/90 " size="sm" value={"light"}>
                        <span className="w-full text-left flex justify-between text-small font-normal">
                            {title}
                            <ChevronRight className="size-4 text-icon" />
                        </span>
                        
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="p-0 border-0 shadow-none block w-[200px] ">
                    <div  className="h-8">
                        <DropdownMenu
                            id = { id }
                            children={children}
                        />
                        
                    </div>
                </PopoverContent>
            </Popover>
        </div>
    )
};

export default SubmenuDropdown; 