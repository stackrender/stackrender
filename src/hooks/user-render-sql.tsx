

import { useDatabaseOperations } from "@/providers/database-provider/database-provider";
import { DatabaseToAst } from "@/utils/render/parsers/database_to_ast";
import { useEffect, useState } from "react";

import { Parser } from "node-sql-parser";
import { DatabaseType } from "@/lib/schemas/database-schema";
import { format } from 'sql-formatter';
import { DatabaseDialect, getDatabaseByDialect } from "@/lib/database";

const parser = new Parser();


export const useRenderSql = (database: DatabaseType) => {
    const [sql, setSql] = useState<string>("");
    const { data_types } = useDatabaseOperations();

    useEffect(() => {
        const dbAst: any = DatabaseToAst(database, data_types);

        const formattedSqlCode = format(parser.sqlify(dbAst, {
            database: getDatabaseByDialect(database.dialect ).name
        }), { language: 'sql' });
        setSql(
            formattedSqlCode
        );

    }, [database]);


    return sql;

}