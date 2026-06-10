import { DataInsertType } from "../schemas/data-type-schema";

export const OracleDataType: Partial<DataInsertType>[] = [
    {
        id: '7b79fc89-38ae-4cf7-bdb8-1a270c2c4f0b',
        name: 'number',
        type: 'numeric',
        modifiers: ['precision', 'scale', "auto_increment"],
        synonyms: ['decimal', 'dec', 'numeric']
    },
    {
        id: 'fc4ba819-cbf8-4550-9e78-6f7a05883f55',
        name: 'integer',
        type: 'integer',
        modifiers: ["auto_increment"],
        synonyms: ['int', 'smallint']
    },
    {
        id: 'd4a2a12b-1c72-443a-9c9b-b30a0a4e64d3',
        name: 'float',
        type: 'numeric',
        modifiers: ['precision']
    },
    {
        id: 'd2b819bd-028a-4790-8e32-a1e06c6cb82c',
        name: 'binary_float',
        type: 'numeric'
    },
    {
        id: '6a04aad8-b97e-4a57-ae1a-b270f3885821',
        name: 'binary_double',
        type: 'numeric'
    },
    {
        id: 'a15c03d8-e8f1-4285-8148-134311b403e4',
        name: 'varchar2',
        type: 'text',
        modifiers: ['length'],
        synonyms: ['varchar', 'character varying']
    },
    {
        id: 'f5932edf-41bc-4d52-ad1d-4501acbe77f1',
        name: 'char',
        type: 'text',
        modifiers: ['length'],
        synonyms: ['character']
    },
    {
        id: 'ac67bfe8-6c83-4729-b9b2-ac6fbca5699f',
        name: 'nchar',
        type: 'text',
        modifiers: ['length']
    },
    {
        id: 'bd515b9f-1355-436a-9ff6-f007d61361f2',
        name: 'nvarchar2',
        type: 'text',
        modifiers: ['length']
    },
    {
        id: '16115bbb-a06e-4663-96c5-6169398aba60',
        name: 'clob',
        type: 'lob',
        modifiers: ['no_default' , 'no_unique']
    },
    {
        id: 'a0e84fd7-dae8-4f1c-b989-acae67eedbf5',
        name: 'nclob',
        type: 'lob',
        modifiers: ['no_default' , 'no_unique']
    },
    {
        id: '18762e8d-8fa7-43cf-9e0a-4205f2b2f3b1',
        name: 'blob',
        type: 'lob',
        modifiers: ['no_default' , 'no_unique']
    },
    {
        id: 'c19f392c-6edc-439c-a65b-a52f1d616051',
        name: 'bfile',
        type: 'lob',
        modifiers: ['no_default' , 'no_unique']
    },
    {
        id: '699d85c7-080e-4ec9-ae3c-2dafdaf4cd27',
        name: 'raw',
        type: 'binary',
        modifiers: ['length' , 'no_default' ]
    },
    {
        id: '8521fef1-0105-49ca-a927-cde3cf4224d3',
        name: 'date',
        type: 'time',
    },
    {
        id: '5306e486-a2db-4095-9c4d-bc216e2b3b57',
        name: 'timestamp',
        type: 'time',
        modifiers: ['precision'],
        synonyms: ['timestamp without time zone']
    },
    {
        id: '8604a573-7472-4603-952e-316fe1ef3407',
        name: 'timestamp with time zone',
        type: 'time',
        modifiers: ['precision']
    },
    {
        id: '6ec0d6d2-dc41-49b1-9e15-2ded2d75b5ef',
        name: 'timestamp with local time zone',
        type: 'time',
        modifiers: ['precision']
    },
    {
        id: '7076c729-ff35-4d5e-8f21-8c02bfc90d5c',
        name: 'interval year to month',
        type: 'time' , 
        modifiers: ['precision' , "no_default"]
    },
    {
        id: '6e2ca449-5062-4feb-a5ce-19fcc751ff2b',
        name: 'interval day to second',
        type: 'time',
        modifiers: ['precision' , "no_default"]
    },
    {
        id: '3c3cd09e-a970-4c48-9f6e-6636757e3dd7',
        name: 'rowid',
        type: 'rowid',
        modifiers: ['no_default' , 'no_unique']
    },
    {
        id: 'f8ca2603-b196-4044-baec-bdc02803f3b8',
        name: 'urowid',
        type: 'rowid',
        modifiers: ['no_default', 'no_unique']
    },
    {
        id: 'c9abbfda-e2b3-4746-a536-36f34204b383',
        name: 'xmltype',
        type: 'xml',
        modifiers: ['no_default']
    },
    {
        id: '92fb0e59-b573-43a6-a7d3-f357867a3b00',
        name: 'json',
        type: 'json',
        modifiers: ['no_default']
    },

]