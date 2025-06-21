

import { useCallback, useContext, useState } from "react"
import { ModalContext, Modals } from "./modal-contxet"
import { useDisclosure } from "@heroui/react";
import CreateRelationshipModal from "@/pages/database/modals/create-relationship-modal";
import { CreateDatabaseModal } from "@/pages/database/modals/create-database-modal";
import OpenDatabaseModal from "@/pages/database/modals/open-database-modal";
import DeleteDatabaseModal from "@/pages/database/modals/delete-database-modal";
import ImportDatabaseModal from "@/pages/database/modals/import-database";


interface Props { children: React.ReactNode }
interface CurrentModalProps {
    modal: Modals,
    props?: any,

}

export const ModalProvider: React.FC<Props> = ({ children }) => {

    const [currentModal, setCurrentModal] = useState<CurrentModalProps | undefined>(undefined);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const open = useCallback((modal: Modals, props?: any) => {

        setCurrentModal({
            modal,
            props
        });
        onOpen();
    }, []);

    const onOpenChange = (isOpen: boolean) => {
        if (!isOpen) {
            onClose();
            setCurrentModal(undefined);
        }
    }

    return (
        <ModalContext.Provider value={{
            open
        }}
        >
            {
                currentModal ? (
                    currentModal.modal == Modals.CREATE_RELATIONSHIP &&
                    <CreateRelationshipModal {...currentModal.props} onOpenChange={onOpenChange} isOpen={isOpen} />
                    ||
                    currentModal.modal == Modals.CREATE_DATABASE &&
                    <CreateDatabaseModal {...currentModal.props} onOpenChange={onOpenChange} isOpen={isOpen} />
                    ||
                    currentModal.modal == Modals.OPEN_DATABASE &&
                    <OpenDatabaseModal {...currentModal.props} onOpenChange={onOpenChange} isOpen={isOpen} />
                    ||
                    currentModal.modal == Modals.DELETE_DATABASE &&
                    <DeleteDatabaseModal {...currentModal.props} onOpenChange={onOpenChange} isOpen={isOpen} />
                    ||
                    (currentModal.modal == Modals.IMPORT_DATABASE ) &&
                    <ImportDatabaseModal {...currentModal.props} onOpenChange={onOpenChange} isOpen={isOpen} />
                ) : undefined

}
            {children}
        </ModalContext.Provider>
    )
}


export const useModal = () => useContext(ModalContext);

