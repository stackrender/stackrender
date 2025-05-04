import { colorOptions } from "@/lib/colors";
import { Button, Popover, PopoverContent, PopoverTrigger } from "@heroui/react";
import { useCallback, useState } from "react";

interface ColorPickerProps {
    defaultColor?: string;
    onChange?: (color: string) => void
}



const ColorPicker: React.FC<ColorPickerProps> = ({ defaultColor, onChange }) => {
    const [color , setColor] = useState<string>( defaultColor as string ) ; 
    const [isOpen, setIsOpen] = useState(false);

    const onSelect = useCallback((color: string) => {
        setIsOpen(false);
        onChange && onChange(color) ; 
        setColor ( color)
    }, [onChange])

    return (
        <Popover placement="bottom" radius="sm" isOpen={isOpen} onOpenChange={(open) => setIsOpen(open)}>
            <PopoverTrigger>
                <Button size="sm"
                    className="size-8 cursor-pointer rounded-md border-2 border-muted transition-shadow hover:shadow-md"
                    isIconOnly
                    style={{
                        backgroundColor : color 
                    }}
                >

                </Button>
            </PopoverTrigger>
            <PopoverContent>
                <div className="grid grid-cols-4 gap-2">
                    {colorOptions.map(color => (
                        <div
                            key={color}
                            className="size-8 cursor-pointer rounded-md border-2 border-muted transition-shadow hover:shadow-md"
                            style={{
                                backgroundColor: color
                            }}
                            onClick={() => onSelect(color)}
                        >

                        </div>
                    ))}
                </div>
            </PopoverContent>
        </Popover>
    )
}


export default ColorPicker; 