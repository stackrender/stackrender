 
import FieldItem from "./field-item";


import { closestCenter, DndContext, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { arrayMove, SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import {  FieldType } from "@/lib/schemas/field-schema";


import React, {  useEffect, useState } from "react";
import {  useDatabaseOperations } from "@/providers/database-provider/database-provider";

import hash from "object-hash" ; 

interface Props {
    tableFields: FieldType[] ; 
    tableId : string ; 
}


const FieldList: React.FC<Props> = ({ tableFields , tableId}) => {
 
    const [fields, setFields] = useState<FieldType[]>(tableFields);
    const { orderTableFields  } = useDatabaseOperations();

    useEffect(() => {

        setFields(tableFields)
    }, [tableFields])

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
        
        </div >
    )
}


export default React.memo(FieldList , (prevState , newState) => {
    return hash(prevState) == hash(newState) ; 
}); 