
import { addEdge, applyEdgeChanges, applyNodeChanges, Background, Connection, Controls, Edge, EdgeChange, EdgeRemoveChange, MiniMap, Node, NodeChange, NodePositionChange, NodeRemoveChange, NodeSelectionChange, OnEdgesChange, OnNodesChange, ReactFlow, useEdgesState, useNodesState, useReactFlow } from "@xyflow/react";
import { SetStateAction, useCallback, useEffect, useMemo, useState } from "react";
import Table from "./table/table";
import '@xyflow/react/dist/style.css';
import Relationship from "./table/relationship";
import DBController from "./db-controller/db-controller";
import { TableInsertType, TableType } from "@/lib/schemas/table-schema";
import { useDatabase } from "@/providers/database-provider/database-provider";
import { useTableToNode } from "@/hooks/use-table-to-node";
import { useRelationshipToEdge } from "@/hooks/use-relationship-to-edge";
import { RelationshipInsertType, RelationshipType } from "@/lib/schemas/relationship-schema";
import { v4 } from "uuid";
import { LEFT_PREFIX, TARGET_PREFIX } from "./table/field";
import CardinalityMarker from "@/components/cardinality-marker/cardinality-marker";


interface DatabaseProps {
    initialTables?: TableType
}

const edgeTypes = {
    'relationship-edge': Relationship,
};

const DatabasePage: React.FC<DatabaseProps> = ({ initialTables }) => {

    const { tables, relationships, updateTablePositions, deleteMultiTables, deleteMultiRelationships, createRelationship } = useDatabase();
    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);


    useTableToNode(tables);
    useRelationshipToEdge(relationships);

    const nodeTypes = useMemo(() => ({ table: Table }), []);
    const onConnect = useCallback((connection: Connection) => {

        createRelationship({
            id: v4(),
            sourceTableId: connection.source,
            targetTableId: connection.target,
            sourceFieldId: (connection.sourceHandle as string).split("_").pop(),
            targetFieldId: (connection.targetHandle as string).replace(TARGET_PREFIX, "")
        } as RelationshipInsertType)

        setEdges((eds) => addEdge(connection, eds));

    }, [setEdges]);

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

        onNodesChange(changes);

    }, [onNodesChange]);


    const handleEdgeChanges: OnEdgesChange<any> = useCallback((changes: EdgeChange<any>[]) => {
        const edgeRemoveChanges: EdgeRemoveChange[] = changes.filter((change: EdgeChange) => change.type == "remove") as EdgeRemoveChange[];
        if (edgeRemoveChanges.length > 0) {
            deleteMultiRelationships(edgeRemoveChanges.map((change: EdgeRemoveChange) => change.id))
        }
        onEdgesChange(changes as EdgeChange<never>[]);
    }, [onEdgesChange]);


    const selectedTableIds: string[] = useMemo(() => {
        return nodes.filter((node: Node) => node.selected).map((node: Node) => node.id)
    }, [nodes]);

    const selectedRelationshipIds: string[] = useMemo(() => {
        return relationships.filter((relationship: RelationshipType) =>
            selectedTableIds.includes(relationship.sourceTableId) ||
            selectedTableIds.includes(relationship.targetTableId)
        ).map((relationship: RelationshipType) => relationship.id);
    }, [selectedTableIds, relationships]);

    
    useEffect(() => {
        setEdges((edges: any) => {
            return edges.map((edge: any) => {
                const selected: boolean = selectedRelationshipIds.includes(edge.id);
                return {
                    ...edge , 
                    animated : selected , 
                 
                } as Edge 
            })

        })
    }, [setEdges, selectedRelationshipIds])
    return (
        <div className="w-full h-screen flex">

            <DBController />
            <ReactFlow
                nodes={nodes}
                edges={edges}
                fitView
                className="w-full h-full nodes-animated"
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

            >

                <Controls />
                <Background className="bg-default/30" />
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