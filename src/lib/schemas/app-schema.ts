 
import { DrizzleAppSchema  } from '@powersync/drizzle-driver';
import { data_types, dataTypeRelations } from './data-type-schema';
import { tables, tablesRelations } from './table-schema';
import { fields, fieldsRelations } from './field-schema';
import { relationshipRelations, relationships } from './relationship-schema';
import { databaseRelations, databases } from './database-schema';
import { indices, indicesRlationships } from './index-schema';
import { field_indices, fieldIndicesRelationships } from './field_index-schema';

export const drizzleSchema = {
  data_types , 
  tables , 
  fields , 
  relationships ,
  databases ,  
  indices , 
  field_indices , 

  // relationships 
  tablesRelations , 
  fieldsRelations , 
  relationshipRelations , 
  dataTypeRelations , 
  databaseRelations , 
  indicesRlationships , 
  fieldIndicesRelationships 
};

// Infer the PowerSync schema from your Drizzle schema
export const AppSchema = new DrizzleAppSchema(drizzleSchema);
