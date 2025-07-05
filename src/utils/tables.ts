import { FieldType } from "@/lib/schemas/field-schema";
import { RelationshipType } from "@/lib/schemas/relationship-schema";
import { TableType } from "@/lib/schemas/table-schema";
import { Node } from "@xyflow/react";

import ELK from "elkjs/lib/elk.bundled.js";
import { cloneField } from "./field";
import { v4 } from "uuid";
import { getTimestamp } from "./utils";
import { SortableTable } from "@/lib/table";


const elk = new ELK();

const adjustTablesPositions = async (
    nodes: Node[],
    relationships: RelationshipType[]
): Promise<TableType[]> => {

    // Extract tables (same as before)
    const tables: TableType[] = nodes.map((node: Node) => (
        { ...node.data.table as TableType }
    )) as TableType[];
    // Build the ELK graph structure
    const graph = {
        id: "root",
        layoutOptions: {
            'elk.algorithm': 'layered',
            'elk.layered.spacing.nodeNodeBetweenLayers': '100',
            'elk.spacing.nodeNode': '80',

        },
        children: nodes.map((node) => ({
            id: node.id,
            width: node.measured?.width ?? 224,
            height: node.measured?.height ?? ((node.data?.table as TableType)?.fields?.length * 32 + 36),
        })),
        edges: relationships.map((rel) => ({
            id: `${rel.sourceTableId}->${rel.targetTableId}`,
            sources: [rel.sourceTableId],
            targets: [rel.targetTableId],
        })),
    };
    // Run ELK layout (async)
    const layoutedGraph = await elk.layout(graph);
    // Map positions back to your tables
    tables.forEach((table) => {
        const node = layoutedGraph?.children?.find((n) => n.id === table.id);
        if (node) {
            // ELK positions are top-left, adjust to center like before
            table.posX = (node.x || 0);
            table.posY = (node.y || 0);
        }
    });
    return tables;
};

const isTablesOverlapping = (tableA: TableType, tableB: TableType) => {
    const tableAWidth: number = 224;
    const tableAHeight: number = tableA.fields.length * 32 + 36;


    const tableBWidth: number = 224;
    const tableBHeight: number = tableB.fields.length * 32 + 36;

    const a = {
        left: tableA.posX,
        right: tableA.posX + tableAWidth,
        top: tableA.posY,
        bottom: tableA.posY + tableAHeight,
    };

    const b = {
        left: tableB.posX,
        right: tableB.posX + tableBWidth,
        top: tableB.posY,
        bottom: tableB.posY + tableBHeight,
    };

    return !(a.right <= b.left || a.left >= b.right || a.bottom <= b.top || a.top >= b.bottom);
}


const getDefaultTableOverlapping = (table: TableType, tables: TableType[]): boolean => {
    for (let index: number = 0; index < tables.length; index++) {
        if (table.id == tables[index].id) continue;
        if (isTablesOverlapping(table, tables[index]))
            return true;
    }
    return false;
}



const cloneTable = (table: TableType): TableType => {

    return {
        ...table,
        id: v4(),
        name: `${table.name}_copy`,
        fields: table.fields.map((field: FieldType) => cloneField(field)),
        posX: table.posX - 360,

        createdAt: getTimestamp()
    }
}



function orderTables(tables: SortableTable[]): string[] {
 
    // Build adjacency list and in-degree count
    const graph = new Map();
    const inDegree = new Map();

    // Initialize graph and in-degree map
    tables.forEach(({ tableId, relationships }) => {
        graph.set(tableId, new Set());
        inDegree.set(tableId, 0);
    });

    // Populate the graph and in-degree map
    tables.forEach(({ tableId, relationships }) => {
        relationships.forEach(fk => {
            if (graph.has(fk)) {
                graph.get(fk).add(tableId);
                inDegree.set(tableId, (inDegree.get(tableId) || 0) + 1);
            }
        });
    });

    // Find tables with no dependencies (in-degree = 0)
    const queue: string[] = [];
    inDegree.forEach((count, table) => {
        if (count === 0) queue.push(table);
    });

    // Process tables in topological order
    const sortedOrder: string[] = [];
    while (queue.length > 0) {
        const table = queue.shift();
        sortedOrder.push(table as string);

        // Reduce in-degree of dependent tables
        graph.get(table).forEach((dependent: string) => {
            inDegree.set(dependent, inDegree.get(dependent) - 1);
            if (inDegree.get(dependent) === 0) {
                queue.push(dependent);
            }
        });
    }

    
 
    // If not all tables are processed, a cycle exists
    if (sortedOrder.length !== tables.length) {
        const visited = new Set<string>();
        const onStack = new Set<string>();
        const path: string[] = [];
        let cycle: string[] = [];

        function dfs(node: string): boolean {
            visited.add(node);
            onStack.add(node);
            path.push(node);

            for (const neighbor of graph.get(node)!) {
                if (!visited.has(neighbor)) {
                    if (dfs(neighbor)) return true;
                } else if (onStack.has(neighbor)) {
                    // Found the cycle
                    const cycleStartIndex = path.indexOf(neighbor);
                    cycle = path.slice(cycleStartIndex);
                    cycle.push(neighbor); // close the loop
                    return true;
                }
            }

            onStack.delete(node);
            path.pop();
            return false;
        }

        for (const node of graph.keys()) {
            if (!visited.has(node)) {
                if (dfs(node)) break;
            }
        }

        
        throw {
            success: false,
            message: "Cycle detected",
            cycle: cycle,
        };
    }


    return sortedOrder;
}






export {
    adjustTablesPositions,
    getDefaultTableOverlapping,
    isTablesOverlapping,
    cloneTable,
    orderTables

}