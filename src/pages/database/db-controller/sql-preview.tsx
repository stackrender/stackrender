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
import Clipboard from "@/components/clipboard/clipboard";
import { TableType } from "@/lib/schemas/table-schema";
import { RelationshipType } from "@/lib/schemas/relationship-schema";


interface SqlPreviewProps {
    tableFilterIds ? : string[] 
}


const SqlPreview: React.FC<SqlPreviewProps> = ({ tableFilterIds }) => {

    const { database : currentDatabase } = useDatabase();


    const database = useMemo(() => { 
        return {
            ...currentDatabase , 
            tables : currentDatabase?.tables.filter((table : TableType) => tableFilterIds?.includes(table.id)) , 
            relationships : currentDatabase?.relationships.filter((relationship : RelationshipType) => 
                tableFilterIds?.includes( relationship.sourceTableId)  ||  tableFilterIds?.includes(relationship.targetFieldId) 
            ), 
        } as DatabaseType ; 
    } , [currentDatabase ,tableFilterIds ])



    


    const { sql: sqlCode, circularDependency } = useRenderSql(database as DatabaseType);
    const { resolvedTheme } = useTheme();
    const { t } = useTranslation();

    

    console.log ( tableFilterIds ) ; 

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
            <div className="flex w-full h-full relative">
                <div className="absolute right-[12px] top-[4px] z-[1] bg-background ">
                    <Clipboard
                        text={sqlCode}
                    />
                </div>
                {
                    <CodeMirror
                        defaultValue={sqlCode}
                        value={sqlCode}
                        className="flex flex-1 w-full "
                        extensions={[sql()]}
                        readOnly
                        
                        theme={resolvedTheme == "light" ? overrideLightTheme : [oneDark, overrideDarkTheme]}
                        
                    />
                }
            </div>
        )

}



export default React.memo(SqlPreview) ; 