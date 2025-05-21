
import { TableType } from "@/lib/schemas/table-schema";
import { Node, useReactFlow } from "@xyflow/react";
import { useEffect } from "react";
import useGetOverlappingNodes from "./use-get-overlapping-nodes";
import hash from 'object-hash';
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
                },
                style: {
                    width: 224
                }
            } as Node
        })


        setNodes((nodes) => {

            return tableNodes.map((tableNode: Node) => {
                const node = nodes.find((node: Node) => node.id == tableNode.id);
                if (!node) {
                    return tableNode;
                }

                const hashNode: string = hash((node.data as any).table);
                const hashTableNode: string = hash((tableNode.data as any).table);
                return hashNode == hashTableNode ? node : tableNode;

            })
        })
    }, [tables])

}