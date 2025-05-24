// Importing necessary types and hooks from React Flow (XYFlow)
import {
    addEdge, Background, Connection, Controls, EdgeChange,
    EdgeRemoveChange, NodeChange, NodePositionChange,
    NodeRemoveChange, OnEdgesChange, OnNodesChange,
    ReactFlow, useEdgesState, useNodesState, useReactFlow
} from "@xyflow/react";

// React built-ins
import { useCallback, useMemo } from "react";

// Custom components and styles
import Table from "./table/table";
import '@xyflow/react/dist/style.css';
import Relationship from "./table/relationship";
import DBController from "./db-controller/db-controller";
import { TableInsertType } from "@/lib/schemas/table-schema";

// Custom context providers and hooks
import { useDatabase, useDatabaseOperations } from "@/providers/database-provider/database-provider";
import { useTableToNode } from "@/hooks/use-table-to-node";
import { useRelationshipToEdge } from "@/hooks/use-relationship-to-edge";
import { RelationshipInsertType } from "@/lib/schemas/relationship-schema";

// Utils and constants
import { v4 } from "uuid";
import { TARGET_PREFIX } from "./table/field";
import CardinalityMarker from "@/components/cardinality-marker/cardinality-marker";
import { useDiagramOps } from "@/providers/diagram-provider/diagram-provider";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/tooltip/tooltip";
import { addToast, Button } from "@heroui/react";
import { AlertTriangle } from "lucide-react";
import { adjustTablesPositions } from "@/utils/tables";
import DatabaseControlButtons from "./database-control-buttons";
import { FieldType } from "@/lib/schemas/field-schema";
import useHighlightedEdges from "@/hooks/use-highlighted-edges"; 
import { useTranslation } from "react-i18next";
import useOverlappingTables from "@/hooks/use-overlapping-tables";


const DatabasePage: React.FC<never> = () => {
    const { t } = useTranslation() ;  
    // Extract database state and operations
    const { database, getField } = useDatabase();
    const { updateTablePositions, deleteMultiTables, deleteMultiRelationships, createRelationship } = useDatabaseOperations();

    // Node and edge state hooks
    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);

    // Diagram-related state (e.g. connection in progress)
    const { setIsConnectionInProgress } = useDiagramOps();

    // Destructure tables and relationships from database
    const { tables, relationships } = database;

    // Hook to allow zooming and centering the diagram
    const { fitView } = useReactFlow();

    // Define custom node and edge types
    const nodeTypes = useMemo(() => ({ table: Table }), []);
    const edgeTypes = useMemo(() => ({ 'relationship-edge': Relationship }), []);

    // Called when a connection is made between fields
    const onConnect = useCallback((connection: Connection) => {
        const sourceFieldId: string | undefined = (connection.sourceHandle as string).split("_").pop();
        const targetFieldId: string = (connection.targetHandle as string).replace(TARGET_PREFIX, "");

        const sourceField: FieldType | undefined = getField(connection.source, sourceFieldId as string);
        const targetField: FieldType | undefined = getField(connection.target, targetFieldId);

        // Check if both fields have the same type (valid relationship)
        if (sourceField?.typeId == targetField?.typeId) {
            createRelationship({
                id: v4(),
                sourceTableId: connection.source,
                targetTableId: connection.target,
                sourceFieldId,
                targetFieldId
            } as RelationshipInsertType);

            // Add edge to the diagram
            setEdges((eds) => addEdge(connection, eds));
        } else {
            // Show error toast if invalid relationship
            addToast({
                title: t("db_controller.invalid_relationship.title"),
                description: t("db_controller.invalid_relationship.description"),
                color: "danger",
            });
        }

        setIsConnectionInProgress(false);
    }, [database , t ]);

    // Called when nodes are updated (position changes or removed)
    const handleNodesChanges: OnNodesChange<never> = useCallback(async (changes: NodeChange<never>[]) => {
        const nodePositionChanges: NodePositionChange[] = changes.filter((change: NodeChange) =>
            change.type == "position" && !change.dragging
        ) as NodePositionChange[];

        const nodeRemoveChanges: NodeRemoveChange[] = changes.filter((change: NodeChange) => change.type == "remove");

        // Save new positions to the database
        if (nodePositionChanges.length > 0)
            await updateTablePositions(nodePositionChanges.map((change: NodePositionChange) => ({
                id: change.id,
                posX: change.position?.x,
                posY: change.position?.y
            } as TableInsertType)));

        // Delete tables if removed
        if (nodeRemoveChanges.length > 0)
            deleteMultiTables(nodeRemoveChanges.map((change: NodeRemoveChange) => change.id));

        return onNodesChange(changes);
    }, [onNodesChange]);

    // Called when edges (relationships) change
    const handleEdgeChanges: OnEdgesChange<any> = useCallback((changes: EdgeChange<any>[]) => {
        const edgeRemoveChanges: EdgeRemoveChange[] = changes.filter((change: EdgeChange) => change.type == "remove") as EdgeRemoveChange[];

        // Delete relationships from database
        if (edgeRemoveChanges.length > 0) {
            deleteMultiRelationships(edgeRemoveChanges.map((change: EdgeRemoveChange) => change.id));
        }

        return onEdgesChange(changes as EdgeChange<never>[]);
    }, [onEdgesChange]);

    // When user starts connecting fields
    const onConnectStart = useCallback(() => {
        setIsConnectionInProgress(true);
    }, []);

    // When user ends connecting fields
    const onConnectEnd = useCallback(() => {
        setIsConnectionInProgress(false);
    }, []);

    // Automatically reposition tables to avoid overlap and fit the view
    const adjustPositions = useCallback(async () => {
        updateTablePositions(await adjustTablesPositions(nodes, relationships));
        setTimeout(() => {
            fitView({
                duration: 500
            });
        }, 300);
    }, [relationships, nodes]);

    // Convert tables and relationships into flow elements
    useTableToNode(tables);
    useRelationshipToEdge(relationships);
    useHighlightedEdges(nodes, relationships, edges);
    const { isOverlapping, puls } = useOverlappingTables(tables);

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
                    onlyRenderVisibleElements
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

                    <Background className="bg-default/40 dark:bg-black" />
                </ReactFlow>
                <div
                    className="absolute left-[24px] bottom-[24px] "
                >
                    {
                        isOverlapping &&
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <span>
                                    <Button
                                        variant="shadow"
                                        size="sm"
                                        isIconOnly
                                        color="danger"
                                        className="size-8 p-1 "
                                        onPressEnd={puls}
                                    >
                                        <AlertTriangle className="size-4 text-white" />
                                    </Button>
                                </span>
                            </TooltipTrigger>
                            <TooltipContent>
                                {t("table.overlapping_tables")}
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