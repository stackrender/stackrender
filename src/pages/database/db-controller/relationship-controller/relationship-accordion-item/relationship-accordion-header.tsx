import { randomColor } from "@/lib/colors";
import { Button, cn, Input } from "@heroui/react";
import { Check, ChevronRight, EllipsisVertical, Focus, Pencil } from "lucide-react";
import { useState } from "react";



interface RelationshipAccordionHeaderProps {
    isOpen?: boolean;
}


const RelationshipAccordionHeader: React.FC<RelationshipAccordionHeaderProps> = ({ isOpen }) => {

    const [editMode, setEditMode] = useState<boolean>(false);
    return (
        <div className="group w-full flex h-12 gap-1  flex p-2 items-center" >
            <div className={cn(
                'tarnsition-all duration-200',
                isOpen ? "rotate-[90deg]" : ""
            )}>
                <ChevronRight className="size-4 text-icon" />
            </div>


            {
                editMode && <>
                    <Input
                        placeholder={"Usres"}
                        autoFocus
                        size="sm"
                        variant="bordered"
                        onBlur={() => setEditMode(false)}
                        type="text"
                        className="rounded-md px-2 py-0.5 w-full  border-blue-400  focus-visible:ring-0 dark:bg-slate-900  text-sm "
                    />
                    <Button
                        variant="light"
                        className="size-6 p-0 text-slate-500 hover:bg-primary-foreground hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200"
                        size="sm"
                        onPress={() => setEditMode(false)}
                        isIconOnly
                    >
                        <Check className="size-4 text-icon" />
                    </Button>
                </>
            }
            {

                !editMode && <>

                    <label
                        className="w-full  truncate px-2 py-1 text-sm font-semibold text-black"
                    >
                        users one or many posts
                    </label>
                    <div className="hidden shrink-0 flex-row group-hover:flex">

                        <Button
                            size="sm"
                            isIconOnly
                            variant="light"
                        >
                            <Focus className="size-4 text-icon" />
                        </Button>
                        <Button
                            size="sm"
                            isIconOnly
                            variant="light"
                            onPress={() => setEditMode(true)}
                        >
                            <Pencil className="size-4 text-icon" />
                        </Button>
                    </div>
                    <Button
                        size="sm"
                        isIconOnly
                        variant="light"
                    >
                        <EllipsisVertical className="size-4 text-slate-500" />
                    </Button>
                </>
            }
        </div>

    )
}


export default RelationshipAccordionHeader; 