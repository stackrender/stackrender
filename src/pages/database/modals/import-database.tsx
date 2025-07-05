import Modal, { ModalProps } from "@/components/modal/modal"
import ReactCodeMirror, { oneDark } from "@uiw/react-codemirror";
import { useCallback, useEffect, useMemo, useState } from "react"
import { useTranslation } from "react-i18next"
import { overrideDarkTheme, overrideLightTheme } from "@/lib/colors";
import { sql } from '@codemirror/lang-sql';
import { useTheme } from "next-themes";
import { DatabaseDialect, ImportDatabaseMethod, ImportDatabaseOption, ImportMethodType, MARIADB_DUMP_EXAMPLE, MARIADB_DUMP_INSTRUCTIONS, MYSQL_DUMP_EXAMPLE, MYSQL_DUMP_INSTRUCTIONS, PG_DUMP_EXAMPLE, PG_DUMP_INSTRUCTIONS, SQLITE_DUMP_EXAMPLE, SQLITE_DUMP_INSRUCTION } from "@/lib/database";
import { useDatabase, useDatabaseOperations } from "@/providers/database-provider/database-provider";
import { Alert, CheckboxGroup, cn } from "@heroui/react";
import OptionCheckbox from "@/components/checkbox/option-checkbox";
import { Code } from "lucide-react";
import { Code as CodeSection } from "@heroui/react";
import { SqlToDatabase } from "@/utils/render/parsers/sql_to_database";
import Clipboard from "@/components/clipboard/clipboard";
import { Trans } from 'react-i18next';
import { Parser } from "node-sql-parser";
import { DatabaseInsertType } from "@/lib/schemas/database-schema";
import { Node, useReactFlow } from "@xyflow/react";
import { adjustTablesPositions } from "@/utils/tables";
import { TableInsertType } from "@/lib/schemas/table-schema";

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


    const { resolvedTheme } = useTheme();
    const { database, isLoading, isSwitchingDatabase } = useDatabase();
    const { data_types, importDatabase  } = useDatabaseOperations();
    const [sqlCode, setSqlCode] = useState<string>("");
    const [parsedDatabase, setParsedDatabase] = useState<any | undefined>(undefined)
    const [error, setError] = useState<boolean>(false);
    const {  fitView } = useReactFlow();

    let currentOption: ImportDatabaseOption | undefined = useMemo(() => {
        return options.find((option: ImportDatabaseOption) => option.dialect == database?.dialect)
    }, [database]);

    const [selectedMethodId, setSelectedMethodId] = useState<string[]>([]);

    useEffect(() => {
        setSelectedMethodId(currentOption ? [currentOption.methods[0].id] : [])
    }, [currentOption])

    const onImportMethodChange = (types: string[]) => {
        const selectedType: string | undefined = types.pop();
        if (selectedType && selectedType != selectedMethodId?.[0])
            setSelectedMethodId([selectedType]);
    }

    const selectedImportMethod: ImportDatabaseMethod | undefined = useMemo(() => {
        return currentOption?.methods.find((method: ImportDatabaseMethod) => method.id == selectedMethodId?.[0]) as ImportDatabaseMethod;
    }, [selectedMethodId, currentOption])

    const validateSql = useCallback((code: string) => {
        try {
            const parsedDatabase = SqlToDatabase(code, data_types, database?.dialect as DatabaseDialect);
            console.log ( parsedDatabase) ; 
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
                console.log(error)
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
            className="min-w-[860px] max-w-[860px]"
            actionHandler={onImport}
            isDisabled={!parsedDatabase}
        >
            <div className="flex flex-col gap-4 ">
                <div className="w-full   ">
                    <p className="text-sm text-font">
                        {t("modals.import_database.import_options")}
                    </p>
                    <CheckboxGroup
                        classNames={{
                            base: "w-full  p-0 ",
                            wrapper: "flex flex-row p-2  gap-2   px-0 "
                        }}
                        aria-label="Select Database"
                        value={selectedMethodId}
                        onChange={onImportMethodChange}
                    >
                        {
                            currentOption?.methods.map((method: ImportDatabaseMethod) => (
                                <OptionCheckbox
                                    label={method.name}
                                    value={method.id}
                                    icon={method.icon}
                                    logo={method.logo}
                                    isSelected={selectedImportMethod?.id == method.id}
                                />
                            ))
                        }
                    </CheckboxGroup>
                    {
                        selectedImportMethod?.type == ImportMethodType.DUMP &&
                        <div className="space-y-2">
                            <label className="text-sm font-medium ">
                                {t("import.instructions")}
                            </label>
                            <ul className="list-decimal list-outside px-4    text-font text-sm space-y-2 marker:font-medium	">
                                <li>
                                    {t("import.install")}  <span className=" font-medium ">{selectedImportMethod?.name}</span> .
                                </li>
                                <li className="space-y-2">
                                    <div>
                                        {t("import.run_command")}
                                    </div>
                                    <CodeSection color="default" radius="md" className="selectable border-1 border-divider py-0.5 bg-background w-full text-font/90 flex items-center justify-between dark:border-divider dark:bg-transparent" >
                                        {selectedImportMethod.instruction}
                                        <Clipboard text={selectedImportMethod.instruction} />
                                    </CodeSection>

                                    <div>
                                        {t("import.example")}
                                    </div>
                                    <CodeSection color="default" radius="md" className="selectable border-1  border-divider  py-0.5 bg-background w-full text-font/90 flex items-center justify-between dark:border-divider dark:bg-transparent" >
                                        {selectedImportMethod.example}
                                        <Clipboard text={selectedImportMethod.example} />
                                    </CodeSection>
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
                            <label className="text-sm font-medium">
                                {t("import.instructions")}
                            </label>
                            <ul className="list-decimal list-outside px-4 text-font text-sm space-y-3 marker:font-medium">
                                {
                                    Array.from({ length: selectedImportMethod.numberOfInstructions as number }, (_, i) => i).map((index: number) => (
                                        <li>
                                            <Trans i18nKey={`import.${selectedImportMethod.id}.step${index + 1}`} components={{
                                                bold: <span className="font-medium" />,
                                                code: <CodeSection
                                                    className="border-1 bg-default text-font/90 px-1 h-7 mx-0.5 dark:border-divider "
                                                    color="primary"
                                                    size="sm"
                                                />
                                            }} />
                                        </li>
                                    ))
                                }

                            </ul>
                        </div>
                    }

                </div>
                <div className="flex flex-1 flex-col ">
                    <ReactCodeMirror
                        className={
                            cn("flex w-full  border-1 rounded-md border-divider overflow-hidden ",
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
                                color="danger"
                                description={t("modals.import_database.import_error_description")}
                                title={t("modals.import_database.import_error")}
                                variant={resolvedTheme == "dark" ? "solid" : "faded"}
                            />
                        }
                        {
                            (parsedDatabase?.errors && parsedDatabase?.errors?.length > 0) &&
                            <Alert
                                color="warning"
                                description={t("modals.import_database.import_warning_description")}
                                title={t("modals.import_database.import_warning")}

                                variant={resolvedTheme == "dark" ? "solid" : "faded"}

                            />
                        }
                    </div>
                </div>
            </div>
        </Modal>
    )
}


export default ImportDatabaseModal 