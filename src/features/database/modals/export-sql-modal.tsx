
import Modal, { ModalProps } from "@/components/modal";


import React from "react";
import { useTranslation } from "react-i18next";
import SqlPreview from "../components/db-controller/sql-preview";
import { Separator } from "@/components/ui/separator";

const ExportSqlModal: React.FC<ModalProps> = ({ isOpen, onOpenChange }) => {

    const { t } = useTranslation();

    return (

           <Modal
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            title={t("modals.export_sql")}
            className="w-full lg:min-w-[960px] "
            description={t("modals.export_sql_header")}
        >
            <Separator />
            <div className="h-full min-h-[65vh]  max-h-[65vh] min-w-0 !bg-background p-1 border-1 rounded-md shadow-xs" >
                <SqlPreview />
            </div>
            <Separator />

        </Modal>
    )
};


export default React.memo(ExportSqlModal)