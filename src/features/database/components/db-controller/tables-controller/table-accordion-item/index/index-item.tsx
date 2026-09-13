import { MultiSelect } from "@/components/multi-select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useDatabaseInvalidIdentifier } from "@/features/database/hooks/use-invalid-identifier";
import { DatabaseDialect } from "@/lib/database";
import { FieldType } from "@/lib/schemas/field-schema";
import { FieldIndexType } from "@/lib/schemas/field_index-schema";
import { IndexInsertType, IndexType } from "@/lib/schemas/index-schema";
import { cn } from "@/lib/utils";
import { useDatabaseOperations } from "@/providers/database-provider/database-provider";
import { areArraysEqual } from "@/utils/utils";
import { IconAlertTriangle, IconTrash } from "@tabler/icons-react";
import { Settings2 } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";





interface Props {
    index: IndexType;
    fields: FieldType[];
    dialect?: DatabaseDialect

}


const IndexItem: React.FC<Props> = ({ index, fields, dialect }) => {
    const { t } = useTranslation();
    const { editIndex, deleteIndex, editFieldIndices } = useDatabaseOperations();
    const [isUnique, setIsUnique] = useState<boolean>(index.unique as boolean);

    const [fieldIndices, setFieldIndices] = useState<string[]>([]);

    const inputRef = useRef<HTMLInputElement>(null);

    const [indexName, setIndexName] = useState<string>(index.name);
    const { identifierError, showIdentifierError, identifierMaxLength } = useDatabaseInvalidIdentifier(indexName, dialect, "index");



    useEffect(() => {
        setIndexName(index.name);
    }, [index.name]);


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
    const editIndexName = () => {

        if (identifierError == "empty") {
            setIndexName(index.name);
            return;
        }
        editIndex({
            id: index.id,
            name: indexName
        } as IndexInsertType);
    }
    const removeIndex = () => {
        deleteIndex(index.id)
    }

    const updateFieldIndices = useCallback((fieldIds: string[]) => {

        const previousFieldids: string[] = index.fieldIndices.map((fieldIndex: FieldIndexType) => fieldIndex.fieldId);
        const deletedFieldIndicesIds: string[] = index.fieldIndices.filter((fieldIndex: FieldIndexType) => !fieldIds.includes(fieldIndex.fieldId)).map((fieldIndex: FieldIndexType) => fieldIndex.id);
        const createFieldIndices: string[] = fieldIds.filter((fieldId: string) => !previousFieldids.includes(fieldId))

        setFieldIndices(fieldIds);
        if (!areArraysEqual(fieldIds, index.fieldIndices.map((fieldIndex: FieldIndexType) => fieldIndex.fieldId)))
            editFieldIndices(index.id, createFieldIndices, deletedFieldIndicesIds);

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
                            className="dark:bg-card dark:border-none size-9 text-muted-foreground hover:text-foreground relative"
                        >
                            <Settings2 className="size-4 " />
                            {
                                identifierError && <span className="size-1.5 bg-destructive rounded-md absolute bottom-1.5 right-1.5"></span>
                            }
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent side="right" className="max-w-[224px]">
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

                            <div className="flex items-center">

                                <Input
                                    id="name"
                                    aria-label={t("db_controller.index_name")}
                                    placeholder={t("db_controller.index_name")}
                                    onBlur={editIndexName}
                                    onChange={(event: any) => setIndexName(event.target.value)}
                                    ref={inputRef}
                                    aria-invalid={identifierError != null}
                                    autoFocus
                                    defaultValue={indexName}
                                    value={indexName}
                                    maxLength={identifierMaxLength}
                                    className={cn({
                                        "text-destructive pr-10": identifierError != null
                                    })}
                                />
                                 {
                                    identifierError &&
                                    <Tooltip>
                                        <TooltipTrigger asChild className="absolute">
                                            <Button variant={"ghost"} size="icon"
                                                className="size-7 shrink-0 hover:bg-destructive/10  dark:hover:bg-destructive/10  right-5.5 bg-background  rounded-sm"
                                                onClick={(event: any) => {
                                                    event.stopPropagation();
                                                    showIdentifierError();
                                                    inputRef.current?.focus();
                                                }}>
                                                <IconAlertTriangle className="size-4 text-destructive " />
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent className="bg-destructive fill-destructive [&_svg]:bg-destructive [&_svg]:fill-destructive">
                                            {t("db_controller.validation.error_message")}
                                        </TooltipContent>
                                    </Tooltip>
                                }
                            </div>
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