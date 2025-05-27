import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { tables } from './table-schema';
import { data_types, DataType } from './data-type-schema';
import { InferInsertModel, InferSelectModel, relations } from 'drizzle-orm';
import { relationships } from './relationship-schema';
import { field_indices } from './field_index-schema';
import { indices } from './index-schema';


export const fields = sqliteTable("fields", {
    id: text("id").primaryKey().notNull(),
    tableId: text("tableId")
        .notNull()
        .references(() => tables.id, { onDelete: "cascade" }),

    name: text("name").notNull(),
    isPrimary: integer("isPrimary", { mode: "boolean" }),
    unique: integer("unique", { mode: "boolean" }),
    nullable: integer("nullable", { mode: "boolean" }),
    defaultValue: text("defaultValue"),
    note: text("note"),
    typeId: text("typeId").references(() => data_types.id, { onDelete: "cascade" }),
    sequence: integer("sequence").default(0),
});

export const fieldsRelations = relations(fields, ({ one, many }) => ({
    table: one(tables, {
        fields: [fields.tableId],
        references: [tables.id],
    }),
    type: one(data_types, {
        fields: [fields.typeId],
        references: [data_types.id]
    }),
    sourceRelations: one(relationships),
    targetRelations: one(relationships),

    fieldIndices: many(field_indices),
    indices: many(indices)
}));


export interface FieldType extends InferSelectModel<typeof fields> {
    sequence: number,
    type: DataType
};


export interface FieldInsertType extends InferInsertModel<typeof fields> { }; 