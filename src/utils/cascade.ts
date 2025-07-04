// ─────────────────────────────────────────────────────────────────────────────
// ❗ PowerSync Limitation: Manual Cascade Deletes Required
// 
// PowerSync uses SQLite *views* instead of real tables, which disables support
// for standard SQLite features like FOREIGN KEY constraints and ON DELETE CASCADE.
//
// Because of this, any time we delete a parent record (like a table, field, or index),
// we must manually delete all dependent child records to maintain data integrity.
//
// These functions perform **manual cascade deletes** to avoid orphaned records.
// ─────────────────────────────────────────────────────────────────────────────

import { fields } from "@/lib/schemas/field-schema";
import { QueryResult } from "@powersync/web";
import { ExtractTablesWithRelations, inArray, or } from "drizzle-orm";
import { SQLiteTransaction } from "drizzle-orm/sqlite-core";
import { tables } from "@/lib/schemas/table-schema";
import { relationships } from "@/lib/schemas/relationship-schema";
import { field_indices } from "@/lib/schemas/field_index-schema";
import { indices } from "@/lib/schemas/index-schema";

// ─────────────────────────────────────────────────────────────────────────────
//  deleteFieldsWithCascade
//
// Manually deletes all related data when a field is removed.
// Removes associated relationships (source/target), field-index mappings, then the field itself.
// Used when deleting one or more fields by ID.
// ─────────────────────────────────────────────────────────────────────────────
export const deleteFieldsWithCascade = async (
    ids: string[],
    tx: SQLiteTransaction<'async', QueryResult, any, ExtractTablesWithRelations<any>>
): Promise<QueryResult[]> => {
    return Promise.all([
        tx.delete(relationships).where(or(
            inArray(relationships.sourceFieldId, ids),
            inArray(relationships.targetFieldId, ids)
        )),
        tx.delete(field_indices).where(inArray(field_indices.fieldId, ids)),
        tx.delete(fields).where(inArray(fields.id, ids)),
    ]);
};

// ─────────────────────────────────────────────────────────────────────────────
//  deleteTablesWithCascade
//
// Handles deletion of entire tables, and manually cascades to:
// - all fields belonging to the table
// - all indices attached to the table
// - all relationships and field-index mappings tied to those fields/indices
//
// This ensures full cleanup when a table is removed in PowerSync context.
// ─────────────────────────────────────────────────────────────────────────────
export const deleteTablesWithCascade = async (
    ids: string[],
    tx: SQLiteTransaction<'async', QueryResult, any, ExtractTablesWithRelations<any>>
): Promise<QueryResult[]> => {

    // Fetch all field IDs belonging to the tables
    let fieldIds: { id: string }[] | string[] = await tx.select({
        id: fields.id
    }).from(fields).where(inArray(fields.tableId, ids));

    // Fetch all index IDs belonging to the tables
    let indicesIds: { id: string }[] | string[] = await tx.select({
        id: indices.id
    }).from(indices).where(inArray(indices.tableId, ids));

    // Normalize into string arrays
    fieldIds = fieldIds.map((fieldId) => fieldId.id);
    indicesIds = indicesIds.map((indexId) => indexId.id);

    return Promise.all([
        // Delete relationships where fields are involved
        tx.delete(relationships).where(or(
            inArray(relationships.sourceFieldId, fieldIds),
            inArray(relationships.targetFieldId, fieldIds)
        )),

        // Delete field-index links for those fields
        tx.delete(field_indices).where(inArray(field_indices.fieldId, fieldIds)),

        // Delete all fields in the table
        tx.delete(fields).where(inArray(fields.id, fieldIds)),

        // Delete field-index links for indices
        tx.delete(field_indices).where(inArray(field_indices.indexId, indicesIds)),

        // Delete all indices belonging to the table
        tx.delete(indices).where(inArray(indices.id, indicesIds)),

        // Finally, delete the table(s) themselves
        tx.delete(tables).where(inArray(tables.id, ids)),
    ]);
};

// ─────────────────────────────────────────────────────────────────────────────
//  deleteIndicesWithCascade
//
// When removing an index, this ensures that any field-index links are removed
// before the index itself is deleted. Prevents dangling associations.
// ─────────────────────────────────────────────────────────────────────────────
export const deleteIndicesWithCascade = async (
    ids: string[],
    tx: SQLiteTransaction<'async', QueryResult, any, ExtractTablesWithRelations<any>>
): Promise<QueryResult[]> => {
    return Promise.all([
        tx.delete(field_indices).where(inArray(field_indices.indexId, ids)),
        tx.delete(indices).where(inArray(indices.id, ids))
    ]);
};
