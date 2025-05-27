import { DatabaseType } from "@/lib/schemas/database-schema"; 
import { createContext } from "react";

 

export interface DatabaseHistoryContextType {
    
    undo: () => void;
    redo: () => void;

    canUndo : boolean ; 
    canRedo : boolean ; 
    isProcessing : boolean ; 

    present : DatabaseType  ; 

}



export default createContext<DatabaseHistoryContextType>({} as DatabaseHistoryContextType);