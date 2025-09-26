

export interface DatabaseType {
    name: string,
    dialect: string;
    logo: string;
    small_logo?: string
    comming? : boolean
}

export enum DatabaseDialect {
    MYSQL = "mysql",
    POSTGRES = "postgres",
    SQLITE = "sqlite",
    MARIADB = "mariadb", 
    SQL_SERVER = "sql_server", 
    ORACLE = "oracle"
};

export const DBTypes: DatabaseType[] = [
    {
        name: "Postgresql",
        dialect: DatabaseDialect.POSTGRES,
        logo: "/postgresql_logo.png",
        small_logo: "/postgresql_logo_small.png"
    }, {
        name: "MySQL",
        dialect: DatabaseDialect.MYSQL,
        logo: "/mysql_logo.png",
        small_logo: "/mysql_logo_small.png"
    },
    {
        name: "Sqlite",
        dialect: DatabaseDialect.SQLITE,
        logo: "/sqlite_logo.png",
        small_logo: "/sqlite_logo_small.png"

    },
    {
        name: "MariaDB",
        dialect: DatabaseDialect.MARIADB,
        logo: "/mariadb_logo.png",
        small_logo: "/mariadb_logo_small.png"
    },
    
    {
        name: "SQL Server",
        dialect: DatabaseDialect.SQL_SERVER,
        logo: "/sql_server_logo_small.png",
        small_logo: "/sql_server_logo_small.png" , 
        comming : true
    },
    
    {
        name: "Oracle",
        dialect: DatabaseDialect.ORACLE,
        logo: "/oracle_logo_small.png",
        small_logo: "/oracle_logo_small.png" , 
        comming : true
    },
]




export const getDatabaseByDialect = (dialect: DatabaseDialect): DatabaseType => {
    const dbType: DatabaseType | undefined = DBTypes.find((dbType: DatabaseType) => dbType.dialect == dialect);
    return dbType ? dbType : DBTypes[0];
}


export enum ImportMethodType {
    DUMP = "DUMP",
    DB_CLIENT = "DB_CLIENT",

}

export interface ImportDatabaseMethod {
    id: string;
    name: string;
    logo?: string;
    icon?: React.ReactNode;
    instruction?: string;
    example?: string;
    type: ImportMethodType;
    numberOfInstructions?: number;
}

export interface ImportDatabaseOption {
    dialect: DatabaseDialect,
    methods: ImportDatabaseMethod[]
}



export const PG_DUMP_INSTRUCTIONS = "pg_dump -U [username] -d [database_name] -f [output_file.sql]";
export const PG_DUMP_EXAMPLE = "pg_dump -U root -d example_db -f example_db.sql";

export const MYSQL_DUMP_INSTRUCTIONS = "mysqldump -u [username] -p --no-data [database_name] > [output_file.sql]";
export const MYSQL_DUMP_EXAMPLE = "mysqldump -u root -p --no-data example_db > example_db.sql";


export const MARIADB_DUMP_INSTRUCTIONS = "mariadb-dump -u [username] -p --no-data [database_name] > [output_file.sql]";
export const MARIADB_DUMP_EXAMPLE = "mariadb-dump -u root -p --no-data example_db > example_db.sql";


export const SQLITE_DUMP_INSRUCTION = "sqlite3 [daabase_path] .schema > [output_file.sql]";
export const SQLITE_DUMP_EXAMPLE = "sqlite3 example_db.sqlite .schema > example_db.sql";


export enum CardinalityStyle {
    HIDDEN = "HIDDEN" , 
    NUMERIC = "NUMERIC" , 
    SYMBOLIC = "SYMBOLIC"
}

