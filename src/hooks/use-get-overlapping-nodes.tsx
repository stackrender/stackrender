import { TableType } from "@/lib/schemas/table-schema";
import { Node, useReactFlow } from "@xyflow/react";
import { useMemo } from "react";

const useGetOverlappingNodes = (): Set<string> => {
    const { getNodes } = useReactFlow();
    const nodes = getNodes();

    const overlappingNodes: Set<string> = useMemo(() => {
        const overlaps: Set<string> = new Set();
        for (let i = 0; i < nodes.length; i++) {
            for (let j = i + 1; j < nodes.length; j++) {

                if (isNodesOverlapping(nodes[i], nodes[j])) {

                    overlaps.add(nodes[i].id);
                    overlaps.add(nodes[j].id);
                }
            }
        }
        return overlaps
    }, [nodes]) ; 
    return overlappingNodes;
}


function isNodesOverlapping(nodeA: Node, nodeB: Node) {

    const nodeAWidth: number = nodeA.measured?.width || parseInt(nodeA.style?.width as string) || 224;
    const nodeAHeight: number = nodeA.measured?.height || (nodeA.data.table as TableType).fields.length * 32 + 36;


    const nodeBWidth: number = nodeB.measured?.width || parseInt(nodeB.style?.width as string) || 224;
    const nodeBHeight: number = nodeB.measured?.height || (nodeB.data.table as TableType).fields.length * 32 + 36;


    const a = {
        left: nodeA.position.x,
        right: nodeA.position.x + nodeAWidth,
        top: nodeA.position.y,
        bottom: nodeA.position.y + nodeAHeight,
    };

    const b = {
        left: nodeB.position.x,
        right: nodeB.position.x + nodeBWidth,
        top: nodeB.position.y,
        bottom: nodeB.position.y + nodeBHeight,
    };


    

    return !(a.right <= b.left || a.left >= b.right || a.bottom <= b.top || a.top >= b.bottom);
}



export default useGetOverlappingNodes; 