import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/tooltip/tooltip";

import { Button, cn, Input, Listbox, ListboxItem, Popover, PopoverContent, PopoverTrigger } from "@heroui/react";
import { Check, ChevronRight, Copy, EllipsisVertical, FileKey, FileType, Focus, Pencil, Trash } from "lucide-react";
import React, { useCallback, useEffect, useState } from "react";

import { useTranslation } from "react-i18next";
import { TableInsertType, TableType } from "@/lib/schemas/table-schema";
import { useDatabaseOperations } from "@/providers/database-provider/database-provider";
import { v4 } from "uuid";
import { getNextSequence } from "@/utils/field";
import { useDiagramOps } from "@/providers/diagram-provider/diagram-provider";
import hash from "object-hash";
import { cloneTable } from "@/utils/tables";
import { IndexInsertType } from "@/lib/schemas/index-schema";

export interface TableAccordionHeaderProps {
    table: TableType,
    isOpen?: boolean,
}


const TableAccordionHeader: React.FC<TableAccordionHeaderProps> = ({ table, isOpen }) => {
    const { editTable, deleteTable, createField, createTable , createIndex } = useDatabaseOperations();

    const [popOverOpen, setPopOverOpen] = useState<boolean>(false);
    const [tableName, setTableName] = useState<string>(table.name);

    const { t } = useTranslation();
    const [editMode, setEditMode] = useState<boolean>(false);
    const { focusOnTable } = useDiagramOps();

    useEffect(() => {
        setTableName(table.name);
    }, [table.name])

    const saveTableName = useCallback(async () => {

        await editTable({ id: table.id, name: tableName } as TableInsertType);
        setEditMode(false);
    }, [tableName])

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

    const addIndex = (event: any) => {
        setPopOverOpen(false)
        
        createIndex({
            id: v4(),
            name: `index_${table.indices.length + 1}`,
            unique: true,
            tableId: table.id
        } as IndexInsertType);
    }

    const duplicate = async () => {
        setPopOverOpen(false)
        const clonedTable: TableType = cloneTable(table);
        await createTable(clonedTable)
        focusOnTable(clonedTable.id);
    }




    return (
        <div className="group w-full flex h-12 gap-1 border-l-4 flex p-2 items-center border-l-[6px] border-default"
            style={{
                borderColor: table.color as string | undefined
            }}
        >
            <div className={cn(
                'tarnsition-all duration-200',
                isOpen ? "rotate-[90deg]" : ""
            )}>
                <ChevronRight className="size-4 text-icon dark:text-white" />
            </div>
            <div className=" w-[1px] h-full bg-default-200 dark:bg-default-100">
            </div>
            {
                !editMode &&
                <div className="w-full px-1">
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <label
                                className="w-full text-editable truncate px-2 py-1 text-sm font-semibold text-black dark:text-white"
                                onDoubleClick={() => setEditMode(true)}
                            >
                                {tableName}
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
                        className="rounded-md px-2 py-0.5 w-full  border-primary-700  focus-visible:ring-0   text-sm  "
                    />
                    <Button
                        variant="light"
                        className="size-6 p-0 text-slate-500 hover:bg-primary-foreground hover:text-slate-700 dark:text-white"
                        size="sm"
                        onPressEnd={saveTableName}
                        isIconOnly
                    >
                        <Check className="size-4 text-icon dark:text-white" />
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
                            onPress={() => setEditMode(true)}
                        >
                            <Pencil className="size-4 text-icon dark:text-white" />
                        </Button>
                        <Button
                            size="sm"
                            isIconOnly
                            variant="light"
                            onPressEnd={() => focusOnTable(table.id, true)}
                        >
                            <Focus className="size-4 text-icon dark:text-white" />
                        </Button>
                    </div>

                    <Popover placement="bottom" radius="sm" shadow="sm" showArrow isOpen={popOverOpen} onOpenChange={setPopOverOpen}>
                        <PopoverTrigger>
                            <Button
                                size="sm"
                                isIconOnly
                                variant="light"
                            >
                                <EllipsisVertical className="size-4 text-slate-500 dark:text-white" />
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
                                        <FileType className="size-4 text-icon dark:text-white" />

                                    }>
                                    {t("db_controller.add_field")}
                                </ListboxItem>
                                <ListboxItem
                                    key="add_index"
                                    endContent={<FileKey className="size-4 text-icon dark:text-white" />}
                                    showDivider
                                    onPressEnd={addIndex}
                                    >

                                    {t("db_controller.add_index")}
                                </ListboxItem>

                                <ListboxItem
                                    key="duplicate"
                                    showDivider
                                    onPressEnd={duplicate}
                                    endContent={<Copy className="size-4 text-icon" />}>

                                    {t("db_controller.duplicate")}
                                </ListboxItem>
                                <ListboxItem
                                    key="delete"
                                    className="text-danger"
                                    color="danger"
                                    onPressEnd={onDeleteTable}
                                    endContent={<Trash className="size-4" />}
                                >
                                    {t("db_controller.delete_table")}
                                </ListboxItem>
                            </Listbox>
                        </PopoverContent>
                    </Popover>

                </>
            }

        </div>
    )
}


export default React.memo(TableAccordionHeader, (prevState, newState) => {
    return hash(prevState) == hash(newState);
}); 