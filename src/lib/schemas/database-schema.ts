import { InferInsertModel, InferSelectModel, relations } from 'drizzle-orm';
import { sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { tables, TableType } from './table-schema';
import { relationships, RelationshipType } from './relationship-schema';


export const databases = sqliteTable('databases', {
    id: text('id')
        .primaryKey()
        .notNull()
        .unique(),
    name: text('name').notNull(),
    createdAt: text('createdAt'),
});

export const databaseRelations = relations(databases, ({ many }) => ({
    tables: many(tables),
    relationships: many(relationships),
}));


export interface DatabaseType extends InferSelectModel<typeof databases> {
    tables : TableType[] , 
    relationships : RelationshipType[] 
 };
export interface DatabaseInsertType extends InferInsertModel<typeof databases> { }; 