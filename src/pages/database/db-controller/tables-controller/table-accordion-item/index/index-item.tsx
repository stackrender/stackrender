import ToggleButton from "@/components/toggle/toggle";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/tooltip/tooltip";
import { FieldType } from "@/lib/schemas/field-schema";
import { FieldIndexType } from "@/lib/schemas/field_index-schema";
import { IndexInsertType, IndexType } from "@/lib/schemas/index-schema";
import { useDatabaseOperations } from "@/providers/database-provider/database-provider";
import { areArraysEqual } from "@/utils/utils";
import { Button, Input, Popover, PopoverContent, PopoverTrigger, Select, SelectItem, SharedSelection } from "@heroui/react";
import { EllipsisVertical, Trash2 } from "lucide-react";
import { Key, useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";





interface Props {
    index: IndexType;
    fields: FieldType[]
}


const IndexItem: React.FC<Props> = ({ index, fields }) => {
    const { t } = useTranslation();
    const { editIndex, deleteIndex, editFieldIndices } = useDatabaseOperations();
    const [popOverOpen, setPopOverOpen] = useState<boolean>(false);
    const [fieldIndices, setFieldIndices] = useState<Set<string>>(new Set());

    useEffect(() => {

        setFieldIndices(
            new Set(index.fieldIndices.map((fieldIndex: FieldIndexType) => fieldIndex.fieldId))
        )
    }, [index.fieldIndices])

    const toggleUnique = (unique: boolean) => {

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


    const onInexFieldChange = (keys: SharedSelection | Set<string>) => {
        setFieldIndices(keys as Set<string>)
    }


    const openChange = useCallback((isOpen: boolean) => {
        if (isOpen == false) {
            if (!areArraysEqual(Array.from(fieldIndices), index.fieldIndices.map((fieldIndex: FieldIndexType) => fieldIndex.fieldId)))
                editFieldIndices(index.id, Array.from(fieldIndices));
        }
    }, [fieldIndices])
    return (
        <div className="flex gap-2 w-full">
            <Select
                className="w-full"
                placeholder={t("db_controller.select_fields")}
                selectionMode="multiple"
                size="sm"
                aria-label={t("db_controller.select_fields")}
                variant="bordered"
                classNames={{
                    trigger: "border-divider group-hover:border-primary",
                }}

                onSelectionChange={onInexFieldChange}
                onOpenChange={openChange}
                selectedKeys={fieldIndices}
            >
                {fields.map((field: FieldType) => (
                    <SelectItem aria-label={field.name} key={field.id}>{field.name}</SelectItem>
                ))}
            </Select>
            <div className="flex gap-2 ml-2">

                <ToggleButton
                    className="px-3"
                    onToggle={toggleUnique}
                    active={index.unique as boolean}
                    label={`${t("db_controller.unique")}?`}
                >
                    U
                </ToggleButton>
                <Popover placement="bottom" radius="sm" shadow="sm" showArrow isOpen={popOverOpen} onOpenChange={setPopOverOpen}>
                    <PopoverTrigger>
                        <Button
                            size="sm"
                            isIconOnly
                            variant="light"
                            className="text-icon hover:text-font/90"
                        >
                            <EllipsisVertical className="size-4" />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[210px]" >
                        <div className="w-full flex flex-col gap-2 p-2">
                            <h3 className="font-semibold text-sm text-font/90">
                                {t("db_controller.index_setting")}
                            </h3>
                            <hr className="border-divider dark:border-font/10" />

                            <label className="text-sm font-medium text-icon dark:text-font/90">
                                {t("db_controller.name")}
                            </label>
                            <Input
                                variant="bordered"
                                aria-label={t("db_controller.index_name")}
                                placeholder={t("db_controller.index_name")}
                                onBlur={editIndexName}
                                size="sm"
                                classNames={{
                                    inputWrapper: "border-divider group-hover:border-primary dark:border-font/10",
                                }}
                                defaultValue={index.name}
                            />


                            <hr className="border-divider dark:border-font/10" />

                            <Button
                                className="bg-default dark:bg-danger dark:border-none dark:text-white"
                                radius="sm" variant="faded"
                                color="danger"
                                size="sm"
                                onPressEnd={removeIndex}>
                                <span className="font-medium text-sm">
                                    {t("db_controller.delete_index")}
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


export default IndexItem; 