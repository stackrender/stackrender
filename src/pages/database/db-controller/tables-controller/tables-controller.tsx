import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/tooltip/tooltip"
import { Accordion, AccordionItem, Button, Input } from "@heroui/react"
import { ChevronDown, Code, EllipsisVertical, Focus, Grid, Grip, List, Pencil, Table } from "lucide-react"
import { useTranslation } from "react-i18next";
import { useCallback, useEffect, useState } from "react";
import TableAccordionHeader from "./table-accordion-item/table-accordion-header";
import TableAccordionBody from "./table-accordion-item/table-accordion-body";
import { useDatabase, useDatabaseOperations } from "@/providers/database-provider/database-provider";
import { TableInsertType, TableType } from "@/lib/schemas/table-schema";
import { v4 } from "uuid";
import { useDiagram } from "@/providers/diagram-provider/diagram-provider";
import { useReactFlow, useViewport } from "@xyflow/react";


interface Props { }
const PADDING_X = 40;
const PADDING_Y = 80;

const TablesController: React.FC<Props> = ({ }) => {

    const { database } = useDatabase();
    const { createTable } = useDatabaseOperations();
    const { getViewport } = useReactFlow();
    const { tables } = database;
    //const viewport = useViewport();
    const { t } = useTranslation();
    const [selectedTable, setSelectedTable] = useState(new Set([]));
    const { focusedTableId } = useDiagram();

    const addNewTable = useCallback(async () => {
        const newTableId: string = v4();
        const viewport = getViewport();
        const { x, y, zoom } = viewport;
        // Convert screen (0,0) to flow coordinates using viewport values
        const posX = -x / zoom + (PADDING_X / zoom);
        const posY = -y / zoom + (PADDING_Y / zoom);

        await createTable({
            id: newTableId,
            name: `table_${tables.length + 1}`,
            posX,
            posY,
            fields: [{
                id: v4(),
                name: "id",
                isPrimary: true,
                unique: true
            }]
        } as TableInsertType);

        setSelectedTable(new Set([newTableId]) as any);
    }, [tables, getViewport]);


    useEffect(() => {
        if (focusedTableId) {
            setSelectedTable(new Set([focusedTableId]) as any);
        }
    }, [focusedTableId]);

    const selectedTableId = selectedTable.values().next().value;
    useEffect(() => {

        console.log("tables controller re-rendered")
    }, [getViewport]);


    return (
        <div className="w-full h-full flex flex-col gap-2">
            <div className="flex items-center justify-between gap-4 py-1">
                <div>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <span>
                                <Button
                                    variant="light"
                                    className="size-8 p-0"
                                    isIconOnly
                                    onPress={() =>
                                        //setShowDBML((value) => !value)
                                        console.log("hello world ")
                                    }
                                >
                                    {false ? (
                                        <List className="size-4" />
                                    ) : (
                                        <Code className="size-4" />
                                    )}
                                </Button>
                            </span>
                        </TooltipTrigger>
                        <TooltipContent>
                            {t("db_controller.show_code")}
                        </TooltipContent>
                    </Tooltip>
                </div>
                <div className="flex-1">
                    <Input
                        //ref={filterInputRef}
                        type="text"
                        size="sm"
                        radius="sm"
                        variant="bordered"
                        placeholder={t("db_controller.filter")}
                        className="h-8 w-full focus-visible:ring-0"
                    //value={filterText}
                    //onChange={(e) => setFilterText(e.target.value)}
                    />
                </div>
                <Button
                    variant="solid"
                    color="primary"
                    radius="sm"
                    onPressEnd={addNewTable}
                    startContent={
                        <Table className="h-4 w-4  " />
                    }
                    className="h-8 p-2 text-xs font-semibold"
                //onClick={handleCreateTable}
                >  {t("db_controller.add_table")}
                </Button>
            </div>
            <div className=" flex-1 overflow-auto">

                <Accordion
                    hideIndicator
                    variant={"splitted"}
                    selectedKeys={selectedTable}
                    onSelectionChange={setSelectedTable as any}
                    isCompact

                >
                    {tables.map((table: TableType) => (
                        <AccordionItem
                            key={table.id}
                            aria-label={table.name}
                            classNames={{
                                trigger: "w-full h-12 hover:bg-default transition-all duration-200 dark:bg-background dark:hover:bg-default-50",
                                base: "rounded-md shadow p-0 overflow-hidden dark:border-1 dark:border-default-100",
                            }}
                            subtitle={
                                <TableAccordionHeader
                                    isOpen={selectedTableId == table.id}
                                    table={table}
                                />
                            }
                        >
                            <TableAccordionBody table={table} />
                        </AccordionItem>
                    ))}
                </Accordion>
            </div>
        </div>
    )
}



export default TablesController


