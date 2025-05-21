import { Edge, useStore } from "@xyflow/react";
import { useEffect, useState } from "react";
import hash from 'object-hash';





const useGetRelatedEdges = ( nodeId : string) => {
    const edges = useStore((store) => store.edges) as Edge[];
    const [relatedEdges, setRelatedEdges] = useState<Edge[]>([]);

    useEffect(() => {
        const newRelatedEdges: Edge[] = edges.filter((edge: Edge) => edge.source == nodeId || edge.target == nodeId);
        setRelatedEdges((previousEdges :Edge[]) => {
            return hash(newRelatedEdges) == hash(previousEdges) ? previousEdges : newRelatedEdges 
        })
    }, [edges, nodeId])

    return relatedEdges
}   


export default useGetRelatedEdges; 