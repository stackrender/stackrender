 
import { DrizzleAppSchema, wrapPowerSyncWithDrizzle } from '@powersync/drizzle-driver';
import { data_types } from './data-type-schema';
import { tables, tablesRelations } from './table-schema';
import { fields, fieldsRelations } from './field-schema';

export const drizzleSchema = {
  data_types , 
  tables , 
  fields , 


  // relationships 
  tablesRelations , 
  fieldsRelations 
};

// Infer the PowerSync schema from your Drizzle schema
export const AppSchema = new DrizzleAppSchema(drizzleSchema);
