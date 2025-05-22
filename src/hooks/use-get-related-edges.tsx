import { Edge, useReactFlow, useStore } from "@xyflow/react";
import { useEffect, useState } from "react";
import hash from 'object-hash';





const useGetRelatedEdges = (nodeId: string) => {
   
    const [relatedEdges, setRelatedEdges] = useState<Edge[]>([]);
    const { getEdges } = useReactFlow();

    const edges = getEdges();
    
    
    useEffect(() => {

        const newRelatedEdges: Edge[] = edges.filter((edge: Edge) => edge.source == nodeId || edge.target == nodeId);
        if (hash(newRelatedEdges) != hash(relatedEdges)) {
            setRelatedEdges(newRelatedEdges)
        }

    }, [edges, nodeId])

    return relatedEdges
}


export default useGetRelatedEdges; 