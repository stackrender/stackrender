// Importing necessary types and hooks from React Flow (XYFlow)
import {
    addEdge, Background, ColorMode, Connection, Controls, EdgeChange,
    EdgeRemoveChange, MiniMap, NodeChange, NodePositionChange,
    NodeRemoveChange, OnEdgesChange, OnNodesChange,
    ReactFlow, useEdgesState, useNodesState, useReactFlow
} from "@xyflow/react";

// React built-ins
import { useCallback, useEffect, useMemo } from "react";

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
import { Cardinality, RelationshipInsertType } from "@/lib/schemas/relationship-schema";

// Utils and constants
import { v4 } from "uuid";
import { TARGET_PREFIX } from "./table/field";
import CardinalityMarker from "@/components/cardinality-marker/cardinality-marker";
import { useDiagramOps } from "@/providers/diagram-provider/diagram-provider";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/tooltip/tooltip";
import { addToast, Button } from "@heroui/react";
import { AlertTriangle } from "lucide-react";
import { adjustTablesPositions, isTablesOverlapping } from "@/utils/tables";
import DatabaseControlButtons from "./database-control-buttons";
import { FieldType } from "@/lib/schemas/field-schema";
import useHighlightedEdges from "@/hooks/use-highlighted-edges";
import { useTranslation } from "react-i18next";
import useOverlappingTables from "@/hooks/use-overlapping-tables";
import { useTheme } from "next-themes";

