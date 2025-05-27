
import { Accordion, AccordionItem, Button, cn, Textarea } from "@heroui/react";
import { ChevronLeft, FileKey, FileType,  MessageSquareQuote, Plus } from "lucide-react";

import React, {  useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import ColorPicker from "@/components/color-picker/color-picker";
import FieldList from "./field/field-list";
import IndexesList from "./index/indexes-list";
import { TableType } from "@/lib/schemas/table-schema";
import {  useDatabaseOperations } from "@/providers/database-provider/database-provider";
import { getNextSequence } from "@/utils/field";
import { v4 } from "uuid";


export interface TableAccordionBodyProps {
    table: TableType,
}

const TableAccordionBody: React.FC<TableAccordionBodyProps> = ({ table }) => {

    const [selectedKeys, setSelectedKeys] = useState(new Set(["fields"]));
    const [note, setNote] = useState<string>(table.note ? table.note : "");
    const { t } = useTranslation();
    const { editTable, createField } = useDatabaseOperations();

    const onColorChange = useCallback((color: string | undefined) => {
        editTable({ id: table.id, color: color ? color : null } as TableType);
    }, [table]);

    const addField = (event: any) => {

        event.stopPropagation && event.stopPropagation();
        createField({
            id: v4(),
            name: `field_${table.fields.length + 1}`,
            tableId: table.id,
            sequence: getNextSequence(table.fields),
            nullable: true,
        })
    }

    const saveNote = () => {
        editTable({
            id: table.id,
            note
        } as TableType)
    }


    useEffect(() => {
        setNote(table.note ? table.note : "");
    }, [table.note]) ; 


 

    return (
        <div className="w-full dark:bg-background">
            <Accordion
                isCompact
                variant={"light"} selectionMode="multiple" selectedKeys={selectedKeys} onSelectionChange={setSelectedKeys as any}>
                <AccordionItem key="fields" aria-label="Fields"
                    indicator={({ isOpen }) => (
                        <div className={cn(
                            'tarnsition-all duration-200  ',
                            isOpen ? "rotate-[-90deg]" : ""
                        )}>
                            <ChevronLeft className="size-4 text-icon dark:text-default-600" />
                        </div>
                    )}
                    classNames={{
                        trigger: "hover:bg-default h-6 dark:hover:bg-background"
                    }}
                    subtitle={
                        <div className="group dark:text-default-600 flex gap-2 items-center font-medium p-1 w-full hover:underline text-slate-500 hover:text-slate-600 transition-all duration-200 dark:hover:text-white">
                            <FileType className="size-4 " />
                            <label className="text-sm w-full  cursor-pointer">
                                {t("db_controller.fields")}
                            </label>
                            <button
                                className="size-4 p-0 text-xs opacity-0 group-hover:opacity-100  transition-all duration-200 hover:text-slate-700 text-icon"
                                onClick={addField}
                            >
                                <Plus className="size-4 dark:text-default-600" />
                            </button>
                        </div>
                    }
                >
                    <FieldList tableFields={table.fields} tableId = { table.id } />
                </AccordionItem>
                <AccordionItem key="indexes" aria-label="Indexes"
                    indicator={({ isOpen }) => (
                        <div className={cn(
                            'tarnsition-all duration-200',
                            isOpen ? "rotate-[-90deg]" : ""
                        )}>
                            <ChevronLeft className="size-4 text-icon dark:text-default-600" />
                        </div>
                    )}
                    classNames={{
                        trigger: "hover:bg-default h-6 dark:hover:bg-background"
                    }}
                    subtitle={
                        <div className="flex gap-2  dark:text-default-600 items-center font-medium p-1 w-full hover:underline text-slate-500 hover:text-slate-600 transition-all duration-200 dark:hover:text-white">
                            <FileKey className="size-4 " />
                            <label className="text-sm  w-full  cursor-pointer">
                                {t("db_controller.indexes")}
                            </label>
                        </div>
                    }>
                    <IndexesList />
                </AccordionItem>
                <AccordionItem key="note" aria-label="Note"
                    indicator={({ isOpen }) => (
                        <div className={cn(
                            'tarnsition-all duration-200',
                            isOpen ? "rotate-[-90deg]" : ""
                        )}>
                            <ChevronLeft className="size-4 text-icon dark:text-default-600" />
                        </div>
                    )}
                    classNames={{
                        trigger: "hover:bg-default h-6 dark:hover:bg-background"
                    }}
                    subtitle={
                        <div className="flex gap-2 dark:text-default-600 items-center font-medium p-1 w-full hover:underline text-slate-500 hover:text-slate-600 transition-all duration-200 dark:hover:text-white">
                            <MessageSquareQuote className="size-4" />
                            <label className="text-sm w-full  cursor-pointer">
                                {t("db_controller.note")}
                            </label>
                        </div>
                    }>
                    <Textarea variant="bordered" className="w-full " label={t("db_controller.table_note")}
                        classNames={{
                            inputWrapper: "bg-default/80 ",
                        }}
                        value={note}
                        onValueChange={setNote}
                        onBlur={saveNote}

                    />
                </AccordionItem>
            </Accordion>
            <hr className="bg-default-200 dark:invisible" />
            <div className="flex p-2 pb-0 items-start">
                <div className="w-full">
                    <ColorPicker
                        defaultColor={table.color as string}
                        onChange={onColorChange}
                    />
                </div>
                <div className="flex gap-2">
                    <Button

                        variant="ghost"
                        size="sm"
                        className="font-semibold p-4 border-default-50"
                        startContent={
                            <FileKey className="size-4 " />
                        }
                    >
                        {t("db_controller.add_index")}
                    </Button>
                    <Button
                        onPressEnd={addField}
                        variant="ghost"
                        size="sm"
                        className="font-semibold p-4 border-default-50"
                        startContent={
                            <FileType className="size-4 " />
                        }
                    >
                        {t("db_controller.add_field")}
                    </Button>

                </div>
            </div>
        </div>
    )
}


export default React.memo(TableAccordionBody); 