import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/tooltip/tooltip"
import { Accordion, AccordionItem, Button, Input } from "@heroui/react"
import { Code, List, ListCollapse, Table, Workflow } from "lucide-react"
import { useState } from "react";
import { useTranslation } from "react-i18next";
import RelationshipAccordionHeader from "./relationship-accordion-item/relationship-accordion-header";
import RelationshipAccordionBody from "./relationship-accordion-item/relationship-accordion-body";



interface Props {

}


const RelationshipController: React.FC<Props> = ({ }) => {
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
                                    <ListCollapse className="size-4" />
                                </Button>
                            </span>
                        </TooltipTrigger>
                        <TooltipContent>
                            {t("db_controller.collapse")}
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
                        //placeholder={t('side_panel.tables_section.filter')}
                        className="h-8 w-full focus-visible:ring-0 "
                    //value={filterText}
                    //onChange={(e) => setFilterText(e.target.value)}
                    />
                </div>
                <Button
                    variant="solid"
                    radius="sm"
                    color="primary"
                    startContent={
                        <Workflow className="h-4 w-4 " />
                    }
                    className="h-8 p-2 text-xs font-semibold "
                //onClick={handleCreateTable}
                >{t("db_controller.add_relationship")}
                </Button>
            </div>
            <div className=" flex-1 overflow-auto">

                <Accordion
                    hideIndicator
                    dividerProps={{
                        className : "bg-default-200"
                    }}
                >
                    {items.map(item => (
                        <AccordionItem
                            key={item}
                            aria-label={item}
                            classNames={{
                                trigger: "w-full hover:bg-default transition-all duration-200",
                                base: "rounded-md  p-0 overflow-hidden",
                            }}
                            subtitle={
                                <RelationshipAccordionHeader/>
                            }
                        >
                            <RelationshipAccordionBody/>
                        </AccordionItem>
                    ))}
                </Accordion>
            </div>
        </div>
    )
}

export default RelationshipController


