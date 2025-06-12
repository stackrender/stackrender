import { FieldType } from "@/lib/schemas/field-schema"
import { Cardinality, RelationshipType } from "@/lib/schemas/relationship-schema"
import { TableType } from "@/lib/schemas/table-schema"

export const getRelationshipSourceAndTarget = (sourceTableId: string, sourceField: FieldType, targetTableId: string, targetField: FieldType) => {
    if (sourceField.isPrimary || targetField.isPrimary) {
        if (sourceField.isPrimary) {
            return {
                sourceTableId: sourceTableId,
                targetTableId: targetTableId,
                sourceFieldId: sourceField.id,
                targetFieldId: targetField.id,
            }
        } else {
            return {

                sourceTableId: targetTableId,
                targetTableId: sourceTableId,
                sourceFieldId: targetField.id,
                targetFieldId: sourceField.id,
            }
        }
    }
    else if (sourceField.unique || targetField.unique) {
        if (sourceField.unique) {
            return {

                sourceTableId: sourceTableId,
                targetTableId: targetTableId,
                sourceFieldId: sourceField.id,
                targetFieldId: targetField.id,
            }
        } else {
            return {

                sourceTableId: targetTableId,
                targetTableId: sourceTableId,
                sourceFieldId: targetField.id,
                targetFieldId: sourceField.id,
            }
        }
    } else {
        return {
            sourceTableId: sourceTableId,
            targetTableId: targetTableId,
            sourceFieldId: sourceField.id,
            targetFieldId: targetField.id,
        }
    }
}


export const getForeignRelationships = (table: TableType): RelationshipType[] => {

    let foreignRelationships = (table.sourceRelations ? table.sourceRelations?.filter((relationship: RelationshipType) =>
        relationship.cardinality == Cardinality.many_to_one
    ) : []).map((relationship: RelationshipType) => {
        return {
            ...relationship , 
            sourceTable : relationship.targetTable , 
            targetTable : relationship.sourceTable ,
            sourceField : relationship.targetField , 
            targetField : relationship.sourceField , 

        }
    });

    foreignRelationships = foreignRelationships.concat(
        table.targetRelations ? table.targetRelations?.filter((relationship: RelationshipType) =>
            relationship.cardinality == Cardinality.one_to_many || relationship.cardinality == Cardinality.one_to_one
        ) : []);

    return foreignRelationships;
}