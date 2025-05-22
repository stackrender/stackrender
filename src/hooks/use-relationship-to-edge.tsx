
import { RelationshipType } from "@/lib/schemas/relationship-schema";
import { LEFT_PREFIX, TARGET_PREFIX } from "@/pages/database/table/field";
import { Edge, useReactFlow } from "@xyflow/react";
import { useEffect } from "react";
import hash from 'object-hash';
export const useRelationshipToEdge = (relationships: RelationshipType[]): void => {
    const { setEdges } = useReactFlow();
    useEffect(() => {

        const relationshipEdges = relationships.map((relationship: RelationshipType) => {
            return {
                id: relationship.id,
                source: relationship.sourceTableId,
                sourceHandle: LEFT_PREFIX + relationship.sourceFieldId,
                target: relationship.targetTableId,
                targetHandle: TARGET_PREFIX + relationship.targetFieldId,
                selected: false , 
                animated : false , 
                data: {
                    relationship
                }
            } as Edge
        })


        setEdges((edges: any) => {
            
            return relationshipEdges.map((relationshipEdge: any) => {
                const edge = edges.find((edge: Edge) => edge.id == relationshipEdge.id);
                if (!edge)
                    return relationshipEdge;

                const relationshipEdgeHash: string = hash(relationshipEdge);
                const edgeHash: string = hash(edge);

                return relationshipEdgeHash == edgeHash ? edge : relationshipEdge;
            })
        });
    }, [relationships])

}