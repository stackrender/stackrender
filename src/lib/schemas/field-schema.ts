import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { tables } from './table-schema';
import { data_types, DataType } from './data-type-schema';
import { InferInsertModel, InferSelectModel, relations } from 'drizzle-orm';
import { relationships, RelationshipType } from './relationship-schema';
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
    maxLength: integer('maxLength') , // or `.nullable()` if you're using drizzle-kit latest
    unsigned: integer('unsigned' , {mode : "boolean"}).default(false),
    isForeign: integer('isForeign', {mode : "boolean"}).default(false),
    zeroFill: integer('zeroFill', {mode : "boolean"}).default(false),
    autoIncrement: integer('autoIncrement', {mode : "boolean"}).default(false),
    precision: integer('precision'),
    scale: integer('scale'),
    charset: text('charset'),
    collate: text('collate'),
    values: text('values'),
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
    sourceRelations: many(relationships),
    targetRelations: many(relationships),

    fieldIndices: many(field_indices),
    indices: many(indices)
}));


export interface FieldType extends InferSelectModel<typeof fields> {
    sequence: number,
    type: DataType,
    sourceRelations?: RelationshipType[],
    targetRelations?: RelationshipType[]
};


export interface FieldInsertType extends InferInsertModel<typeof fields> {

}; 