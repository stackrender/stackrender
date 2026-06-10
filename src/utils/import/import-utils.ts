import { DatabaseDialect } from "@/lib/database";
import { DataType } from "@/lib/schemas/data-type-schema";
import { BaseSqlImporter } from "./base-sql-importer";
import { MysqlImporter } from "./mysql-importer";
import { MariaDbImporter } from "./mariadb-importer";
import { SqliteImporter } from "./sqlite-importer";
import { PostgreSqlImporter } from "./postgresql-importer";
import { OracleImporter } from "./oracle-importer";
import { MSSQLImporter } from "./mssql-importer";

export const getImporter = (dialect: DatabaseDialect, data_types: DataType[]) => {
    let importer: BaseSqlImporter | undefined = undefined;


    switch (dialect) {
        case DatabaseDialect.MYSQL:
            importer = (new MysqlImporter(data_types));
            break;
        case DatabaseDialect.MARIADB:
            importer = (new MariaDbImporter(data_types));
            break;
        case DatabaseDialect.SQLITE:
            importer = (new SqliteImporter(data_types));
            break;
        case DatabaseDialect.POSTGRES:
            importer = (new PostgreSqlImporter(data_types));
            break;
        case DatabaseDialect.ORACLE:
            importer = (new OracleImporter(data_types));
            break;
        case DatabaseDialect.MSSQL:
            importer = (new MSSQLImporter(data_types));
            break;
        default:
            importer = new BaseSqlImporter(data_types);
            break;
    }

    return importer;
}