
import React, { ReactNode, useState } from "react";
import {
    Modal as HeroUiModal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    useDraggable,
    cn,
} from "@heroui/react";
import { useTranslation } from "react-i18next";


export interface ModalProps {
    isOpen?: boolean,
    onOpenChange?: (open: boolean) => void,
    className?: string,
    backdrop?: "blur" | "transparent" | "opaque",
    title: string,
    children: ReactNode,
    actionName?: string,
    actionHandler?: () => void,
    isDisabled?: boolean,
    header?: string,
    variant?: "default" | "danger",
    closable?: boolean
}

const Modal: React.FC<ModalProps> = ({ isOpen, onOpenChange, className, backdrop = "opaque", title, children, actionName = "Action", header, actionHandler, isDisabled, variant = "default", closable = true }) => {


    const targetRef = React.useRef(null);
    const { moveProps } = useDraggable({ targetRef, canOverflow: true, isDisabled: !isOpen });
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const { t } = useTranslation();

    const handleAction = async (onClose: () => void) => {
        setIsLoading(true)
        actionHandler && await actionHandler();
        setIsLoading(false);
    }
    return (
        <HeroUiModal
            ref={targetRef}
            isOpen={isOpen}
            onOpenChange={onOpenChange && closable ? onOpenChange : undefined}
            className={className}
            backdrop={backdrop}
            radius="sm"

            classNames={{
                base: "dark:bg-background-100",
                closeButton: cn("dark:bg-background-100 dark:hover:bg-background rounded-md" , !closable ? "hidden" : "")
            }}

        >
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader {...moveProps} className=" flex flex-col gap-1" >

                            {title}
                            {
                                header &&
                                <p className="text-sm text-font/70 block">
                                    {header}
                                </p>
                            }
                        </ModalHeader>
                        <ModalBody>
                            {children}
                        </ModalBody>
                        <ModalFooter>
                            <div className="flex  w-full justify-between">
                                {
                                    variant == "default" &&
                                    <>
                                        {
                                            closable &&
                                            <Button color="danger" variant="light" onPress={onClose} size="sm">
                                                {t("modals.close")}
                                            </Button>
                                        }
                                        { 
                                            !closable && <div></div>
                                        }
                                        <Button color="primary" onPress={() => handleAction(onClose)} size="sm" isDisabled={isDisabled || isLoading} isLoading={isLoading}>
                                            {actionName}
                                        </Button>
                                    </>
                                }
                                {
                                    variant == "danger" &&
                                    <>
                                        {
                                            closable &&
                                            <Button color="default" variant="light" onPress={onClose} size="sm">
                                                {t("modals.close")}
                                            </Button>
                                        }
                                        { 
                                            !closable && <div></div>
                                        }
                                        <Button color="danger" onPress={() => handleAction(onClose)} size="sm" isDisabled={isDisabled || isLoading} isLoading={isLoading}>
                                            {actionName}
                                        </Button>
                                    </>

                                }
                            </div>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </HeroUiModal>
    )

}


export default Modal; 
