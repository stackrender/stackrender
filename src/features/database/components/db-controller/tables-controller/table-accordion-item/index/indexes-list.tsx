

import IndexItem from "./index-item";
import { IndexInsertType, IndexType } from "@/lib/schemas/index-schema";
import hash from "object-hash";
import React from "react";
import { FieldType } from "@/lib/schemas/field-schema";
import { useDatabaseOperations } from "@/providers/database-provider/database-provider";
import { v4 } from "uuid";
import { IconPlus } from "@tabler/icons-react";
import { TableType } from "@/lib/schemas/table-schema";
import { DatabaseDialect } from "@/lib/database";
import { useTranslation } from "react-i18next";

interface IndexesListProps {
    indices: IndexType[],
    fields: FieldType[],
    tableId: string,
    table: TableType,
    dialect?: DatabaseDialect
}



const IndexesList: React.FC<IndexesListProps> = ({ indices, fields, tableId, table, dialect }) => {

    const { createIndex } = useDatabaseOperations();

    const { t } = useTranslation();

    const addIndex = (event: any) => {

        event.stopPropagation && event.stopPropagation();
        createIndex({
            id: v4(),
            name: `${table.name}_index_${indices.length + 1}`,
            unique: false,
            tableId: tableId
        } as IndexInsertType);
    }

    return (
        <div className="w-full flex-col space-y-2 ">
            {
                indices.map((index: IndexType) => <IndexItem index={index} fields={fields} key={index.id} dialect={dialect} />)
            }
            {
                indices.length == 0 && <p className="text-muted-foreground py-1">
                    {t("db_controller.no_index")}  {  <span className="text-foreground hover:underline cursor-pointer" onClick={addIndex}>
                        {t("db_controller.create_new_index")} <IconPlus className="size-3.5 shrink-0 inline" />
                    </span>}
                </p>
            }

        </div>
    )
}





export default React.memo(IndexesList, (prevState, newState) => {
    return hash(prevState) == hash(newState);
}); 