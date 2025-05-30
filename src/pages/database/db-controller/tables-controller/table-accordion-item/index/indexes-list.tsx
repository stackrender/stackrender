import { Button, } from "@heroui/react";
import IndexItem from "./index-item";
import { Plus } from "lucide-react";
import { useTranslation } from "react-i18next";
import { IndexInsertType, IndexType } from "@/lib/schemas/index-schema";
import hash from "object-hash";
import React from "react";
import { FieldType } from "@/lib/schemas/field-schema";
import { useDatabaseOperations } from "@/providers/database-provider/database-provider";
import { v4 } from "uuid";

interface IndexesListProps {
    indices: IndexType[],
    fields: FieldType[],
    tableId: string

}



const IndexesList: React.FC<IndexesListProps> = ({ indices, fields, tableId }) => {
 
    const { t } = useTranslation();
    const { createIndex } = useDatabaseOperations();

    const addIndex = (event: any) => {
        event.stopPropagation && event.stopPropagation();
        createIndex({
            id: v4(),
            name: `index_${indices.length + 1}`,
            unique: true,
            tableId: tableId
        } as IndexInsertType);
    }
    return (
        <div className="w-full flex-col space-y-2">
            {
                indices.map((index: IndexType) => <IndexItem index={index} fields={fields} />)
            }

            <Button
                variant="flat"
                radius="sm"
                startContent={
                    <Plus className="size-4 text-font/90" />
                }
                className="h-8 p-2 text-xs bg-transparent hover:bg-default text-font/90 font-semibold"
                onPressEnd={addIndex}
            >
                {t("db_controller.add_index")}
            </Button>

        </div>
    )
}





export default React.memo(IndexesList, (prevState, newState) => {
    return hash(prevState) == hash(newState);
}); 