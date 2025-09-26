import { InferInsertModel, InferSelectModel, relations } from 'drizzle-orm';
import { sqliteTable, text, real, integer } from 'drizzle-orm/sqlite-core';
import { fields, FieldType } from './field-schema';
import { relationships, RelationshipType } from './relationship-schema';
import { databases } from './database-schema';
import { IndexType, indices } from './index-schema';

export const tables = sqliteTable('tables', {
    id: text('id')
        .primaryKey()
        .notNull()
        .unique(),

    databaseId: text("databaseId").notNull().references(() => databases.id, { onDelete: "cascade" }),

    name: text('name').notNull(),
    posX: real('posX').notNull().default(0),
    posY: real('posY').notNull().default(0),

    color: text('color'),
    width: real('width'),
    note: text('note'),
    sequence: integer('sequence').default(0),
    createdAt: text('createdAt'),
});


export const tablesRelations = relations(tables, ({ many, one }) => ({
    fields: many(fields),
    sourceRelations: many(relationships),
    targetRelations: many(relationships),
    database: one(databases, {
        fields: [tables.databaseId],
        references: [databases.id],
    }) , 
    indices : many(indices) , 
    
    
}));



export interface TableType extends InferSelectModel<typeof tables> {
    fields: FieldType[];
    indices : IndexType[] ; 
    
    sourceRelations? :RelationshipType[] ; 
    targetRelations? : RelationshipType[] ; 
    
    sequence : number ;  
};


export interface TableInsertType extends InferInsertModel<typeof tables> {
    fields?: FieldType[];
    
}; 