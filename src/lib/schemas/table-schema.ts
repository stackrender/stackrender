import { InferInsertModel, InferSelectModel, relations } from 'drizzle-orm';
import { sqliteTable, text, real, integer } from 'drizzle-orm/sqlite-core';
import { fields, FieldType } from './field-schema';

export const tables = sqliteTable('tables', {
    id: text('id')
        .primaryKey()
        .notNull()
        .unique(),

    databaseId: text('databaseId'),

    name: text('name').notNull(),
    posX: real('posX').notNull().default(0),
    posY: real('posY').notNull().default(0),

    color: text('color'),
    width: real('width'),
    note: text('note'),
    sequence: integer('sequence').default(0),
    createdAt: text('createdAt'),

});


export const tablesRelations = relations(tables, ({ many }) => ({
    fields: many(fields),
}));



export interface TableType extends InferSelectModel<typeof tables> { 
    fields : FieldType[]
}; 


export interface TableInsertType extends InferInsertModel<typeof tables> { 
    fields? : FieldType[]
}; 