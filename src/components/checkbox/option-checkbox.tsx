
import {  Checkbox, Chip, cn, useCheckbox } from "@heroui/react";

interface OptionCheckboxProps {
    value: string;
    label: string;
    icon?: React.ReactNode;
    logo?: string;
    isSelected?: boolean;
}


const OptionCheckbox: React.FC<OptionCheckboxProps> = (props) => {
    const { value, icon, logo, label, isSelected } = props;

    const variant = isSelected ? {
        variant: "flat",
        color: "primary"
    } : {
        variant: "bordered",
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

            <Chip radius="sm" {...variant as any} className={cn("option-span px-3 h-8 border-1 transition-all duration-300 border-divider ",
               !isSelected ?  "dark:bg-default" : undefined
            )}
                avatar={logo ? <img src={logo} /> : undefined}
                startContent={
                    icon
                }
            >
                <span className="text-sm  font-medium">
                    {label}
                </span>
            </Chip>
        </Checkbox>
    )
}


export default OptionCheckbox; 