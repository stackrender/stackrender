



export interface DatabaseType {
    name: string,
    dialect: string;
    logo: string
}

export const DBTypes: DatabaseType[] = [
    {
        name: "PostgreSql",
        dialect: "postgres",
        logo: "/postgresql_logo.png"
    }, {
        name: "Mysql",
        dialect: "mysql",
        logo: "/mysql_logo.png"
    },
    {
        name: "Sqlite",
        dialect: "sqlite",
        logo: "/sqlite_logo.png"
    },
]


export const getDatabaseByDialect = (dialect: string): DatabaseType => {
    const dbType : DatabaseType | undefined = DBTypes.find((dbType : DatabaseType) => dbType.dialect == dialect) ; 
    return dbType ? dbType : DBTypes[0] ; 
}