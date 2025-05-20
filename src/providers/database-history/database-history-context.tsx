import { DatabaseType } from "@/lib/schemas/database-schema";
import { RelationshipType } from "@/lib/schemas/relationship-schema";
import { TableType } from "@/lib/schemas/table-schema";
import { createContext, Dispatch, SetStateAction } from "react";

 

export interface DatabaseHistoryContextType {
    
    undo: () => void;
    redo: () => void;

    canUndo : boolean ; 
    canRedo : boolean ; 

    present : DatabaseType  ; 

}



export default createContext<DatabaseHistoryContextType>({} as DatabaseHistoryContextType);