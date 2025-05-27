

import { Cardinality, RelationshipType } from "@/lib/schemas/relationship-schema";
import {  useDiagramOps } from "@/providers/diagram-provider/diagram-provider";
import {  cn } from "@heroui/react";
import { Edge, EdgeProps,  getSmoothStepPath, Position, useReactFlow } from "@xyflow/react";
import React, {  useMemo } from "react";

 


export type RelationshipProps = Edge<{
    relationship: RelationshipType,
    selected?: boolean
}, 'relationship-edge'>

const Relationship: React.FC<EdgeProps<RelationshipProps>> = (props) => {

    let { id, sourceX, sourceY, targetX, targetY, source, target, selected, data, animated } = props;
    const { getInternalNode, getEdge } = useReactFlow();
    const { focusOnRelationship } = useDiagramOps();


    const sourceNode = getInternalNode(source);
    const targetNode = getInternalNode(target);
    const edge = getEdge(id);

    const sourceHandle: 'left' | 'right' = edge?.sourceHandle?.startsWith?.(
        "right_"
    )
        ? 'right'
        : 'left';

    const sourceWidth = sourceNode?.measured.width ?? 0;
    const sourceLeftX = sourceHandle === 'left' ? sourceX + 6 : sourceX - sourceWidth - 10;
    const sourceRightX = sourceHandle === 'left' ? sourceX + sourceWidth + 10 : sourceX;

    const targetWidth = targetNode?.measured.width ?? 0;
    const targetLeftX = targetX - 2;
    const targetRightX = targetX + targetWidth + 3;



    const { sourceSide, targetSide } = useMemo(() => {
        const distances = {
            leftToLeft: Math.abs(sourceLeftX - targetLeftX),
            leftToRight: Math.abs(sourceLeftX - targetRightX),
            rightToLeft: Math.abs(sourceRightX - targetLeftX),
            rightToRight: Math.abs(sourceRightX - targetRightX),
        };

        const minDistance = Math.min(
            distances.leftToLeft,
            distances.leftToRight,
            distances.rightToLeft,
            distances.rightToRight
        );

        const minDistanceKey = Object.keys(distances).find(
            (key) => distances[key as keyof typeof distances] === minDistance
        ) as keyof typeof distances;

        switch (minDistanceKey) {
            case 'leftToRight':
                return { sourceSide: 'left', targetSide: 'right' };
            case 'rightToLeft':
                return { sourceSide: 'right', targetSide: 'left' };
            case 'rightToRight':
                return { sourceSide: 'right', targetSide: 'right' };
            default:
                return { sourceSide: 'left', targetSide: 'left' };
        }
    }, [sourceLeftX, sourceRightX, targetLeftX, targetRightX]);

    const [edgePath] = useMemo(
        () =>
            getSmoothStepPath({
                sourceX: sourceSide === 'left' ? sourceLeftX : sourceRightX,
                sourceY,
                targetX: targetSide === 'left' ? targetLeftX : targetRightX,
                targetY,
                borderRadius: 6,
                sourcePosition:
                    sourceSide === 'left' ? Position.Left : Position.Right,
                targetPosition:
                    targetSide === 'left' ? Position.Left : Position.Right,

            }),
        [
            sourceSide,
            targetSide,
            sourceLeftX,
            sourceRightX,
            targetLeftX,
            targetRightX,
            sourceY,
            targetY,

        ]
    );
    const { startMarker, endMarker } = useMemo(() => {
        const cardinality: Cardinality = data?.relationship.cardinality as Cardinality;
        if (cardinality) {
            const cardinalities: string[] = cardinality.split("_to_");
            return {
                startMarker: `${cardinalities[0]}_${"start"}${selected ? "_selected" : ""}`,
                endMarker: `${cardinalities[1]}_${"end"}${selected ? "_selected" : ""}`
            }
        }
        return {
            startMarker: `${"one"}_${"start"}${selected ? "_selected" : ""}`,
            endMarker: `${"many"}_${"end"}${selected ? "_selected" : ""}`
        }
    }, [data?.relationship.cardinality, selected]);


    return (
        <>

            <path
                id={id}
                d={edgePath}
                markerStart={`url(#${startMarker})`}
                markerEnd={`url(#${endMarker})`}
                fill="none"
                className={cn([

                    `!stroke-2  ${selected ? '!stroke-primary' : 'stroke-slate-300 dark:stroke-default-500'}`,


                ])}
                onClick={(e) => {
                    if (e.detail === 2) {
                        focusOnRelationship(data?.relationship.id as string);
                    }
                }}
                style={{
                    strokeDasharray: (selected || animated) ? '5, 5' : '0',
                    animation: (selected || animated) ? 'dash 0.5s linear infinite' : 'none',
                }}
            />

            <path
                d={edgePath}
                fill="none"
                strokeOpacity={0}
                strokeWidth={16}

                className="react-flow__edge-interaction"
                onClick={(e) => {
                    if (e.detail === 2) {
                        focusOnRelationship(data?.relationship.id as string);
                    }
                }}
            />

        </>)
}

export default React.memo(Relationship);

/*





  

   

*/