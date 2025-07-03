
import { Accordion, AccordionItem, Button, cn, Textarea } from "@heroui/react";
import { ChevronLeft, FileKey, FileType, MessageSquareQuote, Plus } from "lucide-react";

import React, { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import ColorPicker from "@/components/color-picker/color-picker";
import FieldList from "./field/field-list";
import IndexesList from "./index/indexes-list";
import { TableType } from "@/lib/schemas/table-schema";
import { useDatabase, useDatabaseOperations } from "@/providers/database-provider/database-provider";
import { getNextSequence } from "@/utils/field";
import { v4 } from "uuid";
import { IndexInsertType } from "@/lib/schemas/index-schema";


export interface TableAccordionBodyProps {
    table: TableType,
    keys?: string[];
}

const TableAccordionBody: React.FC<TableAccordionBodyProps> = ({ table, keys }) => {

    const [selectedKeys, setSelectedKeys] = useState(new Set(["fields"]));
    const [note, setNote] = useState<string>(table.note ? table.note : "");
    const { t } = useTranslation();

    const { editTable, createField, createIndex, getInteger } = useDatabaseOperations();

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
            typeId: getInteger()?.id
        });
    }

    const addIndex = (event: any) => {
        event.stopPropagation && event.stopPropagation();
        createIndex({
            id: v4(),
            name: `index_${table.indices.length + 1}`,
            unique: true,
            tableId: table.id
        } as IndexInsertType);

    }
    const saveNote = () => {
        editTable({
            id: table.id,
            note
        } as TableType)
    }


    useEffect(() => {
        setNote(table.note ? table.note : "");
    }, [table.note]);


    useEffect(() => {
        setSelectedKeys(new Set([...selectedKeys, "fields"]))
    }, [table.fields.length])

    useEffect(() => {
        setSelectedKeys(new Set([...selectedKeys, "indexes"]))
    }, [table.indices.length])

    return (
        <div className="w-full dark:bg-background-50">
            <Accordion
                isCompact
                variant={"light"} selectionMode="multiple" selectedKeys={selectedKeys} onSelectionChange={setSelectedKeys as any}>
                <AccordionItem key="fields" aria-label="Fields"
                    indicator={({ isOpen }) => (
                        <div className={cn(
                            'tarnsition-all duration-200  ',
                            isOpen ? "rotate-[0deg]" : ""
                        )}>
                            <ChevronLeft className="size-4 text-icon " />
                        </div>
                    )}
                    classNames={{
                        trigger: "hover:bg-default h-6 dark:hover:bg-background"
                    }}
                    subtitle={
                        <div className="group text-font/90  hover:text-font flex gap-2 items-center font-medium p-1 w-full hover:underline   transition-all duration-200 dark:hover:text-white">
                            <FileType className="size-4 " />
                            <label className="text-sm w-full  cursor-pointer">
                                {t("db_controller.fields")}
                            </label>
                            <button
                                className="size-4 p-0 text-xs opacity-0 group-hover:opacity-100  transition-all duration-200 hover:text-font text-icon"
                                onClick={addField}
                            >
                                <Plus className="size-4 dark:text-font/90" />
                            </button>
                        </div>
                    }
                >
                    <FieldList tableFields={table.fields} tableId={table.id} />
                </AccordionItem>
                <AccordionItem key="indexes" aria-label="Indexes"
                    indicator={({ isOpen }) => (
                        <div className={cn(
                            'tarnsition-all duration-200',
                            isOpen ? "rotate-[0deg]" : ""
                        )}>
                            <ChevronLeft className="size-4 text-icon " />
                        </div>
                    )}
                    classNames={{
                        trigger: "hover:bg-default h-6 dark:hover:bg-background"
                    }}
                    subtitle={
                        <div className="group flex gap-2  text-font/90 items-center font-medium p-1 w-full hover:underline  hover:text-font transition-all duration-200 dark:hover:text-white">
                            <FileKey className="size-4 " />
                            <label className="text-sm  w-full  cursor-pointer">
                                {t("db_controller.indexes")}
                            </label>
                            <button
                                className="size-4 p-0 text-xs opacity-0 group-hover:opacity-100  transition-all duration-200 hover:text-font text-icon"
                                onClick={addIndex}
                            >
                                <Plus className="size-4 dark:text-font/90" />
                            </button>
                        </div>
                    }>
                    <IndexesList indices={table.indices} fields={table.fields} tableId={table.id} />
                </AccordionItem>
                <AccordionItem key="note" aria-label="Note"
                    indicator={({ isOpen }) => (
                        <div className={cn(
                            'tarnsition-all duration-200',
                            isOpen ? "rotate-[0deg]" : ""
                        )}>
                            <ChevronLeft className="size-4 text-icon " />
                        </div>
                    )}
                    classNames={{
                        trigger: "hover:bg-default h-6 dark:hover:bg-background"
                    }}
                    subtitle={
                        <div className="flex gap-2 text-font/90 items-center font-medium p-1 w-full hover:underline  hover:text-font transition-all duration-200 dark:hover:text-white">
                            <MessageSquareQuote className="size-4" />
                            <label className="text-sm w-full  cursor-pointer">
                                {t("db_controller.note")}
                            </label>
                        </div>
                    }>
                    <Textarea variant="bordered" className="w-full " label={t("db_controller.table_note")}
                        classNames={{
                            inputWrapper: "bg-default border-divider dark:bg-background-100 group-hover:border-primary group-data-[focus=true]:border-primary",
                            label: "text-font/90 group-data-[focus=true]:text-font/70 group-data-[filled-within=true]:text-font/70"
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
                        onPressEnd={addIndex}
                        size="sm"
                        className="font-semibold p-4 border-divider text-font/90"
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
                        className="font-semibold p-4 border-divider text-font/90"
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