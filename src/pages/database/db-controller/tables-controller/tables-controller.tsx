import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/tooltip/tooltip"
import { Accordion, AccordionItem, Button, Input } from "@heroui/react"
import { Code, List, Table } from "lucide-react"
import { useTranslation } from "react-i18next";
import { Ref, useCallback, useEffect, useRef, useState } from "react";
import TableAccordionHeader from "./table-accordion-item/table-accordion-header";
import TableAccordionBody from "./table-accordion-item/table-accordion-body";
import { useDatabase, useDatabaseOperations } from "@/providers/database-provider/database-provider";
import { TableInsertType, TableType } from "@/lib/schemas/table-schema";
import { v4 } from "uuid";
import { useDiagram } from "@/providers/diagram-provider/diagram-provider";
import { useReactFlow } from "@xyflow/react";
import SqlPreview from "../sql-preview";

interface Props { }
const PADDING_X = 40;
const PADDING_Y = 80;

const TablesController: React.FC<Props> = ({ }) => {

    const { database, getDefaultPrimaryKeyType } = useDatabase();
    const { createTable, data_types } = useDatabaseOperations();
    const { getViewport } = useReactFlow();
    const { tables: allTables } = database || { tables : []};
    const [tables, setTables] = useState<TableType[]>(allTables);

    const { t } = useTranslation();
    const [selectedTable, setSelectedTable] = useState(new Set([]));
    const [showSqlPreview, setShowSqlPreview] = useState<boolean>(false);
    const { focusedTableId } = useDiagram();
    const nameRef: Ref<HTMLInputElement> = useRef<HTMLInputElement>(null);

    useEffect(() => setTables(allTables), [allTables]);

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
                unique: true,
                typeId: getDefaultPrimaryKeyType(database?.dialect)?.id

            }]
        } as TableInsertType);

        setSelectedTable(new Set([newTableId]) as any);
    }, [database , tables, getViewport, getDefaultPrimaryKeyType]);


    useEffect(() => {
        if (focusedTableId) {
            setSelectedTable(new Set([focusedTableId]) as any);
        }
    }, [focusedTableId]);

    const selectedTableId = selectedTable.values().next().value;

    const searchTables = useCallback(() => {
        const keyword = nameRef.current?.value;
        if (keyword !== undefined)
            setTables(() => allTables.filter((table: TableType) => table.name.toLowerCase().trim().includes(keyword?.toLowerCase().trim())))
    }, [nameRef, allTables]);


    const toggleSqlPreview = useCallback(() => {
        setShowSqlPreview(preview => !preview);
    }, [])

    return (
        <div className="w-full h-full flex flex-col gap-2">
            <div className="flex items-center justify-between gap-4 py-1">
                <div>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <span>
                                <Button
                                    variant="light"
                                    className="size-8 p-0 text-icon hover:text-font/90"
                                    isIconOnly
                                    onPressEnd={toggleSqlPreview}
                                >
                                    {showSqlPreview ? (
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
                        ref={nameRef}
                        type="text"
                        size="sm"
                        autoFocus
                        radius="sm"
                        variant="faded"
                        placeholder={t("db_controller.filter")}
                        className="h-8 w-full focus-visible:ring-0 shadow-none "
                        classNames={{
                            inputWrapper: "dark:bg-default border-divider group-hover:border-primary ",
                        }}
                        onKeyUp={searchTables}

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
            {
                !showSqlPreview &&
                <div className=" flex-1 overflow-auto">

                    <Accordion
                        hideIndicator

                        selectedKeys={selectedTable}
                        onSelectionChange={setSelectedTable as any}
                        isCompact

                    >
                        {tables.map((table: TableType) => (
                            <AccordionItem
                                key={table.id}
                                aria-label={table.name}
                                classNames={{
                                    trigger: "w-full h-12 hover:bg-default transition-all duration-200 dark:hover:bg-background",
                                    base: "rounded-md mb-1  mt-1 p-0 overflow-hidden  dark:border-background-100",
                                    content: "bg-transparent"
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
            }
            {
                showSqlPreview &&
                <div className=" flex-1 overflow-auto ">
                    <SqlPreview />

                </div>
            }
        </div>
    )
}





export default TablesController



