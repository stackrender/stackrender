

import { useDatabaseOperations } from "@/providers/database-provider/database-provider";
import { DatabaseToAst } from "@/utils/render/parsers/database_to_ast";
import { useEffect, useState } from "react";

import { Parser } from "node-sql-parser";
import { DatabaseType } from "@/lib/schemas/database-schema";
import { format } from 'sql-formatter';
import { DatabaseDialect, getDatabaseByDialect } from "@/lib/database";
import { CircularDependencyError, fixCharsetPlacement, fixSQLiteColumnOrder } from "@/utils/render/render-uttils";
import { areArraysEqual } from "@/utils/utils";
import { decomposeManyToMany } from "@/utils/relationship";

const parser = new Parser();


export const useRenderSql = (database: DatabaseType) => {
    const [sql, setSql] = useState<string>("");
    const { data_types } = useDatabaseOperations();
    const [circularDependency, setCircularDependency] = useState<CircularDependencyError | undefined>(undefined) ; 

    useEffect(() => {
        try {

            const decomposedDatabase = decomposeManyToMany(database) ;
            
            const dbAst: any = DatabaseToAst(decomposedDatabase, data_types);
            
            let sql: string = parser.sqlify(dbAst, {
                database: getDatabaseByDialect(database.dialect).name
            });
            
            if (database.dialect != DatabaseDialect.SQLITE)
                sql = fixCharsetPlacement(format(sql, { language: "sql" }));
            else
                sql = fixSQLiteColumnOrder(format(sql, { language: "sql" }));

            const formattedSqlCode = format(sql, { language: 'sql' });

            setSql(
                (formattedSqlCode)
            );
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
    }, [database , data_types]);

    return { sql, circularDependency };

}