import { getRelationshipSourceAndTarget } from "@/utils/relationship";
import { useModal } from "@/providers/modal-provider/modal-provider";
import { Modals } from "@/providers/modal-provider/modal-contxet";
import { Loading } from "@/components/modal/loading-modal";
import { usePowerSync  } from "@powersync/react";
import { CardinalityStyle } from "@/lib/database";



 
const DatabasePage: React.FC = () => {
    const { open } = useModal();
    const syncStatus = usePowerSync();

    const { t } = useTranslation();
    const { resolvedTheme } = useTheme();
    // Extract database state and operations
    const { database, getField, databases, isSwitchingDatabase, isLoading, isFetching, isSyncing } = useDatabase();

    const { updateTablePositions, deleteMultiTables, deleteMultiRelationships, createRelationship } = useDatabaseOperations();

    // Node and edge state hooks
    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);

    // Diagram-related state (e.g. connection in progress)
    const { setIsConnectionInProgress, cardinalityStyle } = useDiagramOps();

    // Destructure tables and relationships from database
    const { tables, relationships } = database || { tables: [], relationships: [] };

    // Hook to allow zooming and centering the diagram
    const { fitView } = useReactFlow();

    // Define custom node and edge types
    const nodeTypes = useMemo(() => ({ table: Table }), []);
    const edgeTypes = useMemo(() => ({ 'relationship-edge': Relationship }), []);

    useEffect(() => {

        if (isSyncing)
            return;

        // no database selected , open (open database) Modal  
        if (!database && databases?.length > 0) {
            open(Modals.OPEN_DATABASE, {
                closable: false
            })
        }
        else if (databases.length == 0) {
            // there is no databases in the first place to select from , 
            // we have to create a new one . 
            open(Modals.CREATE_DATABASE, {
                closable: false
            });
        }
    }, [database?.id, isSyncing])

    useEffect(() => {
        if (isSwitchingDatabase) {
            setNodes([]);
            setEdges([]);
        } else {
            fitView({
                duration: 500
            });
        }
    }, [isSwitchingDatabase])

    // Called when a connection is made between fields
    const onConnect = useCallback(async (connection: Connection) => {
        const sourceId: string | undefined = (connection.sourceHandle as string).split("_").pop();
        const targetId: string = (connection.targetHandle as string).replace(TARGET_PREFIX, "");

        const sourceField: FieldType = getField(connection.source, sourceId as string) as FieldType;
        const targetField: FieldType = getField(connection.target, targetId) as FieldType;

        const { sourceTableId, targetTableId, sourceFieldId, targetFieldId } = getRelationshipSourceAndTarget(connection.source, sourceField, connection.target, targetField);

        // Check if both fields have the same type (valid relationship)
        if (sourceField?.typeId == targetField?.typeId) {
            await createRelationship({
                id: v4(),
                sourceTableId,
                targetTableId,
                sourceFieldId,
                targetFieldId,

            } as RelationshipInsertType);

        } else {
            // Show error toast if invalid relationship
            addToast({
                title: t("db_controller.invalid_relationship.title"),
                description: t("db_controller.invalid_relationship.description"),
                color: "danger",
                variant: "solid"
            });
        }

        setIsConnectionInProgress(false);
    }, [database, t]);

    // Called when nodes are updated (position changes or removed)
    const handleNodesChanges: OnNodesChange<never> = useCallback(async (changes: NodeChange<never>[]) => {

        const nodePositionChanges: NodePositionChange[] = changes.filter((change: NodeChange) =>
            change.type == "position" && !change.dragging
        ) as NodePositionChange[];

        const nodeRemoveChanges: NodeRemoveChange[] = changes.filter((change: NodeChange) => change.type == "remove");
        // Save new positions to the database

        if (nodePositionChanges.length > 0)

            updateTablePositions(nodePositionChanges.map((change: NodePositionChange) => ({
                id: change.id,
                posX: change.position?.x,
                posY: change.position?.y
            } as TableInsertType)));

        // Delete tables if removed
        if (nodeRemoveChanges.length > 0) {
            deleteMultiTables(nodeRemoveChanges.map((change: NodeRemoveChange) => change.id));
        }
        return onNodesChange(changes);
    }, [onNodesChange, database]);

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
        const adjustedTables = await adjustTablesPositions(nodes, relationships);

        updateTablePositions(adjustedTables)
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

        <div className="w-full h-screen flex  relative overflow-hidden">
            {
                (isSwitchingDatabase || isLoading || !(syncStatus.currentStatus as any).options.hasSynced) && <Loading />
            }
            <div className="flex max-w-full">
                <DBController />
            </div>
            {

                <div className="relative w-full h-full ">
                    <ReactFlow
                        colorMode={resolvedTheme as ColorMode}
                        nodes={nodes}
                        edges={edges}
                        fitView
                        className="w-full h-full cursor-default "
                        onNodesChange={handleNodesChanges}
                        onEdgesChange={handleEdgeChanges}
                        onConnect={onConnect}
                        defaultEdgeOptions={{
                            type: 'relationship-edge',
                            animated: false
                        }}
                        panOnDrag={true}
                        zoomOnScroll={true}
                        nodeTypes={nodeTypes}
                        edgeTypes={edgeTypes}
                        snapGrid={[20, 20]}
                        minZoom={0.10}
                        onConnectStart={onConnectStart}
                        onConnectEnd={onConnectEnd}

                    >
                        <Controls
                            position="bottom-center"
                            showFitView={false}
                            showZoom={false}
                            showInteractive={false}
                            className="shadow-none">

                            <DatabaseControlButtons
                                adjustPositions={adjustPositions}
                            />
                        </Controls >
                        <MiniMap
                            nodeStrokeWidth={4}
                            className="dark:bg-content1 bg-background border-1 border-default-200 dark:border-divider rounded-md "
                            maskStrokeColor={resolvedTheme == "dark" ? "#272c35" : "#e9edf1"}
                            maskColor={resolvedTheme == "dark" ? "#20252c99" : "#f2f4f733"}
                            maskStrokeWidth={1}
                            nodeClassName={"fill-default-300 dark:fill-font/30"}
                            style={{
                                width: 164,
                                height: 128
                            }}

                        />
                        <Background className="dark:bg-background-100 " />
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
                                            onPressEnd={puls}>
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

            }
            {
                (cardinalityStyle != CardinalityStyle.HIDDEN) &&
                <svg style={{ position: 'absolute', width: 0, height: 0 }}>
                    <defs>
                        <CardinalityMarker style={cardinalityStyle} cardinality="one" direction="start" />
                        <CardinalityMarker style={cardinalityStyle} cardinality="one" direction="start" selected />

                        <CardinalityMarker style={cardinalityStyle} cardinality="one" direction="end" />
                        <CardinalityMarker style={cardinalityStyle} cardinality="one" direction="end" selected />

                        <CardinalityMarker style={cardinalityStyle} cardinality="many" direction="start" />
                        <CardinalityMarker style={cardinalityStyle} cardinality="many" direction="start" selected />

                        <CardinalityMarker style={cardinalityStyle} cardinality="many" direction="end" />
                        <CardinalityMarker style={cardinalityStyle} cardinality="many" direction="end" selected />

                    </defs>
                </svg>
            }
        </div>

    )
}


export default DatabasePage;





