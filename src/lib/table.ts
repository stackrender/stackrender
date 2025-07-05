
import { getForeignRelationships } from "@/utils/relationship";
import { DatabaseType } from "./schemas/database-schema";
import { RelationshipType } from "./schemas/relationship-schema";
import { TableType } from "./schemas/table-schema";

export interface SortableTable {
    tableId: string;
    relationships: string[];
}

export interface RenderableTable extends TableType {
    foreignRelationships: RelationshipType[]
}


export const toSortableTable = (table: RenderableTable): SortableTable => {
 
    return {
        tableId: table.id,
        relationships: Array.from(new Set(  table.foreignRelationships.filter(
            (relationship : RelationshipType) => !(relationship.targetTable.id == relationship.sourceTable.id && relationship.sourceTable.id == table.id) 
        ).map((relationship: RelationshipType) => relationship.sourceTable.id))) 
    }
}

export const toRenderableTable = (table: TableType, database: DatabaseType): RenderableTable => {
    let renderableTable: RenderableTable | TableType = {
        ...table,
        sourceRelations: database.relationships.filter((relationship: RelationshipType) =>
            relationship.sourceTableId == table.id),
        targetRelations: database.relationships.filter((relationship: RelationshipType) =>
            relationship.targetTableId == table.id),
    } ;


    (renderableTable as RenderableTable).foreignRelationships = getForeignRelationships(renderableTable) ; 
    return renderableTable as RenderableTable ; 


}
