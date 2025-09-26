 
import Modal, { ModalProps } from "@/components/modal"
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { DatabaseDialect, DatabaseType, DBTypes } from "@/lib/database";
import { cn } from "@/lib/utils";
import { useDatabaseOperations } from "@/providers/database-provider/database-provider";
import { Modals } from "@/providers/modal-provider/modal-contxet";
import { useModal } from "@/providers/modal-provider/modal-provider";
import { useCallback, useEffect, useState } from "react"
import { useTranslation } from "react-i18next";
import { v4 } from "uuid";


export const CreateDatabaseModal: React.FC<ModalProps> = (props) => {

    const { t } = useTranslation();
    const { isOpen, onOpenChange } = props;

    const [isValid, setIsValid] = useState<boolean>(false);
    const [selectedDbType, setSelectedDbType] = useState<string>(DBTypes[0].dialect);
    const [dbName, setDbName] = useState<string>("db_example");

    const { createDatabase, switchDatabase } = useDatabaseOperations();
    const { open } = useModal();

    const onDatabaseTypeChange = (dialect: string) => {
        setSelectedDbType(dialect);
    }

    const createNewDatabase = useCallback(async (withImport: boolean = false) => {
        const databaseId: string = v4() ; 

        return new Promise(async (res, rej) => {
            try {
                await createDatabase({
                    id: databaseId,
                    name: dbName,
                    dialect: selectedDbType  as any
                });
                await switchDatabase(databaseId);
                if (withImport)
                    open(Modals.IMPORT_DATABASE);
                else
                    onOpenChange && onOpenChange(false)
                res(databaseId);
            } catch (error) {
                rej(error);
            }
        }) 
    }, [selectedDbType, dbName])

    useEffect(() => {
        setIsValid((selectedDbType  && dbName.trim().length > 0) as boolean)
    }, [selectedDbType, dbName]);

    return (
        <Modal
            {...props}
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            title={t("modals.pick_database")}
            actionName={t("modals.create")}
 
            isDisabled={!isValid}
            actionHandler={createNewDatabase}
            description={t("modals.create_database_header")}
        >
            <div className="w-full justify-center flex ">
                <div className="flex flex-col gap-1">
                    <div className=" py-2 pb-4 space-y-2">
                        <Label >
                            {t("modals.db_name")}
                        </Label>
                        <Input
                            type="text"
                            value={dbName}
                            aria-invalid={dbName.trim().length == 0}
                            onChange={(event: any) => setDbName(event.target.value)}
                            placeholder={t("modals.db_name")}
                        />
                        {
                            dbName.trim().length == 0 &&
                            <p className="text-destructive">
                                {t("modals.db_name_error")}
                            </p>
                        }
                    </div>
                    <RadioGroup
                        onValueChange={onDatabaseTypeChange}
                        defaultValue={DatabaseDialect.POSTGRES}
                        className="grid grid-cols-3 gap-4">
                        {
                            DBTypes.map((db: DatabaseType) => (
                                <div className=" flex items-center space-x-2 relative" key={db.dialect}>

                                    <Label htmlFor={db.dialect}
                                        className={cn("w-full p-3 rounded-md border hover:bg-secondary cursor-pointer",
                                            (selectedDbType == db.dialect && !db.comming )? "border-primary bg-primary/20 " : "" , 
                                            ( db.comming )? "opacity-75 hover:bg-background cursor-default" : ""
                                            

                                        )}>
                                        <RadioGroupItem disabled={db.comming} value={db.dialect} id={db.dialect} className="sr-only" />
                                        <img
                                            src={db.small_logo}
                                            className="rounded-none h-8  "
                                        />
                                        <span className="truncate">
                                            {db.name}
                                        </span>
                                        {
                                            db.comming && 
                                            <Badge className="absolute -top-2 left-[50%] -translate-x-[50%] bg-chart-5 dark:bg-chart-3">
                                                Comming
                                            </Badge>
                                        }
                                    </Label>
                                </div>
                            ))
                        }
                    </RadioGroup>
                
                    <div className="py-4 space-y-2">
                        <Button
                            variant="ghost"
                            size="sm"
                            className=" w-full"
                            onClick={() => createNewDatabase(true)}
                        >
                            <span className="underline" >
                                {t("modals.create_and_import")}
                            </span>
                        </Button>
                    </div>

                </div>
            </div>
        </Modal>
    )
}




