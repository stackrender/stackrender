import { ImportDatabaseMethod, ImportDatabaseOption } from "@/lib/database"
import { Avatar, Checkbox, Chip } from "@heroui/react";






interface OptionCheckboxProps {
    value: string;
    label: string ; 
    icon?: React.ReactNode;
    logo?: string

}


const OptionCheckbox: React.FC<OptionCheckboxProps> = ({ value, icon, logo ,  label }) => {

    return (
        <Checkbox
            aria-label={value}
            value={value}
            size="sm" 
            className="option-checkbox"
            classNames={{
                wrapper: "hidden",
                label: "flex items-center justify-center w-full h-full"
            }}
        >
            <Chip radius="sm" variant="bordered" color="default" className="option-span px-2 border-1 transition-all duration-300 border-divider"  
                avatar={logo ? <Avatar src={logo} /> : undefined}
                startContent={
                    icon
                }
            >
                <span className="text-sm text-font font-semibold">
                    {label}
                </span>
            </Chip>
        </Checkbox>
    )
}


export default OptionCheckbox; 