
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
import { FieldInsertType } from "@/lib/schemas/field-schema";
import { AccordionTrigger } from "@/components/ui/accordion";
import { IconBolt, IconCheck, IconCopy, IconDotsVertical, IconFocus2, IconFolder, IconGripVertical, IconPencil, IconTrash } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DropdownMenuTrigger, DropdownMenu, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuItem, DropdownMenuShortcut } from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useSortable } from "@dnd-kit/sortable";



export interface TableAccordionHeaderProps {
    table: TableType,
    isOpen?: boolean,
}


const TableAccordionHeader: React.FC<TableAccordionHeaderProps> = ({ table, isOpen }) => {

    const { editTable, deleteTable, createField, createTable, createIndex, getInteger } = useDatabaseOperations();

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

    const onDeleteTable = useCallback(async (event: any) => {
        event.stopPropagation();
        deleteTable(table.id)

    }, [table]);

    const addField = useCallback((event: any) => {
        event.stopPropagation();


        createField({
            id: v4(),
            name: `field_${table.fields.length + 1}`,
            tableId: table.id,
            sequence: getNextSequence(table.fields),
            nullable: true,
            typeId: getInteger()?.id
        } as FieldInsertType)

    }, [table, getInteger])

    const addIndex = useCallback((event: any) => {
        event.stopPropagation();
        createIndex({
            id: v4(),
            name: `index_${table.indices.length + 1}`,
            unique: false,
            tableId: table.id
        } as IndexInsertType);
 
    }, [table])

    const duplicate = useCallback(async (event : any) => {
        event.stopPropagation()
        const clonedTable: TableType = cloneTable(table);
        await createTable(clonedTable)
        focusOnTable(clonedTable.id);
    }, [table]);


    const { listeners } = useSortable({ id: table.id });




    return (

        <AccordionTrigger className="group h-12 py-3 "
            leftContent={
                <div className="h-full bg-secondary  w-1 rounded-lg shrink-0 bg-primary" style={{
                    backgroundColor: table.color as string
                }}>
                </div>
            }
        >

            <div {...listeners}>
                <IconGripVertical className="size-4 text-muted-foreground hover:text-foreground cursor-move shrink-0" />
            </div>
            {
                !editMode &&
                <>
                    <div className="w-full flex items-center ">
                        <Tooltip>
                            <TooltipTrigger asChild>

                                <label
                                    className=" py-2 truncate  text-sm cursor-pointer max-w-60"
                                    onDoubleClick={() => setEditMode(true)}
                                    onClick={((event: any) => event.stopPropagation())}
                                >
                                    {tableName}
                                </label>

                            </TooltipTrigger>
                            <TooltipContent>
                                {t("table.double_click")}
                            </TooltipContent>
                        </Tooltip>
                    </div>
                    <div className="hidden !shrink-0 flex-row group-hover:flex gap-2 ">
                        <Button variant="outline" size="icon" className="size-7 shrink-0" onClick={(event: any) => {
                            event.stopPropagation();
                            setEditMode(true)

                        }}>
                            <IconPencil className="size-4 text-muted-foreground " />
                        </Button>
                        <Button variant="outline" size="icon" className="size-7 shrink-0  " onClick={(event: any) => {
                            event.stopPropagation();
                            focusOnTable(table.id, true)
                        }}>
                            <IconFocus2 className="size-4 text-muted-foreground " />
                        </Button>
                    </div>
                </>

            }
            {
                editMode && <>
                    <Input
                        placeholder={"Table name"}
                        value={tableName}
                        onChange={(event: any) => setTableName(event.target.value)}
                        onBlur={saveTableName}
                        autoFocus
                        type="text"
                        onClick={(event) => event.stopPropagation()}
                        className="h-8"

                    />
                    <Button variant="ghost" size="icon" className="size-7 shrink-0 rounded-sm" onClick={saveTableName} >
                        <IconCheck className="size-4 text-muted-foreground " />
                    </Button>
                </>
            }

            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="size-7 shrink-0 flex  rounded-sm" >
                        <IconDotsVertical className="size-4 text-muted-foreground " />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="min-w-[164px]">
                    <DropdownMenuLabel>
                        {t("db_controller.table_actions")}
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={addField}>
                        {t("db_controller.add_field")}
                        <DropdownMenuShortcut>
                            <IconFolder className="size-4" />
                        </DropdownMenuShortcut>
                    </DropdownMenuItem>

                    <DropdownMenuItem onClick={addIndex}>
                        {t("db_controller.add_index")}
                        <DropdownMenuShortcut>
                            <IconBolt className="size-4" />
                        </DropdownMenuShortcut>
                    </DropdownMenuItem>

                    <DropdownMenuItem onClick={duplicate}>
                        {t("db_controller.duplicate")}
                        <DropdownMenuShortcut>
                            <IconCopy className="size-4 " />
                        </DropdownMenuShortcut>
                    </DropdownMenuItem>

                    <DropdownMenuItem variant="destructive" onClick={onDeleteTable}>
                        {t("db_controller.delete_table")}
                        <DropdownMenuShortcut>
                            <IconTrash className="size-4 text-destructive" />
                        </DropdownMenuShortcut>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

        </AccordionTrigger>

    )
}


export default React.memo(TableAccordionHeader, (prevState, newState) => {
    return hash(prevState) == hash(newState);
}); 