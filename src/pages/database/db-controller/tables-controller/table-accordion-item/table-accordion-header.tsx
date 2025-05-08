import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/tooltip/tooltip";

import { Button, cn, Divider, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Input, Listbox, ListboxItem, Popover, PopoverContent, PopoverTrigger, useDisclosure } from "@heroui/react";
import { Check, ChevronRight, Copy, EllipsisVertical, FileKey, FileType, Focus, Pencil, Trash } from "lucide-react";
import { useState } from "react";

import { useTranslation } from "react-i18next";
import { TableType } from "@/lib/schemas/table-schema";
import { useDatabase } from "@/providers/database-provider/database-provider";
import { v4 } from "uuid";
import { getNextSequence } from "@/utils/field";

export interface TableAccordionHeaderProps {
    table: TableType,
    isOpen?: boolean,
}


const TableAccordionHeader: React.FC<TableAccordionHeaderProps> = ({ table, isOpen }) => {
    const { editTable, deleteTable, createField } = useDatabase();
    const [popOverOpen, setPopOverOpen] = useState<boolean>(false);
    const style = {
        borderLeft: "6px solid " + table.color,
    };

    const [tableName, setTableName] = useState<string>(table.name);

    const { t } = useTranslation();
    const [editMode, setEditMode] = useState<boolean>(false);

    const saveTableName = async () => {
        await editTable({ id: table.id, name: tableName });
        setEditMode(false);
    }

    const onDeleteTable = async () => {
        deleteTable(table.id)
        setPopOverOpen(false);
    }



    const addField = () => {
        setPopOverOpen(false)
        createField({
            id: v4(),
            name: `field_${table.fields.length + 1}`,
            tableId: table.id,
            sequence: getNextSequence(table.fields),
            nullable: true,
        })
    }


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
                                {table.name}
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
                        placeholder={"Table name"}
                        autoFocus
                        size="sm"
                        value={tableName}
                        onChange={(event: any) => setTableName(event.target.value)}
                        variant="bordered"
                        onBlur={saveTableName}
                        type="text"
                        className="rounded-md px-2 py-0.5 w-full  border-blue-400  focus-visible:ring-0 dark:bg-slate-900  text-sm "
                    />
                    <Button
                        variant="light"
                        className="size-6 p-0 text-slate-500 hover:bg-primary-foreground hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200"
                        size="sm"
                        onPressEnd={saveTableName}
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

                    <Popover placement="bottom" radius="sm" shadow="sm" showArrow isOpen={popOverOpen} onOpenChange={setPopOverOpen}>
                        <PopoverTrigger>
                            <Button
                                size="sm"
                                isIconOnly
                                variant="light"
                            >
                                <EllipsisVertical className="size-4 text-slate-500" />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[160px]" >
                            <div className="w-full flex flex-col gap-2 ">
                                <h3 className="font-semibold text-sm text-gray p-2">
                                    {t("db_controller.table_actions")}
                                </h3>
                            </div>
                            <hr className="text-default-200" />
                            <Listbox aria-label="Actions" className="p-0 pb-1" >
                                <ListboxItem
                                    key="add_field"
                                    onPressEnd={addField}
                                    endContent={
                                        <FileType className="size-4 text-icon" />

                                    }>
                                    Add Field
                                </ListboxItem>
                                <ListboxItem
                                    key="add_index"
                                    endContent={<FileKey className="size-4 text-icon " />}
                                    showDivider>
                                    Add Index
                                </ListboxItem>

                                <ListboxItem
                                    key="duplicate"
                                    showDivider
                                    endContent={<Copy className="size-4 text-icon" />}>
                                    Duplicate
                                </ListboxItem>
                                <ListboxItem
                                    key="delete"
                                    className="text-danger"
                                    color="danger"
                                    onPressEnd={onDeleteTable}
                                    endContent={<Trash className="size-4" />}
                                >
                                    Delete Table
                                </ListboxItem>
                            </Listbox>
                        </PopoverContent>
                    </Popover>

                </>
            }

        </div>
    )
}


export default TableAccordionHeader; 