import { createContext  } from "react";


export enum Modals {
    CREATE_RELATIONSHIP = "CREATE_RELATIONSHIP"
}






interface ModalContextType {
    focusedTableId: string | undefined;
    focusedRelationshipId: string | undefined;
}

export const ModalContext = createContext<ModalContextType>({} as ModalContextType);
