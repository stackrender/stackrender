
/*
import { useCallback, useContext, useState } from "react"
import { ModalContext, Modals } from "./modal-contxet"
import Modal, { ModalProps } from "@/components/modal/modal";
import { useDisclosure } from "@heroui/react";

interface Props { children: React.ReactNode }
interface CurrentModalProps {
    modal: Modals,
    modalProps: ModalProps,
    content?: any
}

const ModalProvider: React.FC<Props> = ({ children }) => {
    const { isOpen, onOpen } = useDisclosure();
    const [currentModal, setCurrentModal] = useState<CurrentModalProps | undefined>(undefined);

    const onOpenChange = useCallback(() => {
        onOpen();
        setCurrentModal(undefined);
    }, [onOpen]);

 

    return (
        <ModalContext.Provider>
            {
                currentModal &&
                <Modal isOpen={isOpen} {...currentModal.modalProps}  onOpenChange={onOpenChange} >

                </Modal>
            }
            {children}
        </ModalContext.Provider>
    )
}


export const useModal = () => useContext(ModalContext); 

*/