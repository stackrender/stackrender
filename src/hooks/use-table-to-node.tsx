
import { TableType } from "@/lib/schemas/table-schema";
import { Node, useReactFlow } from "@xyflow/react";
import { useEffect } from "react";
import { getDefaultTableOverlapping } from "@/utils/tables";
export const useTableToNode = (tables: TableType[]): void => {
    const { setNodes } = useReactFlow();


    useEffect(() => {

        const nodes = tables.map((table: TableType) => {
            return {
                id: table.id,
                type: "table",
                position: {
                    x: table.posX,
                    y: table.posY
                },
                data: {
                    table,
                    overlapping: getDefaultTableOverlapping(table, tables),
                    pulsing: false,
                    highlightedEdges: []
                },
                style: {
                    width: 224
                }
            } as Node
        })

        setNodes(nodes);
    }, [tables])

}