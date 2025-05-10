
import React, { ReactNode } from "react";
import {
    Modal as HeroUiModal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    useDraggable,
} from "@heroui/react";
import { useTranslation } from "react-i18next";


interface ModalProps {
    isOpen?: boolean,
    onOpenChange: (open: boolean) => void,
    className?: string,
    backdrop?: "blur" | "transparent" | "opaque",
    title: string,
    children: ReactNode,
    actionName?: string,
    actionHandler?: () => void , 
    isDisabled? : boolean  

}

const Modal: React.FC<ModalProps> = ({ isOpen, onOpenChange, className, backdrop = "opaque", title, children, actionName = "Action" , actionHandler , isDisabled}) => {


    const targetRef = React.useRef(null);
    const { moveProps } = useDraggable({ targetRef, canOverflow: true, isDisabled: !isOpen });

    const {t} = useTranslation() ; 

    const handleAction = (onClose: () => void) => {
        actionHandler && actionHandler() ; 
        onClose()
    }
    return (
        <HeroUiModal
            ref={targetRef}
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            className={className}
            backdrop={backdrop}
            radius="sm"
            
        >
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader {...moveProps} className="flex flex-row gap-1" >
                            {title}
                        </ModalHeader>
                        <ModalBody>
                            {children}
                        </ModalBody>
                        <ModalFooter>
                            <div className="flex  w-full justify-between">
                                <Button color="danger" variant="light" onPress={onClose} size="sm">
                                    {t("modal.close")}
                                </Button>
                                <Button color="primary" onPress={() => handleAction(onClose)} size="sm" isDisabled={isDisabled}>
                                    {actionName}
                                </Button>
                            </div>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </HeroUiModal>
    )

}


export default Modal; 
