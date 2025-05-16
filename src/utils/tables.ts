import { RelationshipType } from "@/lib/schemas/relationship-schema";
import { TableType } from "@/lib/schemas/table-schema";
import { Node } from "@xyflow/react";

import ELK from "elkjs/lib/elk.bundled.js";

const elk = new ELK();

const adjustTablesPositions = async (
    nodes: Node[],
    relationships: RelationshipType[]
): Promise<TableType[]> => {

    // Extract tables (same as before)
    const tables: TableType[] = nodes.map((node: Node) => node.data.table) as TableType[];

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
            height: node.measured?.height ?? 150,
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
            table.posX = node.x || 0 + (node.width / 2) + 112;  // 112 = half your fixed width
            table.posY = node.y || 0 + (node.height / 2) + 75;  // 75 = half your fixed height
        }
    });

    return tables;
};


export {
    adjustTablesPositions,

}