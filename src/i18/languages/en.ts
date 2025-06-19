import { Language } from "../types";


export const en = {

    translation: {
        sidebar: {
            tables: "Tables",
            relationships: "Relationships"
        },

        color_picker: {
            default_color: "Default color"
        },
        navbar: {
            rename_db: "Rename database",
        },
        db_controller: {
            filter: "Filter",
            add_table: "Add Table",
            add_field: "Add Field",
            add_index: "Add Index",
            delete_table: "Delete Table",
            duplicate: "Duplicate",
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
            field_settings: {
                title: "Field Setting",
                unique: "Unique",
                unsigned: "Unsigned",
                numeric_setting : "Numeric Setting" , 
                   decimal_setting : "Decimal Setting" , 
                zeroFill: "Zero Fill",
                autoIncrement: "Auto Increment",
                note: "Note",

                delete_field: "Delete Field",
                field_note: "Field note",
                precision : "Precision" , 
                text_setting : "Text Setting" , 
                charset : "Charset" , 
                collation : "Collation" , 
                scale : "Scale"  , 
                max_length : "Max length" , 
                integer_width : "Integer Width" ,
                width : "width" ,  
                default_value : "Default value" ,
                value : "Value" , 
                length : "Length" , 
                values : "Values" , 
                type_enter : "Type and press enter" , 
                precision_def : "Total digits allowed (before + after the decimal)."  , 
                scale_def : "Digits allowed after the decimal." , 
                time_default_value : { 
                    no_value : "No value" , 
                    custom : "Custom time" , 
                    now : "Now"
                } , 
                errors : { 
                    max_length : "must be positive number, no decimals." , 
                    integer_default_value : "Invalid default value for Integer" , 
                    precision : "Precision must be positive number, no decimals." , 
                    scale : "Scale must be positive number, no decimals." ,
                    scale_max_value : "Scale must be ≤ precision."
                    
                } , 
                pick_value : "Pick value"
            },
            delete: "Delete",

            index_setting: "Index Setting",
            table_actions: "Table Actions",
            actions: "Actions",


            delete_index: "Delete Index",
            index_name: "Index name",


            create_relationship: "Create Relationship",
            relationship_error: "To create a relationship, the primary key and foreign key must be of the same type.",

            invalid_relationship: {
                title: "Invalid Relationship",
                description: "The source key type does not match the referenced key type. Please ensure both keys have the same data type."
            }  , 
            circular_dependency : { 
                title : "Circular Dependency Detected" , 
                toast_description : "A circular reference between tables was found. Check the diagram on the left and remove one of the relationships to fix it." , 
                description : "Your schema contains a circular foreign key relationship between tables. To fix it" , 
                suggestion : "remove one of the relationships listed below that are causing the cycle."  , 
                remove_relationship : "Remove relationship"
            }
        },
        table: {
            double_click: "Double click to edit",
            overlapping_tables: "Overlapping Tables",
            show_more: "Show more",
            show_less: "Show less"
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
            join_discord: "Join Discord",


        },

        modals: {
            close: "Close",
            create: "Create",
            pick_database: "Pick your Database.",
            create_database_header: "Every database offers distinct features and functionalities.",
            db_name: "Database name",
            db_name_error: "Please provide a Database name",
            continue: "Continue",
            open: "Open",
            open_database: "Open Database",
            open_database_header: "Open a database by selecting one from the list.",
            delete_database: "Delete Database",
            delete_database_content: "This action is irreversible and will permanently remove the diagram.",
            delete: "Delete"
        }

    }

}

export const enLanguage: Language = {
    name: "English",
    nativeName: 'English',
    code: 'en',
} 