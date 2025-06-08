import { FieldType } from "@/lib/schemas/field-schema";
import { v4 } from "uuid";




export const getNextSequence = (fields: FieldType[]): number => {

    if (fields.length == 0)
        return 0;

    const maxSequenceItem = fields.reduce((max, field: FieldType) => {
        return field.sequence > max.sequence ? field : max
    });
    return maxSequenceItem.sequence + 1;
}



export const cloneField = (field: FieldType): FieldType => {
    return {
        ...field,
        id: v4(),
    } as FieldType;
}




