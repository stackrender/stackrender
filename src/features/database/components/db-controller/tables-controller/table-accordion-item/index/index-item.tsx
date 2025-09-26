import { MultiSelect } from "@/components/multi-select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { FieldType } from "@/lib/schemas/field-schema";
import { FieldIndexType } from "@/lib/schemas/field_index-schema";
import { IndexInsertType, IndexType } from "@/lib/schemas/index-schema";
import { useDatabaseOperations } from "@/providers/database-provider/database-provider";
import { areArraysEqual } from "@/utils/utils";
import { IconTrash } from "@tabler/icons-react";
import { Settings2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";





interface Props {
    index: IndexType;
    fields: FieldType[]
}


const IndexItem: React.FC<Props> = ({ index, fields }) => {
    const { t } = useTranslation();
    const { editIndex, deleteIndex, editFieldIndices } = useDatabaseOperations();
    const [isUnique, setIsUnique] = useState<boolean>(index.unique as boolean);

    const [fieldIndices, setFieldIndices] = useState<string[]>([]);


     

    useEffect(() => {
        setFieldIndices(
            index.fieldIndices.map((fieldIndex: FieldIndexType) => fieldIndex.fieldId)
        )
    }, [index.fieldIndices]);

    useEffect(() => {
        setIsUnique(index.unique as boolean);
    }, [index.unique])

    const toggleUnique = (unique: boolean) => {
        setIsUnique(unique);
        editIndex({
            id: index.id,
            unique
        } as IndexInsertType);
    }
    const editIndexName = (event: any) => {
        editIndex({
            id: index.id,
            name: event.target.value
        } as IndexInsertType);
    }
    const removeIndex = () => {
        deleteIndex(index.id)
    }

    const updateFieldIndices = useCallback((fieldIds: string[]) => {
        setFieldIndices(fieldIds);
        if (!areArraysEqual(fieldIds, index.fieldIndices.map((fieldIndex: FieldIndexType) => fieldIndex.fieldId)))
            editFieldIndices(index.id, fieldIds);
    }, [index.fieldIndices])

    return (
        <div className="flex gap-2 w-full items-center justify-stretch">

            <div className="flex w-full flex-1 ">
                <MultiSelect
                    options={
                        fields.map((field: FieldType) => ({ value: field.id, label: field.name })) as any
                    }
                    onValueChange={updateFieldIndices}
                    defaultValue={fieldIndices}
                    placeholder={t("db_controller.select_fields")}
                    variant={"secondary"}
                    hideSelectAll
                    className="dark:bg-background"
                />
            </div>
            <div className="shrink-0 ">
                <Popover >
                    <PopoverTrigger asChild>
                        <Button
                            size="icon"
                            variant={"ghost"}
                            className="dark:bg-card dark:border-none size-9 text-muted-foreground hover:text-foreground"
                        >
                            <Settings2 className="size-4 " />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent side="right" className="max-w-[210px]">
                        <div className="w-full flex flex-col gap-2 ">
                            <h3 className="font-medium text-sm ">
                                {t("db_controller.index_setting")}
                            </h3>

                            <Separator />

                            <div className="flex items-center justify-between ">
                                <Label htmlFor="unique">
                                    {t("db_controller.unique")}
                                </Label>
                                <Switch id="unique" onCheckedChange={toggleUnique} checked={isUnique} />
                            </div>


                            <Label htmlFor="name">
                                {t("db_controller.name")}
                            </Label>

                            <Input
                                id="name"
                                aria-label={t("db_controller.index_name")}
                                placeholder={t("db_controller.index_name")}
                                onBlur={editIndexName}
                                autoFocus
                                defaultValue={index.name}
                            />

                            <Separator />
                            <Button
                                variant="destructive"
                                size="sm"
                                onClick={removeIndex}>
                                <span >
                                    {t("db_controller.delete_index")}
                                </span>
                                <IconTrash className="size-4" />
                            </Button>
                        </div>
                    </PopoverContent>
                </Popover>
            </div>
      
        </div>
    )
}


export default IndexItem; 