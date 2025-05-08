import { InferSelectModel } from 'drizzle-orm';
import {  sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const data_types = sqliteTable('data_types', {
    id : text("id") , 
    name: text('name'),
});



export interface DataType extends InferSelectModel<typeof data_types> { }; 