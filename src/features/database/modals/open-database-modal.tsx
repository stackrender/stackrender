import Modal, { ModalProps } from "@/components/modal";
import { useDatabase, useDatabaseOperations } from "@/providers/database-provider/database-provider";


import {  useState } from "react";
import { useTranslation } from "react-i18next";
import {
    Table,
    TableBody, 
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { DatabaseType } from "@/lib/schemas/database-schema";
import { getDatabaseByDialect } from "@/lib/database";

const OpenDatabaseModal: React.FC<ModalProps> = (props) => {

    const { isOpen, onOpenChange } = props;
    const { t } = useTranslation();
    const { databases, currentDatabaseId } = useDatabase();

    const { switchDatabase } = useDatabaseOperations();
    const [selectedDatabase, setSelectedDatabase] = useState<string | undefined>(
        (() => currentDatabaseId ? currentDatabaseId : undefined)
    );

    const openDatabase = async () => {
        if (selectedDatabase)
            await switchDatabase(selectedDatabase);
        onOpenChange && onOpenChange(false);
    }
    return (
        <Modal
            {...props}
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            title={t("modals.open_database")}
            actionName={t("modals.open")}
            className="min-w-[820px]"
            actionHandler={openDatabase}
            description={t("modals.open_database_header")}
            isDisabled={!selectedDatabase}
        >
            <div className="max-h-[360px] overflow-y-auto ">
                <Table className="text-center">
                    <TableHeader >
                        <TableRow >

                            <TableHead className="text-center">{t("modals.open_database_table.dialect")}</TableHead>
                            <TableHead className="text-center">{t("modals.open_database_table.name")}</TableHead>
                            <TableHead className="text-center">{t("modals.open_database_table.created_at")}</TableHead>
                            <TableHead className="text-center">{t("modals.open_database_table.tables")}</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody >
                        {
                            databases.map((database: DatabaseType) => (
                                <TableRow
                                    key={database.id}
                                    className="h-10 cursor-pointer"
                                    data-state={selectedDatabase == database.id ? "selected" : undefined}
                                    onClick={() => setSelectedDatabase(database.id)}
                                    >
                                    <TableCell className="flex  justify-center ">
                                        <img
                                            src={getDatabaseByDialect(database.dialect).small_logo}
                                            width={24}
                                        />
                                    </TableCell>
                                    <TableCell className="font-medium ">{database.name}</TableCell>
                                    <TableCell className="text-muted-foreground">{
                                        new Date(database.createdAt as string).toLocaleString("en-US")
                                    }</TableCell>
                                    <TableCell className="text-center">{database.numOfTables}</TableCell>
                                </TableRow>
                            ))
                        }
                    </TableBody>
                </Table>
            </div>
        </Modal>
    )
}


export default OpenDatabaseModal; 