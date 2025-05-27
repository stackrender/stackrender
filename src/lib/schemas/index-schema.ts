

import { sqliteTable, text, integer  } from 'drizzle-orm/sqlite-core';
import { tables } from './table-schema';
import { InferInsertModel, InferSelectModel, relations } from 'drizzle-orm';
import { field_indices, FieldIndexInsertType, FieldIndexType } from './field_index-schema';
import { fields } from './field-schema';



export const indices = sqliteTable("indices", {
    id: text("id").primaryKey().notNull(),
    tableId: text("tableId")
        .notNull()
        .references(() => tables.id, { onDelete: "cascade" }),

    name: text("name").notNull(),
    unique: integer("unique", { mode: "boolean" }),
    createdAt: text('createdAt'),
    
});


export const indicesRlationships = relations(indices, ({ one, many }) => ({
    table: one(tables, {
        references: [tables.id],
        fields: [indices.tableId]
    }),
    fieldIndices: many(field_indices),
    fields: many(fields)
}))


export interface IndexType extends InferSelectModel<typeof indices> {
    fieldIndices: FieldIndexType[]
};
export interface IndexInsertType extends InferInsertModel<typeof indices> {
    fieldIndices? : FieldIndexInsertType[]
}; 