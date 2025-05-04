import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/tooltip/tooltip";
import { randomColor } from "@/lib/colors";
import { Table } from "@/lib/interfaces/table"
import { useSortable } from "@dnd-kit/sortable";
import { Button, cn, Divider, Input } from "@heroui/react";
import { Check, ChevronDown, ChevronLeft, ChevronRight, ChevronUp, EllipsisVertical, Focus, Grip, GripVertical, Pencil } from "lucide-react";
import { useState } from "react";
import { CSS } from "@dnd-kit/utilities";
import { useTranslation } from "react-i18next";

export interface TableAccordionHeaderProps {
    table?: Table,
    isOpen?: boolean,
    id: string
}
const TableAccordionHeader: React.FC<TableAccordionHeaderProps> = ({ table, isOpen, id }) => {
    const style = {
        borderLeft: "6px solid " + randomColor(),
    };
    const { t } = useTranslation();
    const [editMode, setEditMode] = useState<boolean>(false);

    return (
        <div className="group w-full flex h-12 gap-1 border-l-4 flex p-2 items-center"
            style={style}
        >
            <div className={cn(
                'tarnsition-all duration-200',
                isOpen ? "rotate-[90deg]" : ""
            )}>
                <ChevronRight className="size-4 text-icon" />
            </div>
            <div className=" w-[1px] h-full bg-default-200">
                 
            </div>
            {
                !editMode &&
                <div className="w-full px-1">
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <label
                                className="w-full text-editable truncate px-2 py-1 text-sm font-semibold text-black"
                                onDoubleClick={() => setEditMode(true)}
                            >
                                {id}
                            </label>
                        </TooltipTrigger>
                        <TooltipContent>
                            {t("table.double_click")}
                        </TooltipContent>
                    </Tooltip>
                </div>
            }
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
                        onClick={() => setEditMode(false)}
                        isIconOnly
                    >
                        <Check className="size-4 text-icon" />
                    </Button>
                </>
            }
            {

                !editMode && <>
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


export default TableAccordionHeader; 