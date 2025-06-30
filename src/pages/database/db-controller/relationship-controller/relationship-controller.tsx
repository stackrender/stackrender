import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/tooltip/tooltip"
import { Accordion, AccordionItem, Button, Input, useDisclosure } from "@heroui/react"
import { ListCollapse, Workflow } from "lucide-react"
import { Ref, useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import RelationshipAccordionHeader from "./relationship-accordion-item/relationship-accordion-header";
import RelationshipAccordionBody from "./relationship-accordion-item/relationship-accordion-body";

import CreateRelationshipForm from "../../modals/create-relationship-modal";
import { RelationshipInsertType, RelationshipType } from "@/lib/schemas/relationship-schema";
import { useDatabase, useDatabaseOperations } from "@/providers/database-provider/database-provider";

import { useDiagram } from "@/providers/diagram-provider/diagram-provider"; 
import { useModal } from "@/providers/modal-provider/modal-provider";
import { Modals } from "@/providers/modal-provider/modal-contxet";
import { getDefaultRelationshipName } from "@/utils/relationship";







const RelationshipController: React.FC = ({ }) => {


    const { open } = useModal();
    const { database } = useDatabase();
    const { relationships: allRelationships } = database || { relationships: [] };
    const [relationships, setRelationships] = useState<RelationshipType[]>(allRelationships);

    const nameRef: Ref<HTMLInputElement> = useRef<HTMLInputElement>(null);
    const { t } = useTranslation();
    const [selectedRelationship, setSelectedRelationship] = useState(new Set([]));
    const { focusedRelationshipId } = useDiagram();

    useEffect(() => searchRelationships(), [allRelationships]);

    useEffect(() => {
        if (focusedRelationshipId) {
            setSelectedRelationship(new Set([focusedRelationshipId]) as any);
        }

    }, [focusedRelationshipId]);

    const onOpen = useCallback(() => {
        open(Modals.CREATE_RELATIONSHIP, {
            onRlationshipCreated: (id: string) => setSelectedRelationship(new Set([id]) as any)
        })
    }, [])

    const searchRelationships = useCallback(() => {
        const keyword: string | undefined = nameRef.current?.value;
        if (keyword !== undefined) {

            setRelationships(() => {
                return allRelationships.filter((relationship: RelationshipType) => {
                    if (relationship.name)
                        return relationship.name.toLowerCase().trim().includes(keyword.toLocaleLowerCase().trim());
                    else
                        return getDefaultRelationshipName(relationship).trim().toLocaleLowerCase().includes(
                            keyword.trim().toLocaleLowerCase()
                        )
                })
            })
        }
    }, [nameRef, allRelationships]);

    const selectedRelationshipId = selectedRelationship.values().next().value; 


    const collapseAll = useCallback(() => {
        setSelectedRelationship(new Set([])) ; 
    } , [])

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
                                    onPressEnd={collapseAll}    
                                

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
                        ref={nameRef}
                        type="text"
                        size="sm"
                        radius="sm"
                        variant="faded"
                        placeholder={t("db_controller.filter")}
                        onKeyUp={searchRelationships}
                        className="h-8 w-full focus-visible:ring-0 shadow-none "
                        classNames={{
                           inputWrapper: "dark:bg-default border-divider group-hover:border-primary group-data-[focus=true]:border-primary",
                        }}

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

                    isCompact
                    selectedKeys={selectedRelationship}
                    onSelectionChange={setSelectedRelationship as any}
                >
                    {relationships.map((relationship: RelationshipType) => (
                        <AccordionItem
                            key={relationship.id}
                            aria-label={relationship.id}
                            classNames={{
                                trigger: "w-full hover:bg-default transition-all duration-200 h-12  dark:hover:bg-background",


                                base: "rounded-md p-0 overflow-hidden",
                            }}
                            subtitle={
                                <RelationshipAccordionHeader
                                    isOpen={selectedRelationshipId == relationship.id}
                                    relationship={relationship} />
                            }
                        >
                            <RelationshipAccordionBody relationship={relationship} />
                        </AccordionItem>
                    ))}
                </Accordion>
            </div>

        </div>
    )
}

export default RelationshipController


