import { Language } from "../types";


export const fr = {
    translation: {
        sidebar: {
            tables: "Tables",
            relationships: "Relations"
        },
        color_picker: {
            default_color: "Couleur par défaut"
        },
        navbar: {
            rename_db: "Renommer la base de données",
            search: "Rechercher"
        },
        db_controller: {
            filter: "Filtrer",
            add_table: "Ajouter une table",
            add_field: "Ajouter un champ",
            add_index: "Ajouter un index",
            delete_table: "Supprimer la table",
            duplicate: "Dupliquer",
            add_relationship: "Ajouter une relation",
            show_code: "Afficher le code",
            fields: "Champs",
            indexes: "Index",
            note: "Note",
            name: "Nom",
            type: "Type",
            nullable: "Nullable",
            select_fields: "Sélectionner les champs",
            unique: "Unique",
            table_note: "Note de la table",
            collapse: "Tout réduire",
            primary_key: "Clé primaire",
            foreign_key: "Clé étrangère",
            source_table: "Table source",
            referenced_table: "Table référencée",
            select_table: "Sélectionner une table",
            select_field: "Sélectionner un champ",
            empty_list: {
                no_tables: "Aucune table",
                no_tables_description: "Créez une table pour commencer.",
                no_relationships: "Aucune relation",
                no_relationships_description: "Créez des relations pour connecter deux tables"
            },
            cardinality: {
                name: "Cardinalité",
                one_to_one: "Un à un",
                one_to_many: "Un à plusieurs",
                many_to_one: "Plusieurs à un",
                many_to_many: "Plusieurs à plusieurs"
            },
            foreign_key_actions: {
                title: "Actions de clé étrangère",
                on_delete: "Lors de la suppression",
                on_update: "Lors de la mise à jour",
                actions: {
                    no_action: "Aucune action",
                    cascade: "Cascade",
                    set_null: "Définir à null",
                    set_default: "Définir par défaut",
                    restrict: "Restreindre"
                }
            },
            field_settings: {
                title: "Paramètres du champ",
                unique: "Unique",
                unsigned: "Non signé",
                numeric_setting: "Paramètres numériques",
                decimal_setting: "Paramètres décimaux",
                zeroFill: "Complément zéro",
                autoIncrement: "Auto-incrémentation",
                note: "Note",
                delete_field: "Supprimer le champ",
                field_note: "Note du champ",
                precision: "Précision",
                text_setting: "Paramètres de texte",
                charset: "Jeu de caractères",
                collation: "Collation",
                scale: "Échelle",
                max_length: "Longueur max",
                integer_width: "Largeur entière",
                width: "Largeur",
                default_value: "Valeur par défaut",
                value: "Valeur",
                length: "Longueur",
                values: "Valeurs",
                type_enter: "Tapez et appuyez sur Entrée",
                precision_def: "Nombre total de chiffres autorisés (avant + après la virgule).",
                scale_def: "Nombre de chiffres autorisés après la virgule.",
                time_default_value: {
                    no_value: "Aucune valeur",
                    custom: "Heure personnalisée",
                    now: "Maintenant"
                },
                errors: {
                    max_length: "doit être un nombre positif sans décimales.",
                    integer_default_value: "Valeur par défaut invalide pour un entier",
                    precision: "La précision doit être un nombre positif sans décimales.",
                    scale: "L'échelle doit être un nombre positif sans décimales.",
                    scale_max_value: "L'échelle doit être ≤ à la précision."
                },
                pick_value: "Choisir une valeur"
            },
            delete: "Supprimer",
            index_setting: "Paramètres de l'index",
            table_actions: "Actions de table",
            actions: "Actions",
            delete_index: "Supprimer l'index",
            index_name: "Nom de l'index",
            create_relationship: "Créer une relation",
            relationship_error: "Pour créer une relation, la clé primaire et la clé étrangère doivent être du même type.",
            invalid_relationship: {
                title: "Relation invalide",
                description: "Le type de la clé source ne correspond pas à celui de la clé référencée. Assurez-vous qu'elles aient le même type de données."
            },
            circular_dependency: {
                title: "Dépendance circulaire détectée",
                toast_description: "Une référence circulaire entre les tables a été détectée. Vérifiez le diagramme à gauche et supprimez une des relations pour corriger cela.",
                description: "Votre schéma contient une relation de clé étrangère circulaire entre les tables. Pour corriger cela,",
                suggestion: "supprimez l’une des relations ci-dessous qui provoque le cycle.",
                remove_relationship: "Supprimer la relation"
            }
        },
        table: {
            double_click: "Double-cliquez pour modifier",
            overlapping_tables: "Tables qui se chevauchent",
            show_more: "Afficher plus",
            show_less: "Afficher moins"
        },
        control_buttons: {
            redo: "Rétablir",
            undo: "Annuler",
            zoom_in: "Zoom avant",
            zoom_out: "Zoom arrière",
            adjust_positions: "Ajuster les positions",
            show_all: "Afficher tout"
        },
        menu: {
            file: "Fichier",
            new: "Nouveau",
            open: "Ouvrir",
            save: "Enregistrer",
            import: "Importer",
            json: ".json",
            dbml: ".dbml",
            mysql: "MySQL",
            postgresql: "PostgreSQL",
            export_sql: "Exporter en SQL",
            generic: "Générique",
            export_orm_models: "Exporter les modèles ORM",
            delete_project: "Supprimer le projet",
            edit: "Éditer",
            undo: "Annuler",
            redo: "Rétablir",
            clear: "Effacer",
            view: "Vue",
            hide_controller: "Masquer le contrôleur",
            show_controller: "Afficher le contrôleur",
            cardinality_style: "Style de cardinalité",
            hidden: "Caché",
            numeric: "Numérique",
            symbolic: "Symbolique",
            theme: "Thème",
            light: "Clair",
            dark: "Sombre",
            help: "Aide",
            show_docs: "Afficher la documentation",
            join_discord: "Rejoindre Discord"
        },
        modals: {
            close: "Fermer",
            create: "Créer",
            pick_database: "Choisissez votre base de données.",
            create_database_header: "Chaque base de données offre des fonctionnalités différentes.",
            db_name: "Nom de la base de données",
            db_name_error: "Veuillez saisir un nom de base de données",
            continue: "Continuer",
            open: "Ouvrir",
            open_database: "Ouvrir une base de données",
            open_database_header: "Ouvrez une base de données en sélectionnant une dans la liste.",
            delete_database: "Supprimer la base de données",
            delete_database_content: "Cette action est irréversible et supprimera définitivement le diagramme.",
            delete: "Supprimer",
            empty_diagram: "Diagramme vide",
            import_database: {
                title: "Importer votre base de données",
                import: "Importer",
                import_options: "Souhaitez-vous importer en utilisant :",
                import_error: "Erreur d’analyse SQL",
                import_error_description: "Nous n'avons pas pu importer votre SQL car il contient une syntaxe invalide.",
                import_warning: "Avertissement d’analyse SQL",
                import_warning_description: "Certains éléments n'ont pas pu être traités à cause de déclarations non prises en charge ou incomplètes."
            },
            open_database_table: {
                dialect: "Dialecte",
                name: "Nom",
                created_at: "Créé le",
                tables: "Tables"
            },
            export_sql: "Exporter en SQL",
            export_sql_header: "Exporter votre diagramme de base de données en code SQL"
        },
        clipboard: {
            copy: "Copier",
            copied: "Copié"
        },
        connection_status: {
            online: "En ligne",
            offline: "Hors ligne",
            saving: "Enregistrement...",
            saved: "Enregistré",
            last_synced: "Dernière synchronisation",
            min_ago: "min auparavant",
            hour_ago: "heure auparavant",
            just_now: "À l’instant"
        },
        import: {
            instructions: "Instructions",
            install: "Installer",
            run_command: "Exécutez la commande suivante dans votre terminal.",
            example: "Exemple",
            copy_code: "Copiez le contenu du fichier .sql dans la section code ci-dessous.",
            pg_admin: {
                step1: "Ouvrez <bold>Pg Admin</bold>.",
                step2: "Faites un clic droit sur votre base de données et sélectionnez <bold>Sauvegarder</bold>.",
                step3: "Nommez votre fichier <code>.sql</code>, définissez le format sur <bold>Simple</bold>, et choisissez <bold>Encodage : UTF8.</bold>",
                step4: "Assurez-vous que <bold>Schéma uniquement</bold> est coché et que <bold>Données uniquement</bold> ne l'est pas dans l’<bold>onglet Options de données</bold>.",
                step5: "Cliquez sur <bold>Sauvegarder</bold> pour exporter le fichier, puis copiez son contenu dans l’éditeur de code ci-dessous."
            },
            workbench: {
                step1: "Ouvrez <bold>MySQL Workbench</bold> et <bold>connectez-vous</bold> à votre serveur MySQL.",
                step2: "Dans le menu principal, allez à <bold>Serveur > Exportation de données</bold>.",
                step3: "Dans les <bold>Options d’exportation</bold>, choisissez <bold>Exporter la structure uniquement</bold>.",
                step4: "Cochez <bold>Exporter dans un fichier autonome</bold>, puis choisissez un emplacement et entrez un nom pour le fichier <code>.sql</code>.",
                step5: "Cliquez sur <bold>Commencer l’exportation</bold>. Ensuite, copiez son contenu dans l’éditeur de code ci-dessous."
            },
            heidisql: {
                step1: "<bold>Ouvrez HeidiSQL</bold> et connectez-vous à votre serveur.",
                step2: "Dans la <bold>barre latérale gauche</bold>, faites un clic droit sur la base de données à exporter.",
                step3: "Choisissez <bold>Exporter la base de données en SQL</bold>.",
                step4: "Sélectionnez <bold>Pas de données</bold> et assurez-vous que <bold>Créer</bold> est coché pour exporter uniquement la structure.",
                step5: "Cliquez sur le bouton <bold>Exporter</bold>, puis copiez le contenu du fichier <code>.sql</code> dans l’éditeur de code ci-dessous."
            },
            dbbrowser: {
                step1: "Lancez <bold>DB Browser for SQLite</bold>.",
                step2: "Cliquez sur <bold>Fichier > Ouvrir une base de données</bold> et sélectionnez votre fichier <code>.sqlite</code> ou <code>.db</code>.",
                step3: "Allez à <bold>Fichier > Exporter > Base de données vers fichier SQL</bold>.",
                step4: "Dans la fenêtre, sélectionnez <bold>Exporter uniquement le schéma</bold> et cliquez sur <bold>Enregistrer</bold>.",
                step5: "Enfin, copiez le contenu du fichier <code>.sql</code> dans l’éditeur de code ci-dessous."
            }
        }
    }
}

export const frLanguage: Language = {
    name: "French",
    nativeName: 'Français',
    code: 'fr',
} 