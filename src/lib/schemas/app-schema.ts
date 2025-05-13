 
import { DrizzleAppSchema, wrapPowerSyncWithDrizzle } from '@powersync/drizzle-driver';
import { data_types, dataTypeRelations } from './data-type-schema';
import { tables, tablesRelations } from './table-schema';
import { fields, fieldsRelations } from './field-schema';
import { relationshipRelations, relationships } from './relationship-schema';

export const drizzleSchema = {
  data_types , 
  tables , 
  fields , 
  relationships , 

  // relationships 
  tablesRelations , 
  fieldsRelations , 
  relationshipRelations , 
  dataTypeRelations 
};

// Infer the PowerSync schema from your Drizzle schema
export const AppSchema = new DrizzleAppSchema(drizzleSchema);
