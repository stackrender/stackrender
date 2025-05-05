import { column, Schema, Table } from '@powersync/web';

export const DATATYPE_TABLE = 'dataTypes';


const data_types = new Table(
  {
    name: column.text,
  },
);

 

export const AppSchema = new Schema({
  data_types,
 
});

export type Database = (typeof AppSchema)['types'];
export type DataTypesRecord = Database['data_types'];
// OR:
// export type Todo = RowType<typeof todos>;
 

