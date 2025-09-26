

import { useSortable } from "@dnd-kit/sortable";
import { Settings2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { CSS } from "@dnd-kit/utilities";
import {   FieldType } from "@/lib/schemas/field-schema";
import { Key, useEffect, useState } from "react";
import { useDatabaseOperations } from "@/providers/database-provider/database-provider";
import FieldSetting from "./field-setting";
import { DataType } from "@/lib/schemas/data-type-schema";
import { IconGripVertical, IconKey, IconKeyframe } from "@tabler/icons-react";
import { Input } from "@/components/ui/input";
import { Combobox } from "@/components/combobox";
import { Toggle } from "@/components/ui/toggle";

import { TooltipTrigger, Tooltip, TooltipContent } from "@/components/ui/tooltip";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

interface Props {
    field: FieldType
}



const FieldItem: React.FC<Props> = ({ field }) => {

    const [fieldName, setFieldName] = useState<string>(field.name);

    const { data_types } = useDatabaseOperations();
    const { editField } = useDatabaseOperations();

    const [selectedType, setSelectedType] = useState<string | undefined>(field.typeId as string | undefined);
    const { t } = useTranslation();

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
        editField({
            id: field.id,
            name: fieldName
        } as FieldType);
    }
    const updateFieldType = (key: Key | null) => {

        const dataType: DataType | undefined = data_types.find((dataTypes: DataType) => dataTypes.id == key);
        if (!dataType)
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
                <Input
                    aria-label={t("db_controller.name")}
                    placeholder={t("db_controller.name")}
                    value={fieldName}
                    onChange={(event: any) => setFieldName(event.target.value)}
                    onBlur={saveFieldName}
                    className=" flex flex-1 !bg-transparent"
                />
                <Combobox
                    items={data_types}
                    label="name"
                    placeholder={t("db_controller.type")}
                    selectedItem={selectedType}
                    onSelectionChange={updateFieldType}
                    className="flex flex-1  !bg-transparent !font-normal"
                />
            </div>
            <div className="flex gap-2 ml-2 ">
                <Tooltip>
                    <TooltipTrigger asChild>
                        <span>
                            <Toggle size={"sm"}
                                //                            className="size-9 rounded-md bg-secondary data-[state=on]:bg-background dark:data-[state=on]:bg-card data-[state=on]:border-1  text-muted-foreground data-[state=on]:text-foreground/75   "
                                className="size-9 text-muted-foreground data-[state=on]:border-1"
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
                                className="size-9 text-muted-foreground data-[state=on]:border-1"
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