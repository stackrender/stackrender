import { useRenderSql } from "@/hooks/user-render-sql";
import { useDatabase } from "@/providers/database-provider/database-provider";
import React, { useEffect, useMemo } from "react";

import CodeMirror, { EditorView } from '@uiw/react-codemirror';
import { sql } from '@codemirror/lang-sql';
import { oneDark } from '@codemirror/theme-one-dark';
import { useTheme } from "next-themes";
import { Parser } from "node-sql-parser";
import { overrideDarkTheme, overrideLightTheme } from "@/lib/colors";
import { DatabaseType } from "@/lib/schemas/database-schema";
const parser = new Parser();
const code = `
CREATE TABLE events (
  id INT AUTO_INCREMENT PRIMARY KEY,


  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,


  logged_at DATETIME DEFAULT CURRENT_TIMESTAMP 
);
`




const SqlPreview: React.FC = ({ }) => {

    const { database } = useDatabase();
    const sqlCode = useRenderSql(database as DatabaseType);
    const { resolvedTheme } = useTheme();

    useEffect(() => {
        const ast = parser.astify(code, {
            database: "Mysql"
        }) ; 
        
        console.log(ast)
    }, [])

    return (
        <div className="flex w-full h-full  ">
            {

                <CodeMirror
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