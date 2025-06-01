

import { useSortable } from "@dnd-kit/sortable";
import { Button, Input, Popover, PopoverContent, PopoverTrigger, Switch, Textarea } from "@heroui/react";
import { EllipsisVertical, GripVertical, KeyRound, Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { CSS } from "@dnd-kit/utilities";
import { FieldInsertType, FieldType } from "@/lib/schemas/field-schema";
import { Key, useEffect, useState } from "react";
import { useDatabase, useDatabaseOperations } from "@/providers/database-provider/database-provider";
import Autocomplete from "@/components/auto-complete/auto-complete";
import ToggleButton from "@/components/toggle/toggle";
interface Props {
    field: FieldType
}



const FieldItem: React.FC<Props> = ({ field }) => {

    const [fieldName, setFieldName] = useState<string>(field.name);

    const [popOverOpen, setPopOverOpen] = useState<boolean>(false);
    const { data_types } = useDatabaseOperations();
    const { deleteField, editField } = useDatabaseOperations();

    const [note, setNote] = useState<string | undefined>(field.note as string | undefined);
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

    const removeField = () => {
        setPopOverOpen(false);
        deleteField(field.id)
    }

    const updateFieldNote = () => {
        editField({
            id: field.id,
            note: note,
        } as FieldInsertType)
    }
    const toggleUnqiue = (value: boolean) => {
        editField({
            id: field.id,
            unique: value
        } as FieldInsertType)
    }

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
                items={data_types}
                onSelectionChange={updateFieldType}

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

                <Popover placement="bottom" radius="sm" shadow="sm" showArrow isOpen={popOverOpen} onOpenChange={setPopOverOpen}>
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
                    <PopoverContent className="w-[210px] " >
                        <div className="w-full flex flex-col gap-2 p-2 ">
                            <h3 className="font-semibold text-sm text-font/90">
                                {t("db_controller.field_setting")}
                            </h3>
                            <hr className="border-divider" />
                            <div className="flex w-full  justify-between">
                                <span className="text-sm text-icon font-medium dark:text-font/90">
                                    {t("db_controller.unique")}
                                </span>
                                <Switch size="sm" defaultSelected={field.unique as boolean} onValueChange={toggleUnqiue}>
                                </Switch>

                            </div> 
                            <label className="text-sm font-medium text-icon dark:text-font/90">
                                {t("db_controller.note")}
                            </label>
                            <Textarea
                                variant="bordered"
                                className="w-full"
                                label={t("db_controller.field_note")}
                                value={note}
                                disableAutosize
                                disableAnimation
                                onValueChange={setNote}
                                onBlur={updateFieldNote}
                                classNames={{
                                    inputWrapper: "bg-default border-divider ",
                                    base: "max-w-xs",
                                    input: "resize-y min-h-[60px] max-h-[180px]",
                                }} />
                            <hr className="border-divider" />

                            <Button
                                className="bg-default dark:bg-danger dark:border-none dark:text-white"
                                radius="sm" 
                                variant="faded"
                                color="danger"
                                size="sm"
                                onPressEnd={removeField}>
                                <span className="font-medium text-sm ">
                                    {t("db_controller.delete_field")}
                                </span>
                                <Trash2 className="mr-1 size-3.5 text-danger dark:text-white" />
                            </Button>
                        </div>
                    </PopoverContent>
                </Popover>
            </div>


        </div>

    )
}



export default FieldItem; 