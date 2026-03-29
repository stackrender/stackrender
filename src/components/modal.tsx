
import React, { ReactNode, useState } from "react";

import { useTranslation } from "react-i18next";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Button } from "./ui/button";
import { Spinner } from "./ui/shadcn-io/spinner";


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
    description?: string,
    variant?: "default" | "danger",
    closable?: boolean,
    footer?: boolean
}

const Modal: React.FC<ModalProps> = ({
    isOpen,
    onOpenChange,
    className,
    title,
    description,
    children,
    actionName = "Action",
    actionHandler,
    isDisabled,
    closable = true,
    footer = true,
    variant = "default"
}) => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const { t } = useTranslation();
    const handleAction = async () => {
        setIsLoading(true)
        try {
            actionHandler && await actionHandler();
        } catch (error) {
            setIsLoading(false);
        } finally {
            setIsLoading(false);
        }
    }

 
    return (
        <Dialog open={isOpen} onOpenChange={ closable ? onOpenChange : () => {}}>
            <DialogContent className={className}  showCloseButton={closable}>
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    {
                        description &&
                        <DialogDescription>
                            {description}
                        </DialogDescription>
                    }
                </DialogHeader>
                {children}
                {
                    footer &&
                    <DialogFooter >
                        <div className="flex justify-between w-full flex-col gap-4 sm:flex-row">


                            {
                                variant == "default" &&
                                <>
                                    {
                                        closable &&
                                        <DialogClose asChild  >
                                            <Button variant="outline">{t("modals.close")}</Button>
                                        </DialogClose>
                                    }
                                    {
                                        !closable && <div></div>
                                    }
                                    {
                                        actionHandler &&
                                        <Button type="submit" onClick={handleAction} disabled={isDisabled || isLoading}  >
                                            {actionName}
                                            {isLoading && <Spinner />}

                                        </Button>
                                    }
                                </>
                            }
                            {
                                variant == "danger" &&
                                <>
                                    {
                                        closable &&
                                        <DialogClose asChild >
                                            <Button variant="outline">{t("modals.close")}</Button>
                                        </DialogClose>
                                    }
                                    {

                                        actionHandler &&
                                        <Button type="submit" variant="destructive" onClick={handleAction} disabled={isDisabled || isLoading} >
                                            {actionName}
                                        </Button>
                                    }
                                </>
                            }
                        </div>
                    </DialogFooter>
                }
            </DialogContent>
        </Dialog>
        /*
        <HeroUiModal
            ref={targetRef}
            isOpen={isOpen}
            onOpenChange={onOpenChange && closable ? onOpenChange : undefined}
            className={className}
            backdrop={backdrop}
            radius="sm"

            classNames={{
                base: "dark:bg-background-100",
                closeButton: cn("dark:bg-background-100 dark:hover:bg-background rounded-md", !closable ? "hidden" : "")
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
                        {footer &&
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
                                            {
                                                actionHandler &&
                                                <Button color="primary" onPress={() => handleAction(onClose)} size="sm" isDisabled={isDisabled || isLoading} isLoading={isLoading}>
                                                    {actionName}
                                                </Button>
                                            }
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
                                            {
                                                actionHandler &&

                                                <Button color="danger" onPress={() => handleAction(onClose)} size="sm" isDisabled={isDisabled || isLoading} isLoading={isLoading}>
                                                    {actionName}
                                                </Button>
                                            }
                                        </>
                                    }
                                </div>
                            </ModalFooter>
                        }
                    </>
                )}
            </ModalContent>
        </HeroUiModal>
        */
    )

}


export default Modal; 
