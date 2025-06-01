import Modal, { ModalProps } from "@/components/modal/modal";
import { getDatabaseByDialect } from "@/lib/database";
import { DatabaseType } from "@/lib/schemas/database-schema";

import { useDatabase, useDatabaseOperations } from "@/providers/database-provider/database-provider";

import { Image, Selection, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@heroui/react";
import { Key, useState } from "react";
import { useTranslation } from "react-i18next";





const OpenDatabaseModal: React.FC<ModalProps> = ({ isOpen, onOpenChange }) => {

    const { t } = useTranslation();
    const { databases } = useDatabase();
    const { setCurrentDatabaseId } = useDatabaseOperations();
    const [selectedDatabase, setSelectedDatabase] = useState<any | undefined>(undefined);
    const openDatabase = () => {
        setCurrentDatabaseId( selectedDatabase.currentKey)
    }



    return (
        <Modal
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            title={t("modals.open_database")}
            actionName={t("modals.open")}
            className="min-w-[860px]"
            actionHandler={openDatabase}
            header={t("modals.open_database_header")}
            isDisabled={!selectedDatabase?.size}
        >
            <Table
                aria-label="Example static collection table"
                color={"primary"}


                selectionMode="single"
                selectedKeys={selectedDatabase}
                onSelectionChange={setSelectedDatabase}
                classNames={{
                    wrapper: "min-h-[360px]  shadow-none border-1 border-divider border-sm"
                }}
            >
                <TableHeader>
                    <TableColumn>Dialect</TableColumn>
                    <TableColumn>Name</TableColumn>
                    <TableColumn>Created at</TableColumn>
                    <TableColumn>Tables</TableColumn>
                </TableHeader>
                <TableBody>
                    {
                        databases.map((database: DatabaseType) => (
                            <TableRow key={database.id}>
                                <TableCell>
                                    <Image
                                        src={getDatabaseByDialect(database.dialect).logo}
                                        width={24}
                                    />
                                </TableCell>
                                <TableCell>{database.name}</TableCell>
                                <TableCell>{
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