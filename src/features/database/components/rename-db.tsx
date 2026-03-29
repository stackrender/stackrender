import { useDatabase, useDatabaseOperations } from "@/providers/database-provider/database-provider";
import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { DatabaseDialect, getDatabaseByDialect } from "@/lib/database";
import { Save } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/shadcn-io/spinner";


const RenameDB: React.FC = ({ }) => {


    const { database } = useDatabase();
    const { editDatabase } = useDatabaseOperations();
    const [editMode, setEditMode] = useState<boolean>(false);
    const [dbName, setDbName] = useState<string>(database?.name || "");
    const { t } = useTranslation();
    const [isLoading, setIsLoading] = useState<boolean>(false);


    useEffect(() => {
        if (database?.name)
            setDbName(database?.name);
    }, [database?.name])

    const saveDatabaseName = async () => {

        if (!database)
            return;

        if (!dbName || dbName.trim().length == 0)
            return;

        if (dbName.trim() == database.name) {
            setEditMode(false)

            return;
        }
        setIsLoading(true);

        await editDatabase({
            id: database.id,
            name: dbName
        });
        setIsLoading(false);
        setEditMode(false);
    }


    if (!database)
        return;

    return (
        <div className="group flex items-center  px-2  rounded-sm  ">
            {
                !editMode &&
                <Tooltip >
                    <TooltipTrigger asChild>
                        <label
                            className=" w-full max-w-[256px] truncate h-8 text-sm font-medium  flex gap-4 items-center justify-center  cursor-pointer"
                            onDoubleClick={() => setEditMode(true)}
                        >
                            <img
                                src={getDatabaseByDialect(database.dialect as DatabaseDialect).small_logo}

                                className="rounded-none shrink-0 border-1 p-1 size-8 !rounded-md  "
                            />
                            <div className="flex flex-col">
                                <span className="max-w-[164px] truncate group-hover:underline ">
                                    {dbName}
                                </span>

                            </div>

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
                    <img
                        src={getDatabaseByDialect(database.dialect as DatabaseDialect).small_logo}
                        className="rounded-none shring-0 border-1 p-1 size-8 !rounded-md "
                    />
                    <Input
                        placeholder={database.name}
                        type="text"
                        onChange={(event: any) => setDbName(event.target.value)}
                        value={dbName}
                        onBlur={saveDatabaseName}
                        autoFocus
                        className="h-8 min-w-[164px]"
                    />
                    <Button
                        variant="default"

                        size="sm"
                        color="primary"
                        onClick={saveDatabaseName}


                        disabled={isLoading}
                    >
                        {isLoading && <Spinner />}
                        <Save className="size-3" />
                    </Button>


                </div>
            }
        </div >
    )
}


export default React.memo(RenameDB); 