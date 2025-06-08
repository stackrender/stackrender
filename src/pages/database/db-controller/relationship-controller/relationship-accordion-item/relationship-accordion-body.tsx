
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/tooltip/tooltip";
import { Cardinality, RelationshipInsertType, RelationshipType } from "@/lib/schemas/relationship-schema";
import { useDatabaseOperations } from "@/providers/database-provider/database-provider";
 
import { Button, Select, SelectItem, SharedSelection } from "@heroui/react";
import { ChevronsLeftRightEllipsis, FileMinus2, FileOutput, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";


interface RelationshipAccordionBodyProps {
    relationship: RelationshipType
}

const RelationshipAccordionBody: React.FC<RelationshipAccordionBodyProps> = ({ relationship }) => {
    const [cardinality, setCardinality] = useState(new Set([relationship.cardinality]));
    const { editRelationship, deleteRelationship } = useDatabaseOperations();

    const { t } = useTranslation();

    const changeCardinality = (keys: SharedSelection) => {

        if (keys.anchorKey != relationship.cardinality) {

            editRelationship({
                id: relationship.id,
                cardinality: keys.anchorKey as Cardinality,

            } as RelationshipInsertType);
        }

        setCardinality(keys as any);
    }

    const removeRelationship = () => {
        deleteRelationship(relationship.id);
    }

    useEffect(() => {
        setCardinality(new Set([relationship.cardinality]));
    }, [relationship.cardinality])


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
                        {t("    .target_table")}

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
                    className="w-full"
                    size="sm"
                    variant="bordered"
                    aria-label="cardinality"
                    selectedKeys={cardinality}
                    onSelectionChange={changeCardinality}
                    classNames={{
                        trigger: "border-divider group-hover:border-primary",
                    }}


                >
                    <SelectItem key={Cardinality.one_to_one}>{t("db_controller.cardinality.one_to_one")}</SelectItem>
                    <SelectItem key={Cardinality.one_to_many}>{t("db_controller.cardinality.one_to_many")}</SelectItem>
                    <SelectItem key={Cardinality.many_to_one}>{t("db_controller.cardinality.many_to_one")}</SelectItem>
                    <SelectItem key={Cardinality.many_to_many}>{t("db_controller.cardinality.many_to_many")}</SelectItem>
                </Select>
            </div>
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