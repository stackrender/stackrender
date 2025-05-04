import { Language } from "../types";


export const fr = {
    translation: {
        sidebar: {
            tables: "Tableaux",
            relationships: "Relations"
        } , 
        db_controller : {
            filter : "Filtrer" , 
            add_table : "Ajouter une table" , 
            add_field : "Ajouter un champ" , 
            add_index : "Ajouter un index" ,  
            add_relationship : "Ajouter une relation" , 
            show_code : "Afficher le code" , 
            fields : "Champs" , 
            indexes : "Index" , 
            note : "Note" , 
            name : "Nom" , 
            type : "Type" , 
            primary_key : "Clé primaire" , 
            nullable : "Nullable" , 
            select_fields : "Sélectionner des champs" , 
            unique : "Unique" , 
            table_note : "Note de la table" , 
            collapse : "Tout réduire" , 
            primary_table : "Table primaire" , 
            referenced_table : "Table référencée" , 
            cardinality :{
                name : "Cardinalité" , 
                one_to_one : "Un à un" , 
                one_to_many : "Un à plusieurs" , 
                many_to_one : "Plusieurs à un" , 
                many_to_many : "Plusieurs à plusieurs" , 
            }, 
            delete : "Supprimer" , 
        } , 
        table: {
            double_click: "Double-cliquez pour modifier"
        },
      
    }

}

export const frLanguage: Language = {
    name: "French",
    nativeName: 'Français',
    code: 'fr',
} 