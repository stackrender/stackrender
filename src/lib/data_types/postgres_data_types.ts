import { DataInsertType } from "../schemas/data-type-schema";

export const PostgresDataType: Partial<DataInsertType>[]  = [
    {
        id: 'ee0289ee-8cc8-43c0-b67d-321cbc4585d1', name: 'smallint', type: 'integer', modifiers: ["auto_increment"],
        synonyms: ['int2']
    },
    {
        id: '96ca7315-2daf-489e-a5c6-1f6757dea9d9', name: 'integer', type: 'integer', modifiers: ["auto_increment"],
        synonyms: ['int', 'int4']
    },
    {
        id: 'e256e7b2-355a-45f4-aee7-6b39efa853a0', name: 'bigint', type: 'integer', modifiers: ["auto_increment"],
        synonyms: ['int8']
    },

    { id: 'b11e83d0-57c4-45fd-8f7d-c09a94758af0', name: 'numeric', type: 'numeric', modifiers: ['precision', 'scale'], synonyms: ['decimal'] },
    { id: '8c3e6086-6372-4ff1-a60c-7ca75f31d8e7', name: 'real', type: 'numeric', synonyms: ['float4', 'float'] },
    { id: '3774463e-1076-4dcb-95e7-f695fa769899', name: 'double precision', type: 'numeric', synonyms: ['float8'] },
    { id: 'd85b45d9-ea58-4d80-8589-b2489c64b6a9', name: 'money', type: 'numeric' },


    { id: '0173eda2-1e61-45bd-99cc-6a1a8df93efa', name: 'varchar', type: 'text', modifiers: ['length'], synonyms: ['character varying'] },
    { id: '87c39193-9592-488c-9864-8643cef6ce12', name: 'char', type: 'text', modifiers: ['length'], synonyms: ['character'] },
    { id: 'ec45a87a-00dc-422a-ac05-578f9bf74fdb', name: 'text', type: 'text' },

    { id: 'e75dbf56-41c4-4570-b141-e693b6fe1612', name: 'bytea', type: 'binary', modifiers: ["no_default"] },
    { id: '1d7f3282-e377-4252-bd49-95277c9c637c', name: 'bit', type: 'binary', modifiers: ['length', 'no_default'] },
    { id: 'bd35c546-89d2-407a-accc-101851f2b62d', name: 'varbit', type: 'binary', modifiers: ['length', "no_default"], synonyms: ['bit varying'] },

    {
        id: '11f5ce77-a0c8-44b0-9fbb-4a4b65140997', name: 'timestamp', type: 'time', modifiers: ['precision'], synonyms: [
            'timestamp without time zone',
        ]
    },
    {
        id: "abf823e0-4f8e-4b37-beb1-3c73b8e8b7d1", name: "timestamptz", type: "time", modifiers: ["precision"], synonyms: [
            "timestamp with time zone"
        ]
    },
    { id: 'bd95631d-c1c4-4cc2-a715-b613369ab097', name: 'date', type: 'time', },
    { id: 'ea3b2c12-931e-4c88-bda5-07efa36ae178', name: 'time', type: 'time', modifiers: ['precision']  },


    { id: '3763db96-0ad8-45ef-8510-83000e398263', name: 'boolean', type: 'boolean',  synonyms: ['bool'] },

    { id: '5baecfc7-f76d-4184-bb10-586dfb95ac37', name: 'enum', type: 'enum', modifiers: ['values'] },

    { id: "9660224d-cc98-4204-b4db-cbce58f1257d", name: 'point', type: 'geometric', modifiers: ["no_default"] },
    { id: 'e390e7a6-6fcb-4417-91ec-f663db80e47f', name: 'line', type: 'geometric', modifiers: ["no_default"] },
    { id: 'd6cc5854-f88c-4b92-98ce-7b4016022fe1', name: 'lseg', type: 'geometric', modifiers: ["no_default"] },
    { id: '4ce5a962-0194-4298-91f6-4647b0a12b13', name: 'box', type: 'geometric', modifiers: ["no_default"] },
    { id: 'b95eec3d-c6b1-40f0-8fe7-19b4a6212cfd', name: 'path', type: 'geometric', modifiers: ["no_default"] },
    { id: 'b8de3385-798b-4b3b-983f-f3cc61c3c3ac', name: 'polygon', type: 'geometric', modifiers: ["no_default"] },
    { id: '7b3db3bc-2334-4fe5-a5d7-1ad61f4cfb4f', name: 'circle', type: 'geometric', modifiers: ["no_default"] },

    { id: 'f5ad8fc7-4dfb-4e58-b5f5-348a08354056', name: 'uuid', type: 'uuid', },
    { id: 'a5dfb0db-377b-4ff7-b4c1-3c8e705d71aa', name: 'json', type: 'json', modifiers: ["no_default"] },
    { id: '1a8e41ae-fc5e-4bd9-9919-960e07d7b3d4', name: 'jsonb', type: 'json', modifiers: ["no_default"] },
    { id: 'e55e9dc4-4dd3-47f5-a9db-10c3b6f1295b', name: 'xml', type: 'xml', modifiers: ["no_default"] },
    { id: '2a52974a-2b00-4cd8-8264-fd41e2f77683', name: 'cidr', type: 'network', modifiers: ["no_default"] },
    { id: 'ac857b8e-8803-4635-ae2c-1be1c1aa8324', name: 'inet', type: 'network', modifiers: ["no_default"] },
    { id: '83f9691a-1b12-4663-a24a-f019bb5f04c2', name: 'macaddr', type: 'network', modifiers: ["no_default"] },
    { id: 'fdc52c94-6bd4-47d8-a5e7-6a43e5e517e9', name: 'tsvector', type: 'textsearch', modifiers: ["no_default"] },
    { id: '1b06287e-7e9f-4a3f-8c61-5f0a18f7f91c', name: 'tsquery', type: 'textsearch', modifiers: ["no_default"] },
];
