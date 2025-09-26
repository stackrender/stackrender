
import React, { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import FieldList from "./field/field-list";
import IndexesList from "./index/indexes-list";
import { TableType } from "@/lib/schemas/table-schema";
import {  useDatabaseOperations } from "@/providers/database-provider/database-provider";
import { getNextSequence } from "@/utils/field";
import { v4 } from "uuid";
import { IndexInsertType } from "@/lib/schemas/index-schema";
import { FieldInsertType } from "@/lib/schemas/field-schema";
import { AccordionContent, Accordion, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { IconBolt , IconFolder,  IconMessageCircle,  } from "@tabler/icons-react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import ColorPicker from "@/components/color-picker";



export interface TableAccordionBodyProps {
    table: TableType,
    keys?: string[];
}

const TableAccordionContent: React.FC<TableAccordionBodyProps> = ({ table, keys }) => {

    const [selectedItems, setSelectedItems] = useState<string[]>(["fields"]);
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
        } as FieldInsertType);
    }

    const addIndex = (event: any) => {
        event.stopPropagation && event.stopPropagation();
        createIndex({
            id: v4(),
            name: `index_${table.indices.length + 1}`,
            unique: false,
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
        setSelectedItems([...selectedItems, "fields"])
    }, [table.fields.length])

    useEffect(() => {
        if (table.indices.length > 0)
            setSelectedItems([...selectedItems, "indexes"])
    }, [table.indices.length])

  
    return (
        <AccordionContent className=" p-0 ">
            <Accordion
                type="multiple"
                className="w-full"
                value={selectedItems}

                onValueChange={setSelectedItems as any}
            >
                
                <AccordionItem value="fields" className="border-none">
                    <AccordionTrigger className="py-1 rounded-none  text-muted-foreground " position="right" >
                        <div className="w-full flex gap-1 items-center">
                            <IconFolder className="size-4" />
                            {t("db_controller.fields")}
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className="pb-0 ">
                        <FieldList tableFields={table.fields} tableId={table.id} />
                    </AccordionContent>
                </AccordionItem>
               
                <AccordionItem value="indexes" className="border-none">
                    <AccordionTrigger className=" py-1  rounded-none text-muted-foreground " position="right">
                        <div className="w-full flex gap-1 items-center">         
                            <IconBolt className="size-4" />
                            {t("db_controller.indexes")}
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className="pb-2">
                        <IndexesList indices={table.indices} fields={table.fields} tableId={table.id} />
                    </AccordionContent>
                </AccordionItem>

                <AccordionItem value="note"  className="border-none">
                    <AccordionTrigger className=" py-1 rounded-none  text-muted-foreground  " position="right">
                        <div className="w-full flex gap-1 items-center">
                               <IconMessageCircle className="size-4  " />
                            {t("db_controller.note")}
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className="pb-0">
                        <Textarea
                            placeholder={t("db_controller.table_note")}
                            value={note}
                            onChange={(event : any) => setNote(event.target.value) }
                            onBlur={saveNote}
                            className="resize-none min-h-[86px] focus-visible:ring-0 bg-secondary dark:bg-background"
                        />
                    </AccordionContent>
                </AccordionItem> 
              
            </Accordion>
            <div className="flex  pt-2  justify-between    items-center ">
                <div className="h-full flex items-center">
                    <ColorPicker
                        defaultColor={table.color as string}
                        onChange={onColorChange}
                        
                    />
                </div>
                <div className="flex gap-2 ">
                    <Button
                        variant="outline"
                        onClick={addIndex}
                        size="sm"
                        className="h-9"
                    >
                        {t("db_controller.add_index")}
                    </Button>
                    <Button
                        onClick={addField}
                        variant="outline"
                        size="sm"
                        className="h-9"
                    >
                        {t("db_controller.add_field")}
                    </Button>
                </div>
            </div>
        </AccordionContent>

    )
}


export default React.memo(TableAccordionContent);

 