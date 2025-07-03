import DatabaseCheckbox from "@/components/checkbox/database-checkbox";
import Modal, { ModalProps } from "@/components/modal/modal"
import { DatabaseType, DBTypes } from "@/lib/database";
import { useDatabaseOperations } from "@/providers/database-provider/database-provider";
import { Modals } from "@/providers/modal-provider/modal-contxet";
import { useModal } from "@/providers/modal-provider/modal-provider";
import { Button, CheckboxGroup, Input } from "@heroui/react";
import { usePowerSync, usePowerSyncStatus } from "@powersync/react";
import { Database, SquareMenu } from "lucide-react";
import { useCallback, useEffect, useState } from "react"
import { useTranslation } from "react-i18next";
import { v4 } from "uuid";



export const CreateDatabaseModal: React.FC<ModalProps> = (props) => {
    const { t } = useTranslation();
    const { isOpen, onOpenChange } = props ; 
    
   
    const [isValid, setIsValid] = useState<boolean>(false);
    const [selectedDbType, setSelectedDbType] = useState<string[]>([DBTypes[0].dialect]);
    const [dbName, setDbName] = useState<string>("db_example");
    const { createDatabase, switchDatabase } = useDatabaseOperations();
    const { open } = useModal();

    const onDatabaseTypeChange = (types: string[]) => {
        const selectedType: string | undefined = types.pop();
        if (selectedType && selectedType != selectedDbType?.[0])
            setSelectedDbType([selectedType]);
    }

    const createNewDatabase = useCallback(async () => {
        const databaseId: string = v4();
        return new Promise(async (res, rej) => {
            try {
                await createDatabase({
                    id: databaseId,
                    name: dbName,
                    dialect: selectedDbType[0] as any
                });
                switchDatabase(databaseId);
                open(Modals.IMPORT_DATABASE);
                res(databaseId);
            } catch (error) {
                rej(error);
            }
        })
    }, [selectedDbType, dbName])

    useEffect(() => {
        setIsValid((selectedDbType.length > 0 && dbName.trim().length > 0) as boolean)
    }, [selectedDbType, dbName]);

    return (
        <Modal
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            title={t("modals.pick_database")}
            actionName={t("modals.continue")}
            className="min-w-[720px]"
            isDisabled={!isValid}
            actionHandler={createNewDatabase}
            header={t("modals.create_database_header")}
        >
            <div className="w-full justify-center flex ">
                <div className="flex flex-col gap-1 w-[70%]">
                    <div className="p-8 py-2 pb-4 space-y-2">
                        <label className="text-sm text-font/90 font-semibold">
                            {t("modals.db_name")}
                        </label>
                        <Input
                            errorMessage={t("modals.db_name_error")}
                            isInvalid={dbName.trim().length == 0}
                            type="text"
                            value={dbName}
                            onValueChange={setDbName}
                            size="sm"
                            radius="sm"
                            variant="faded"
                            placeholder={t("modals.db_name")}
                            className="h-8 w-full focus-visible:ring-0 shadow-none "
                            classNames={{
                                inputWrapper: "dark:bg-default border-divider group-hover:border-primary group-data-[focus=true]:border-primary",
                            }}
                        />
                    </div>
                    <CheckboxGroup
                        classNames={{
                            base: "w-full  p-0 ",
                            wrapper: "flex-row p-4  gap-8   px-0 items-center justify-center"
                        }}
                        aria-label="Select Database"
                        value={selectedDbType}
                        onChange={onDatabaseTypeChange}
                    >
                        {
                            DBTypes.map((db: DatabaseType) => (
                                <DatabaseCheckbox
                                    database={db}
                                />
                            ))
                        }
                    </CheckboxGroup>
                    <div className="p-8 py-4 space-y-2">
                        <Button
                            variant="bordered"
                            size="sm"
                            className="w-full text-font/90 border-1 border-divider"
                        >
                            <SquareMenu className="size-4 text-icon" /> Check examples
                        </Button>
                        <Button
                            variant="bordered"
                            size="sm"
                            className="w-full text-font/90 border-1 border-divider"
                        >
                            <span className="underline">
                                Empty Diagram
                            </span>
                        </Button>
                    </div>

                </div>
            </div>
        </Modal>
    )
}




