import { FieldType } from "@/lib/schemas/field-schema";
import { RelationshipType } from "@/lib/schemas/relationship-schema";
import { TableType } from "@/lib/schemas/table-schema";
import { Node } from "@xyflow/react";

import ELK from "elkjs/lib/elk.bundled.js";
import { cloneField } from "./field";
import { v4 } from "uuid";
import { getTimestamp } from "./utils";

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
            height: node.measured?.height ?? 150,
        })),
        edges: relationships.map((rel) => ({
            id: `${rel.sourceTableId}->${rel.targetTableId}`,
            sources: [rel.sourceTableId],
            targets: [rel.targetTableId],
        })),
    };
    console.log (graph.children ) ; 
    // Run ELK layout (async)
    const layoutedGraph = await elk.layout(graph);

    // Map positions back to your tables
    tables.forEach((table) => {
        const node = layoutedGraph?.children?.find((n) => n.id === table.id);
        if (node) {
            // ELK positions are top-left, adjust to center like before
            table.posX = node.x || 0 + (node.width / 2) + 112;  
            table.posY = node.y || 0 + (node.height / 2) + 75;   
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
        if ( table.id == tables[index].id) continue ; 
        if (isTablesOverlapping(table, tables[index]))
            return true;
    }
    return false;
}



const cloneTable = ( table: TableType) : TableType => {

    return {
        ...table , 
        id : v4() , 
        name : `${table.name}_copy` , 
        fields : table.fields.map((field : FieldType) => cloneField(field)) , 
        posX : table.posX - 360 ,
        
        createdAt : getTimestamp() 

    }

}

export {
    adjustTablesPositions,
    getDefaultTableOverlapping , 
    isTablesOverlapping , 
    cloneTable

}