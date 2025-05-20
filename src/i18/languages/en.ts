import { Language } from "../types";


export const en = {

    translation: {
        sidebar: {
            tables: "Tables",
            relationships: "Relationships"
        },
        modal: {
            close: "Close",
            create: "Create"
        },
        color_picker : { 
            default_color : "Default color"
        } , 
        db_controller: {
            filter: "Filter",
            add_table: "Add Table",
            add_field: "Add Field",
            add_index: "Add Index",
            add_relationship: "Add Relationship",
            show_code: "Show code",
            fields: "Fields",
            indexes: "Indexes",
            note: "Note",
            name: "Name",
            type: "Type",
            nullable: "Nullable",
            select_fields: "Select fields",
            unique: "Unique",
            table_note: "Table note",
            collapse: "Collapse All",



            primary_key: "Primary Key",
            foreign_key: "Foreign Key",

            source_table: "Source Table",
            target_table: "Target Table",

            select_table: "Select table",
            select_field: "Select field",


            cardinality: {
                name: "Cardinality",
                one_to_one: "One to One",
                one_to_many: "One to Many",
                many_to_one: "Many to One",
                many_to_many: "Many to Many",
   
            },
            delete: "Delete",
            field_setting: "Field Setting",
            table_actions: "Field Actions",
            actions : "Actions" , 
            
            field_note: "Field note",
            delete_field: "Delete Field",

            create_relationship: "Create Relationship",
            relationship_error: "To create a relationship, the primary key and foreign key must be of the same type.",
        },
        table: {
            double_click: "Double click to edit"
        } , 
        control_buttons : { 
            redo : "Redo" , 
            undo : "Undo" , 
            zoom_in : "Zoom In" , 
            zoom_out : "Zoom Out" , 
            adjust_positions : "Adjust Positions" , 
            show_all : "Show all"
        }
    }

}

export const enLanguage: Language = {
    name: "English",
    nativeName: 'English',
    code: 'en',
} 