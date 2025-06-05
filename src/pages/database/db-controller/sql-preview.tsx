import { useRenderSql } from "@/hooks/user-render-sql";
import { useDatabase } from "@/providers/database-provider/database-provider";
import React from "react";






const SqlPreview : React.FC = ({}) => { 

    const {database} = useDatabase() ; 
    const sql = useRenderSql(database) ; 


    return(
        <p>
            {sql
            }
        </p>
    )

} 



export default React.memo(SqlPreview) ; 