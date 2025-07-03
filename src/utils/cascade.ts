import { fields } from "@/lib/schemas/field-schema";
import { QueryResult } from "@powersync/web";
import { ExtractTablesWithRelations, inArray, or } from "drizzle-orm";
import { SQLiteTransaction } from "drizzle-orm/sqlite-core";
import { tables } from "@/lib/schemas/table-schema";
import { relationships } from "@/lib/schemas/relationship-schema";
import { field_indices } from "@/lib/schemas/field_index-schema";
import { indices } from "@/lib/schemas/index-schema";



export const deleteFieldsWithCascade = async (ids: string[], tx: SQLiteTransaction<'async', QueryResult, any, ExtractTablesWithRelations<any>>): Promise<QueryResult[]> => {
    return Promise.all([
        tx.delete(relationships).where(or(inArray(relationships.sourceFieldId, ids), inArray(relationships.targetFieldId, ids))),
        tx.delete(field_indices).where(inArray(field_indices.fieldId, ids)),
        tx.delete(fields).where(inArray(fields.id, ids)),
    ]);
}

export const deleteTablesWithCascade = async (ids: string[], tx: SQLiteTransaction<'async', QueryResult, any, ExtractTablesWithRelations<any>>): Promise<QueryResult[]> => {

    let fieldIds: { id: string }[] | string[] = await tx.select({
        id: fields.id
    }).from(fields).where(inArray(fields.tableId, ids));

    let indicesIds: { id: string }[] | string[] = await tx.select({
        id: indices.id
    }).from(indices).where(inArray(indices.tableId, ids));

    fieldIds = fieldIds.map((fieldId: { id: string }) => fieldId.id);
    indicesIds = indicesIds.map((indexId: { id: string }) => indexId.id);

    return Promise.all([
        tx.delete(relationships).where(or(inArray(relationships.sourceFieldId, fieldIds), inArray(relationships.targetFieldId, fieldIds))),
        tx.delete(field_indices).where(inArray(field_indices.fieldId, fieldIds)),
        tx.delete(fields).where(inArray(fields.id, fieldIds)),
        tx.delete(field_indices).where(inArray(field_indices.indexId, indicesIds)),
        tx.delete(indices).where(inArray(indices.id, indicesIds)),
        tx.delete(tables).where(inArray(tables.id, ids)),

    ])
}


export const deleteIndicesWithCascade = async (ids: string[], tx: SQLiteTransaction<'async', QueryResult, any, ExtractTablesWithRelations<any>>): Promise<QueryResult[]> => {
    return Promise.all([
        tx.delete(field_indices).where(inArray(field_indices.indexId, ids)),
        tx.delete(indices).where(inArray(indices.id, ids))
    ])

}