

import { useSortable } from "@dnd-kit/sortable";
import { Button,  Input, Popover, PopoverContent, PopoverTrigger, Switch, Textarea } from "@heroui/react";
import { EllipsisVertical,  GripVertical, KeyRound, Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { CSS } from "@dnd-kit/utilities";
import { FieldInsertType, FieldType } from "@/lib/schemas/field-schema";
import { Key , useState } from "react";
import { useDatabase } from "@/providers/database-provider/database-provider";
import Autocomplete from "@/components/auto-complete/auto-complete";
import ToggleButton from "@/components/toggle/toggle";
interface Props {
    field: FieldType
}



const FieldItem: React.FC<Props> = ({ field }) => {

    const [fieldName, setFieldName] = useState<string>(field.name);

    const [popOverOpen, setPopOverOpen] = useState<boolean>(false);
    const { deleteField, editField, data_types } = useDatabase();

    const [note, setNote] = useState<string | undefined>(field.note as string | undefined);
    const { t } = useTranslation();

    const { attributes, listeners, setNodeRef, transform  } = useSortable({ id: field.id });

    const style = {
        transform: CSS.Transform.toString(transform),
    };

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
                <GripVertical className="size-4 text-icon cursor-move" />
            </div>
            <Input
                variant="bordered"
                size="sm"
                aria-label={t("db_controller.name")}
                placeholder={t("db_controller.name")}
                value={fieldName}
                onValueChange={setFieldName}
                onBlur={saveFieldName}
            />
            <Autocomplete
                items={data_types}
                onSelectionChange={updateFieldType}
                defaultSelection={field.typeId as any}
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
                        >
                            <EllipsisVertical className="size-4 text-slate-500" />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[210px]" >
                        <div className="w-full flex flex-col gap-2 p-2">
                            <h3 className="font-semibold text-sm text-gray">
                                {t("db_controller.field_setting")}
                            </h3>
                            <hr className="text-default-200" />
                            <div className="flex w-full 500 justify-between">
                                <span className="text-sm text-slate-500 font-medium">
                                    {t("db_controller.unique")}
                                </span>
                                <Switch size="sm" defaultSelected={field.unique as boolean} onValueChange={toggleUnqiue}>
                                </Switch>

                            </div>
                            <label className="text-sm font-medium text-slate-500">
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
                                    inputWrapper: "bg-default/80",
                                    base: "max-w-xs",
                                    input: "resize-y min-h-[60px] max-h-[180px]",
                                }} />
                            <hr className="text-default-200" />

                            <Button
                                className="bg-default"
                                radius="sm" variant="faded"
                                color="danger"
                                size="sm"
                                onPressEnd={removeField}>
                                <span className="font-medium text-sm">
                                    {t("db_controller.delete_field")}
                                </span>
                                <Trash2 className="mr-1 size-3.5 text-danger" />
                            </Button>
                        </div>
                    </PopoverContent>
                </Popover>
            </div>


        </div>

    )
}



export default FieldItem; 