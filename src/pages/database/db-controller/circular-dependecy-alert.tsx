import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/tooltip/tooltip";
import { RelationshipType } from "@/lib/schemas/relationship-schema";
import { useDatabase, useDatabaseOperations } from "@/providers/database-provider/database-provider";
import { useDiagramOps } from "@/providers/diagram-provider/diagram-provider";
import { CircularDependencyError } from "@/utils/render/render-uttils";
import { addToast, Alert, Button, Listbox, ListboxItem, toast } from "@heroui/react";
import { AlertTriangle, Trash } from "lucide-react";
import React, { useCallback, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";

interface CircularDependencyAlertProps {
    error: CircularDependencyError
}
const CircularDependencyAlert: React.FC<CircularDependencyAlertProps> = ({ error }) => {

    const { database } = useDatabase() || { relationships: [] };
    const { relationships } = database || { relationships: [] }
    const { focusOnRelationship } = useDiagramOps();
    const { deleteRelationship } = useDatabaseOperations();

    const { t } = useTranslation();

    const circularRelationships: RelationshipType[] = useMemo(() => {

        let cycle: RelationshipType[] = [];

        for (let index = 0; index < error.cycle?.length - 1; index++) {
            const sourceTableId: string = error.cycle[index];
            const targetTableId: string = error.cycle[index + 1];
            const relationship: RelationshipType | undefined = relationships.find((relationship: RelationshipType) => relationship.sourceTableId == sourceTableId && relationship.targetTableId == targetTableId)
            if (relationship)
                cycle.push(
                    relationship
                )
        }

        return cycle;

    }, [error, relationships])


    const focus = (key: any) => {
      
        focusOnRelationship(
            key, true, false
        )
    }


    const removeRelationship = useCallback((id: string) => {
        deleteRelationship(id)
    }, [])
    return (
        <div className="flex flex-col gap-2 w-full h-full items-center pt-12 ">
            <AlertTriangle
                className="size-12 text-danger"
            />
            <h3 className="text-danger font-semibold">
                {t("db_controller.circular_dependency.title")}
            </h3>
            <p className="text-sm text-font/70 text-center w-[80%] max-w-[360px]">
                {t("db_controller.circular_dependency.description")} , <span className="font-semibold text-font/90"> {t("db_controller.circular_dependency.suggestion")}  </span>
            </p>

            <Listbox aria-label="Relationships" className="w-[80%] max-w-[360px]" onAction={focus}



            >
                {
                    circularRelationships.map((relationship: RelationshipType) => (
                        <ListboxItem
                            variant={"faded"}
                            className="data-[hover=true]:bg-default-500"
                            key={relationship.id}>
                            <div className="flex items-center justify-between tex-font/90">
                                <span>
                                    {relationship.sourceTable.name} -&gt;  {relationship.targetTable.name}
                                </span>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <span>
                                            <Button
                                                isIconOnly
                                                variant="light"
                                                color={"danger"}
                                                size="sm"
                                                onPress={() => removeRelationship(relationship.id)}
                                            >
                                                <Trash className="text-danger size-4" />
                                            </Button>
                                        </span>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        {t("db_controller.circular_dependency.remove_relationship")}
                                    </TooltipContent>
                                </Tooltip>
                            </div>
                        </ListboxItem>
                    ))
                }
            </Listbox>

        </div>
    )
};


export default React.memo(CircularDependencyAlert)