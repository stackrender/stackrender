import Modal, { ModalProps } from "@/components/modal/modal";
import { useDatabase, useDatabaseOperations } from "@/providers/database-provider/database-provider";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";


const DeleteDatabaseModal: React.FC<ModalProps> = ({ isOpen, onOpenChange }) => {

    const { currentDatabaseId } = useDatabase();
    const { deleteDatabase , switchDatabase} = useDatabaseOperations();
    const { t } = useTranslation();

    const onDelete = useCallback(async () => {
        return await new Promise(async (res, rej) => {
            await deleteDatabase(currentDatabaseId as string);
            switchDatabase( undefined ) ; 
            res(currentDatabaseId) ; 
            onOpenChange && onOpenChange(false) ; 
        })
    }, [currentDatabaseId])


    return (
        <Modal
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            title={t("modals.delete_database")}
            actionName={t("modals.delete")}
            className="min-w-[560px]"
            actionHandler={onDelete}
            variant="danger"

        >
            <p className="text-font/90">
                {t("modals.delete_database_content")}
            </p>
        </Modal>
    )
}


export default DeleteDatabaseModal;

