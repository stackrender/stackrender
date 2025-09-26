import { TableType } from "@/lib/schemas/table-schema";
import {
    AccordionContent,
    AccordionItem,
} from "@/components/ui/accordion";
import TableAccordionTrigger from "./table-accordion-trigger";
import TableAccordionContent from "./table-accordion-content";
import React, { forwardRef } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface TableAccordionItemProps {
    table: TableType;
}

const TableAccordionItem = forwardRef<HTMLDivElement, TableAccordionItemProps>(
    ({ table }, ref) => {
        const { attributes, setNodeRef, transform, transition } = useSortable({ id: table.id });

        if (transform?.scaleY)
            transform.scaleY = 1

        const style = {
            transform: CSS.Transform.toString(transform),
            transition,
        };

 

        return (
            <AccordionItem value={table.id} className="my-2 border-none" id={table.id} ref={ref}>
                <div
                    ref={setNodeRef}
                    style={style}
                    {...attributes}
                    className="w-full border-b "
                >
                    <TableAccordionTrigger table={table} />
                    <AccordionContent className="flex flex-col gap-4 text-balance">
                        <TableAccordionContent table={table} />
                    </AccordionContent>
                </div>
            </AccordionItem>
        );
    }
);

TableAccordionItem.displayName = "TableAccordionItem";

export default React.memo(TableAccordionItem);