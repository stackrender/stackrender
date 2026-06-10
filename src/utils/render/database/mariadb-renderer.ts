import { DataType } from "@/lib/schemas/data-type-schema";
import MysqlRenderer from "./mysql-renderer";
import { DatabaseDialect } from "@/lib/database";

export default class MariaDbRenderer extends MysqlRenderer {
 
    public constructor(data_types: DataType[]) {
        super( data_types , DatabaseDialect.MARIADB)
    }
}