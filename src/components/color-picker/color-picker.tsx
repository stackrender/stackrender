import { colorOptions } from "@/lib/colors";
import { Button, Popover, PopoverContent, PopoverTrigger } from "@heroui/react";
import { Slash } from "lucide-react";
import { useCallback, useState } from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "../tooltip/tooltip";
import { useTranslation } from "react-i18next";

interface ColorPickerProps {
    defaultColor?: string;
    onChange?: (color: string | undefined) => void
}



const ColorPicker: React.FC<ColorPickerProps> = ({ defaultColor, onChange }) => {
    const [color, setColor] = useState<string | undefined>(defaultColor as string);
    const [isOpen, setIsOpen] = useState(false);
    const { t } = useTranslation();

    const onSelect = useCallback((color: string | undefined) => {
        setIsOpen(false);
        onChange && onChange(color);
        setColor(color)
    }, [onChange])

    return (
        <Popover placement="bottom" radius="sm" isOpen={isOpen} onOpenChange={(open) => setIsOpen(open)}>
            <PopoverTrigger>
                <Button size="sm"
                    className="size-8 cursor-pointer rounded-md border-2 border-muted transition-shadow hover:shadow-md"
                    isIconOnly
                    style={{
                        backgroundColor: color ? color : undefined
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
                    <Tooltip>
                        <TooltipTrigger>
                            <div
                                key={undefined}
                                className="size-8 cursor-pointer rounded-md border-2 border-muted transition-shadow hover:shadow-md"
                                style={{
                                    backgroundColor: "white"
                                }}
                                onClick={() => onSelect(undefined)}
                            >
                                <Slash className="size-full text-danger-500" />

                            </div>
                        </TooltipTrigger>
                        <TooltipContent>
                            {t("color_picker.default_color")}
                        </TooltipContent>
                    </Tooltip>


                </div>
            </PopoverContent>
        </Popover>
    )
}


export default ColorPicker; 