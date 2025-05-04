import { Relationship as RelationshipType } from "@/lib/interfaces/relationship";
import { cn } from "@heroui/react";
import { Edge, EdgeProps, getSmoothStepPath, Position, useReactFlow } from "@xyflow/react";
import { useMemo } from "react";




export type RelationshipProps = Edge<{
    relationship: RelationshipType,
    selected?: boolean
}, 'relationship-edge'>

export const Relationship: React.FC<EdgeProps<RelationshipProps>> = ({
    id,
    sourceX,
    sourceY,
    targetX,
    targetY,
    source,
    target,
    selected,
    data,
}) => {
    const { getInternalNode, getEdge } = useReactFlow();
    //const { openRelationshipFromSidebar, selectSidebarSection } = useLayout();
    //const { checkIfRelationshipRemoved, checkIfNewRelationship } = useDiff();

    const sourceNode = getInternalNode(source);
    const targetNode = getInternalNode(target);
    const edge = getEdge(id);

    const sourceHandle: 'left' | 'right' = edge?.sourceHandle?.startsWith?.(
        "right-"
    )
        ? 'right'
        : 'left';

    const sourceWidth = sourceNode?.measured.width ?? 0;
    const sourceLeftX =
        sourceHandle === 'left' ? sourceX + 3 : sourceX - sourceWidth - 10;
    const sourceRightX =
        sourceHandle === 'left' ? sourceX + sourceWidth + 9 : sourceX;

    const targetWidth = targetNode?.measured.width ?? 0;
    const targetLeftX = targetX - 1;
    const targetRightX = targetX + targetWidth + 10;

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
                borderRadius: 14,
                sourcePosition:
                    sourceSide === 'left' ? Position.Left : Position.Right,
                targetPosition:
                    targetSide === 'left' ? Position.Left : Position.Right,
             //   offset: (edgeNumber + 1) * 14,
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
         //   edgeNumber,
        ]
    );
    return (
        <>
            <path
                id={id}
                d={edgePath}
                //markerStart={`url(#${sourceMarker})`}
                //markerEnd={`url(#${targetMarker})`}
                fill="none"
                className={cn([
                    'react-flow__edge-path',
                    `!stroke-2 ${selected ? '!stroke-pink-600' : '!stroke-slate-400'}`,

                ])}
                onClick={(e) => {
                    if (e.detail === 2) {
                        console.log("hello world");
                        //                        openRelationshipInEditor();
                    }
                }}
            />
            <path
                d={edgePath}
                fill="none"
                strokeOpacity={0}
                strokeWidth={20}
                // eslint-disable-next-line tailwindcss/no-custom-classname
                className="react-flow__edge-interaction"
                onClick={(e) => {
                    if (e.detail === 2) {
                        //                      openRelationshipInEditor();
                    }
                }}
            />
        </>)
}