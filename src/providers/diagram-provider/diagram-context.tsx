import { createContext, Dispatch, SetStateAction } from "react";


interface DiagramDataContextType {
    focusedTableId: string | undefined;
    focusedRelationshipId: string | undefined;
    isConnectionInProgress: boolean
}

interface DiagramOpsContextType {
    focusOnTable: (id: string, transition?: boolean) => void,
    focusOnRelationship: (id: string, transition?: boolean) => void,
    setIsConnectionInProgress: Dispatch<boolean>
}


export const DiagramDataContext = createContext<DiagramDataContextType>({} as DiagramDataContextType);
export const DiagramOpsContext = createContext<DiagramOpsContextType>({} as DiagramOpsContextType);