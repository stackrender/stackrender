import { DataType } from "@/lib/schemas/data-type-schema";
import { DatabaseDialect } from "@/lib/database";
import { MysqlImporter } from "./mysql-importer";

export class MariaDbImporter extends MysqlImporter {

    public constructor(data_types: DataType[]) { 
        super(data_types);
        this.dialect = DatabaseDialect.MYSQL;
    }


    protected processDefaultValue(ast: any, dataType: DataType): string | undefined {
        
        let defaultValue: string | undefined = super.processDefaultValue(ast, dataType);

        if (!defaultValue) { 
            if (ast.Nested?.Function) {
                if ( ast.Nested.Function.name?.[0]?.Identifier?.value?.toUpperCase() == "UUID" ) { 
       
                    return "random" ; 
                }
            }
            if (ast.Function) {
                if ( ast.Function.name?.[0]?.Identifier?.value.toUpperCase() == "UUID" ) { 
                 
                    return "random" ; 
                }
                
            }
        }

        return defaultValue
    }


}
