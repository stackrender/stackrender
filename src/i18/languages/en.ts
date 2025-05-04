import { Language } from "../types";


export const en = { 

    translation : {
        sidebar : {
            tables : "Tables" , 
            relationships : "Relationships"
        } , 
        db_controller : {
            filter : "Filter" , 
            add_table : "Add Table" , 
            add_field : "Add Field" , 
            add_index : "Add Index" ,  
            add_relationship : "Add Relationship" , 
            show_code : "Show code" , 
            fields : "Fields" , 
            indexes : "Indexes" , 
            note : "Note" , 
            name : "Name" , 
            type : "Type" , 
            primary_key : "Primary Key" , 
            nullable : "Nullable" , 
            select_fields : "Select fields" , 
            unique : "Unique" , 
            table_note : "Table note"  , 
            collapse : "Collapse All" , 
            primary_table : "Primary Table" , 
            referenced_table : "Referenced Table" , 
            cardinality :{
                name : "Cardinality" , 
                one_to_one : "One to One" , 
                one_to_many : "One to Many" , 
                many_to_one : "Many to One" , 
                many_to_many : "Many to Many" , 
            }  , 
            delete : "Delete" , 
            
        }, 
        table : { 
            double_click : "Double click to edit"
        }
    }

} 

export const enLanguage : Language = {
    name : "English" , 
    nativeName: 'English',
    code: 'en',
} 