import Modal, { ModalProps } from "@/components/modal"
import ReactCodeMirror, { oneDark } from "@uiw/react-codemirror";
import { useCallback, useEffect, useMemo, useState } from "react"
import { useTranslation } from "react-i18next"
import { overrideDarkTheme, overrideLightTheme } from "@/lib/colors";
import { sql } from '@codemirror/lang-sql';
import { DatabaseDialect, ImportDatabaseMethod, ImportDatabaseOption, ImportMethodType, MARIADB_DUMP_EXAMPLE, MARIADB_DUMP_INSTRUCTIONS, MYSQL_DUMP_EXAMPLE, MYSQL_DUMP_INSTRUCTIONS, PG_DUMP_EXAMPLE, PG_DUMP_INSTRUCTIONS, SQLITE_DUMP_EXAMPLE, SQLITE_DUMP_INSRUCTION } from "@/lib/database";
import { useDatabase, useDatabaseOperations } from "@/providers/database-provider/database-provider";

import { AlertCircleIcon, Code } from "lucide-react"; 
import { SqlToDatabase } from "@/utils/render/parsers/sql_to_database";
import Clipboard from "@/components/clipboard";
import { Trans } from 'react-i18next'; 
import { Node, useReactFlow } from "@xyflow/react";
import { adjustTablesPositions } from "@/utils/tables";
import { TableInsertType } from "@/lib/schemas/table-schema";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useTheme } from "@/providers/theme-provider/theme-provider";
import { cn } from "@/lib/utils";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const options: ImportDatabaseOption[] = [{
    dialect: DatabaseDialect.POSTGRES,
    methods: [{
        id: "pg_dump",
        name: "pg_dump",
        icon: <Code className="size-3.5 " />,
        type: ImportMethodType.DUMP,
        instruction: PG_DUMP_INSTRUCTIONS,
        example: PG_DUMP_EXAMPLE

    }, {
        id: "pg_admin",
        name: "Pg Admin",
        logo: "/postgresql_logo_small.png",
        type: ImportMethodType.DB_CLIENT,
        numberOfInstructions: 5,

    }]
}, {
    dialect: DatabaseDialect.MYSQL,
    methods: [{
        id: "mysql_dump",
        name: "mysqldump",
        icon: <Code className="size-3.5" />,
        type: ImportMethodType.DUMP,
        instruction: MYSQL_DUMP_INSTRUCTIONS,
        example: MYSQL_DUMP_EXAMPLE,
    }, {
        id: "workbench",
        name: "MySQL Workbench",
        logo: "/mysql_logo_small.png",
        type: ImportMethodType.DB_CLIENT,
        numberOfInstructions: 5,
    }]
}
    , {
    dialect: DatabaseDialect.MARIADB,
    methods: [{
        id: "mariadb-dump",
        name: "mariadb-dump",
        icon: <Code className="size-3.5" />,
        type: ImportMethodType.DUMP,
        instruction: MARIADB_DUMP_INSTRUCTIONS,
        example: MARIADB_DUMP_EXAMPLE,
    }, {
        id: "heidisql",
        name: "HeidiSQL",
        type: ImportMethodType.DB_CLIENT,
        numberOfInstructions: 5,
        logo: "/heidisqlL_logo.png",
    }, {
        id: "mysql_dump",
        name: "mysqldump",
        icon: <Code className="size-3.5" />,
        type: ImportMethodType.DUMP,
        instruction: MYSQL_DUMP_INSTRUCTIONS,
        example: MYSQL_DUMP_EXAMPLE,
    }, {
        id: "workbench",
        name: "MySQL Workbench",
        logo: "/mysql_logo_small.png",
        type: ImportMethodType.DB_CLIENT,
        numberOfInstructions: 5,
    }],

}, {
    dialect: DatabaseDialect.SQLITE,
    methods: [{
        id: "sqlite3",
        name: "Sqlite3",
        icon: <Code className="size-3.5" />,
        type: ImportMethodType.DUMP,
        instruction: SQLITE_DUMP_INSRUCTION,
        example: SQLITE_DUMP_EXAMPLE
    }, {
        id: "dbbrowser",
        name: "DB Browser",
        logo: "/dbbrowser.png",
        type: ImportMethodType.DB_CLIENT,
        numberOfInstructions: 5,
    }]
}
];
const ImportDatabaseModal: React.FC<ModalProps> = ({ isOpen, onOpenChange }) => {
    const { t } = useTranslation();


    const { theme: resolvedTheme } = useTheme();
    const { database, isLoading, isSwitchingDatabase } = useDatabase();
    const { data_types, importDatabase } = useDatabaseOperations();
    const [sqlCode, setSqlCode] = useState<string>("");
    const [parsedDatabase, setParsedDatabase] = useState<any | undefined>(undefined)
    const [error, setError] = useState<boolean>(false);
    const { fitView } = useReactFlow();

    let currentOption: ImportDatabaseOption | undefined = useMemo(() => {
        return options.find((option: ImportDatabaseOption) => option.dialect == database?.dialect)
    }, [database]);

    const [selectedMethodId, setSelectedMethodId] = useState<string | undefined>(undefined);

    useEffect(() => {
        setSelectedMethodId(currentOption ? currentOption.methods[0].id as string : undefined)
    }, [currentOption])

    const onImportMethodChange = (method: string) => {
        setSelectedMethodId(method);
    }

    const selectedImportMethod: ImportDatabaseMethod | undefined = useMemo(() => {
        return currentOption?.methods.find((method: ImportDatabaseMethod) => method.id == selectedMethodId) as ImportDatabaseMethod;
    }, [selectedMethodId, currentOption])

    const validateSql = useCallback((code: string) => {
        try {
            const parsedDatabase = SqlToDatabase(code, data_types, database?.dialect as DatabaseDialect);

            setParsedDatabase(parsedDatabase);
            setError(false);

        } catch (error) {

            setError(true);
            setParsedDatabase(undefined)
        }
        setSqlCode(code)

    }, [database?.dialect, data_types])



    const onImport = useCallback(async () => {
        return new Promise(async (res, rej) => {
            try {
                const nodes: Node[] = parsedDatabase.tables.map((table: TableInsertType) => ({
                    id: table.id,
                    data: {
                        table
                    }
                }))

                const adjustedTables = await adjustTablesPositions(nodes, parsedDatabase.relationships);
                await importDatabase(adjustedTables, parsedDatabase.relationships, parsedDatabase.indices);

                onOpenChange && onOpenChange(false);

                setTimeout(() => {
                    fitView({
                        duration: 500
                    });
                }, 300);

            } catch (error) {

                setError(true);
                rej()
            }
        })
    }, [parsedDatabase]);




    if (isLoading || isSwitchingDatabase)
        return;



    return (
        <Modal
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            title={t("modals.import_database.title")}
            actionName={t("modals.import_database.import")}
                className="lg:min-w-[860px] md:min-w-[560px] w-full max-h-screen overflow-auto "
            actionHandler={onImport}
            isDisabled={!parsedDatabase}
        >
            <div className="flex flex-col gap-4 !min-w-0  ">
                <div className="w-full space-y-2 !min-w-0 ">
                    <p className="text-sm text-muted-foreground">
                        {t("modals.import_database.import_options")}
                    </p>
                    {
                        <RadioGroup
                            onValueChange={onImportMethodChange}
                            value={selectedMethodId}
                            className="flex ">
                            {
                                currentOption?.methods.map((method: ImportDatabaseMethod) => (
                                    <Label htmlFor={method.id}
                                        key={method.id}
                                        className={cn(" h-8  px-2 rounded-md border hover:bg-secondary cursor-pointer flex items-center gap-1 ",
                                            (selectedMethodId == method.id) ? "border-primary bg-primary/20 " : "",
                                        )}>
                                        <RadioGroupItem value={method.id} id={method.id} className="sr-only" />
                                        {
                                            method.icon &&

                                            <div >
                                                {method.icon}
                                            </div>
                                        }
                                        <img
                                            src={method.logo}
                                            className="rounded-none h-4  "
                                        />
                                        <span >
                                            {method.name}
                                        </span>


                                    </Label>
                                ))
                            }
                        </RadioGroup>

                    }
                    {
                        selectedImportMethod?.type == ImportMethodType.DUMP &&
                        <div className="space-y-2">
                            <h3 className=" text-medium ">
                                {t("import.instructions")}
                            </h3>
                            <ul className="list-decimal list-outside px-4 text-sm space-y-2 ">
                                <li>
                                    {t("import.install")}  <span className=" font-medium ">{selectedImportMethod?.name}</span> .
                                </li>
                                <li className="space-y-2">
                                    <div>
                                        {t("import.run_command")}
                                    </div>
                                    <div className="  font-normal w-full">
                                        <span className="border-1 border-border p-1 px-2  rounded-md  w-full flex items-center justify-between">
                                            {selectedImportMethod.instruction}
                                            <Clipboard text={selectedImportMethod.example} />
                                        </span>
                                    </div>

                                    <div>
                                        {t("import.example")}
                                    </div>


                                    <div className="  font-normal w-full">
                                        <span className="border-1 border-border  p-1 px-2  rounded-md  w-full flex items-center justify-between">
                                            {selectedImportMethod.example}
                                            <Clipboard text={selectedImportMethod.example} />
                                        </span>
                                    </div>

                                </li>
                                <li>
                                    {t("import.copy_code")}
                                </li>
                            </ul>
                        </div>
                    }
                    {
                        selectedImportMethod?.type == ImportMethodType.DB_CLIENT &&
                        <div className="space-y-2">
                            <h3 className=" text-medium ">
                                {t("import.instructions")}
                            </h3>
                            <ul className="list-decimal list-outside px-4  text-sm space-y-3 ">
                                {
                                    Array.from({ length: selectedImportMethod.numberOfInstructions as number }, (_, i) => i).map((index: number) => (
                                        <li>
                                            <Trans i18nKey={`import.${selectedImportMethod.id}.step${index + 1}`} components={{
                                                bold: <span className="font-medium" />,
                                                code: <span className="border-1 border-border bg-secondary p-1 px-2  rounded-md  " />
                                            }} />
                                        </li>
                                    ))
                                }

                            </ul>
                        </div>
                    }

                </div>
                <div className="flex flex-col  ">
                    <ReactCodeMirror
                        className={
                            cn("flex w-full border-1 rounded-md border-divider overflow-hidden  ",
                                (error || parsedDatabase?.errors?.length > 0) ? "min-h-[360px] max-h-[360px]" : "min-h-[424px] max-h-[424px]"
                            )
                        }
                        extensions={[sql()]}
                        value={sqlCode}
                        onChange={validateSql}
                        theme={resolvedTheme == "light" ? overrideLightTheme : [oneDark, overrideDarkTheme]}
                    />
                    <div className="mt-4">
                        {
                            error &&
                            <Alert
                                variant={"destructive"}
                            >

                                <AlertCircleIcon />
                                <AlertTitle>
                                    {t("modals.import_database.import_error")}
                                </AlertTitle>
                                <AlertDescription>
                                    {t("modals.import_database.import_error_description")}
                                </AlertDescription>
                            </Alert>
                        }
                        {
                            (parsedDatabase?.errors && parsedDatabase?.errors?.length > 0) &&
                            <Alert
                                variant={"default"}
                                className="text-chart-5 dark:text-chart-3"
                            >

                                <AlertTitle>
                                    {t("modals.import_database.import_warning")}
                                </AlertTitle>
                                <AlertDescription className="text-chart-5 dark:text-chart-3">
                                    {t("modals.import_database.import_warning_description")}
                                </AlertDescription>

                            </Alert>
                        }
                    </div>
                </div>
            </div>
        </Modal>
    )
}


export default ImportDatabaseModal 