import Modal, { ModalProps } from "@/components/modal/modal"
import ReactCodeMirror, { oneDark } from "@uiw/react-codemirror";
import { useCallback, useMemo, useState } from "react"
import { useTranslation } from "react-i18next"

import { overrideDarkTheme, overrideLightTheme } from "@/lib/colors";

import { sql } from '@codemirror/lang-sql';
import { useTheme } from "next-themes";
import { DatabaseDialect, ImportDatabaseMethod, ImportDatabaseOption, ImportMethodType } from "@/lib/database";
import { useDatabase, useDatabaseOperations } from "@/providers/database-provider/database-provider";
import { CheckboxGroup } from "@heroui/react";
import OptionCheckbox from "@/components/checkbox/option-checkbox";
import { Code } from "lucide-react";
import { Code as CodeSection } from "@heroui/react";
import { SqlToDatabase } from "@/utils/render/parsers/sql_to_database";
import { adjustTablesPositions } from "@/utils/tables";






const options: ImportDatabaseOption[] = [{
    dialect: DatabaseDialect.POSTGRES,
    methods: [{
        id: "pg_dump",
        name: "pg_dump",
        icon: <Code className="size-4 text-font/90" />,
        type: ImportMethodType.DUMP

    }, {
        id: "pg_admin",
        name: "pg Admin",
        logo: "/postgresql_logo.png",
        type: ImportMethodType.DB_CLIENT
    }]
}]

const ImportDatabaseModal: React.FC<ModalProps> = ({ isOpen, onOpenChange }) => {

    const { t } = useTranslation();
    const { resolvedTheme } = useTheme();
    const { database } = useDatabase();
    const { data_types, createTable  , createRelationship} = useDatabaseOperations();
    const [sqlCode, setSqlCode] = useState<string>("");
    let currentOption: ImportDatabaseOption | undefined = useMemo(() => {
        return options.find((option: ImportDatabaseOption) => option.dialect == database?.dialect)
    }, [database]);


    const [selectedMethodId, setSelectedMethodId] = useState<string[]>(currentOption ? [currentOption.methods[0].id] : []);

    if (!currentOption) {
        onOpenChange && onOpenChange(false);
    }

    const onImportMethodChange = (types: string[]) => {
        const selectedType: string | undefined = types.pop();
        if (selectedType && selectedType != selectedMethodId?.[0])
            setSelectedMethodId([selectedType]);
    }


    const selectedImportMethod: ImportDatabaseMethod = useMemo(() => {
        return currentOption?.methods.find((method: ImportDatabaseMethod) => method.id == selectedMethodId?.[0]) as ImportDatabaseMethod;
    }, [selectedMethodId, currentOption])

    const importDatabase = useCallback( async () => {

        const {tables , relationships } = SqlToDatabase(sqlCode, data_types, database?.dialect as DatabaseDialect);
        
        
        for (const table of tables) {
            await createTable(table)
        } 

        for ( const relationship of relationships ) { 
            await createRelationship(relationship) ; 
        }
    }, [sqlCode, database?.dialect, data_types]);


    return (
        <Modal
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            title={t("modals.import_database.title")}
            actionName={t("modals.import_database.import")}
            className="min-w-[860px] max-w-[860px]"
            actionHandler={importDatabase}
        >
            <div className="flex flex-col gap-4 ">
                <div className="w-full   ">
                    <p className="text-sm text-font/90">
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
                                />
                            ))
                        }
                    </CheckboxGroup>
                    {
                        selectedImportMethod.type == ImportMethodType.DUMP &&
                        <div className="space-y-2">
                            <label className="text-sm font-semibold">
                                Instructions :
                            </label>
                            <ul className="list-decimal list-outside px-4    text-font/90 text-sm space-y-2 marker:font-semibold	">
                                <li>
                                    install <span className="font-semibold text-font/90">{selectedImportMethod.name}</span> .
                                </li>

                                <li>
                                    Run the following command in your terminal :
                                    <ReactCodeMirror
                                        className="flex flex-1 w-full border-1 my-2 rounded-md border-divider overflow-hidden "

                                        editable={false}

                                        value={`pg_dump -h <host> -p <port> -d <database_name> 
-U <username> -s -F p -E UTF-8 
-f <output_file_path>`}
                                        theme={resolvedTheme == "light" ? overrideLightTheme : [overrideDarkTheme, oneDark]}
                                    />
                                    Example :
                                    <ReactCodeMirror
                                        className="flex flex-1 w-full border-1 my-2 rounded-md border-divider overflow-hidden  "
                                        value={`pg_dump -h localhost -p 5432 -d my_db 
-U postgres -s -F p -E UTF-8 
-f schema_export.sql`}
                                        editable={false}
                                        theme={resolvedTheme == "light" ? overrideLightTheme : [overrideDarkTheme, oneDark]}
                                    />

                                </li>
                                <li>
                                    Drag and drop the output .sql file in code section or copy it content
                                </li>
                            </ul>
                        </div>
                    }

                    {
                        selectedImportMethod.type == ImportMethodType.DB_CLIENT &&
                        <div className="space-y-2">
                            <label className="text-sm font-semibold">
                                Instructions :
                            </label>
                            <ul className="list-decimal list-outside px-4 text-font/90 text-sm space-y-3 marker:font-semibold	">
                                <li>
                                    Open <span className="font-semibold text-font/90">{selectedImportMethod.name}</span> .
                                </li>
                                <li>
                                    Right-click your database and select <span className="font-semibold text-font/90">Backup</span> from the context menu.
                                </li>
                                <li>
                                    Name your <CodeSection className="p-1" color="default" size="sm"> .sql </CodeSection> file, set Format to <span className="font-semibold text-font/90">Plain</span>, and choose <span className="font-semibold text-font/90">Encoding: UTF8.</span>
                                </li>
                                <li>
                                    Make sure <span className="font-semibold text-font/90">Only schema</span> is checked and <span className="font-semibold text-font/90">Only data</span> is unchecked in the <span className="font-semibold text-font/90">Data Options tab</span>.
                                </li>
                                <li>
                                    Click <span className="font-semibold text-font/90">Backup</span> to export the file, then copy its content into the code editor section.
                                </li>
                            </ul>
                        </div>
                    }

                </div>
                <div className="flex flex-1 ">
                    {

                        <ReactCodeMirror
                            className="flex  w-full min-h-[360px] max-h-[360px] border-1 rounded-md border-divider overflow-hidden"
                            extensions={[sql()]}
                            value={sqlCode}
                            onChange={setSqlCode}
                            theme={resolvedTheme == "light" ? overrideLightTheme : [oneDark, overrideDarkTheme]}
                        />

                    }
                </div>
            </div>
        </Modal>
    )
}


export default ImportDatabaseModal 