
import { TableType } from "@/lib/schemas/table-schema";
import { Node, useReactFlow } from "@xyflow/react";
import { useEffect } from "react";
import { getDefaultTableOverlapping } from "@/utils/tables";
import hash from "object-hash";
import { useDatabase } from "@/providers/database-provider/database-provider";


export const useTableToNode = (tables: TableType[]): void => {
    const { setNodes } = useReactFlow();


    useEffect(() => {

        const tableNodes = tables.map((table: TableType) => {
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
        

        setNodes((nodes) => {
            return tableNodes.map((tableNode) => {
                const node: Node | undefined = nodes.find((node: Node) => node.id == tableNode.id);
                if (!node)
                    return tableNode;
                else {
                    const hashNode: string = hash(node.data.table as TableType);
                    const hashTableNode: string = hash(tableNode.data.table as TableType);
                    return hashNode == hashTableNode ? node : tableNode;
                }
            })
        });
    }, [tables])

}