import { useRenderSql } from "@/hooks/user-render-sql";
import { useDatabase, useDatabaseOperations } from "@/providers/database-provider/database-provider";
import React, { useCallback, useEffect, useMemo, useState } from "react";

import CodeMirror, { EditorView } from '@uiw/react-codemirror';
import { sql } from '@codemirror/lang-sql';
import { oneDark } from '@codemirror/theme-one-dark';
import { useTheme } from "next-themes";

import { overrideDarkTheme, overrideLightTheme } from "@/lib/colors";
import { DatabaseType } from "@/lib/schemas/database-schema";
import CircularDependencyAlert from "./circular-dependecy-alert";
import { addToast } from "@heroui/react";
import { useTranslation } from "react-i18next"; 




const SqlPreview: React.FC = ({ }) => {

    const { database } = useDatabase();
    
    const { sql: sqlCode, circularDependency } = useRenderSql(database as DatabaseType);
    const { resolvedTheme } = useTheme();
    const { t } = useTranslation();

    useEffect(() => {
        if (circularDependency)
            addToast({
                title: t("db_controller.circular_dependency.title"),
                description: t("db_controller.circular_dependency.description"),
                color: "danger",
                variant: "solid"
            });
    }, [circularDependency]);

    if (circularDependency)
        return <CircularDependencyAlert error={circularDependency} />
    else
        return (
            <div className="flex w-full h-full  ">
                {
                    <CodeMirror       
                        defaultValue={sqlCode}
                        value={sqlCode}
                        className="flex flex-1 w-full"
                        extensions={[sql()]}
                        theme={resolvedTheme == "light" ? overrideLightTheme : [oneDark, overrideDarkTheme]}
                    />
                }
            </div>
        )

}



export default React.memo(SqlPreview); 