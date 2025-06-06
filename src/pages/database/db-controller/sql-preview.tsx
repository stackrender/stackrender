import { useRenderSql } from "@/hooks/user-render-sql";
import { useDatabase } from "@/providers/database-provider/database-provider";
import React, { useEffect, useMemo } from "react";

import CodeMirror from '@uiw/react-codemirror';
import { sql } from '@codemirror/lang-sql';
import { oneDark } from '@codemirror/theme-one-dark';
import { useTheme } from "next-themes"; 
import { Parser } from "node-sql-parser"; 

const parser = new Parser();
const code = `

-- Addresses table with a foreign key to users
CREATE TABLE addresses (
    id INTEGER PRIMARY KEY,
    user_id INT NOT NULL,
    street VARCHAR(255),
    city VARCHAR(100),
    state VARCHAR(100),
    postal_code VARCHAR(20),
    country VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Indexes to improve lookup performance
CREATE UNIQUE  INDEX idx_addresses_user_id ON addresses(user_id);
CREATE INDEX idx_addresses_city ON addresses(city , country);


`



const SqlPreview: React.FC = ({ }) => {

    const { database } = useDatabase();
    const sqlCode = useRenderSql(database);
    const {resolvedTheme} = useTheme(); 

    useEffect(() => {
        const ast = parser.astify(code )
        console.log (ast)
    }, [])

    return (
        <div className="flex w-full h-full  ">
            {
               
            <CodeMirror
                value={sqlCode}
                className="flex flex-1 w-full"
                
                
                extensions={[sql()]}
                theme={resolvedTheme == "light" ? undefined : oneDark}
            /> 
            }
        </div>
    )

}



export default React.memo(SqlPreview); 