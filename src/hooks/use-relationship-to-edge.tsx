
import { RelationshipType } from "@/lib/schemas/relationship-schema";
import { LEFT_PREFIX, TARGET_PREFIX } from "@/pages/database/table/field";

import { Edge, useReactFlow } from "@xyflow/react";
import { useEffect } from "react";

export const useRelationshipToEdge = (relationships: RelationshipType[]): void => {
    const { setEdges } = useReactFlow();
    useEffect(() => {
        const edges = relationships.map((relationship: RelationshipType) => {
            return {
                id: relationship.id,
                source: relationship.sourceTableId,
                sourceHandle: LEFT_PREFIX + relationship.sourceFieldId,
                target: relationship.targetTableId,
                targetHandle: TARGET_PREFIX + relationship.targetFieldId,
                data : { 
                    relationship 
                }
            } as Edge
        })
        setEdges(edges)
    }, [relationships])

}