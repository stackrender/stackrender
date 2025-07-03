
import { Checkbox, Chip, cn, useCheckbox } from "@heroui/react";
import { useTheme } from "next-themes";
import React from "react";

interface OptionCheckboxProps {
    value: string;
    label: string;
    icon?: React.ReactNode;
    logo?: string;
    isSelected?: boolean;
}


const OptionCheckbox: React.FC<OptionCheckboxProps> = (props) => {
    const { value, icon, logo, label, isSelected } = props;

    let variant : any  = isSelected ? {
        variant: "solid",
        color: "default"
    } : {
        variant: "borderd",
        color: "default"
    }
  
    return (    
        <Checkbox
            aria-label={value}
            value={value}
            size="sm"
            className="option-checkbox"
            classNames={{
                wrapper: "hidden",
                label: "flex items-center justify-center w-full h-full "
            }}
        >
            <Chip radius="sm" {...variant as any} className={cn("dark:bg-background px-3 h-9 border-1 transition-all duration-300 border-divider text-font/90 ",
                !isSelected ? "dark:bg-default" : undefined
            )}
                avatar={logo ? <img src={logo} height={12} /> : undefined}
                startContent={
                    icon
                }
            >
                <span className="text-xs font-medium ">
                    {label}
                </span>
            </Chip>
        </Checkbox>
    )
}


export default React.memo(OptionCheckbox); 