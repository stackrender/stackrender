
export interface DatabaseType {
    name: string,
    dialect: string;
    logo: string
}

export enum DatabaseDialect {
    MYSQL = "mysql",
    POSTGRES = "postgres",
    SQLITE = "sqlite",
    MARIADB = "mariadb"
};

export const DBTypes: DatabaseType[] = [
    {
        name: "Postgresql",
        dialect: DatabaseDialect.POSTGRES,
        logo: "/postgresql_logo.png"
    }, {
        name: "MySQL",
        dialect: DatabaseDialect.MYSQL,
        logo: "/mysql_logo.png"
    },
    {
        name: "Sqlite",
        dialect: DatabaseDialect.SQLITE,
        logo: "/sqlite_logo.png"
    },
      {
        name: "MariaDB",
        dialect: DatabaseDialect.MARIADB,
        logo: "/mariadb_logo.png"
    },
]


export const getDatabaseByDialect = (dialect: DatabaseDialect): DatabaseType => {
    const dbType : DatabaseType | undefined = DBTypes.find((dbType : DatabaseType) => dbType.dialect == dialect) ; 
    return dbType ? dbType : DBTypes[0] ; 
}