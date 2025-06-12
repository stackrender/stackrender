import { useDatabase, useDatabaseOperations } from "@/providers/database-provider/database-provider";
import React, { useEffect, useState } from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "../tooltip/tooltip";
import { useTranslation } from "react-i18next";
import { Button, Divider, Image, Input } from "@heroui/react";
import { DatabaseDialect,  getDatabaseByDialect } from "@/lib/database";
import { Save } from "lucide-react";
import { DatabaseType } from "@/lib/schemas/database-schema";

interface RenameDatabaseProps {
    database : DatabaseType
}

const RenameDatabase: React.FC<RenameDatabaseProps> = ({ database}) => {
    
    const { editDatabase } = useDatabaseOperations();
    const [editMode, setEditMode] = useState<boolean>(false);
    const [dbName, setDbName] = useState<string>(database.name);
    const { t } = useTranslation();
    const [isLoading, setIsLoading] = useState<boolean>(false);

    useEffect(() => {
        console.log (database.name) ; 
        setDbName(database.name);
    }, [database.name])

    const saveDatabaseName = async () => {
        if (!dbName || dbName.trim().length == 0)
            return;
        setIsLoading(true);

        await editDatabase({
            id: database.id,
            name: dbName
        });
        setIsLoading(false);
        setEditMode(false);
    }
    return (
        <div className="group">
            {
                !editMode &&
                <Tooltip>
                    <TooltipTrigger asChild>
                        <label
                            className=" w-full text-editable truncate h-8   px-3 text-sm font-bold dark:text-white flex gap-4 items-center justify-center text-font/90 hover:underline"
                            onDoubleClick={() => setEditMode(true)}
                        >
                            <Image
                                src={getDatabaseByDialect(database.dialect as DatabaseDialect).logo}
                                width={22}
                                className=" rounded-none "
                            />

                            {dbName}

                        </label>
                    </TooltipTrigger>
                    <TooltipContent>
                        {t("navbar.rename_db")}
                    </TooltipContent>
                </Tooltip>
            }
            {
                editMode &&
                <div className="flex justify-center items-center gap-4">
                    <Image
                        src={getDatabaseByDialect(database.dialect as DatabaseDialect).logo}
                        width={32}
                        className=" rounded-none "
                    />


                    <Input
                        placeholder={database.name}
                        type="text"
                        size="sm"
                        radius="sm"
                        variant="faded"
                        onChange={(event: any) => setDbName(event.target.value)}
                        value={dbName}
                        onBlur={saveDatabaseName}
                        className="h-8 w-full focus-visible:ring-0 shadow-none"
                        classNames={{
                            inputWrapper: "dark:bg-default border-divider group-hover:border-primary ",
                        }}


                    />
                    <Button
                        variant="solid"
                        className="size-6 p-0 text-white h-8 w-8"
                        size="sm"
                        color="primary"
                        onPressEnd={saveDatabaseName}
                        isIconOnly
                        isLoading={isLoading}
                        isDisabled={isLoading}
                    >
                        <Save className="size-3" />
                    </Button>


                </div>
            }
        </div >
    )
}


export default React.memo(RenameDatabase); 