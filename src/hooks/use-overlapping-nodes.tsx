import { TableType } from "@/lib/schemas/table-schema";
import { areArraysEqual } from "@/utils/utils";
import { Node, useReactFlow } from "@xyflow/react";
import { useCallback, useEffect, useMemo, useState } from "react";

// Return type of the hook
type UseOverlapingType = {
    isOverlapping: boolean, // Indicates if any nodes are overlapping
    puls: () => void        // Triggers a short visual pulse effect for overlapping nodes
}

/**
 * Custom hook to detect overlapping nodes in a React Flow diagram,
 * annotate them with metadata (`overlapping`, `pulsing`),
 * and provide a pulse trigger for visual feedback.
 */
const useOverlappingNodes = (nodes: Node[]): UseOverlapingType => {
    const [isPulsing, setIsPulsing] = useState<boolean>(false);
    const { setNodes } = useReactFlow();

    /**
     * Triggers a brief "pulse" effect (e.g. for animations or styles)
     * by toggling a boolean flag for a short time.
     */
    const puls = useCallback(() => {
        setIsPulsing(true);
        setTimeout(() => setIsPulsing(false), 200);
    }, []);

    /**
     * Compute which nodes are currently overlapping.
     * This is memoized to avoid recalculating unless nodes change.
     */
    const overlappingNodes: Set<string> = useMemo(() => {
        const overlaps: Set<string> = new Set();

        // Compare every pair of nodes
        for (let i = 0; i < nodes.length; i++) {
            for (let j = i + 1; j < nodes.length; j++) {
                if (isNodesOverlapping(nodes[i], nodes[j])) {
                    overlaps.add(nodes[i].id);
                    overlaps.add(nodes[j].id);
                }
            }
        }

        return overlaps;
    }, [nodes]);

    /**
     * When overlapping nodes change, update each node’s `data.overlapping` property accordingly.
     * Avoids unnecessary updates using deep comparison.
     */
    useEffect(() => {
        const overlappingIds: string[] = Array.from(overlappingNodes);
        const previousOverlappingNodesIds: string[] = nodes
            .filter((node: Node) => node.data.overlapping)
            .map((node: Node) => node.id);

        if (!areArraysEqual(previousOverlappingNodesIds, overlappingIds)) {
            setNodes((nodes: any) => {
                return nodes.map((node: any) => {
                    const isOverlaped: boolean = overlappingIds.includes(node.id);
                    if (isOverlaped === node.data.overlapping)
                        return node; // No change needed
                    else
                        return {
                            ...node,
                            data: {
                                ...node.data,
                                overlapping: isOverlaped
                            }
                        };
                });
            });
        }
    }, [overlappingNodes]);

    /**
     * When `isPulsing` is active, apply a `pulsing` property to overlapping nodes
     * to trigger animations or visual indicators in the UI.
     */
    useEffect(() => {
        setNodes((nodes: any) => {
            return nodes.map((node: any) => {
                if (!node.data.overlapping)
                    return node;

                return {
                    ...node,
                    data: {
                        ...node.data,
                        pulsing: isPulsing
                    }
                };
            });
        });
    }, [isPulsing]);

    // True if any overlapping nodes exist
    const isOverlapping: boolean = overlappingNodes.size > 0;

    // Return memoized object to avoid unnecessary rerenders
    return useMemo(() => ({
        puls,
        isOverlapping
    }), [isOverlapping, puls]);
};

export default useOverlappingNodes;

/**
 * Helper function to check whether two nodes are overlapping
 * Uses their position and dimensions to determine intersection.
 */
function isNodesOverlapping(nodeA: Node, nodeB: Node) {
    const nodeAWidth: number =
        nodeA.measured?.width ||
        parseInt(nodeA.style?.width as string) ||
        224; // Default fallback width

    const nodeAHeight: number =
        nodeA.measured?.height ||
        (nodeA.data.table as TableType).fields.length * 32 + 36; // Estimate height based on number of fields

    const nodeBWidth: number =
        nodeB.measured?.width ||
        parseInt(nodeB.style?.width as string) ||
        224;

    const nodeBHeight: number =
        nodeB.measured?.height ||
        (nodeB.data.table as TableType).fields.length * 32 + 36;

    // Bounding box of node A
    const a = {
        left: nodeA.position.x,
        right: nodeA.position.x + nodeAWidth,
        top: nodeA.position.y,
        bottom: nodeA.position.y + nodeAHeight,
    };

    // Bounding box of node B
    const b = {
        left: nodeB.position.x,
        right: nodeB.position.x + nodeBWidth,
        top: nodeB.position.y,
        bottom: nodeB.position.y + nodeBHeight,
    };

    // Check if the bounding boxes intersect
    return !(a.right <= b.left || a.left >= b.right || a.bottom <= b.top || a.top >= b.bottom);
}
