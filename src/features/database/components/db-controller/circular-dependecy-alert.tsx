
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { RelationshipType } from "@/lib/schemas/relationship-schema";
import { useDatabase, useDatabaseOperations } from "@/providers/database-provider/database-provider";
import { useDiagramOps } from "@/providers/diagram-provider/diagram-provider";
import { CircularDependencyError } from "@/utils/render/render-uttils"; 
import { AlertTriangle, Trash } from "lucide-react";
import React, { useCallback, useMemo } from "react";
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
                className="size-12 text-destructive"
            />
            <h3 className="text-destructive font-semibold">
                {t("db_controller.circular_dependency.title")}
            </h3>
            <p className="text-sm text-muted-foreground text-center w-[80%] max-w-[360px]">
                {t("db_controller.circular_dependency.description")} , <span className="font-medium text-foreground"> {t("db_controller.circular_dependency.suggestion")}  </span>
            </p>

            <ul aria-label="Relationships" className="w-[80%] max-w-[360px]" 
            >
                {
                    circularRelationships.map((relationship: RelationshipType) => (
                        <li
                            onClick={() => focus(relationship.id)}
                            key={relationship.id}>
                            <div className="hover:bg-secondary flex items-center justify-between h-10 mb-2 px-3 rounded-md cursor-pointer">
                                <span className="text-sm">
                                    {relationship.sourceTable.name} -&gt;  {relationship.targetTable.name}
                                </span>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <span>
                                            <Button
                                                
                                                
                                                variant={"outline"}
                                                size="icon"
                                                onClick={() => removeRelationship(relationship.id)}
                                                className="shadow-sm  size-7"
                                            >
                                                <Trash className="text-destructive size-4" />
                                            </Button>
                                        </span>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        {t("db_controller.circular_dependency.remove_relationship")}
                                    </TooltipContent>
                                </Tooltip>
                            </div>
                        </li>
                    ))
                }
            </ul>

        </div>
    )
};


export default React.memo(CircularDependencyAlert)