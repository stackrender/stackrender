import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/tooltip/tooltip"
import { Accordion, AccordionItem, Button, Input, useDisclosure } from "@heroui/react"
import { Code, List, ListCollapse, Table, Workflow } from "lucide-react"
import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import RelationshipAccordionHeader from "./relationship-accordion-item/relationship-accordion-header";
import RelationshipAccordionBody from "./relationship-accordion-item/relationship-accordion-body";
import Modal from "@/components/modal/modal";
import CreateRelationshipForm from "./create-relationship-form/create-relationship-form";
import { RelationshipInsertType, RelationshipType } from "@/lib/schemas/relationship-schema";
import { useDatabase, useDatabaseOperations } from "@/providers/database-provider/database-provider";
import { v4 } from "uuid";
import { useDiagram } from "@/providers/diagram-provider/diagram-provider";




interface Props {

}


const RelationshipController: React.FC<Props> = ({ }) => {
    const [relationship, setRelationship] = useState<RelationshipInsertType | undefined>(undefined);
    const [isValid, setIsValid] = useState<boolean>(false);
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const { database } = useDatabase();
    const { createRelationship, } = useDatabaseOperations();
    const { relationships } = database;

    const { t } = useTranslation();
    const [selectedRelationship, setSelectedRelationship] = useState(new Set([]));
    const { focusedRelationshipId } = useDiagram();

    const addRelationship = useCallback(() => {

        const newRelationshipId: string = v4();

        createRelationship({
            id: newRelationshipId,
            ...relationship,
        } as RelationshipInsertType);

        setSelectedRelationship(new Set([newRelationshipId]) as any);
    }, [relationship]);


    useEffect(() => {
        if (focusedRelationshipId) {
            setSelectedRelationship(new Set([focusedRelationshipId]) as any);
        }

    }, [focusedRelationshipId])

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
                    onPressEnd={onOpen}
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
                        className: "bg-default-200"
                    }}
                    isCompact
                    selectedKeys={selectedRelationship}
                    onSelectionChange={setSelectedRelationship as any}
                >
                    {relationships.map((relationship: RelationshipType) => (
                        <AccordionItem
                            key={relationship.id}
                            aria-label={relationship.id}
                            classNames={{
                                trigger: "w-full hover:bg-default transition-all duration-200 h-12 dark:bg-background dark:hover:bg-default-50",
                                base: "rounded-md p-0 overflow-hidden",
                            }}
                            subtitle={
                                <RelationshipAccordionHeader relationship={relationship} />
                            }
                        >
                            <RelationshipAccordionBody relationship={relationship} />
                        </AccordionItem>
                    ))}
                </Accordion>
            </div>
            <Modal
                isOpen={isOpen}
                onOpenChange={onOpenChange}
                title={t("db_controller.create_relationship")}
                actionName={t("modal.create")}
                className="min-w-[520px]"
                isDisabled={!isValid}
                actionHandler={addRelationship}

            >
                <CreateRelationshipForm
                    onRelationshipChanges={setRelationship}
                    onValidationChanges={setIsValid}
                />
            </Modal>
        </div>
    )
}

export default RelationshipController


