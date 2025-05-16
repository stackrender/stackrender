import { Button } from "@heroui/react";
import { Plus } from "lucide-react";
import FieldItem from "./field-item";
import { useTranslation } from "react-i18next";

import { closestCenter, DndContext, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { arrayMove, SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { FieldType } from "@/lib/schemas/field-schema";
import { TableType } from "@/lib/schemas/table-schema";
import { useCallback, useEffect, useState } from "react";
import { useDatabase } from "@/providers/database-provider/database-provider";
import { v4 } from "uuid";
import { getNextSequence } from "@/utils/field";


interface Props {
    table: TableType
}


const FieldList: React.FC<Props> = ({ table }) => {

    const { t } = useTranslation();
    const [fields, setFields] = useState<FieldType[]>(table.fields);
    const { createField, orderTableFields } = useDatabase();

    useEffect(() => {
        setFields(table.fields)
    }, [table.fields])

    const sensors = useSensors(
        useSensor(PointerSensor)
    );

    function handleDragEnd(event: any) {
        const { active, over } = event;

        if (active.id !== over?.id) {

            setFields((items) => {
                
                const oldIndex = items.findIndex((item: FieldType) => item.id == active.id);
                const newIndex = items.findIndex((item: FieldType) => item.id == over.id);

                const fields = arrayMove(items, oldIndex, newIndex); 
                orderTableFields(fields)
                return fields;

            });
        }
    }

    const addField = () => {
        createField({
            id: v4(),
            name: `field_${table.fields.length + 1}`,
            tableId: table.id,
            sequence: getNextSequence(fields) , 
            nullable: true,
        })
    }


    return (
        <div className="w-full space-y-2 no-select">
            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
            >
                <div className="space-y-2">
                    <SortableContext
                        items={fields}
                        strategy={verticalListSortingStrategy}
                    >
                        {
                            fields.map((field: FieldType) => (
                                <FieldItem field={field} key={field.id} />

                            ))
                        }
                    </SortableContext>
                </div>
            </DndContext>
            <Button
                variant="flat"
                radius="sm"

                startContent={
                    <Plus className="size-4 text-icon dark:text-white" />
                }
                className="h-8 p-2 text-xs bg-transparent hover:bg-default text-gray font-semibold"
                onPressEnd={addField}
            >
                {t("db_controller.add_field")}
            </Button>
        </div >
    )
}


export default FieldList; 