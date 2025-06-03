import { createContext } from "react";


export enum Modals {
    CREATE_RELATIONSHIP = "CREATE_RELATIONSHIP",
    CREATE_DATABASE = "CREATE_DATABASE" , 
    OPEN_DATABASE = "OPEN_DATABASE" , 
    DELETE_DATABASE = "DELETE_DATABASE"
}

interface ModalContextType {
    open: (modal: Modals, props?: any) => void
}

export const ModalContext = createContext<ModalContextType>({} as ModalContextType);
