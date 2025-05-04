import { Button } from "@heroui/react";
import { Plus } from "lucide-react";
import FieldItem from "./field-item";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { closestCenter, DndContext, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { arrayMove, SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";

interface Props {

}


const FieldList: React.FC<Props> = ({ }) => {
    const { t } = useTranslation();
    const [fields, setFields] = useState<string[]>(["Field 1", "Field 2", "Field 3", "Field 4"])

    const sensors = useSensors(
        useSensor(PointerSensor)
    );

    function handleDragEnd(event: any) {
        const { active, over } = event;

        if (active.id !== over?.id) {
            setFields((items) => {
                const oldIndex = items.indexOf(active.id);
                const newIndex = items.indexOf(over.id);

                return arrayMove(items, oldIndex, newIndex);
            });
        }
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
                            fields.map((field: string) => (
                                <FieldItem id={field}/>

                            ))
                        }
                    </SortableContext>
                </div>
            </DndContext>
            <Button
                variant="flat"
                radius="sm"
                startContent={
                    <Plus className="size-4 text-icon" />
                }
                className="h-8 p-2 text-xs bg-transparent hover:bg-default text-gray font-semibold"
            //onClick={handleCreateTable}
            >
                {t("db_controller.add_field")}
            </Button>
        </div >
    )
}


export default FieldList; 