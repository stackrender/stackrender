import {
    sqliteTable,
    text,
} from 'drizzle-orm/sqlite-core';
import { InferInsertModel, InferSelectModel, relations } from 'drizzle-orm';
import { tables, TableType } from './table-schema';
import { fields, FieldType } from './field-schema';

export const relationships = sqliteTable('relationships', {
    id: text('id').primaryKey().notNull(),

    name: text('name'),

    sourceTableId: text('sourceTableId')
        .notNull()
        .references(() => tables.id, { onDelete: 'cascade' }),

    targetTableId: text('targetTableId')
        .notNull()
        .references(() => tables.id, { onDelete: 'cascade' }),

    sourceFieldId: text('sourceFieldId')
        .notNull()
        .references(() => fields.id, { onDelete: 'cascade' }),

    targetFieldId: text('targetFieldId')
        .notNull()
        .references(() => fields.id, { onDelete: 'cascade' }),

    cardinality: text('cardinality', {
        enum: [
            'one_to_one',
            'one_to_many',
            'many_to_one',
            'many_to_many',
        ],
    })
        .notNull()
        .default('one_to_many'),

    sourceAliasName: text('sourceAliasName'),
    targetAliasName: text('targetAliasName'),
    createdAt: text('createdAt'),
});


export const relationshipRelations = relations(relationships, ({ one }) => ({
    sourceTable: one(tables, {
        fields: [relationships.sourceTableId],
        references: [tables.id],
    }),
    targetTable: one(tables, {
        fields: [relationships.targetTableId],
        references: [tables.id],
    }),
    sourceField: one(fields, {
        fields: [relationships.sourceFieldId],
        references: [fields.id],
    }),
    targetField: one(fields, {
        fields: [relationships.targetFieldId],
        references: [fields.id],
    }),
}));


export interface RelationshipType extends InferSelectModel<typeof relationships> {
    sourceTable : TableType , 
    targetTable : TableType ,
    sourceField : FieldType ,
    targetField : FieldType ,   
 };

export interface RelationshipInsertType extends InferInsertModel<typeof relationships> { };


export enum Cardinality {
    one_to_one = "one_to_one",
    one_to_many = "one_to_many",
    many_to_one = "many_to_one",
    many_to_many = "many_to_many"

}