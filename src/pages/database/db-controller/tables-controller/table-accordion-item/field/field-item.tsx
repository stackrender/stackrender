import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/tooltip/tooltip";
import { useSortable } from "@dnd-kit/sortable";
import { Autocomplete, AutocompleteItem, Button, Input } from "@heroui/react";
import { EllipsisVertical, Grip, GripVertical, KeyRound } from "lucide-react";
import { useTranslation } from "react-i18next";
import { CSS } from "@dnd-kit/utilities";

interface Props {
id : string 
}
export const animals = [
    { label: "Cat", key: "cat", description: "The second most popular pet in the world" },
    { label: "Dog", key: "dog", description: "The most popular pet in the world" },
    { label: "Elephant", key: "elephant", description: "The largest land animal" },
    { label: "Lion", key: "lion", description: "The king of the jungle" },
    { label: "Tiger", key: "tiger", description: "The largest cat species" },
    { label: "Giraffe", key: "giraffe", description: "The tallest land animal" },
    {
        label: "Dolphin",
        key: "dolphin",
        description: "A widely distributed and diverse group of aquatic mammals",
    },
    { label: "Penguin", key: "penguin", description: "A group of aquatic flightless birds" },
    { label: "Zebra", key: "zebra", description: "A several species of African equids" },
    {
        label: "Shark",
        key: "shark",
        description: "A group of elasmobranch fish characterized by a cartilaginous skeleton",
    },
    {
        label: "Whale",
        key: "whale",
        description: "Diverse group of fully aquatic placental marine mammals",
    },
    { label: "Otter", key: "otter", description: "A carnivorous mammal in the subfamily Lutrinae" },
    { label: "Crocodile", key: "crocodile", description: "A large semiaquatic reptile" },
];


const FieldItem: React.FC<Props> = ({id }) => {
    const { t } = useTranslation();

    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
 
       
      };
    
    return (
        <div className="flex w-full gap-1 items-center " style={style} ref={setNodeRef} {...attributes}>
            <div {...listeners}>
                <GripVertical className="size-4 text-icon" />
            </div>
            <Input
                variant="bordered"
                size="sm"
                placeholder={t("db_controller.name")}
                value={id}
            />
            <Autocomplete
                className="w-full"
                defaultItems={animals}
                size="sm"
                variant="bordered"

                placeholder={t("db_controller.type")}
            >
                {(item) => <AutocompleteItem key={item.key}>{item.label}</AutocompleteItem>}
            </Autocomplete>
            <div className="flex gap-2 ml-2">
                <Tooltip>
                    <TooltipTrigger asChild>
                        <button className="p-1 px-3 transition-all hover:bg-default rounded duration-200"  >
                            <span className="text-icon  text-sm">
                                N
                            </span>
                        </button>
                    </TooltipTrigger>
                    <TooltipContent>
                        {t("db_controller.nullable")}?
                    </TooltipContent>
                </Tooltip>

                <Tooltip>
                    <TooltipTrigger asChild>
                        <button className="p-1 px-2 transition-all hover:bg-default rounded duration-200"  >
                            <span className="text-icon  text-sm">
                                <KeyRound className="size-4" />
                            </span>
                        </button>
                    </TooltipTrigger>
                    <TooltipContent>
                        {t("db_controller.primary_key")}
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



export default FieldItem; 