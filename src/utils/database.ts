// Importing types from schema definitions
import { DatabaseType } from "@/lib/schemas/database-schema";
import { FieldType } from "@/lib/schemas/field-schema";
import { RelationshipType } from "@/lib/schemas/relationship-schema";
import { TableType } from "@/lib/schemas/table-schema";
import { excludeFields } from "./utils";

// Define the possible operations that can be performed when diffing databases
export type DBDiffOperation =
    | { type: 'CREATE_TABLE'; table: TableType }
    | { type: 'DELETE_TABLE'; tableId: string }
    | { type: 'UPDATE_TABLE'; tableId: string; changes: Partial<TableType> }
    | { type: 'CREATE_FIELD'; tableId: string; field: FieldType }
    | { type: 'DELETE_FIELD'; tableId: string; fieldId: string }
    | { type: 'UPDATE_FIELD'; tableId: string; fieldId: string; changes: Partial<FieldType> }
    | { type: 'CREATE_RELATIONSHIP'; relationship: RelationshipType }
    | { type: 'DELETE_RELATIONSHIP'; relationshipId: string }
    | { type: 'UPDATE_RELATIONSHIP'; relationshipId: string; changes: Partial<RelationshipType> };

/**
 * Convert a list of low-level JSON patch operations into higher-level database diff operations
 */
export function mapDiffToDBDiffOperation(patch: any[]): DBDiffOperation[] {
    const operations: DBDiffOperation[] = [];

    // Track changes for tables, fields, and relationships
    const tableChanges: Record<string, Partial<TableType>> = {};
    const fieldChanges: Record<string, Record<string, Partial<FieldType>>> = {};
    const fieldCreates: Record<string, FieldType[]> = {};
    const fieldDeletes: Record<string, string[]> = {};
    const relationshipChanges: Record<string, Partial<RelationshipType>> = {};
    const relationshipCreates: RelationshipType[] = [];
    const relationshipDeletes: string[] = [];

    // Loop through each patch operation
    for (const op of patch) {
        const parts = op.path.split('/').filter(Boolean); // Split JSON path into parts

        // Handle table-related changes
        if (parts[0] == "tables") {
            const tableId = parts[1];

            // Whole table operations (add/delete table)
            if (parts.length === 2) {
                if (op.op === 'add') {
                    operations.push({ type: 'CREATE_TABLE', table: op.value });
                } else if (op.op === 'remove') {
                    operations.push({ type: 'DELETE_TABLE', tableId });
                }
            }

            // Field-related operations inside a table
            else if (parts[2] === 'fields') {
                const fieldId = parts[3];

                if (op.op === 'add') {
                    fieldCreates[tableId] ??= [];
                    fieldCreates[tableId].push(op.value);
                } else if (op.op === 'remove') {
                    fieldDeletes[tableId] ??= [];
                    fieldDeletes[tableId].push(fieldId);
                } else if (op.op === 'replace') {
                    const attr = parts.slice(4).join('/');
                    fieldChanges[tableId] ??= {};
                    fieldChanges[tableId][fieldId] ??= {};
                    fieldChanges[tableId][fieldId][attr as keyof FieldType] = op.value;
                }
            }

            // Updating table attributes (e.g., name, position, etc.)
            else if (op.op === 'replace') {
                const attr = parts[2];
                tableChanges[tableId] ??= {};
                tableChanges[tableId][attr as keyof TableType] = op.value;
            }
        }

        // Handle relationship-related changes
        else if (parts[0] === 'relationships') {
            const relationshipId = parts[1];

            // Create or delete the entire relationship
            if (parts.length === 2) {
                if (op.op === 'add') {
                    relationshipCreates.push(op.value);
                } else if (op.op === 'remove') {
                    relationshipDeletes.push(relationshipId);
                }
            }

            // Update relationship properties (e.g., type, constraints)
            else if (op.op === 'replace') {
                const attr = parts.slice(2).join('/');
                relationshipChanges[relationshipId] ??= {};
                relationshipChanges[relationshipId][attr as keyof RelationshipType] = op.value;
            }
        }
    }

    // Push table update operations
    for (const [tableId, changes] of Object.entries(tableChanges)) {
        operations.push({
            type: 'UPDATE_TABLE',
            tableId,
            changes
        });
    }

    // Push field update operations
    for (const [tableId, fields] of Object.entries(fieldChanges)) {
        for (const [fieldId, changes] of Object.entries(fields)) {
            operations.push({
                type: 'UPDATE_FIELD',
                tableId,
                fieldId,
                changes
            });
        }
    }

    // Push field creation operations
    for (const [tableId, fields] of Object.entries(fieldCreates)) {
        for (const field of fields) {
            operations.push({
                type: 'CREATE_FIELD',
                tableId,
                field
            });
        }
    }

    // Push field deletion operations
    for (const [tableId, fieldIds] of Object.entries(fieldDeletes)) {
        for (const fieldId of fieldIds) {
            operations.push({
                type: 'DELETE_FIELD',
                tableId,
                fieldId
            });
        }
    }

    // Push relationship creation operations
    for (const relationship of relationshipCreates) {
        operations.push({ type: 'CREATE_RELATIONSHIP', relationship });
    }

    // Push relationship deletion operations
    for (const relationshipId of relationshipDeletes) {
        operations.push({ type: 'DELETE_RELATIONSHIP', relationshipId });
    }

    // Push relationship update operations
    for (const [relationshipId, changes] of Object.entries(relationshipChanges)) {
        operations.push({ type: 'UPDATE_RELATIONSHIP', relationshipId, changes });
    }

    return operations;
}

/**
 * Convert a Database object to a normalized form:
 * - Convert arrays to maps keyed by ID for easier access
 * - Exclude some fields from relationships to avoid circular references
 */
export function normalizeDatabase(db: DatabaseType): any {
    return {
        ...db,
        tables: Object.fromEntries(
            db.tables.map(table => [
                table.id,
                {
                    ...table,
                    fields: Object.fromEntries(
                        table.fields.map(field => [field.id, field])
                    )
                }
            ])
        ),
        relationships: Object.fromEntries(
            db.relationships.map((rel: RelationshipType) => [
                rel.id,
                excludeFields(rel, {
                    root: ["sourceField", "targetField", "sourceTable", "targetTable"]
                })
            ])
        )
    };
}
