import { Ref, useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { RelationshipType } from "@/lib/schemas/relationship-schema";
import { useDatabase } from "@/providers/database-provider/database-provider";
import { useDiagram } from "@/providers/diagram-provider/diagram-provider";
import { useModal } from "@/providers/modal-provider/modal-provider";
import { Modals } from "@/providers/modal-provider/modal-contxet";
import { getDefaultRelationshipName } from "@/utils/relationship";
import EmptyList from "@/components/empty-list";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { IconFilter2Up, IconPlus } from "@tabler/icons-react";
import { Accordion } from "@/components/ui/accordion";
import RelationshipAccordionItem from "./relationship-accordion-item/relationship-accordion-item";
import { ScrollArea } from "@/components/ui/scroll-area";

const RelationshipController: React.FC = ({ }) => {


    const { open } = useModal();
    const { database } = useDatabase();
    const { relationships: allRelationships } = database || { relationships: [] };
    const [relationships, setRelationships] = useState<RelationshipType[]>(allRelationships);

    const nameRef: Ref<HTMLInputElement> = useRef<HTMLInputElement>(null);
    const { t } = useTranslation();
    const [selectedRelationship, setSelectedRelationship] = useState<string | undefined>();
    const { focusedRelationshipId } = useDiagram();

    useEffect(() => searchRelationships(), [allRelationships]);

    useEffect(() => {
        if (focusedRelationshipId) {
            setSelectedRelationship(focusedRelationshipId);
            const accordionItem = document.getElementById(focusedRelationshipId)
            if (accordionItem)
                accordionItem?.scrollIntoView({
                    behavior: 'smooth', block: 'center'
                })
        }
    }, [focusedRelationshipId]);

    const onOpen = useCallback(() => {
        open(Modals.CREATE_RELATIONSHIP, {
            onRlationshipCreated: (id: string) => setSelectedRelationship(id)
        })
    }, []);


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

    const collapseAll = useCallback(() => {
        setSelectedRelationship("");
    }, []);

    return (
        <div className="w-full h-full flex flex-col pl-3 min-h-0">

            <div className="flex  items-center pb-2 gap-2 pt-3 pr-3 ">
                <Tooltip >
                    <TooltipTrigger asChild>
                        <Button
                            variant={"ghost"}
                            size={"icon"}
                            className="rounded-md h-8 w-8"
                            onClick={collapseAll}
                        >
                            <IconFilter2Up className="size-4" />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                        {t("db_controller.collapse")}

                    </TooltipContent>
                </Tooltip>
                <Input
                    className="h-8 bg-secondary dark:bg-background"
                    placeholder={t("db_controller.filter")}
                    ref={nameRef}
                    type="text"
                    onKeyUp={searchRelationships}
                />
                <Tooltip >
                    <TooltipTrigger asChild>
                        <Button
                            variant={"default"}
                            size={"icon"}
                            className="rounded-md h-8 w-8"
                            onClick={onOpen}
                        >
                            <IconPlus className="size-4 " />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                        {t("db_controller.add_relationship")}
                    </TooltipContent>
                </Tooltip>

            </div>

            {
                allRelationships.length > 0 &&
                <ScrollArea className=" flex-1 overflow-auto pr-3">
                    <Accordion
                        type="single"
                        collapsible
                        className="w-full "
                        value={selectedRelationship}
                        onValueChange={setSelectedRelationship}
                    >
                        {relationships.map((relationship: RelationshipType) => (
                            <RelationshipAccordionItem relationship={relationship} key={relationship.id} />
                        ))}
                    </Accordion>
                </ScrollArea>
            }

            {
                (allRelationships.length == 0) &&
                <div className="pr-2 h-full">
                    <EmptyList
                        title={t("db_controller.empty_list.no_relationships")}
                        description={t("db_controller.empty_list.no_relationships_description")}
                    />
                </div>
            }
        </div>
    )
}

export default RelationshipController


