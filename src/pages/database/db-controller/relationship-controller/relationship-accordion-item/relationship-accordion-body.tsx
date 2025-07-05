
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/tooltip/tooltip";
import { ForeignKeyActions } from "@/lib/field";
import { Cardinality, RelationshipInsertType, RelationshipType } from "@/lib/schemas/relationship-schema";
import { useDatabaseOperations } from "@/providers/database-provider/database-provider";

import { Button, Select, SelectItem, SharedSelection } from "@heroui/react";
import { ChevronsLeftRightEllipsis, FileCog, FileKey, FileMinus2, FileOutput, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";


interface RelationshipAccordionBodyProps {
    relationship: RelationshipType
}

const RelationshipAccordionBody: React.FC<RelationshipAccordionBodyProps> = ({ relationship }) => {

    const [cardinality, setCardinality] = useState(new Set([relationship.cardinality]));
    const [onDeleteAction, setOnDeleteAction] = useState<Set<ForeignKeyActions>>(new Set([]));
    const [onUpdateAction, setOnUpdateAction] = useState<Set<ForeignKeyActions>>(new Set([]));

    const { editRelationship, deleteRelationship } = useDatabaseOperations();
    const { t } = useTranslation();

    const changeCardinality = (keys: SharedSelection) => {
        if (keys.anchorKey && (keys.anchorKey != relationship.cardinality)) {
            editRelationship({
                id: relationship.id,
                cardinality: keys.anchorKey as Cardinality,
            } as RelationshipInsertType);
            setCardinality(keys as any);
        }
    }

    const changeOnDelete = (keys: SharedSelection) => {
        if (keys.anchorKey && (keys.anchorKey != relationship.onDelete)) {
            editRelationship({
                id: relationship.id,
                onDelete: keys.anchorKey as ForeignKeyActions,
            } as RelationshipInsertType);
            setOnDeleteAction(keys as any);
        }
    }

    const changeOnUpdate = (keys: SharedSelection) => {
        if (keys.anchorKey && (keys.anchorKey != relationship.onUpdate)) {
            editRelationship({
                id: relationship.id,
                onUpdate: keys.anchorKey as ForeignKeyActions,
            } as RelationshipInsertType);
            setOnUpdateAction(keys as any);
        }
    }

    const removeRelationship = () => {
        deleteRelationship(relationship.id);
    } 
    
    useEffect(() => {
        setCardinality(new Set([relationship.cardinality]));
    }, [relationship.cardinality])

    useEffect(() => {
        if (!relationship.onDelete)
            setOnDeleteAction(new Set([ForeignKeyActions.NO_ACTION]))
        else
            setOnDeleteAction(new Set([relationship.onDelete as ForeignKeyActions]))
    }, [relationship.onDelete]);

    useEffect(() => {
        if (!relationship.onUpdate)
            setOnUpdateAction(new Set([ForeignKeyActions.NO_ACTION]))
        else
            setOnUpdateAction(new Set([relationship.onUpdate as ForeignKeyActions]))
    }, [relationship.onUpdate]);

    if (!relationship.sourceTable || !relationship.targetTable)
        return;

    return (
        <div className="w-full p-2 space-y-4">
            <div className="flex">
                <div className="w-full space-y-1">
                    <label className="font-medium flex text-font/90 flex items-center gap-1 text-sm ">
                        <FileOutput className="size-4 " />
                        {t("db_controller.source_table")}
                    </label>
                    <Tooltip>
                        <TooltipTrigger>
                            <span className="truncate text-left text-sm  text-font/70">
                                {relationship.sourceTable?.name}({relationship.sourceField?.name})
                            </span>
                        </TooltipTrigger>
                        <TooltipContent>
                            {relationship.sourceTable?.name}({relationship.sourceField?.name})
                        </TooltipContent>
                    </Tooltip>
                </div>

                <div className="w-full space-y-1">
                    <label className="font-medium flex text-font/90 flex items-center gap-1 text-sm ">
                        <FileMinus2 className="size-4" />
                        {t("db_controller.referenced_table")}
                    </label>

                    <Tooltip>
                        <TooltipTrigger>
                            <span className="truncate text-left text-sm text-font/70 ">
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
                <label className="flex text-sm font-medium flex text-font/90 items-center gap-1 ">
                    <ChevronsLeftRightEllipsis className="size-4 " />
                    {t('db_controller.cardinality.name')}
                </label>
                <Select
                    size="sm"
                    variant="bordered"
                    aria-label="cardinality"
                    selectedKeys={cardinality}
                    onSelectionChange={changeCardinality}
                    className="h-8 w-full focus-visible:ring-0 shadow-none "
                    classNames={{
                        trigger: "border-divider group-hover:border-primary data-[focus=true]:border-primary data-[open=true]:border-primary",
                        selectorIcon: "text-icon",
                        popoverContent: "rounded-md "

                    }}
                >
                    <SelectItem key={Cardinality.one_to_one}>{t("db_controller.cardinality.one_to_one")}</SelectItem>
                    <SelectItem key={Cardinality.one_to_many}>{t("db_controller.cardinality.one_to_many")}</SelectItem>
                    <SelectItem key={Cardinality.many_to_one}>{t("db_controller.cardinality.many_to_one")}</SelectItem>
                    <SelectItem key={Cardinality.many_to_many}>{t("db_controller.cardinality.many_to_many")}</SelectItem>
                </Select>
            </div>
            {
                cardinality.values().next().value != Cardinality.many_to_many &&
                <div className="space-y-2">
                    <label className="flex text-sm font-medium flex text-font/90 items-center gap-1 ">
                        <FileCog className="size-4 " />
                        {t('db_controller.foreign_key_actions.title')}
                    </label>
                    <div className="flex gap-2">
                        <div className="w-full space-y-2">
                            <span className="truncate text-left text-sm  text-font/70">
                                {t('db_controller.foreign_key_actions.on_delete')}
                            </span>
                            <Select
                                size="sm"
                                variant="bordered"
                                aria-label="Oon Delete actions"
                                selectedKeys={onDeleteAction}
                                onSelectionChange={changeOnDelete}
                                className="h-8 w-full focus-visible:ring-0 shadow-none "
                                classNames={{
                                    trigger: "border-divider group-hover:border-primary data-[focus=true]:border-primary data-[open=true]:border-primary",
                                    selectorIcon: "text-icon",
                                    popoverContent: "rounded-md "
                                }}
                            >
                                {
                                    Object.values(ForeignKeyActions).map((value: string) => (
                                        <SelectItem key={value}>{t(`db_controller.foreign_key_actions.actions.${value}`)}</SelectItem>
                                    ))
                                }
                            </Select>
                        </div>
                        <div className="w-full space-y-2">
                            <div className="w-full space-y-2">
                                <span className="truncate text-left text-sm  text-font/70">
                                    {t('db_controller.foreign_key_actions.on_update')}
                                </span>
                                <Select
                                    size="sm"
                                    variant="bordered"
                                    aria-label="Oon Update actions"
                                    selectedKeys={onUpdateAction}
                                    onSelectionChange={changeOnUpdate}
                                    className="h-8 w-full focus-visible:ring-0 shadow-none "
                                    classNames={{
                                        trigger: "border-divider group-hover:border-primary data-[focus=true]:border-primary data-[open=true]:border-primary",
                                        selectorIcon: "text-icon",
                                        popoverContent: "rounded-md "
                                    }}
                                >
                                    {
                                        Object.values(ForeignKeyActions).map((value: string) => (
                                            <SelectItem key={value}>{t(`db_controller.foreign_key_actions.actions.${value}`)}</SelectItem>
                                        ))
                                    }
                                </Select>
                            </div>
                        </div>
                    </div>
                </div>
            }
            <div className="flex justify-center">
                <Button
                    variant="solid"
                    className="bg-transparent text-xs"
                    radius="sm"
                    size="sm"
                    onPressEnd={removeRelationship}
                >
                    <Trash2 className="mr-1 size-3.5 text-danger" />
                    <div className="text-danger font-semibold">
                        {t("db_controller.delete")}
                    </div>
                </Button>
            </div>
        </div>
    )
}


export default RelationshipAccordionBody; 