import Modal, { ModalProps } from "@/components/modal/modal";
import { getDatabaseByDialect } from "@/lib/database";
import { DatabaseType } from "@/lib/schemas/database-schema";

import { useDatabase, useDatabaseOperations } from "@/providers/database-provider/database-provider";

import { Image, Pagination, Selection, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@heroui/react";
import { Key, useState } from "react";
import { useTranslation } from "react-i18next";





const OpenDatabaseModal: React.FC<ModalProps> = (props) => {
    const { isOpen, onOpenChange } = props;
    const { t } = useTranslation();
    const { databases, currentDatabaseId } = useDatabase();
    
    const { switchDatabase } = useDatabaseOperations();
    const [selectedDatabase, setSelectedDatabase] = useState<any | undefined>(
        (() => currentDatabaseId ? new Set([currentDatabaseId]) : undefined)
    );

    const openDatabase = () => {
        switchDatabase(selectedDatabase.currentKey);
        onOpenChange && onOpenChange(false);
    }

    const onSelectionChange = (selection: Selection) => {
        if ((selection as any).currentKey != selectedDatabase?.currentKey)
            setSelectedDatabase(selection)
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
            header={t("modals.open_database_header")}
            isDisabled={!selectedDatabase?.size}
        >
            <Table
                isHeaderSticky
                aria-label="Example static collection table"
                color={"primary"}
                selectionMode="single"
                selectedKeys={selectedDatabase}
                onSelectionChange={onSelectionChange}
         
                classNames={{
                    wrapper: "shadow-sm border-1  border-divider dark:bg-background-100  rounded-sm",
                    th: "dark:bg-background font-bold   text-center rounded-sm",
                    tr: " hover:bg-default-100 h-10 dark:hover:bg-background rounded-lg cursor-pointer text-font/90 transition-colors duration-200 ",
                    base: "max-h-[520px] overflow-y-scroll ",
                    td: "items-center text-center" , 
                }}
            >
                <TableHeader className="rounded-sm">
                    <TableColumn>{t("modals.open_database_table.dialect")}</TableColumn>
                    <TableColumn>{t("modals.open_database_table.name")}</TableColumn>
                    <TableColumn>{t("modals.open_database_table.created_at")}</TableColumn>
                    <TableColumn>{t("modals.open_database_table.tables")}</TableColumn>
                </TableHeader>
                <TableBody>
                    {
                        databases.map((database: DatabaseType) => (
                            <TableRow key={database.id}>
                                <TableCell>
                                    <div className="flex justify-center">
                                        <Image
                                            src={getDatabaseByDialect(database.dialect).small_logo}
                                            width={24}
                                            radius="none"
                                        />
                                    </div>
                                </TableCell>
                                <TableCell className="font-semibold ">{database.name}</TableCell>
                                <TableCell className="text-font/70">{
                                    new Date(database.createdAt as string).toLocaleString("en-US")
                                }</TableCell>
                                <TableCell>{database.numOfTables}</TableCell>
                            </TableRow>
                        ))
                    }


                </TableBody>
            </Table>

        </Modal>
    )
}


export default OpenDatabaseModal; 