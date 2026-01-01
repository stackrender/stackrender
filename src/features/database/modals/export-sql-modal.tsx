
import Modal, { ModalProps } from "@/components/modal";


import React from "react";
import { useTranslation } from "react-i18next";
import SqlPreview from "../components/db-controller/sql-preview";

const ExportSqlModal: React.FC<ModalProps> = ({ isOpen, onOpenChange }) => {

    const { t } = useTranslation();

    return (
        <Modal
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            title={t("modals.export_sql")}
            className="w-full lg:min-w-[960px]"
            description={t("modals.export_sql_header")}
        >
            <div className="h-full max-h-[72vh] min-w-0">
                <SqlPreview />
            </div>

        </Modal>

    )
};


export default React.memo(ExportSqlModal)