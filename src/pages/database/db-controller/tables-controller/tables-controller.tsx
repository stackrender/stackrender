import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/tooltip/tooltip"
import { Accordion, AccordionItem, Button, Input } from "@heroui/react"
import { ChevronDown, Code, EllipsisVertical, Focus, Grid, Grip, List, Pencil, Table } from "lucide-react"
import { useTranslation } from "react-i18next";
import { useState } from "react";
import TableAccordionHeader from "./table-accordion-item/table-accordion-header";
import TableAccordionBody from "./table-accordion-item/table-accordion-body";

interface Props {}


const TablesController: React.FC<Props> = ({ }) => {

    const [items, setItems] = useState(["Item 1", "Item 2", "Item 3", "Item 4"]);

    const { t } = useTranslation();

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
                >
                    {items.map(item => (
                        <AccordionItem
                            key={item}
                            aria-label={item}
                            classNames={{
                                trigger: "w-full hover:bg-default transition-all duration-200",
                                base: "rounded-md shadow p-0 overflow-hidden",
                            }}
                            subtitle={
                                <TableAccordionHeader id={item} />
                            }
                        >
                            <TableAccordionBody />
                        </AccordionItem>
                    ))}
                </Accordion>
            </div>
        </div>
    )
}



export default TablesController


