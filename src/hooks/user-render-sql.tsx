

import { useDatabaseOperations } from "@/providers/database-provider/database-provider";
import { DatabaseToAst } from "@/utils/render/parsers/database_to_ast";
import { useEffect, useState } from "react";

import { Parser } from "node-sql-parser";
import { DatabaseType } from "@/lib/schemas/database-schema";
import { format } from 'sql-formatter';
import { getDatabaseByDialect } from "@/lib/database";
import { fixCharsetPlacement } from "@/utils/render/parsers/render-uttils";

const parser = new Parser();


export const useRenderSql = (database: DatabaseType) => {
    const [sql, setSql] = useState<string>("");
    const { data_types } = useDatabaseOperations();

    useEffect(() => {
        try {
            const dbAst: any = DatabaseToAst(database, data_types);
            const sql = fixCharsetPlacement(format(parser.sqlify(dbAst, {
                database: getDatabaseByDialect(database.dialect).name
            }), { language: "sql" } ));
         
            const formattedSqlCode = format(sql, { language: 'sql' });

            setSql(
                (formattedSqlCode)
            );
        } catch (error) {
            console.log(error)
        }
    }, [database]);

    return sql;

}