import { useCallback, useContext, useEffect, useMemo, useState } from "react";
 
import { FitViewOptions, useReactFlow } from "@xyflow/react";
import { useNavigate } from "react-router-dom";
import { RelationshipType } from "@/lib/schemas/relationship-schema";
import DiagramContext from "./diagram-context";



interface Props { children: React.ReactNode }

const DiagramProvider: React.FC<Props> = ({ children }) => {

    const { setNodes, fitView, setEdges } = useReactFlow();
    const navigate = useNavigate();
    const [focusedTableId, setFocusedTableId] = useState<string | undefined>(undefined)
    const [focusedRelationshipId, setFocusedRelationshipId] = useState<string | undefined>(undefined)
    const [isConnectionInProgress , setIsConnectionInProgress] = useState<boolean>( false) ; 

    const focusOnTable = useCallback((id: string, transition: boolean = false) => {
        navigate("/database/tables");

        setNodes((nodes) =>
            nodes.map((node) => {
                const selected: boolean = node.id === id;
                if (selected && transition) {
                    fitView({
                        duration: 500,
                        maxZoom: 1,
                        minZoom: 1,
                        nodes: [{
                            id,
                        }],
                    });
                }
                return {
                    ...node,
                    selected,
                }
            })
        );
        setFocusedTableId(id);
    }, [setFocusedTableId])


    const focusOnRelationship = useCallback((id: string, transition: boolean = false) => {
          navigate("/database/relationships");
        setFocusedRelationshipId(id);

        setEdges((edges) =>
            edges.map((edge) => {
                const selected: boolean = edge.id === id;

                if (selected && transition) {
                    fitView({
                        duration: 500,
                        maxZoom: 1,
                        minZoom: 1,
                        nodes: [{
                            id: (edge.data?.relationship as RelationshipType).sourceTableId
                        }, {
                            id: (edge.data?.relationship as RelationshipType).targetTableId
                        }]
                    });
                }
                return {
                    ...edge,
                    selected
                }
            })
        )

    }, [setFocusedRelationshipId]);


    const contextValue = useMemo(() => ({
        focusedTableId,
        focusedRelationshipId,
        isConnectionInProgress , 
        focusOnTable,
        focusOnRelationship , 
        setIsConnectionInProgress 
    }), [focusedTableId, focusedRelationshipId, focusOnTable, focusOnRelationship , isConnectionInProgress , setIsConnectionInProgress ]);
    return (
        <DiagramContext.Provider
            value={contextValue}
        >
            {children}
        </DiagramContext.Provider>
    )

}


export const useDiagram = () => useContext(DiagramContext);


export default DiagramProvider; 