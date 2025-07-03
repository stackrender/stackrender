import { createContext } from "react";


export enum Modals {
    CREATE_RELATIONSHIP = "CREATE_RELATIONSHIP",
    CREATE_DATABASE = "CREATE_DATABASE" , 
    OPEN_DATABASE = "OPEN_DATABASE" , 
    DELETE_DATABASE = "DELETE_DATABASE" , 
    IMPORT_DATABASE = "IMPOR_DATABASE" , 
    EXPORT_SQL = "EXPORT_SQL" 
}

interface ModalContextType {
    open: (modal: Modals, props?: any) => void
}

export const ModalContext = createContext<ModalContextType>({} as ModalContextType);
