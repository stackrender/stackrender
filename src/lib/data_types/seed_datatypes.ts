import { PowerSyncSQLiteDatabase } from "@powersync/drizzle-driver";
import { data_types, DataInsertType } from "../schemas/data-type-schema";
import { MysqlDataType } from "./mysql_data_types";
import { PostgresDataType } from "./postgres_data_types";
import { SqliteDataTypes } from "./sqlite_data_types";
import { MariaDbDataType } from "./mariadb_data_types";
import { DatabaseDialect } from "../database";





export const seedDataTypes = async (db: any) => {
    const existing = await db.query.data_types.findFirst();
    if (!existing) {
        // seeding data types . 
        return await db.insert(data_types).values([
            ...mapToDataType(MysqlDataType , DatabaseDialect.MYSQL) , 
            ...mapToDataType(PostgresDataType , DatabaseDialect.POSTGRES) , 
            ...mapToDataType(SqliteDataTypes , DatabaseDialect.SQLITE) , 
            ...mapToDataType(MariaDbDataType , DatabaseDialect.MARIADB) 
        ] as DataInsertType[])
    }
     
}

const mapToDataType = (dataTypes: Partial<DataInsertType>[], dialect: DatabaseDialect): DataInsertType[] => {
    return dataTypes.map((dataType: Partial<DataInsertType>) => ({
        ...dataType,
        dialect,
        modifiers: dataType.modifiers ? JSON.stringify(dataType.modifiers) : undefined,
        synonyms: dataType.synonyms ? JSON.stringify(dataType.synonyms) : undefined
    } as DataInsertType))
}