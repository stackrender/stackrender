import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/tooltip/tooltip"
import { Accordion, AccordionItem, Button, Input } from "@heroui/react"
import { ChevronDown, Code, EllipsisVertical, Focus, Grid, Grip, List, Pencil, Table } from "lucide-react"
import { useTranslation } from "react-i18next";
import { useCallback, useEffect, useState } from "react";
import TableAccordionHeader from "./table-accordion-item/table-accordion-header";
import TableAccordionBody from "./table-accordion-item/table-accordion-body";
import { useDatabase } from "@/providers/database-provider/database-provider";
import { TableType } from "@/lib/schemas/table-schema";
import { v4 } from "uuid";
import { randomColor } from "@/lib/colors";


interface Props { }


const TablesController: React.FC<Props> = ({ }) => {


    const { tables, createTable } = useDatabase();
    const { t } = useTranslation();
    const [selectedTable, setSelectedTable] = useState(new Set([]));


    const addNewTable = useCallback(async () => {
        const newTableId: string = v4();

        await createTable({
            id: newTableId,
            name: `table_${tables.length + 1}`,
            createdAt: new Date().toISOString()
        });

        setSelectedTable(new Set([newTableId]) as any);
    }, [tables]);



    const selectedTableId = selectedTable.values().next().value;

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
                    variant="splitted"
                    selectedKeys={selectedTable}
                    onSelectionChange={setSelectedTable as any}
                    isCompact
                    
                >
                    {tables.map((table: TableType) => (
                        <AccordionItem
                            key={table.id}
                            aria-label={table.name}
                            classNames={{
                                trigger: "w-full h-12 hover:bg-default transition-all duration-200",
                                base: "rounded-md shadow p-0 overflow-hidden",
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


