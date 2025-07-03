
import Modal, { ModalProps } from "@/components/modal/modal";


import React from "react";
import { useTranslation } from "react-i18next";
import SqlPreview from "../db-controller/sql-preview";

const ExportSqlModal: React.FC<ModalProps> = ({ isOpen, onOpenChange }) => {

    const { t } = useTranslation();

    return (
        <Modal
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            title={t("modals.export_sql")}
            className="min-w-[960px] h-[90vh]"
            header={t("modals.export_sql_header")}
        >
            <div className="h-full max-h-[72vh]">
                <SqlPreview />
            </div>
        
        </Modal>

    )
};


export default React.memo(ExportSqlModal)