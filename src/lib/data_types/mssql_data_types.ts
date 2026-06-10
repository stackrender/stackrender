import { DataInsertType } from "../schemas/data-type-schema";

export const MSSQLDataType: Partial<DataInsertType>[] = [
    {
        id: 'c7a6fd94-ecec-4b79-9ea6-8ca25bae8d9c',
        name: 'tinyint',
        type: 'integer',
        modifiers: ['auto_increment']
    },
    {
        id: '48bdd059-9b52-4f93-b5c1-42d9dc2b7d13',
        name: 'smallint',
        type: 'integer',

        modifiers: ['auto_increment']
    },
    {
        id: 'ae5e05da-21e0-4746-b972-6069ab628dc2',
        name: 'int',
        type: 'integer',

        modifiers: ['auto_increment']
    },
    {
        id: '8a719f0c-0b0f-4be2-b660-61502575a5bd',
        name: 'bigint',
        type: 'integer',

        modifiers: ['auto_increment']
    },
    {
        id: '442c88ae-6d53-41d5-bdaf-cb95192ab2e7',
        name: 'decimal',
        type: 'numeric',
        modifiers: ['precision', 'scale'],
        synonyms: ['numeric']
    },
    {
        id: 'c3102982-a9ee-48c9-b050-bc3e8318efda',
        name: 'float',
        type: 'numeric',
        modifiers: ['precision']
    },
    {
        id: '1858ca0e-ba61-45aa-9236-8028ab7d7570',
        name: 'real',
        type: 'numeric'
    },
    {
        id: '3842960d-f0a9-411b-99d2-be3cfaf03fe7',
        name: 'money',
        type: 'numeric'
    },
    {
        id: '664aacc0-d646-4052-a616-d0b3d5d546df',
        name: 'smallmoney',
        type: 'numeric'
    },
    {
        id: 'fbdfd7d5-72d1-4c0b-9cfb-ca843ac444a4',
        name: 'char',
        type: 'text',
        modifiers: ['length']
    },
    {
        id: '1a6f261b-1abf-4f13-b803-a9533198f4c9',
        name: 'varchar',
        type: 'text',
        modifiers: ['length']
    },
    {
        id: '0a27e11f-1af7-4a62-babd-cfc1ecdd5f1f',
        name: 'text',
        type: 'text'
    },
    {
        id: 'c8cd26da-a09e-4a18-8b2f-11a2e4fe049c',
        name: 'nchar',
        type: 'text',
        modifiers: ['length']
    },
    {
        id: '53f552a2-b782-4084-a236-6928651b4f43',
        name: 'nvarchar',
        type: 'text',
        modifiers: ['length']
    },
    {
        id: 'e0071583-b97a-4f67-80b1-6ff25b8b8c37',
        name: 'ntext',
        type: 'text'
    },
    {
        id: '9df5d149-c9f1-4d26-a3ae-832accc08831',
        name: 'binary',
        type: 'binary',
        modifiers: ['length', 'no_default']
    },
    {
        id: '3c351e8c-92ba-40aa-843c-df2d8409e95a',
        name: 'varbinary',
        type: 'binary',
        modifiers: ['length', 'no_default']
    },
    {
        id: '731051f0-050f-4eb2-a327-5e10dd6bf6ca',
        name: 'image',
        type: 'binary',
        modifiers: ['no_unique', 'no_default']
    },
    {
        id: 'b412d41c-255b-413d-b866-4b652f291606',
        name: 'date',
        type: 'time'
    },
    {
        id: 'cc0f4f94-772c-4f4e-b1d3-f2fe0a18ee49',
        name: 'time',
        type: 'time',
        modifiers: ['precision']
    },
    {
        id: '83a37c4f-9501-485e-bc10-802673ca0594',
        name: 'datetime',
        type: 'time'
    },
    {
        id: '85a466ba-b97a-4c47-a204-1a8f0e16d275',
        name: 'smalldatetime',
        type: 'time'
    },
    {
        id: '562887bf-8d60-4e9e-b038-e760a6da05a2',
        name: 'datetime2',
        type: 'time',
        modifiers: ['precision']
    },
    {
        id: '1165eda1-6b45-4c45-82de-ddc90bb87f86',
        name: 'datetimeoffset',
        type: 'time',
        modifiers: ['precision']
    },
    {
        id: '00ea0771-47e0-4067-ba74-a153421c2d69',
        name: 'uniqueidentifier',
        type: 'uuid',

    },
    {
        id: '03db80b0-d2c0-47bc-879b-8d0c17a36a9e',
        name: 'bit',
        type: 'boolean'
    },
    {
        id: '060d32ca-4e8a-496f-a29e-36d1947d0469',
        name: 'json',
        type: 'json'
    },
    {
        id: '090ad5cd-43b6-4443-93ce-61a6f12c6f4e',
        name: 'xml',
        type: 'xml'
    },
    {
        id: '9e9ddfc5-176b-4574-a097-3a1cbf927d9c',
        name: 'geometry',
        type: 'geometric'
    },
    {
        id: 'c6cdd823-5b8e-45ed-a489-3b68ce10b698',
        name: 'geography',
        type: 'geometric'
    }
]