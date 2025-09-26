import { colorOptions } from "@/lib/colors";

import { useCallback, useEffect, useState } from "react";
 
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Button } from "./ui/button"; 
import { IconSlash } from "@tabler/icons-react";

interface ColorPickerProps {
    defaultColor?: string;
    onChange?: (color: string | undefined) => void
}



const ColorPicker: React.FC<ColorPickerProps> = ({ defaultColor, onChange }) => {
    const [color, setColor] = useState<string | undefined>(defaultColor as string);
    const [isOpen, setIsOpen] = useState(false);
    
    

    useEffect(() => {
        setColor(defaultColor);
    }, [defaultColor])

    const onSelect = useCallback((color: string | undefined) => {
        setIsOpen(false);
        onChange && onChange(color);
        setColor(color)
    }, [onChange])

    return (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild >
                <Button
                    size="sm"
                    className="size-7 cursor-pointer rounded-md border-1   transition-shadow hover:shadow-md border-border rounded-sm bg-secondary hover:bg-secondary"
                    style={{
                        backgroundColor: color ? color : undefined
                    }}
                >
                </Button>
            </PopoverTrigger>
            <PopoverContent className="p-2 w-fit">
                <div className="grid grid-cols-4 gap-2">
                    {colorOptions.map(color => (
                        <div
                            key={color}
                            className="size-7 cursor-pointer rounded-sm border-1   transition-shadow hover:shadow-md border-border"
                            style={{
                                backgroundColor: color
                            }}
                            onClick={() => onSelect(color)}
                        >
                        </div>
                    ))}
                    <div
                        key={undefined}
                        className="size-7 cursor-pointer rounded-sm border-2 border-border transition-shadow hover:shadow-md bg-background dark:bg-secondary"
                        onClick={() => onSelect(undefined)}
                    >
                        <IconSlash className="size-8 text-destructive -ml-1 -mt-1" />
                    </div>
                </div>
            </PopoverContent>
        </Popover>



        /*
        <Popover placement="bottom" radius="sm" isOpen={isOpen} onOpenChange={(open) => setIsOpen(open)} shadow="sm">
            <PopoverTrigger>
                <Button size="sm"
                    className="size-8 cursor-pointer rounded-md border-2  transition-shadow hover:shadow-md border-divider"
                    isIconOnly
                    style={{
                        backgroundColor: color ? color : undefined
                    }}
                >

                </Button>
            </PopoverTrigger>
            <PopoverContent>
               
            </PopoverContent>
        </Popover>
        */
    )
}


export default ColorPicker; 