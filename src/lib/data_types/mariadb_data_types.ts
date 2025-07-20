import { DataInsertType } from "../schemas/data-type-schema";

export const MariaDbDataType: Partial<DataInsertType>[] = [
  // ===== integer =====
  {
    id: 'ce8a95f3-c0eb-4700-aefa-3147fa21377a',
    name: 'bit',
    type: 'integer',
    modifiers: ['length'] // BIT(M) where M is number of bits (1-64)
  },

  {
    id: 'e2ff64e3-96b1-4896-8f92-1dbe5d8bd442',
    name: 'integer',
    type: 'integer',
    modifiers: ['unsigned', 'zerofill', 'length', "auto_increment"], // Same as INT
    synonyms: ['int']

  },
  {
    id: '5b4d8b34-5f33-4660-9443-03ea2eef34fd',
    name: 'tinyint',
    type: 'integer',
    modifiers: ['unsigned', 'zerofill', 'length', "auto_increment"] // TINYINT[(M)] [UNSIGNED] [ZEROFILL]
  },
  {
    id: '6548ff67-1800-447b-8fbd-87003a43dc05',
    name: 'smallint',
    type: 'integer',
    modifiers: ['unsigned', 'zerofill', 'length', "auto_increment"] // SMALLINT[(M)] [UNSIGNED] [ZEROFILL]
  },
  {
    id: '5991fbbb-6180-4f4c-9f3f-af8f94931bae',
    name: 'mediumint',
    type: 'integer',
    modifiers: ['unsigned', 'zerofill', 'length', "auto_increment"] // MEDIUMINT[(M)] [UNSIGNED] [ZEROFILL]
  },
  {
    id: 'e7b9e8f8-6a87-4ee7-a411-af5775cd0b88',
    name: 'bigint',
    type: 'integer',
    modifiers: ['unsigned', 'zerofill', 'length', "auto_increment"] // BIGINT[(M)] [UNSIGNED] [ZEROFILL]
  },

  // ===== numeric =====
  {
    id: '59abc150-6796-46ee-940c-88eb34eae619',
    name: 'float',
    type: 'numeric',
    modifiers: ['precision', "scale", 'unsigned', 'zerofill'] // FLOAT[(M,D)] [UNSIGNED] [ZEROFILL]
  },
  {
    id: '1ccdde6d-45ae-4ab8-9020-d0d123175037',
    name: 'double',
    type: 'numeric',
    modifiers: ['precision', "scale", 'unsigned', 'zerofill'],  // DOUBLE[(M,D)] [UNSIGNED] [ZEROFILL]
    synonyms: ['double precision', 'real']

  },

  {
    id: '3089e057-7ea0-4422-9f8b-b03c1c4aadb1',
    name: 'decimal',
    type: 'numeric',
    modifiers: ['precision', "scale", 'unsigned', 'zerofill'], // DECIMAL[(M[,D])] [UNSIGNED] [ZEROFILL]
    synonyms: ['dec', 'numeric', 'fixed']
  },





  {
    id: '70c98043-ce75-4e17-8157-b4060b600cc0',
    name: 'boolean',
    type: 'boolean',
    synonyms: ['bool'] // BOOLEAN and BOOL are both aliases for TINYINT(1)

    // Alias for TINYINT(1)
  },

  // ===== date/time =====
  {
    id: 'bd2d44eb-d4dc-45bc-b1c8-39bff5c703a6',
    name: 'date',
    type: 'time',
    // No modifiers
  },
  {
    id: '2344419d-c226-42a3-bdf4-77e4181a7f81',
    name: 'datetime',
    type: 'time',
    modifiers: ['precision'] // DATETIME[(fsp)], fsp = fractional seconds precision (0-6)
  },
  {
    id: '2b2d6921-b364-4953-a94d-048c43037e35',
    name: 'timestamp',
    type: 'time',
    modifiers: ['precision'] // TIMESTAMP[(fsp)], fsp = fractional seconds precision (0-6)
  },
  {
    id: '6b40d621-d7c5-408e-b784-c839b6c36bed',
    name: 'time',
    type: 'time',
    modifiers: ['precision'] // TIME[(fsp)], fsp = fractional seconds precision (0-6)
  },
  {
    id: '2da3d963-ee00-4472-8b61-38b3f22bdeb6',
    name: 'year',
    type: 'time',
    // YEAR[(2|4)], but 2-digit YEAR is deprecated
  },

  // ===== text =====
  {
    id: '3d1c4ddc-a71b-42c6-b935-abb571999055',
    name: 'char',
    type: 'text',
    modifiers: ['length', 'charset', 'collate'] // CHAR[(M)] [CHARACTER SET charset] [COLLATE collation]
  },

  {
    id: 'dfba8595-d9da-4efa-b5e7-a759c07a7984',
    name: 'varchar',
    type: 'text',
    modifiers: ['length', 'charset', 'collate'],  // VARCHAR(M) [CHARACTER SET charset] [COLLATE collation]
    synonyms: ['nchar', 'national char']
  },

  {
    id: '2dc7ba21-e477-47ff-b736-836f7a6586c6',
    name: 'text',
    type: 'text',
    modifiers: ['charset', 'collate', "no_default", "no_unique"], // TEXT [CHARACTER SET charset] [COLLATE collation]
    synonyms: ['nvarchar', 'national varchar']
  },
  {
    id: '51467e54-6257-4431-b161-477aa74857d5',
    name: 'tinytext',
    type: 'text',
    modifiers: ['charset', 'collate', "no_default", "no_unique"] // Same as TEXT
  },
  {
    id: '62399f45-0a58-4b7e-826e-d40278399b19',
    name: 'mediumtext',
    type: 'text',
    modifiers: ['charset', 'collate', "no_default", "no_unique"] // Same as TEXT
  },
  {
    id: 'd0a90fad-ed80-43c5-9388-2e416cfa07dd',
    name: 'longtext',
    type: 'text',
    modifiers: ['charset', 'collate', "no_default", "no_unique"] // Same as TEXT
  },

  // ===== binary (bytea) =====
  {
    id: '4c08fd5b-3744-44d1-a57a-e81290a1a29b',
    name: 'blob',
    type: 'binary',
    modifiers: ["no_default", "no_unique"]
  },
  {
    id: '8183a869-7c46-4bee-9560-e5965b824aba',
    name: 'tinyblob',
    type: 'binary',
    modifiers: ["no_default", "no_unique"]
  },
  {
    id: '3edc6207-e595-45c9-af0d-056b4d991b21',
    name: 'mediumblob',
    type: 'binary',
    modifiers: ["no_default", "no_unique"]

  },
  {
    id: 'c3cbe13f-38bf-4ef5-b448-ed9bda3c673b',
    name: 'longblob',
    type: 'binary',
    modifiers: ["no_default", "no_unique"]
  },
  {
    id: 'f2930d56-1903-4710-9c4c-d635123bfaec',
    name: 'binary',
    type: 'binary',
    modifiers: ["no_default", 'length'] // BINARY(M)
  },
  {
    id: '646d8483-d585-4b7c-8255-5bd36bf9240e',
    name: 'varbinary',
    type: 'binary',
    modifiers: ["no_default", 'length'] // VARBINARY(M)
  },

  // ===== enum/set =====
  {
    id: '0c9fca72-ead9-4abc-8726-3074bb49c878',
    name: 'enum',
    type: 'enum',
    modifiers: ['values'] // ENUM('value1','value2',...) [CHARACTER SET charset] [COLLATE collation]
  },
  {
    id: '378b77b6-d27c-4bb1-beea-6f0423bd1776',
    name: 'set',
    type: 'enum',
    modifiers: ['values'] // SET('value1','value2',...) [CHARACTER SET charset] [COLLATE collation]
  },

  // ===== json =====
  {
    id: '40222e5e-40a6-43a5-b5c6-2a89601ee30b',
    name: 'json',
    type: 'json',
    modifiers: ["no_default", "no_unique"]
    // No modifiers
  },

  // ===== spatial =====
  // Spatial types generally don't have modifiers
  {
    id: '06c24cc7-0ad8-4e05-a2bd-c1b7fb881fa3',
    name: 'geometry',
    type: 'geometry',
    modifiers: ["no_default", "no_unique"]

  },
  {
    id: '8a3363e8-ebce-4ec1-b022-b18cf52a4769',
    name: 'point',
    type: 'geometry',
    modifiers: ["no_default", "no_unique"]
  },
  {
    id: '5018b1a6-6a62-4f58-9c49-fc96efeb1b38',
    name: 'linestring',

    type: 'geometry',
    modifiers: ["no_default", "no_unique"]

  },
  {
    id: '0edf91e8-4f10-41b1-9fc9-3c024c5f90c4',
    name: 'polygon',

    type: 'geometry',
    modifiers: ["no_default", "no_unique"]

  },
  {
    id: '0be92649-f626-4dc8-a163-c86643ca6687',
    name: 'multipoint',

    type: 'geometry',
    modifiers: ["no_default", "no_unique"]

  },
  {
    id: 'c996968e-a83b-44af-aca0-755865cd8825',
    name: 'multilinestring',

    type: 'geometry',
    modifiers: ["no_default", "no_unique"]

  },
  {
    id: '3fa4450a-78b1-4243-9faf-178c607ac092',
    name: 'multipolygon',

    type: 'geometry',
    modifiers: ["no_default", "no_unique"]

  },
  {
    id: '584bf784-3193-4534-8078-392558fc625f',
    name: 'geometrycollection',

    type: 'geometry',
    modifiers: ["no_default", "no_unique"]

  },

  // ===== MariaDB-specific additions =====
  {
    id: '7e092014-b75f-4a62-b447-0c5d4af91bc7',
    name: 'uuid',
    type: 'uuid',
    // No modifiers
  },
  {
    id: 'd6483b02-4eaf-418d-ab00-1818ca40d749',
    name: 'inet4',
    type: 'network',
    modifiers: ["no_default"]
    // No modifiers
  },
  {
    id: '90adf29b-e993-4215-8241-38dfb31a1139',
    name: 'inet6',
    type: 'network',
    modifiers: ["no_default"]
    // No modifiers
  }
];