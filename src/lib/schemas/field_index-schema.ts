import { sqliteTable, text, primaryKey } from 'drizzle-orm/sqlite-core';
import { indices } from './index-schema';
import { fields } from './field-schema';
import { InferInsertModel, InferSelectModel, relations } from 'drizzle-orm';

export const field_indices = sqliteTable("field_indices", {
    id: text('id')
        .primaryKey()
        .notNull()
        .unique(),
    fieldId: text("fieldId").notNull().references(() => fields.id, { onDelete: "cascade" }),
    indexId: text("indexId").notNull().references(() => indices.id, { onDelete: "cascade" }),
});


export const fieldIndicesRelationships = relations(field_indices, ({ one }) => ({
    field: one(fields, {
        fields: [field_indices.fieldId],
        references: [fields.id]
    }),

    index: one(indices, {
        fields: [field_indices.indexId],
        references: [indices.id]
    }),
}))


export interface FieldIndexType extends InferSelectModel<typeof field_indices> { };


export interface FieldIndexInsertType extends InferInsertModel<typeof field_indices> { }; 