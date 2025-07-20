import { DataInsertType } from "../schemas/data-type-schema";

export const MysqlDataType :  Partial<DataInsertType>[] = [
  // ===== integer =====

  {
    id: '53a71e01-345e-4894-bc99-15148dadd1f5',
    name: 'integer',
    type: 'integer',
    modifiers: ['length', 'unsigned', 'zerofill', "auto_increment"], // Same as INT 
    synonyms: ["int"]
  },
  {
    id: '838da726-648b-4b39-b589-f07c6f9ad249',
    name: 'tinyint',
    type: 'integer',
    modifiers: ['length', 'unsigned', 'zerofill', "auto_increment"] // TINYINT[(M)] [UNSIGNED] [ZEROFILL]
  },
  {
    id: '244e63ba-b172-4af5-8b82-ffbf7fb98b37',
    name: 'smallint',
    type: 'integer',
    modifiers: ['length', 'unsigned', 'zerofill', "auto_increment"] // SMALLINT[(M)] [UNSIGNED] [ZEROFILL]
  },
  {
    id: 'f34a507e-d99d-4129-967b-16436580e23a',
    name: 'mediumint',
    type: 'integer',
    modifiers: ['length', 'unsigned', 'zerofill', "auto_increment"] // MEDIUMINT[(M)] [UNSIGNED] [ZEROFILL]
  },
  {
    id: '37f5a67a-5366-4b0a-aa2d-b94f7cae0c09',
    name: 'bigint',
    type: 'integer',
    modifiers: ['length', 'unsigned', 'zerofill', "auto_increment"] // BIGINT[(M)] [UNSIGNED] [ZEROFILL]
  },

  // ===== numeric =====
  {
    id: '40183231-7a46-4f40-9b54-69a573ce61d1',
    name: 'float',
    type: 'numeric',
    modifiers: ['precision', "scale", 'unsigned', 'zerofill'],
    synonyms: ['float4']
  },
  {
    id: 'b1b1ccf9-b349-453e-a3dd-1ca7751d27f1',
    name: 'double',
    type: 'numeric',
    modifiers: ['precision', "scale", 'unsigned', 'zerofill'],
    synonyms: ['double precision', 'real', 'float8']

  },
  {
    id: '094e7c4c-ae7f-414f-b7aa-6d44e7f357c2',
    name: 'decimal',
    type: 'numeric',
    modifiers: ['precision', "scale", 'unsigned', 'zerofill'],
    synonyms: ['dec', 'numeric', 'fixed']
  },


  {
    id: '73eac02b-27e6-4d74-a161-00809c85be01',
    name: 'boolean',
    type: 'boolean',
    synonyms: ['bool'],
  },

  // ===== date =====
  {
    id: '8fb4b59c-ab26-4377-a329-aca5bce94ef7',
    name: 'date',
    type: 'time',
    // No modifiers
  },

  // ===== timestamp =====
  {
    id: 'c53ab7b7-a453-4669-80c8-cad828e4c95d',
    name: 'datetime',
    type: 'time',
    modifiers: ['precision'] // DATETIME[(fsp)], fsp = fractional seconds (0-6)
  },
  {
    id: 'c2c12ebd-9e71-45d9-979b-868335fbf29a',
    name: 'timestamp',
    type: 'time',
    modifiers: ['precision'] // TIMESTAMP[(fsp)], fsp = fractional seconds (0-6)
  },

  // ===== time =====
  {
    id: '0097a5e9-2e8b-46f8-a27b-229e05c0ad3e',
    name: 'time',
    type: 'time',
    modifiers: ['precision'] // TIME[(fsp)], fsp = fractional seconds (0-6)
  },
  {
    id: 'd22941e8-c036-4fda-b7b7-003e5e9d92d5',
    name: 'year',
    type: 'time',
    // YEAR[(2|4)], but 2-digit YEAR is deprecated
  },

  {
    id: "98bf3653-ef15-4528-8319-9053f7ce0b9a",
    name: "char",
    type: "text",
    modifiers: ["length", "charset", "collate"],
    synonyms: ["nchar", "national char"] // CHAR = NCHAR = NATIONAL CHAR
  },
  {
    id: "e9b4026d-67bb-4478-812a-760a1312dcb3",
    name: "varchar",
    type: "text",
    modifiers: ["length", "charset", "collate"] , 
      synonyms: ["nvarchar", "national varchar"] // VARCHAR = NVARCHAR = NATIONAL VARCHAR

  },
  {
    id: "1caa0a4a-fa8e-4ca1-85af-ed3355f91789",
    name: "text",
    type: "text",
    modifiers: ["charset", "collate", "no_default", "no_unique"]
  },
  {
    id: "04cb1391-b46b-452f-8e36-cd90fbbd0c9b",
    name: "tinytext",
    type: "text",
    modifiers: ["charset", "collate", "no_default", "no_unique"]
  },
  {
    id: "0eb12f0c-d9b9-4355-b097-cffb5174ec48",
    name: "mediumtext",
    type: "text",
    modifiers: ["charset", "collate", "no_default", "no_unique"]
  },
  {
    id: "3f7402aa-d1e4-416a-9f0c-39063a5253ef",
    name: "longtext",
    type: "text",
    modifiers: ["charset", "collate", "no_default", "no_unique"]
  },

  // ===== binary =====
  {
    id: '9437b53d-3ad0-4079-9b51-afd433e91085',
    name: 'binary',
    type: 'binary',
    modifiers: ["no_default", 'length'] // BINARY(M)
  },
  {
    id: 'ccbc6f5f-07d4-43e2-b3e2-ca802e373a7b',
    name: 'varbinary',
    type: 'binary',
    modifiers: ["no_default", 'length'] // VARBINARY(M)
  },
  {
    id: '5f03ac95-b931-444f-9837-519a785cc098',
    name: 'blob',
    type: 'binary',
    modifiers: ["no_default", "no_unique"]
    // BLOB
  },
  {
    id: '9d677b18-2a4a-435f-ac8a-4ba0ceef9148',
    name: 'tinyblob',
    type: 'binary',
    modifiers: ["no_default", "no_unique"]
    // TINYBLOB
  },
  {
    id: 'ab7f73d6-bdaf-4485-a4da-d94467f157d7',
    name: 'mediumblob',
    type: 'binary',
    modifiers: ["no_default", "no_unique"]
    // MEDIUMBLOB
  },
  {
    id: '9367631e-3e05-4b85-9937-9b7e80ac7430',
    name: 'longblob',
    type: 'binary',
    modifiers: ["no_default", "no_unique"]
    // LONGBLOB
  },

  // ===== enum =====
  {
    id: '0e964e0c-f1f0-4bfd-84f7-dd82f07973aa',
    name: 'enum',
    type: 'enum',
    modifiers: ['values'] // ENUM('value1','value2',...) [CHARACTER SET charset] [COLLATE collation]
  },
  {
    id: '793c840c-b11e-484d-aaed-c9bbdee4b422',
    name: 'set',
    type: 'enum',
    modifiers: ['values'] // SET('value1','value2',...) [CHARACTER SET charset] [COLLATE collation]
  },

  // ===== json =====
  {
    id: '9c9efa25-4db9-44f8-905b-948608f9119f',
    name: 'json',
    type: 'json',
    modifiers: ["no_default", "no_unique"]
    // No modifiers
  },

  {
    id: '821e41e2-c7d0-4a89-86cf-501df764eb15',
    name: 'geometry',
    type: 'geometry',
    modifiers: ["no_default", "no_unique"]
  },
  {
    id: '5de94b34-3a89-4650-98f6-8779bf0370db',
    name: 'point',
    type: 'geometry',
    modifiers: ["no_default", "no_unique"]
  },
  {
    id: '353225e7-0da6-4bdc-8fd9-101bf3c5b8f3',
    name: 'linestring',
    type: 'geometry',
    modifiers: ["no_default", "no_unique"]
  },
  {
    id: '71f34268-df34-448a-bf4f-95a67e03653c',
    name: 'polygon',
    type: 'geometry',
    modifiers: ["no_default", "no_unique"]
  },
  {
    id: '3ed65825-6bd3-4d3a-82aa-be8ff168d450',
    name: 'geometrycollection',
    type: 'geometry',
    modifiers: ["no_default", "no_unique"]
  }
];