import { FieldType } from "@/lib/schemas/field-schema" 

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

    