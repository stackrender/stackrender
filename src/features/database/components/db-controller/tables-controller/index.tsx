

import { Code } from "lucide-react"
import { useTranslation } from "react-i18next";
import { Ref, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useDatabase, useDatabaseOperations } from "@/providers/database-provider/database-provider";
import { TableInsertType, TableType } from "@/lib/schemas/table-schema";
import { v4 } from "uuid";
import { useDiagram } from "@/providers/diagram-provider/diagram-provider";
import { useReactFlow } from "@xyflow/react";
import SqlPreview from "../sql-preview";
import EmptyList from "@/components/empty-list";
import { useModal } from "@/providers/modal-provider/modal-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { IconListDetails, IconPlus } from "@tabler/icons-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";


const PADDING_X = 40;
const PADDING_Y = 80;

import {
    Accordion,
} from "@/components/ui/accordion"
import TableAccordionItem from "./table-accordion-item/table-accordion-item";
import { ScrollArea } from "@/components/ui/scroll-area";
import { closestCenter, DndContext, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { arrayMove, SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { getTableNextSequence } from "@/utils/tables";


const TablesController: React.FC = ({ }) => {

    const { database } = useDatabase();
    const { createTable, getInteger, orderTables } = useDatabaseOperations();
    const { getViewport } = useReactFlow();
    const { tables: allTables } = database || { tables: [] };
    const [tables, setTables] = useState<TableType[]>(allTables);
    const { t } = useTranslation();
    const [selectedTable, setSelectedTable] = useState<string | undefined>(undefined);
    const [showSqlPreview, setShowSqlPreview] = useState<boolean>(false);
    const { focusedTableId } = useDiagram();
    const nameRef: Ref<HTMLInputElement> = useRef<HTMLInputElement>(null);

    const sensors = useSensors(
        useSensor(PointerSensor)
    );


    function handleDragEnd(event: any) {
        const { active, over } = event;

        if (active.id !== over?.id) {

            setTables((items) => {

                const oldIndex = items.findIndex((item: TableType) => item.id == active.id);
                const newIndex = items.findIndex((item: TableType) => item.id == over.id);

                const tables = arrayMove(items, oldIndex, newIndex);
       
                orderTables(tables)

                return tables;

            });
        }
    }


    useEffect(() => searchTables(), [allTables]);

    const addNewTable = useCallback(async () => {
 
        const newTableId: string = v4();
        const viewport = getViewport();
        const { x, y, zoom } = viewport;

        const posX = -x / zoom + (PADDING_X / zoom);
        const posY = -y / zoom + (PADDING_Y / zoom);

        await createTable({
            id: newTableId,
            name: `table_${tables.length + 1}`,
            posX,
            posY,
            sequence: getTableNextSequence(tables),
            fields: [{
                id: v4(),
                name: "id",
                isPrimary: true,
                typeId: getInteger()?.id,
                autoIncrement: true,

            }]
        } as TableInsertType);

        setSelectedTable(newTableId);
    }, [database, tables, getViewport, getInteger]);

    useEffect(() => {
        if (focusedTableId) {
            setSelectedTable(focusedTableId);
            setShowSqlPreview(false);
            const accordionItem = document.getElementById(focusedTableId)
            if (accordionItem)
                accordionItem?.scrollIntoView({
                    behavior: 'smooth', block: 'center'
                })
        }
    }, [focusedTableId]);

    const searchTables = useCallback(() => {
        const keyword = nameRef.current?.value;
        if (keyword !== undefined)
            setTables(() => allTables.filter((table: TableType) => table.name.toLowerCase().trim().includes(keyword?.toLowerCase().trim())))
        else
            setTables(allTables)
    }, [nameRef, allTables]);

    const toggleSqlPreview = useCallback(() => {
        setShowSqlPreview(preview => !preview);
    }, []);

    const tableFilterIds = useMemo(() => {
        return tables.map((table: TableType) => table.id);
    }, [tables]);

    return (
        <div className="w-full h-full flex flex-col pl-3 ">
            <div className="flex  items-center pb-2 gap-2 pt-3 pr-3 ">
                <Tooltip >
                    <TooltipTrigger asChild>
                        <Button
                            variant={"ghost"}
                            size={"icon"}
                            className="rounded-md h-8 w-8"
                            onClick={toggleSqlPreview}
                        >
                            {showSqlPreview ? (
                                <IconListDetails className="size-4" stroke={1} />
                            ) : (
                                <Code className="size-4 text-muted-foreground" />
                            )}
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                        {t("db_controller.show_code")}
                    </TooltipContent>
                </Tooltip>
                <Input
                    className="h-8 bg-secondary dark:bg-background"
                    placeholder={t("db_controller.filter")}
                    ref={nameRef}
                    type="text"
                    onKeyUp={searchTables}
                />
                <Tooltip >
                    <TooltipTrigger asChild>
                        <Button
                            variant={"default"}
                            size={"icon"}
                            className="rounded-md h-8 w-8"
                            onClick={addNewTable}
                        >
                            <IconPlus className="size-4 " />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                        {t("db_controller.add_table")}
                    </TooltipContent>
                </Tooltip>
            </div>
            {
                allTables.length > 0 && !showSqlPreview &&
                <ScrollArea className="overflow-y-auto  pr-3 h-full  w-full ">
                    <Accordion
                        type="single"
                        collapsible
                        className="w-full"
                        value={selectedTable}
                        onValueChange={setSelectedTable}
                    >
                        <DndContext
                            sensors={sensors}
                            collisionDetection={closestCenter}
                            onDragEnd={handleDragEnd}
                        >

                            <SortableContext
                                items={tables}
                                strategy={verticalListSortingStrategy}
                            >

                                {tables.map((table: TableType) => (
                                    <TableAccordionItem table={table} key={table.id} />
                                ))}
                            </SortableContext>


                        </DndContext>
                    </Accordion>
                </ScrollArea>
            }
            {
                allTables.length > 0 && showSqlPreview &&
                <div className=" flex-1 overflow-auto -ml-3">
                    <SqlPreview
                        tableFilterIds={tableFilterIds}
                    />
                </div>
            }
            {
                (allTables.length == 0) &&
                <div className="pr-3 h-full">
                    <EmptyList
                        title={t("db_controller.empty_list.no_tables")}
                        description={t("db_controller.empty_list.no_tables_description")}
                    />
                </div>
            }
        </div>
    )
}
export default TablesController
