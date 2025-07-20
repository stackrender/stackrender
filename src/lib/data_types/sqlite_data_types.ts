import { DataInsertType } from "../schemas/data-type-schema";

export const SqliteDataTypes: Partial<DataInsertType>[]  = [
  // ===== INTEGER =====
  {
    id: 'dea77641-e050-4392-9c14-e53cafa1bcab', // using canonical 'integer'
    name: 'integer',
    type: 'integer',
    modifiers: ['auto_increment'], // Only valid with PRIMARY KEY
    synonyms: [
      'int',
      'tinyint',
      'smallint',
      'mediumint',
      'bigint',
      'unsigned big int',
      'int2',
      'int8'
    ]
  },

  // ===== TEXT =====
  {
    id: '862ee99c-a1d9-4652-a35a-a545712d39db', // 'text'
    name: 'text',
    type: 'text',
    modifiers: ['length'],  // Length ignored but can exist in UI
    synonyms: [
      'character',
      'varchar',
      'varying character',
      'nchar',
      'native character',
      'nvarchar',
      'clob'
    ]
  },

  // ===== REAL =====
  {
    id: '79f8e7a8-b36b-488a-9703-aa7593dcdfa4', // 'real'
    name: 'real',
    type: 'numeric',
    synonyms: [
      'float',
      'double',
      'double precision'
    ]
  },

  // ===== NUMERIC =====
  {
    id: '36ea1bc0-8f4f-4d9d-9a74-31458a65062c', // 'numeric'
    name: 'numeric',
    type: 'numeric',
    modifiers: ['precision'], // Precision/scale ignored
    synonyms: [
      'decimal'
    ]
  },

  // ===== BLOB =====
  {
    id: '577161ce-7085-4484-af44-d25304c8c63b', // 'blob'
    name: 'blob',
    type: 'binary',
    modifiers: ["no_default", "no_unique"]
  },

  // ===== BOOLEAN =====
  {
    id: '263a800f-e6c1-4287-91ad-d6688cb9f1e1', // 'boolean'
    name: 'boolean',
    type: 'boolean'
  },

  // ===== DATE / TIME =====
  {
    id: 'c438e00b-f7f8-4343-807d-96a6a3fff1c4', // 'date'
    name: 'date',
    type: 'time'
  },
  {
    id: 'ef9455e5-3d56-48bd-8ba6-4c4d13a72fb9', // 'time'
    name: 'time',
    type: 'time'
  },
  {
    id: '0e2a61ea-05dc-4b67-ab84-04caac829d57', // 'datetime'
    name: 'datetime',
    type: 'time'
  },

  // ===== JSON =====
  {
    id: 'a8cdd25f-dbd5-4582-b42d-641e5862de01', // 'json'
    name: 'json',
    type: 'json',
    modifiers: ["no_default", "no_unique"]
  }
];