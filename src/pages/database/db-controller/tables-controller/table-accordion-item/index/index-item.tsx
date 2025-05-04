import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/tooltip/tooltip";
import { Button, Select, SelectItem } from "@heroui/react";
import { EllipsisVertical } from "lucide-react";
import { useTranslation } from "react-i18next";



export const animals = [
    { key: "cat", label: "Cat" },
    { key: "dog", label: "Dog" },
    { key: "elephant", label: "Elephant" },
    { key: "lion", label: "Lion" },
    { key: "tiger", label: "Tiger" },
    { key: "giraffe", label: "Giraffe" },
    { key: "dolphin", label: "Dolphin" },
    { key: "penguin", label: "Penguin" },
    { key: "zebra", label: "Zebra" },
    { key: "shark", label: "Shark" },
    { key: "whale", label: "Whale" },
    { key: "otter", label: "Otter" },
    { key: "crocodile", label: "Crocodile" },
];


interface Props {

}


const IndexItem: React.FC<Props> = ({ }) => {
    const { t } = useTranslation();
    return (
        <div className="flex gap-2 w-full">
            <Select
                className="w-full"
                placeholder={t("db_controller.select_fields")}
                selectionMode="multiple"
                size="sm"
                variant="bordered"
            >
                {animals.map((animal) => (
                    <SelectItem key={animal.key}>{animal.label}</SelectItem>
                ))}
            </Select>
            <div className="flex gap-2 ml-2">
                <Tooltip>
                    <TooltipTrigger asChild>
                        <button className="p-1 px-3 transition-all hover:bg-default rounded duration-200"  >
                            <span className="text-icon  text-sm">
                                U
                            </span>
                        </button>
                    </TooltipTrigger>
                    <TooltipContent>
                        {t("db_controller.unique")}?
                    </TooltipContent>
                </Tooltip>

                <Button
                    size="sm"
                    isIconOnly
                    variant="light"
                >
                    <EllipsisVertical className="size-4 text-icon" />
                </Button>
            </div>

        </div>
    )
}


export default IndexItem; 