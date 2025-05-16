
import { addEdge, applyNodeChanges, Background, Connection, Controls, Edge, EdgeChange, EdgeRemoveChange, MiniMap, Node, NodeChange, NodePositionChange, NodeRemoveChange, NodeSelectionChange, OnEdgesChange, OnNodesChange, ReactFlow, useEdgesState, useNodesState, useReactFlow } from "@xyflow/react";
import { useCallback, useEffect, useMemo, useState } from "react";
import Table from "./table/table";
import '@xyflow/react/dist/style.css';
import Relationship from "./table/relationship";
import DBController from "./db-controller/db-controller";
import { TableInsertType } from "@/lib/schemas/table-schema";
import { useDatabase } from "@/providers/database-provider/database-provider";
import { useTableToNode } from "@/hooks/use-table-to-node";
import { useRelationshipToEdge } from "@/hooks/use-relationship-to-edge";
import { RelationshipInsertType, RelationshipType } from "@/lib/schemas/relationship-schema";
import { v4 } from "uuid";
import { TARGET_PREFIX } from "./table/field";
import CardinalityMarker from "@/components/cardinality-marker/cardinality-marker";
import { areArraysEqual } from "@/utils/utils";
import { useDiagram } from "@/providers/diagram-provider/diagram-provider";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/tooltip/tooltip";
import { Button } from "@heroui/react";
import { LayoutGrid } from "lucide-react";
import { adjustTablesPositions } from "@/utils/tables";
import { useTheme } from "next-themes";



const DatabasePage: React.FC<never> = () => {

    const { tables, relationships, updateTablePositions, deleteMultiTables, deleteMultiRelationships, createRelationship } = useDatabase();
    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);
    const { setIsConnectionInProgress } = useDiagram();
    const [selectedNodeIds, setSelectedNodeIds] = useState<string[]>([]);

 
    const { fitView } = useReactFlow();

    const nodeTypes = useMemo(() => ({ table: Table }), []);
    const edgeTypes = useMemo(() => ({ 'relationship-edge': Relationship }), []);

    const onConnect = useCallback((connection: Connection) => {

        createRelationship({
            id: v4(),
            sourceTableId: connection.source,
            targetTableId: connection.target,
            sourceFieldId: (connection.sourceHandle as string).split("_").pop(),
            targetFieldId: (connection.targetHandle as string).replace(TARGET_PREFIX, "")
        } as RelationshipInsertType)

        setEdges((eds) => addEdge(connection, eds));
        setIsConnectionInProgress(false);

    }, []);

    const handleNodesChanges: OnNodesChange<never> = useCallback((changes: NodeChange<never>[]) => {

        const nodePositionChanges: NodePositionChange[] = changes.filter((change: NodeChange) => change.type == "position" && !change.dragging) as NodePositionChange[];
        const nodeRemoveChanges: NodeRemoveChange[] = changes.filter((change: NodeChange) => change.type == "remove");

        if (nodePositionChanges.length > 0)
            updateTablePositions(nodePositionChanges.map((change: NodePositionChange) => ({
                id: change.id,
                posX: change.position?.x,
                posY: change.position?.y
            } as TableInsertType)));

        if (nodeRemoveChanges.length > 0)
            deleteMultiTables(nodeRemoveChanges.map((change: NodeRemoveChange) => change.id));

        return onNodesChange(changes);

    }, [onNodesChange]);

    const handleEdgeChanges: OnEdgesChange<any> = useCallback((changes: EdgeChange<any>[]) => {

        const edgeRemoveChanges: EdgeRemoveChange[] = changes.filter((change: EdgeChange) => change.type == "remove") as EdgeRemoveChange[];
        if (edgeRemoveChanges.length > 0) {
            deleteMultiRelationships(edgeRemoveChanges.map((change: EdgeRemoveChange) => change.id))
        }
        return onEdgesChange(changes as EdgeChange<never>[]);
    }, [onEdgesChange]);


    useEffect(() => {
        const newSelectedNodesIds: string[] = nodes.filter((node: Node) => node.selected).map((node: Node) => node.id)
        if (areArraysEqual(newSelectedNodesIds, selectedNodeIds)) return; setSelectedNodeIds(newSelectedNodesIds);
    }, [nodes]);


    const selectedEdgeIds: string[] = useMemo(() => {
        return relationships.filter((relationship: RelationshipType) =>
            selectedNodeIds.includes(relationship.sourceTableId) ||
            selectedNodeIds.includes(relationship.targetTableId)
        ).map((relationship: RelationshipType) => relationship.id);
    }, [selectedNodeIds, relationships]);


    useEffect(() => {
        setEdges((edges: any) => {
            return edges.map((edge: any) => {
                const selected: boolean = selectedEdgeIds.includes(edge.id);
                return {
                    ...edge,
                    animated: selected,
                } as Edge


            })
        })
    }, [selectedEdgeIds]);

    const onConnectStart = useCallback(() => {
        setIsConnectionInProgress(true);
    }, []);


    const onConnectEnd = useCallback(() => {
        setIsConnectionInProgress(false);
    }, []);


    const adjustPositions = useCallback(async () => {

        updateTablePositions(await adjustTablesPositions(nodes, relationships));
        setTimeout(() => {
            fitView({
                duration: 500
            })
        }, 500)

    }, [relationships, nodes])

    useTableToNode(tables);
    useRelationshipToEdge(relationships);

    return (

        <div className="w-full h-screen flex  relative">
            <DBController />
            <ReactFlow
                nodes={nodes}
                edges={edges}
                fitView
                className="w-full h-full cursor-default"
                onNodesChange={handleNodesChanges}
                onEdgesChange={handleEdgeChanges}
                onConnect={onConnect}
                defaultEdgeOptions={{
                    type: 'relationship-edge',
                }}
                //  onlyRenderVisibleElements
                panOnDrag={true}
                zoomOnScroll={true}
                nodeTypes={nodeTypes}
                edgeTypes={edgeTypes}
                snapGrid={[20, 20]}
                onConnectStart={onConnectStart}
                onConnectEnd={onConnectEnd}
            >
                <div className="absolute top-[160px]">

                </div>
                <Controls >
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <span>
                                <Button
                                    size="sm"
                                    isIconOnly
                                    variant="flat"
                                    className="size-8 p-1 shadow-none"
                                    onPressEnd={adjustPositions}

                                >
                                    <LayoutGrid className="size-4" />
                                </Button>
                            </span>
                        </TooltipTrigger>
                        <TooltipContent>
                            Adjust Positions
                        </TooltipContent>
                    </Tooltip>

                </Controls>
                <Background className="bg-default/30 dark:bg-black" />
            </ReactFlow>

            <svg style={{ position: 'absolute', width: 0, height: 0 }}>
                <defs>
                    <CardinalityMarker type="one" direction="start" />
                    <CardinalityMarker type="one" direction="start" selected />

                    <CardinalityMarker type="one" direction="end" />
                    <CardinalityMarker type="one" direction="end" selected />

                    <CardinalityMarker type="many" direction="start" />
                    <CardinalityMarker type="many" direction="start" selected />

                    <CardinalityMarker type="many" direction="end" />
                    <CardinalityMarker type="many" direction="end" selected />

                </defs>
            </svg>
        </div>

    )
}


export default DatabasePage; 