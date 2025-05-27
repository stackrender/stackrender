

import { sqliteTable, text } from 'drizzle-orm/sqlite-core';

import { indices } from './index-schema';
import { fields } from './field-schema';
import { InferInsertModel, InferSelectModel, relations } from 'drizzle-orm';

export const field_indices = sqliteTable("field_indices", {
    fieldId: text("fieldId").references(() => fields.id, { onDelete: "cascade" }),
    indexId: text("indexId").references(() => indices.id, { onDelete: "cascade" }),
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


export interface FieldIndexType extends InferSelectModel<typeof field_indices> {};


export interface FieldIndexInsertType extends InferInsertModel<typeof field_indices> { }; 