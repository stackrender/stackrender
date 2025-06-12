import { useRenderSql } from "@/hooks/user-render-sql";
import { useDatabase } from "@/providers/database-provider/database-provider";
import React, { useEffect, useMemo } from "react";

import CodeMirror, { EditorView } from '@uiw/react-codemirror';
import { sql } from '@codemirror/lang-sql';
import { oneDark } from '@codemirror/theme-one-dark';
import { useTheme } from "next-themes";
import { Parser } from "node-sql-parser"; 
import { overrideDarkTheme, overrideLightTheme } from "@/lib/colors";
const parser = new Parser();
const code = `

CREATE TABLE \`users\` (
  id BIGINT NOT NULL PRIMARY KEY UNIQUE,
  name VARCHAR(255) NOT NULL,
  lastname VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  profile_url VARCHAR(255),
  age SMALLINT,
  birthday DATE,
  created_at TIMESTAMP NOT NULL
);

CREATE TABLE \`addresses\` (
  id BIGINT NOT NULL PRIMARY KEY UNIQUE,
  street_line VARCHAR(255) NOT NULL,
  latitude FLOAT,
  longitude FLOAT, -- fixed spelling
  state_id BIGINT NOT NULL,
  user_id BIGINT NOT NULL,
  FOREIGN KEY (\`user_id\`) REFERENCES \`users\` (\`id\`)
);

`




const SqlPreview: React.FC = ({ }) => {

    const { database } = useDatabase();
    const sqlCode = useRenderSql(database);
    const { resolvedTheme } = useTheme();

    useEffect(() => {
        const ast = parser.astify(code, {
            database: "Mysql"
        })
        console.log(ast)
    }, [])

    return (
        <div className="flex w-full h-full  ">
            {

                <CodeMirror
                    value={sqlCode}
                    className="flex flex-1 w-full"
                    extensions={[sql()]}
                    theme={resolvedTheme == "light" ? overrideLightTheme :   [oneDark , overrideDarkTheme]  }
                />
            }
        </div>
    )

}



export default React.memo(SqlPreview); 