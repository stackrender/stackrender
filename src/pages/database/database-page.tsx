
import { addEdge, applyNodeChanges, Background, Connection, Controls, Edge, EdgeChange, EdgeRemoveChange, MiniMap, Node, NodeChange, NodePositionChange, NodeRemoveChange, NodeSelectionChange, OnEdgesChange, OnNodesChange, ReactFlow, useEdgesState, useNodesState, useReactFlow } from "@xyflow/react";
import { useCallback, useEffect, useMemo, useState } from "react";
import Table from "./table/table";
import '@xyflow/react/dist/style.css';
import Relationship from "./table/relationship";
import DBController from "./db-controller/db-controller";
import { TableInsertType } from "@/lib/schemas/table-schema";
import { useDatabase, useDatabaseOperations } from "@/providers/database-provider/database-provider";
import { useTableToNode } from "@/hooks/use-table-to-node";
import { useRelationshipToEdge } from "@/hooks/use-relationship-to-edge";
import { RelationshipInsertType, RelationshipType } from "@/lib/schemas/relationship-schema";
import { v4 } from "uuid";
import { TARGET_PREFIX } from "./table/field";
import CardinalityMarker from "@/components/cardinality-marker/cardinality-marker";
import { areArraysEqual } from "@/utils/utils";
import { useDiagramOps } from "@/providers/diagram-provider/diagram-provider";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/tooltip/tooltip";
import { addToast, Button, Image } from "@heroui/react";
import { AlertTriangle, LayoutGrid } from "lucide-react";
import { adjustTablesPositions } from "@/utils/tables";

import DatabaseControlButtons from "./database-control-buttons";
import useGetOverlappingNodes from "@/hooks/use-get-overlapping-nodes";
import { FieldType } from "@/lib/schemas/field-schema";



const DatabasePage: React.FC<never> = () => {

    const { database, getField } = useDatabase();
    const { updateTablePositions, deleteMultiTables, deleteMultiRelationships, createRelationship } = useDatabaseOperations();
    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);

    const { setIsConnectionInProgress } = useDiagramOps();
    const [selectedNodeIds, setSelectedNodeIds] = useState<string[]>([]);
    const [isTableOverlappingPulsing, setIsTableOverlappingPulsing] = useState<boolean>(false);
    const { tables, relationships } = database;
    const { fitView } = useReactFlow();

    const nodeTypes = useMemo(() => ({ table: Table }), []);
    const edgeTypes = useMemo(() => ({ 'relationship-edge': Relationship }), []);

    const onConnect = useCallback((connection: Connection) => {
        const sourceFieldId: string | undefined = (connection.sourceHandle as string).split("_").pop();
        const targetFieldId: string = (connection.targetHandle as string).replace(TARGET_PREFIX, "");

        const sourceField: FieldType | undefined = getField(connection.source, sourceFieldId as string);
        const targetField: FieldType | undefined = getField(connection.target, targetFieldId);


        if (sourceField?.typeId == targetField?.typeId) {

            createRelationship({
                id: v4(),
                sourceTableId: connection.source,
                targetTableId: connection.target,
                sourceFieldId,
                targetFieldId
            } as RelationshipInsertType);

            setEdges((eds) => addEdge(connection, eds));
        } else {
            addToast({
                title: "Invalid Relationship",
                description: "Relationship should be between primary key and foreign key of the same time",
                color: "danger",
            })
        }
        setIsConnectionInProgress(false);

    }, [database]);

    const handleNodesChanges: OnNodesChange<never> = useCallback((changes: NodeChange<never>[]) => {

        const nodePositionChanges: NodePositionChange[] = changes.filter((change: NodeChange) =>
            change.type == "position" &&
            !change.dragging
        ) as NodePositionChange[];

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
                return (edge.animated == selected) ? edge : { ...edge, animated: selected } as Edge;
            })
        });
    }, [selectedEdgeIds]);


    useEffect(() => {
        setNodes((nodes: any) => {
            return nodes.map((node: any) => {
                const newHighlitedEdges: Edge[] = edges.filter((edge: Edge) =>
                    (edge.animated || edge.selected)
                    && (edge.source == node.id || edge.target == node.id)
                );
                return {
                    ...node,
                    data: {
                        ...node.data,
                        highlightedEdges: newHighlitedEdges
                    }
                }
            })
        })
    }, [edges]);

    const onConnectStart = useCallback(() => {
        setIsConnectionInProgress(true);
    }, []);


    const onConnectEnd = useCallback(() => {
        setIsConnectionInProgress(false);
    }, []);



    useTableToNode(tables);
    useRelationshipToEdge(relationships);


    const adjustPositions = useCallback(async () => {
        updateTablePositions(await adjustTablesPositions(nodes, relationships));
        setTimeout(() => {
            fitView({
                duration: 500
            })
        }, 500)
    }, [relationships, nodes]);


    const overlappingNodes = useGetOverlappingNodes();

    useEffect(() => {
        const overlappingIds = Array.from(overlappingNodes);

        const previousOverlappingNodes = nodes.filter((node: Node) => node.data.overlapping);

        if (!areArraysEqual(previousOverlappingNodes, overlappingIds)) {
            setNodes((nodes: any) => {
                return nodes.map((node: any) => {
                    const isOverlaped: boolean = overlappingIds.includes(node.id);

                    if (isOverlaped == node.data.overlapping)
                        return node;
                    else
                        return {
                            ...node,
                            data: {
                                ...node.data,
                                overlapping: isOverlaped
                            }
                        }
                })
            })
        }
    }, [overlappingNodes]);


    useEffect(() => {
        setNodes((nodes: any) => {
            return nodes.map((node: any) => {
                if (!node.data.overlapping)
                    return node;
                else
                    return {
                        ...node,
                        data: {
                            ...node.data,
                            pulsing: isTableOverlappingPulsing
                        }
                    }
            })
        })
    }, [isTableOverlappingPulsing])

    const pulsOverlappingTables = useCallback(() => {
        setIsTableOverlappingPulsing(true);
        setTimeout(() => setIsTableOverlappingPulsing(false), 200);
    }, [])

    return (

        <div className="w-full h-screen flex  relative">

            <DBController />
            <div className="relative w-full h-full">
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
                    //onlyRenderVisibleElements
                    panOnDrag={true}
                    zoomOnScroll={true}
                    nodeTypes={nodeTypes}
                    edgeTypes={edgeTypes}
                    snapGrid={[20, 20]}
                    onConnectStart={onConnectStart}
                    onConnectEnd={onConnectEnd}
                >

                    <Controls
                        position="bottom-center"
                        showFitView={false}
                        showZoom={false}
                        showInteractive={false}
                        className="shadow-none "
                    >

                        <DatabaseControlButtons
                            adjustPositions={adjustPositions}
                        />
                    </Controls >

                    <Background className="bg-default/40 dark:bg-black"/>
                </ReactFlow>
                <div
                    className="absolute left-[12px]  top-[64px] "
                >
                    {
                        overlappingNodes.size > 0 &&
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <span>
                                    <Button
                                        variant="shadow"
                                        size="sm"
                                        isIconOnly
                                        color="danger"
                                        className="size-8 p-1 "
                                        onPressEnd={pulsOverlappingTables}
                                    >
                                        <AlertTriangle className="size-4 text-white" />
                                    </Button>
                                </span>
                            </TooltipTrigger>
                            <TooltipContent>
                                Overlapping Tables
                            </TooltipContent>
                        </Tooltip>
                    }
                </div>
            </div>

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