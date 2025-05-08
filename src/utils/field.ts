import { FieldType } from "@/lib/schemas/field-schema";




export const getNextSequence = (fields: FieldType[]): number => {

    if (fields.length == 0)
        return 0;

    const maxSequenceItem = fields.reduce((max, field: FieldType) => {
        return field.sequence > max.sequence ? field : max
    });
    return maxSequenceItem.sequence + 1;
}