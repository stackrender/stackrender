import { InferSelectModel, relations } from 'drizzle-orm';
import { sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { fields } from './field-schema';

export const data_types = sqliteTable('data_types', {
    id: text("id"),
    name: text('name'),

    dialect: text("dialect", {
        enum: ["postgres", "mysql", "sqlite", "mariadb"],
    }).notNull().default("postgres"),
});



export const dataTypeRelations = relations(fields, ({ many }) => ({
    fields: many(fields),
}));


export interface DataType extends InferSelectModel<typeof data_types> { }; 