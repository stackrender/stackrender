import { Table as TableType } from "@/lib/interfaces/table";
import { addEdge, applyEdgeChanges, applyNodeChanges, Background, Controls, MiniMap, ReactFlow, useEdgesState, useNodesState, useReactFlow } from "@xyflow/react";
import { useCallback, useMemo } from "react";
import Table from "./table/table";

import '@xyflow/react/dist/style.css';
import { Relationship } from "./table/relationship";
import DBController from "./db-controller/db-controller";
import { useQuery } from "@powersync/react";

interface DatabaseProps {
    initialTables?: TableType
}


const initialNodes = [
    {
        id: '1', type: "table", position: { x: 500, y: 500 }, data: {

            table: {
                id: "1",
                name: "users",
                fields: [
                    {
                        id: 'e5n46eojbyxpg65pb1sesysi2',
                        name: 'id',
                        type: {
                            id: 'integer',
                            name: 'integer',
                        },
                        primaryKey: true,
                        unique: true,
                        nullable: false,
                        createdAt: Date.now(),
                    },
                    {
                        id: '7nbmg2bt6dzltr8rfouxctdlc',
                        name: 'reservation_id',
                        type: {
                            id: 'integer',
                            name: 'integer',
                        },
                        primaryKey: false,
                        unique: false,
                        nullable: true,
                        createdAt: Date.now(),
                    },
                    {
                        id: 'f9kcpflp010xe5ad3rmexla63',
                        name: 'rating',
                        type: {
                            id: 'integer',
                            name: 'integer',
                        },
                        primaryKey: false,
                        unique: false,
                        nullable: false,
                        createdAt: Date.now(),
                    },
                    {
                        id: '3znekob0pqusyvdoq14nhlvgo',
                        name: 'comment',
                        type: {
                            id: 'character_varying',
                            name: 'character varying',
                        },
                        primaryKey: false,
                        unique: false,
                        nullable: true,
                        createdAt: Date.now(),
                    },
                ],
            }
        },
        style: { width: 224 }
    },

    {
        id: '2', type: "table", position: { x: 200, y: 500 }, data: {

            table: {
                id: "1",
                name: "products",
                fields: [
                    {
                        id: 'e5n46eojbyxpg65pb1sesysi2',
                        name: 'id',
                        type: {
                            id: 'integer',
                            name: 'integer',
                        },
                        primaryKey: true,
                        unique: true,
                        nullable: false,
                        createdAt: Date.now(),
                    },
                    {
                        id: '7nbmg2bt6dzltr8rfouxctdlc',
                        name: 'user_id',
                        type: {
                            id: 'integer',
                            name: 'integer',
                        },
                        primaryKey: false,
                        unique: false,
                        nullable: true,
                        createdAt: Date.now(),
                    },
                    {
                        id: 'f9kcpflp010xe5ad3rmexla63',
                        name: 'rating',
                        type: {
                            id: 'integer',
                            name: 'integer',
                        },
                        primaryKey: false,
                        unique: false,
                        nullable: false,
                        createdAt: Date.now(),
                    },
                    {
                        id: 'f9kcpflp010xe5ad3rmexla63',
                        name: 'rating',
                        type: {
                            id: 'integer',
                            name: 'integer',
                        },
                        primaryKey: false,
                        unique: false,
                        nullable: false,
                        createdAt: Date.now(),
                    },
                    {
                        id: 'f9kcpflp010xe5ad3rmexla63',
                        name: 'rating',
                        type: {
                            id: 'integer',
                            name: 'integer',
                        },
                        primaryKey: false,
                        unique: false,
                        nullable: false,
                        createdAt: Date.now(),
                    },
                    {
                        id: '3znekob0pqusyvdoq14nhlvgo',
                        name: 'comment',
                        type: {
                            id: 'character_varying',
                            name: 'character varying',
                        },
                        primaryKey: false,
                        unique: false,
                        nullable: true,
                        createdAt: Date.now(),
                    },
                ],
            }
        },
        style: { width: 224 }
    },
];

const initialEdges: any[] = [];


const edgeTypes = {
    'relationship-edge': Relationship,
};

const DatabasePage: React.FC<DatabaseProps> = ({ initialTables }) => {

    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

    const { data  , isLoading , error ,  isFetching  } = useQuery('SELECT *  FROM data_types ;' );


    console.log (data)

    const nodeTypes = useMemo(() => ({ table: Table }), []);
    const onConnect = useCallback((params: any) => setEdges((eds) => addEdge(params, eds)), [setEdges]);


    return (
        <div className="w-full h-screen flex">
            <DBController/>
            <ReactFlow
                nodes={nodes}
                edges={edges}
                fitView
                className="w-full h-full"
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                defaultEdgeOptions={{
                    animated: false,
                    type: 'relationship-edge',
                }}

                panOnDrag={true}
                zoomOnScroll={true}
                nodeTypes={nodeTypes}
                edgeTypes={edgeTypes}

            >

                <Controls />
                <Background className="bg-default/10" />
            </ReactFlow>
        </div>
    )
}


export default DatabasePage; 