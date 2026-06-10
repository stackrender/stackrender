 
import { useDatabase, useDatabaseOperations } from "@/providers/database-provider/database-provider";
import React, { useEffect, useMemo, useState } from "react";
import CodeMirror from '@uiw/react-codemirror';
import { sql } from '@codemirror/lang-sql';
import { oneDark } from '@codemirror/theme-one-dark';
import { overrideDarkTheme, overrideLightTheme } from "@/lib/colors";
import { DatabaseType } from "@/lib/schemas/database-schema";
import CircularDependencyAlert from "./circular-dependecy-alert";
import { useTranslation } from "react-i18next";
import Clipboard from "@/components/clipboard";
import { TableType } from "@/lib/schemas/table-schema";
import { RelationshipType } from "@/lib/schemas/relationship-schema";
import { useTheme } from "@/providers/theme-provider/theme-provider";
import { toast } from "sonner";
import BaseDatabaseRenderer from "@/utils/render/database/base-database-renderer";
import { CircularDependencyError, getRenderer } from "@/utils/render/render-uttils";
import { areArraysEqual } from "@/utils/utils";


interface SqlPreviewProps {
    tableFilterIds?: string[]
}

const SqlPreview: React.FC<SqlPreviewProps> = ({ tableFilterIds }) => {


    const { database: currentDatabase } = useDatabase();
    const { data_types } = useDatabaseOperations();
    const [sqlCode, setSqlCode] = useState<string>("");

    const [circularDependency, setCircularDependency] = useState<CircularDependencyError | undefined>(undefined);

    const database = useMemo(() => {
        if (!tableFilterIds)
            return currentDatabase;
        return {
            ...currentDatabase,
            tables: currentDatabase?.tables.filter((table: TableType) => tableFilterIds?.includes(table.id)),
            relationships: currentDatabase?.relationships.filter((relationship: RelationshipType) =>
                tableFilterIds?.includes(relationship.sourceTableId) || tableFilterIds?.includes(relationship.targetFieldId)
            ),
        } as DatabaseType;
    }, [currentDatabase, tableFilterIds])

    const { theme } = useTheme();
    const { t } = useTranslation();

    useEffect(() => {
        (async () => {

            if (database?.dialect && data_types.length > 0) {
 
                try {
                    const renderer: BaseDatabaseRenderer = getRenderer(database.dialect, data_types);
                    const sql: string = await renderer.renderDDL(database)
 
                    setSqlCode(sql);
                    setCircularDependency(undefined);

                } catch (error) {

                    if ((error as CircularDependencyError)?.cycle)
                        setCircularDependency((previousError) => {
                            if (!previousError)
                                return error as CircularDependencyError;
                            else if (Array.isArray(previousError.cycle) && Array.isArray((error as CircularDependencyError).cycle) && !(areArraysEqual(previousError.cycle, (error as CircularDependencyError).cycle)))

                                return error as CircularDependencyError;
                            return previousError;
                        })
                }
            }

        })()
    }, [database, data_types]);


    useEffect(() => {
        if (circularDependency)
            toast(t("db_controller.circular_dependency.title"), {
                description: t("db_controller.circular_dependency.description"),
                classNames: {
                    description: "!text-destructive",
                    title: "!text-destructive"
                },
            });
    }, [circularDependency]);

    if (circularDependency)
        return <CircularDependencyAlert error={circularDependency} />

    else
        return (
            <div className="flex w-full h-full relative ">
                <div className="absolute right-[12px] top-[4px] z-[1]  ">
                    <Clipboard
                        text={sqlCode}
                    />
                </div>
                <CodeMirror
                    defaultValue={sqlCode}
                    value={sqlCode}
                    className="flex flex-1 w-full "
                    extensions={[sql()]}
                    readOnly
                    theme={theme != "dark" ? overrideLightTheme : [oneDark, overrideDarkTheme]}
                />
            </div>
        )

}



export default React.memo(SqlPreview); 