

import { useSortable } from "@dnd-kit/sortable";
import { Settings2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { CSS } from "@dnd-kit/utilities";
import { FieldType } from "@/lib/schemas/field-schema";
import { Key, useEffect, useRef, useState } from "react";
import { useDatabaseOperations } from "@/providers/database-provider/database-provider";
import FieldSetting from "./field-setting";
import { DataType } from "@/lib/schemas/data-type-schema";
import { IconAlertTriangle, IconGripVertical, IconKey, IconKeyframe } from "@tabler/icons-react";
import { Input } from "@/components/ui/input";
import { Combobox } from "@/components/combobox";
import { Toggle } from "@/components/ui/toggle";

import { TooltipTrigger, Tooltip, TooltipContent } from "@/components/ui/tooltip";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { DatabaseDialect } from "@/lib/database";
import { useDatabaseInvalidIdentifier } from "@/features/database/hooks/use-invalid-identifier";
import { cn } from "@/lib/utils";

interface Props {
    field: FieldType;
    dialect?: DatabaseDialect

}



const FieldItem: React.FC<Props> = ({ field, dialect }) => {

    const [fieldName, setFieldName] = useState<string>(field.name);

    const { data_types } = useDatabaseOperations();
    const { editField } = useDatabaseOperations();

    const [selectedType, setSelectedType] = useState<string | undefined>(field.typeId as string | undefined);
    const { t } = useTranslation();

    const { identifierError, showIdentifierError, identifierMaxLength } = useDatabaseInvalidIdentifier(fieldName, dialect, "column");
    const inputRef = useRef<HTMLInputElement>(null);

    const { attributes, listeners, setNodeRef, transform } = useSortable({ id: field.id });

    const style = {
        transform: CSS.Transform.toString(transform),
    };

    useEffect(() => {
        setFieldName(field.name);
    }, [field.name]);

    useEffect(() => {
        setSelectedType(field.typeId as string | undefined);
    }, [field.typeId])




    const saveFieldName = () => {

        if (identifierError == "empty") {
            setFieldName(field.name);
            return;
        }
        editField({
            id: field.id,
            name: fieldName.trim()
        } as FieldType);
    }
    const updateFieldType = (key: Key | null) => {

        const dataType: DataType | undefined = data_types.find((dataTypes: DataType) => dataTypes.id == key);
        if (!dataType)
            return;

        if (dataType.id == field.typeId)
            return;
        if (key != null) {
            editField({
                id: field.id,
                typeId: key
            } as FieldType);
            setSelectedType(key as string | undefined);

        }
    }

    const toggleNullable = (nullable: boolean) => {
        editField({
            id: field.id,
            nullable: !nullable
        } as FieldType);
    }

    const togglePrimaryKey = (primaryKey: boolean) => {
        editField({
            id: field.id,
            isPrimary: primaryKey
        } as FieldType);
    }

    return (
        <div className="flex w-full gap-1 items-center  " style={style} ref={setNodeRef} {...attributes}>
            <div {...listeners}>
                <IconGripVertical className="size-4 text-muted-foreground hover:text-foreground cursor-move shrink-0" />
            </div>
            <div className="flex gap-2 w-full">
                <div className="flex flex-1  relative items-center min-w-0  ">

                    <Input
                        aria-label={t("db_controller.name")}
                        placeholder={t("db_controller.name")}
                        value={fieldName}
                        onChange={(event: any) => setFieldName(event.target.value)}
                        onBlur={saveFieldName}
                        maxLength={identifierMaxLength}
                        aria-invalid={identifierError != null}
                        ref={inputRef}
                        onKeyDown={(e: any) => {
                            if (e.key === "Enter") {
                                e.preventDefault();
                                saveFieldName();
                                e.target.blur();
                            }
                        }}
                        className={cn("flex flex-1 !bg-transparent !opacity-100", {
                            "text-destructive pr-10": identifierError != null
                        })}
                    />
                    {
                        identifierError &&
                        <Tooltip >
                            <TooltipTrigger asChild className="absolute">
                                <Button variant={"ghost"} size="icon"
                                    className="size-7 shrink-0 hover:bg-destructive/10  dark:hover:bg-destructive/10  right-1 bg-background  rounded-sm"
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
                <Combobox
                    items={data_types}
                    label="name"
                    placeholder={t("db_controller.type")}
                    selectedItem={selectedType}

                    onSelectionChange={updateFieldType}
                    className={cn("flex flex-1  !bg-transparent !font-normal  !opacity-100 min-w-0 w-full ", {
                        "text-destructive border-destructive hover:text-destructive": !selectedType
                    })}
                    valueLength={20}
                />
            </div>
            <div className="flex gap-2 ml-2 ">
                <Tooltip>
                    <TooltipTrigger asChild>
                        <span>
                            <Toggle size={"sm"}

                                className="size-9 text-muted-foreground "
                                pressed={!field.nullable as boolean}
                                onPressedChange={toggleNullable}
                            >
                                <IconKeyframe className="size-4" />
                            </Toggle>
                        </span>
                    </TooltipTrigger>
                    <TooltipContent>
                        {t("db_controller.required")} {field.nullable ? "?" : ""}
                    </TooltipContent>
                </Tooltip>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <span>
                            <Toggle size={"sm"}
                                className="size-9 text-muted-foreground "
                                pressed={field.isPrimary as boolean}
                                onPressedChange={togglePrimaryKey}
                            >
                                <IconKey className="size-4" />
                            </Toggle>
                        </span>
                    </TooltipTrigger>
                    <TooltipContent>
                        {t("db_controller.primary_key")} {!field.isPrimary ? "?" : ""}
                    </TooltipContent>
                </Tooltip>

                <Popover >
                    <PopoverTrigger asChild>
                        <Button
                            size="icon"
                            variant={"ghost"}
                            className="size-9 dark:bg-card dark:border-none text-muted-foreground hover:text-foreground"
                        >
                            <Settings2 className="size-4 " />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent side="right">
                        <FieldSetting field={field} />
                    </PopoverContent>
                </Popover>
            </div>
        </div>
    )
}



export default FieldItem; 