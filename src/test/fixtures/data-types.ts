import { DatabaseDialect } from "@/lib/database";
import { DataInsertType, DataType } from "@/lib/schemas/data-type-schema";
import { MysqlDataType } from "@/lib/data_types/mysql_data_types";
import { PostgresDataType } from "@/lib/data_types/postgres_data_types";
import { SqliteDataTypes } from "@/lib/data_types/sqlite_data_types";
import { MariaDbDataType } from "@/lib/data_types/mariadb_data_types";
import { OracleDataType } from "@/lib/data_types/oracle_data_types";
import { MSSQLDataType } from "@/lib/data_types/mssql_data_types";

// Build a DataType[] fixture straight from the seed arrays, applying the exact
// same transform as seedDataTypes() -> mapToDataType() in the app (see
// src/lib/data_types/seed_datatypes.ts). The importer reads `modifiers` and
// `synonyms` as JSON strings, so they must be stringified here just like the
// production seeding does. This lets the tests exercise the real supported-type
// tables without booting the WASM SQLite database.
const mapToDataType = (
  dataTypes: Partial<DataInsertType>[],
  dialect: DatabaseDialect,
): DataType[] =>
  dataTypes.map(
    (dataType) =>
      ({
        ...dataType,
        dialect,
        modifiers: dataType.modifiers
          ? JSON.stringify(dataType.modifiers)
          : null,
        synonyms: dataType.synonyms ? JSON.stringify(dataType.synonyms) : null,
      }) as DataType,
  );

const dataTypesByDialect: Record<DatabaseDialect, DataType[]> = {
  [DatabaseDialect.MYSQL]: mapToDataType(MysqlDataType, DatabaseDialect.MYSQL),
  [DatabaseDialect.POSTGRES]: mapToDataType(
    PostgresDataType,
    DatabaseDialect.POSTGRES,
  ),
  [DatabaseDialect.SQLITE]: mapToDataType(
    SqliteDataTypes,
    DatabaseDialect.SQLITE,
  ),
  [DatabaseDialect.MARIADB]: mapToDataType(
    MariaDbDataType,
    DatabaseDialect.MARIADB,
  ),
  [DatabaseDialect.ORACLE]: mapToDataType(
    OracleDataType,
    DatabaseDialect.ORACLE,
  ),
  [DatabaseDialect.MSSQL]: mapToDataType(MSSQLDataType, DatabaseDialect.MSSQL),
};

export const getDataTypes = (dialect: DatabaseDialect): DataType[] =>
  dataTypesByDialect[dialect];
