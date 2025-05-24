import { Language } from "../types";


export const fr = {
    translation: {
        sidebar: {
            tables: "Tables",
            relationships: "Relations"
        },
        modal: {
            close: "Fermer",
            create: "Créer"
        },
        color_picker: {
            default_color: "Couleur par défaut"
        },
        db_controller: {
            filter: "Filtrer",
            add_table: "Ajouter une Table",
            add_field: "Ajouter un Champ",
            add_index: "Ajouter un Index",
            add_relationship: "Ajouter une Relation",
            show_code: "Afficher le code",
            fields: "Champs",
            indexes: "Indexes",
            note: "Note",
            name: "Nom",
            type: "Type",
            nullable: "Nullable",
            select_fields: "Sélectionner les champs",
            unique: "Unique",
            table_note: "Note de la Table",
            collapse: "Tout réduire",

            primary_key: "Clé primaire",
            foreign_key: "Clé étrangère",

            source_table: "Table source",
            target_table: "Table cible",

            select_table: "Sélectionner la table",
            select_field: "Sélectionner le champ",

            cardinality: {
                name: "Cardinalité",
                one_to_one: "Un à Un",
                one_to_many: "Un à Plusieurs",
                many_to_one: "Plusieurs à Un",
                many_to_many: "Plusieurs à Plusieurs"
            },
            delete: "Supprimer",
            field_setting: "Paramètres du champ",
            table_actions: "Actions sur le champ",
            actions: "Actions",

            field_note: "Note sur le champ",
            delete_field: "Supprimer le champ",

            create_relationship: "Créer une Relation",
            relationship_error: "Pour créer une relation, la primary key et la foreign key doivent être du même type.",

            invalid_relationship: {
                title: "Relation invalide",
                description: "Le type de la source key ne correspond pas au type de la referenced key. Veuillez vous assurer que les deux clés ont le même type de données."
            }
        },
        table: {
            double_click: "Double-cliquez pour éditer" , 
            overlapping_tables: "Tables qui se chevauchent",
        },
        control_buttons: {
            redo: "Refaire",
            undo: "Annuler",
            zoom_in: "Zoom avant",
            zoom_out: "Zoom arrière",
            adjust_positions: "Ajuster les positions",
            show_all: "Tout afficher"
        },
        menu: {
            file: "Fichier",
            new: "Nouveau",
            open: "Ouvrir",
            save: "Enregistrer",
            import: "Importer",
            json: ".json",
            dbml: ".dbml",
            mysql: "MySql",
            postgresql: "Postgresql",
            export_sql: "Exporter SQL",
            generic: "Générique",
            export_orm_models: "Exporter les ORM Models",
            delete_project: "Supprimer le projet",
            edit: "Éditer",
            undo: "Annuler",
            redo: "Refaire",
            clear: "Effacer",
            view: "Affichage",
            hide_controller: "Masquer le contrôleur",
            zoom_on_scroll: "Zoom au défilement",
            on: "Activé",
            off: "Désactivé",
            theme: "Thème",
            light: "Clair",
            dark: "Sombre",
            help: "Aide",
            show_docs: "Afficher la documentation",
            join_discord: "Rejoindre Discord"
        }
    }
};

export const frLanguage: Language = {
    name: "French",
    nativeName: 'Français',
    code: 'fr',
} 