

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { ForeignKeyActions } from "@/lib/field";
import { Cardinality, RelationshipInsertType, RelationshipType } from "@/lib/schemas/relationship-schema";
import { useDatabaseOperations } from "@/providers/database-provider/database-provider";
 
import { Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";


interface RelationshipAccordionContentProps {
    relationship: RelationshipType
}

const RelationshipAccordionContent: React.FC<RelationshipAccordionContentProps> = ({ relationship }) => {

    const [cardinality, setCardinality] = useState<string>(relationship.cardinality);
    const [onDeleteAction, setOnDeleteAction] = useState<string>(relationship.onDelete || ForeignKeyActions.NO_ACTION);
    const [onUpdateAction, setOnUpdateAction] = useState<string>(relationship.onUpdate || ForeignKeyActions.NO_ACTION);

    const { editRelationship, deleteRelationship } = useDatabaseOperations();
    const { t } = useTranslation();

    const changeCardinality = (selection: string) => {
        setCardinality(selection);
        editRelationship({
            id: relationship.id,
            cardinality: selection as Cardinality,
        } as RelationshipInsertType);
    }

    const changeOnDelete = (selection: string) => {

        editRelationship({
            id: relationship.id,
            onDelete: selection as ForeignKeyActions,
        } as RelationshipInsertType);
        setOnDeleteAction(selection);
    }

    const changeOnUpdate = (selection: string) => {

        editRelationship({
            id: relationship.id,
            onUpdate: selection as ForeignKeyActions,
        } as RelationshipInsertType);
        setOnUpdateAction(selection);
    }

    const removeRelationship = () => {
        deleteRelationship(relationship.id);
    }

    useEffect(() => {
        setCardinality(relationship.cardinality);
    }, [relationship.cardinality])

    useEffect(() => {
        if (!relationship.onDelete)
            setOnDeleteAction(ForeignKeyActions.NO_ACTION)
        else
            setOnDeleteAction(relationship.onDelete as ForeignKeyActions)
    }, [relationship.onDelete]);

    useEffect(() => {
        if (!relationship.onUpdate)
            setOnUpdateAction(ForeignKeyActions.NO_ACTION)
        else
            setOnUpdateAction(relationship.onUpdate as ForeignKeyActions)
    }, [relationship.onUpdate]);

    if (!relationship.sourceTable || !relationship.targetTable)
        return;

    return (
        <div className="w-full p-2 space-y-4">
            <div className="flex">
                <div className="w-full space-y-1">
                    <Label >
                        {t("db_controller.source_table")}
                    </Label>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <span className="truncate text-sm text-muted-foreground">
                                {relationship.sourceTable?.name}({relationship.sourceField?.name})
                            </span>
                        </TooltipTrigger>
                        <TooltipContent>
                            {relationship.sourceTable?.name}({relationship.sourceField?.name})
                        </TooltipContent>
                    </Tooltip>
                </div>

                <div className="w-full space-y-1">
                    <Label >
                        {t("db_controller.referenced_table")}
                    </Label>

                    <Tooltip>
                        <TooltipTrigger asChild>
                            <span className="truncate text-sm text-muted-foreground">
                                {relationship.targetTable?.name}({relationship.targetField?.name})
                            </span>
                        </TooltipTrigger>
                        <TooltipContent>
                            {relationship.targetTable?.name}({relationship.targetField?.name})
                        </TooltipContent>
                    </Tooltip>
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="cardinality">
                    {t('db_controller.cardinality.name')}
                </Label>
                <Select
                    aria-label="cardinality"
                    value={cardinality as any}
                    onValueChange={changeCardinality as any}
                >
                    <SelectTrigger id="cardinality" className="w-full flex ">
                        <SelectValue placeholder={t('db_controller.cardinality.name')} />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value={Cardinality.one_to_one}>{t("db_controller.cardinality.one_to_one")}</SelectItem>
                        <SelectItem value={Cardinality.one_to_many}>{t("db_controller.cardinality.one_to_many")}</SelectItem>
                        <SelectItem value={Cardinality.many_to_one}>{t("db_controller.cardinality.many_to_one")}</SelectItem>
                        <SelectItem value={Cardinality.many_to_many}>{t("db_controller.cardinality.many_to_many")}</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            {
                cardinality != Cardinality.many_to_many &&
                <div className="space-y-4">
                    <Label>
                        {t('db_controller.foreign_key_actions.title')}
                    </Label>
                    <div className="flex gap-2">
                        <div className="w-full space-y-2">
                            <Label >
                                {t('db_controller.foreign_key_actions.on_delete')}
                            </Label>
                            <Select
                                aria-label="On delete actions"
                                value={onDeleteAction as any}
                                onValueChange={changeOnDelete as any}
                            >
                                <SelectTrigger className="w-full flex ">
                                    <SelectValue placeholder={t('db_controller.foreign_key_actions.on_delete')} />
                                </SelectTrigger>
                                <SelectContent>
                                    {
                                        Object.values(ForeignKeyActions).map((value: string) => (
                                            <SelectItem
                                            key={value}
                                            value={value}>{t(`db_controller.foreign_key_actions.actions.${value}`)}</SelectItem>
                                        ))
                                    }
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="w-full space-y-2">
                            <div className="w-full space-y-2">
                                <Label >
                                    {t('db_controller.foreign_key_actions.on_update')}
                                </Label>
                                <Select
                                    aria-label="On update actions"
                                    value={onUpdateAction}
                                    onValueChange={changeOnUpdate}
                                >
                                    <SelectTrigger className="w-full flex ">
                                        <SelectValue placeholder={t('db_controller.foreign_key_actions.on_update')} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {
                                            Object.values(ForeignKeyActions).map((value: string) => (
                                                <SelectItem 
                                                key={value}
                                                value={value}>{t(`db_controller.foreign_key_actions.actions.${value}`)}</SelectItem>
                                            ))
                                        }
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>
                </div>
            }
             <div className="flex justify-center">
                <Button
                    variant="destructive"
                    className="w-full"                    
                    onClick={removeRelationship}
                >
                    <Trash2 className="mr-1 size-3.5 text-danger" />
                        {t("db_controller.delete")}
                </Button>
            </div>
        </div>
    )
}


export default RelationshipAccordionContent; 