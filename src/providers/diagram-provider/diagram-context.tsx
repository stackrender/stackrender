import { createContext, Dispatch, SetStateAction } from "react";


export interface DiagramContextType { 

    focusedTableId : string | undefined ; 
    focusedRelationshipId : string | undefined; 
    isConnectionInProgress : boolean 
    
    focusOnTable : ( id : string , transition? : boolean )  => void ,
    focusOnRelationship :  ( id : string, transition? : boolean ) => void ,  
    setIsConnectionInProgress : Dispatch<boolean>

} 



export default createContext<DiagramContextType>({} as DiagramContextType);