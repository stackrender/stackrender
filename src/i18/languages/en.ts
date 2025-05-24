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
        color_picker: {
            default_color: "Default color"
        },
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
            actions: "Actions",

            field_note: "Field note",
            delete_field: "Delete Field",

            create_relationship: "Create Relationship",
            relationship_error: "To create a relationship, the primary key and foreign key must be of the same type.",
            
            invalid_relationship: {
                title: "Invalid Relationship",
                description: "The source key type does not match the referenced key type. Please ensure both keys have the same data type."
            }
        },
        table: {
            double_click: "Double click to edit" , 
            overlapping_tables : "Overlapping Tables"
        },
        control_buttons: {
            redo: "Redo",
            undo: "Undo",
            zoom_in: "Zoom In",
            zoom_out: "Zoom Out",
            adjust_positions: "Adjust Positions",
            show_all: "Show all"
        },
        menu: {
            file: "File",
            new: "New",
            open: "Open",
            save: "Save",
            import: "Import",
            json: ".json",
            dbml: ".dbml",
            mysql: "MySql",
            postgresql: "Postgresql",
            export_sql: "Export SQL",
            generic: "Generic",
            export_orm_models: "Export ORM Models",
            delete_project: "Delete Project",
            edit: "Edit",
            undo: "Undo",
            redo: "Redo",
            clear: "Clear",
            view: "View",
            hide_controller: "Hide Controller",
            zoom_on_scroll: "Zoom on scroll",
            on: "On",
            off: "Off",
            theme: "Theme",
            light: "Light",
            dark: "Dark",
            help: "Help",
            show_docs: "Show Docs",
            join_discord: "Join Discord"
        }
    }

}

export const enLanguage: Language = {
    name: "English",
    nativeName: 'English',
    code: 'en',
} 