import { RelationshipType } from "@/lib/schemas/relationship-schema";
import { areArraysEqual } from "@/utils/utils";
import { Edge, Node, useReactFlow } from "@xyflow/react";
import { useEffect, useMemo, useState } from "react";

/**
 * Custom hook to manage and visually highlight edges in a React Flow diagram
 * based on selected nodes and their relationships.
 */
const useHighlightedEdges = (nodes: Node[], relationships: RelationshipType[], edges: Edge[]) => {
    const { setNodes, setEdges } = useReactFlow();

    // Keeps track of currently selected node IDs
    const [selectedNodeIds, setSelectedNodeIds] = useState<string[]>([]);

    /**
     * Effect to update selected node IDs when node selection changes.
     * Prevents unnecessary state updates by comparing the new selection with the previous one.
     */
    useEffect(() => {
        const newSelectedNodesIds: string[] = nodes
            .filter((node: Node) => node.selected)
            .map((node: Node) => node.id);

        // Only update state if the selected nodes have changed
        if (areArraysEqual(newSelectedNodesIds, selectedNodeIds)) return;

        setSelectedNodeIds(newSelectedNodesIds);
    }, [nodes]);

    /**
     * Memoized list of edge IDs that are connected to selected nodes.
     * This avoids recomputation unless `selectedNodeIds` or `relationships` change.
     */
    const selectedEdgeIds: string[] = useMemo(() => {
        return relationships
            .filter((relationship: RelationshipType) =>
                selectedNodeIds.includes(relationship.sourceTableId) ||
                selectedNodeIds.includes(relationship.targetTableId)
            )
            .map((relationship: RelationshipType) => relationship.id);
    }, [selectedNodeIds, relationships]);

    /**
     * Effect to update edge animation state based on selection.
     * Edges that are connected to selected nodes will be animated.
     */
    useEffect(() => {
        setEdges((edges: any) => {
            return edges.map((edge: any) => {
                const selected: boolean = selectedEdgeIds.includes(edge.id);

                // Only update edge if its animation state needs to change
                return (edge.animated === selected)
                    ? edge
                    : { ...edge, animated: selected } as Edge;
            });
        });
    }, [selectedEdgeIds]);

    /**
     * Effect to update nodes with a list of their connected and animated/selected edges.
     * This information can be used to visually emphasize connected edges in node components.
     */
    useEffect(() => {
        setNodes((nodes: any) => {
            return nodes.map((node: any) => {
                // Find edges that are either animated or selected and connected to this node
                const newHighlightedEdges: Edge[] = edges.filter((edge: Edge) =>
                    (edge.animated || edge.selected) &&
                    (edge.source === node.id || edge.target === node.id)
                );
                const newHighlightedEdgeIds = newHighlightedEdges.map((edge : Edge) => edge.id) ; 
                const previousHighlightedEdgeIds = node.data.highlightedEdges.map((edge : Edge) => edge.id) ; 

                if (areArraysEqual(previousHighlightedEdgeIds , newHighlightedEdgeIds))
                    return node ; 
                // Add the highlighted edges to the node's data
                return {
                    ...node,
                    data: {
                        ...node.data,
                        highlightedEdges: newHighlightedEdges
                    }
                };
            });
        });
    }, [edges]);
};

export default useHighlightedEdges;
