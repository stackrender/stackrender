import { CardinalityStyle } from "@/lib/database";
import { createContext, Dispatch  } from "react";


interface DiagramDataContextType {
    focusedTableId: string | undefined;
    focusedRelationshipId: string | undefined;
}

interface DiagramOpsContextType {
    focusOnTable: (id: string, transition?: boolean) => void,
    focusOnRelationship: (id: string, transition?: boolean , withNavigate? : boolean) => void,
    setIsConnectionInProgress: Dispatch<boolean>,
    isConnectionInProgress: boolean ,
    showController : boolean  , 
    setShowController : ( value : boolean ) => void ,  
    cardinalityStyle : CardinalityStyle , 
    setCardinalityStyle : (style : CardinalityStyle) => void  


}


export const DiagramDataContext = createContext<DiagramDataContextType>({} as DiagramDataContextType);
export const DiagramOpsContext = createContext<DiagramOpsContextType>({} as DiagramOpsContextType);