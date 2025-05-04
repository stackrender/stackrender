import { Table } from "@/lib/interfaces/table"
import { Accordion, AccordionItem, Button, cn, Divider, Textarea } from "@heroui/react";
import { ChevronLeft, ChevronRight, FileKey, FileText, FileType, Key, MessageSquareQuote } from "lucide-react";

import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import ColorPicker from "@/components/color-picker/color-picker";
import FieldList from "./field/field-list";
import IndexesList from "./index/indexes-list";


export interface TableAccordionBodyProps {
    table?: Table ,  
}

const TableAccordionBody: React.FC<TableAccordionBodyProps> = ({ table }) => {

    const [selectedKeys, setSelectedKeys] = useState(new Set(["fields"]));
    const { t } = useTranslation();

    const onColorChange = useCallback((color : string) => { 
        console.log ( color)
    } ,[])

    return (
        <div className="w-full">
            <Accordion
                variant={"light"} selectionMode="multiple" selectedKeys={selectedKeys} onSelectionChange={setSelectedKeys as any}>
                <AccordionItem key="fields" aria-label="Fields"
                    indicator={({ isOpen }) => (
                        <div className={cn(
                            'tarnsition-all duration-200',
                            isOpen ? "rotate-[-90deg]" : ""
                        )}>
                            <ChevronLeft className="size-4 text-icon" />
                        </div>
                    )}
                    classNames={{
                        trigger: "hover:bg-default h-6 "
                    }}
                    subtitle={
                        <div className="flex gap-2 items-center font-medium p-1 w-full hover:underline text-slate-500 hover:text-slate-600 transition-all duration-200">
                            <FileType className="size-4  " />
                            <label className="text-sm w-full  cursor-pointer">
                                {t("db_controller.fields")}
                            </label>
                        </div>
                    }
                >
                    <FieldList />
                </AccordionItem>
                <AccordionItem key="indexes" aria-label="Indexes"
                    indicator={({ isOpen }) => (
                        <div className={cn(
                            'tarnsition-all duration-200',
                            isOpen ? "rotate-[-90deg]" : ""
                        )}>
                            <ChevronLeft className="size-4 text-icon" />
                        </div>
                    )}
                    classNames={{
                        trigger: "hover:bg-default"
                    }}
                    subtitle={
                        <div className="flex gap-2 items-center font-medium p-1 w-full hover:underline text-slate-500 hover:text-slate-600 transition-all duration-200">
                            <FileKey className="size-4 " />
                            <label className="text-sm  w-full  cursor-pointer">
                                {t("db_controller.indexes")}
                            </label>
                        </div>
                    }>
                    <IndexesList/>
                </AccordionItem>
                <AccordionItem key="note" aria-label="Note"
                    indicator={({ isOpen }) => (
                        <div className={cn(
                            'tarnsition-all duration-200',
                            isOpen ? "rotate-[-90deg]" : ""
                        )}>
                            <ChevronLeft className="size-4 text-icon" />
                        </div>
                    )}
                    classNames={{
                        trigger: "hover:bg-default"
                    }}
                    subtitle={
                        <div className="flex gap-2 items-center font-medium p-1 w-full hover:underline text-slate-500 hover:text-slate-600 transition-all duration-200">
                            <MessageSquareQuote className="size-4" />
                            <label className="text-sm w-full  cursor-pointer">
                                {t("db_controller.note")}
                            </label>
                        </div>
                    }>
                    <Textarea variant="bordered" className="w-full " label={t("db_controller.table_note")}  classNames={{
                        inputWrapper: "bg-default/80",

                    }} />
                </AccordionItem>
            </Accordion>
            <hr className="bg-default-200" />
            <div className="flex p-2 pb-0 items-start">
                <div className="w-full">
                    <ColorPicker
                        onChange={onColorChange}
                    />
                </div>
                <div className="flex gap-2">
                    <Button

                        variant="ghost"
                        size="sm"
                        className="font-semibold p-4"
                        startContent={
                            <FileKey className="size-4 " />
                        }
                    >
                        {t("db_controller.add_index")}
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="font-semibold p-4"
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


export default TableAccordionBody; 