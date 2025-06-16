

import { useSortable } from "@dnd-kit/sortable";
import { Button, Input, Popover, PopoverContent, PopoverTrigger, Switch, Textarea } from "@heroui/react";
import {  Ellipsis, EllipsisVertical, GripVertical, KeyRound, Settings, Settings2  } from "lucide-react";
import { useTranslation } from "react-i18next";
import { CSS } from "@dnd-kit/utilities";
import { FieldInsertType, FieldType } from "@/lib/schemas/field-schema";
import { Key, useEffect, useState } from "react";
import {  useDatabaseOperations } from "@/providers/database-provider/database-provider";
import Autocomplete from "@/components/auto-complete/auto-complete";
import ToggleButton from "@/components/toggle/toggle";
import FieldSetting from "./field-setting";
interface Props {
    field: FieldType
}



const FieldItem: React.FC<Props> = ({ field }) => {

    const [fieldName, setFieldName] = useState<string>(field.name);

    const [popOverOpen, setPopOverOpen] = useState<boolean>(false);
    const {  grouped_data_types } = useDatabaseOperations();
    const {  editField } = useDatabaseOperations();

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
        editField({
            id: field.id,
            typeId: key
        } as FieldType);
        setSelectedType(key as string | undefined);
    }

    const toggleNullable = (nullable: boolean) => {
        editField({
            id: field.id,
            nullable: nullable
        } as FieldType);
    }

    const togglePrimaryKey = (primaryKey: boolean) => {
        editField({
            id: field.id,
            isPrimary: primaryKey
        } as FieldType);
    }


    return (
        <div className="flex w-full gap-1 items-center " style={style} ref={setNodeRef} {...attributes}>

            <div {...listeners}>
                <GripVertical className="size-4 text-icon cursor-move dark:hover:text-font/90" />
            </div>
            <Input
                variant="bordered"
                size="sm"
                aria-label={t("db_controller.name")}
                placeholder={t("db_controller.name")}
                value={fieldName}
                onValueChange={setFieldName}
                onBlur={saveFieldName}
                classNames={{
                    inputWrapper: "border-divider group-hover:border-primary",
                }}
            />
            <Autocomplete
                items={grouped_data_types}
                onSelectionChange={updateFieldType}
                grouped 
                selectedItem={selectedType}
                placeholder={t("db_controller.type")}
            />

            <div className="flex gap-2 ml-2">

                <ToggleButton
                    className="px-3"
                    onToggle={toggleNullable}
                    active={field.nullable as boolean}
                    label={`${t("db_controller.nullable")}?`}
                >
                    N
                </ToggleButton>
                <ToggleButton
                    onToggle={togglePrimaryKey}
                    active={field.isPrimary as boolean}
                    label={`${t("db_controller.primary_key")}?`}
                >
                    <KeyRound className="size-4" />
                </ToggleButton>

                <Popover placement="right" radius="sm" shadow="sm"   isOpen={popOverOpen} onOpenChange={setPopOverOpen} >
                    <PopoverTrigger>
                        <Button
                            size="sm"
                            isIconOnly
                            variant="light"
                            className="text-icon hover:text-font/90"
                        >
                            <EllipsisVertical className="size-4 " />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent  >
                        <FieldSetting field={field}/>
                    </PopoverContent>
                </Popover>
            </div>


        </div>

    )
}



export default FieldItem; 