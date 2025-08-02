import { Language } from "../types";

export const es = {

    translation: {
        sidebar: {
            tables: "Tablas",
            relationships: "Relaciones"
        },

        color_picker: {
            default_color: "Color predeterminado"
        },
        navbar: {
            rename_db: "Renombrar base de datos",
            search: "Buscar"
        },
        db_controller: {
            filter: "Filtrar",
            add_table: "Agregar tabla",
            add_field: "Agregar campo",
            add_index: "Agregar índice",
            delete_table: "Eliminar tabla",
            duplicate: "Duplicar",
            add_relationship: "Agregar relación",
            show_code: "Mostrar código",
            fields: "Campos",
            indexes: "Índices",
            note: "Nota",
            name: "Nombre",
            type: "Tipo",
            nullable: "Permite nulo",
            select_fields: "Seleccionar campos",
            unique: "Único",
            table_note: "Nota de la tabla",
            collapse: "Colapsar todo",
            primary_key: "Clave primaria",
            foreign_key: "Clave foránea",

            source_table: "Tabla de origen",
            referenced_table: "Tabla referenciada",

            select_table: "Seleccionar tabla",
            select_field: "Seleccionar campo",

            empty_list: {
                no_tables: "Sin tablas",
                no_tables_description: "Crea una tabla para comenzar.",

                no_relationships: "Sin relaciones",
                no_relationships_description: "Crea relaciones para conectar dos tablas"
            },

            cardinality: {
                name: "Cardinalidad",
                one_to_one: "Uno a uno",
                one_to_many: "Uno a muchos",
                many_to_one: "Muchos a uno",
                many_to_many: "Muchos a muchos",

            },
            foreign_key_actions: {
                title: "Acciones de clave foránea",
                on_delete: "Al eliminar",
                on_update: "Al actualizar",
                actions: {
                    no_action: "Sin acción",
                    cascade: "Cascada",
                    set_null: "Establecer nulo",
                    set_default: "Establecer valor predeterminado",
                    restrict: "Restringir"
                }
            },
            field_settings: {
                title: "Configuración de campo",
                unique: "Único",
                unsigned: "Sin signo",
                numeric_setting: "Configuración numérica",
                decimal_setting: "Configuración decimal",
                zeroFill: "Relleno con ceros",
                autoIncrement: "Autoincremento",
                note: "Nota",

                delete_field: "Eliminar campo",
                field_note: "Nota del campo",
                precision: "Precisión",
                text_setting: "Configuración de texto",
                charset: "Charset",
                collation: "Intercalación",
                scale: "Escala",
                max_length: "Longitud máxima",
                integer_width: "Ancho de entero",
                width: "Ancho",
                default_value: "Valor predeterminado",
                value: "Valor",
                length: "Longitud",
                values: "Valores",
                type_enter: "Escribe y presiona enter",
                precision_def: "Total de dígitos permitidos (antes + después del decimal).",
                scale_def: "Dígitos permitidos después del decimal.",
                time_default_value: {
                    no_value: "Sin valor",
                    custom: "Hora personalizada",
                    now: "Ahora"
                },
                errors: {
                    max_length: "debe ser un número positivo, sin decimales.",
                    integer_default_value: "Valor predeterminado inválido para entero",
                    precision: "La precisión debe ser un número positivo, sin decimales.",
                    scale: "La escala debe ser un número positivo, sin decimales.",
                    scale_max_value: "La escala debe ser ≤ precisión."

                },
                pick_value: "Seleccionar valor"
            },
            delete: "Eliminar",

            index_setting: "Configuración del índice",
            table_actions: "Acciones de la tabla",
            actions: "Acciones",
            delete_index: "Eliminar índice",
            index_name: "Nombre del índice",
            create_relationship: "Crear relación",
            relationship_error: "Para crear una relación, la clave primaria y la clave foránea deben ser del mismo tipo.",

            invalid_relationship: {
                title: "Relación inválida",
                description: "El tipo de clave de origen no coincide con el tipo de clave referenciada. Asegúrese de que ambas claves tengan el mismo tipo de datos."
            },
            circular_dependency: {
                title: "Dependencia circular detectada",
                toast_description: "Se encontró una referencia circular entre tablas. Revisa el diagrama a la izquierda y elimina una de las relaciones para corregirlo.",
                description: "Tu esquema contiene una relación foránea circular entre tablas. Para corregirlo",
                suggestion: "elimina una de las relaciones que se indican a continuación y que están causando el ciclo.",
                remove_relationship: "Eliminar relación"
            }
        },
        table: {
            double_click: "Doble clic para editar",
            overlapping_tables: "Tablas superpuestas",
            show_more: "Mostrar más",
            show_less: "Mostrar menos"
        },
        control_buttons: {
            redo: "Rehacer",
            undo: "Deshacer",
            zoom_in: "Acercar",
            zoom_out: "Alejar",
            adjust_positions: "Ajustar posiciones",
            show_all: "Mostrar todo"
        },
        menu: {
            file: "Archivo",
            new: "Nuevo",
            open: "Abrir",
            save: "Guardar",
            import: "Importar",
            json: ".json",
            dbml: ".dbml",
            mysql: "MySql",
            postgresql: "Postgresql",
            export_sql: "Exportar SQL",
            generic: "Genérico",
            export_orm_models: "Exportar modelos ORM",
            delete_project: "Eliminar proyecto",
            edit: "Editar",
            undo: "Deshacer",
            redo: "Rehacer",
            clear: "Limpiar",
            view: "Vista",
            hide_controller: "Ocultar controlador",
            show_controller: "Mostrar controlador",
            cardinality_style: "Estilo de cardinalidad",
            hidden: "Oculto",
            numeric: "Numérico",
            symbolic: "Simbólico",
            theme: "Tema",
            light: "Claro",
            dark: "Oscuro",
            help: "Ayuda",
            show_docs: "Mostrar documentación",
            join_discord: "Unirse a Discord",


        },

        modals: {
            close: "Cerrar",
            create: "Crear",
            pick_database: "Selecciona tu base de datos.",
            create_database_header: "Cada base de datos ofrece características y funcionalidades distintas.",
            db_name: "Nombre de la base de datos",
            db_name_error: "Por favor, proporciona un nombre para la base de datos",
            continue: "Continuar",
            open: "Abrir",
            open_database: "Abrir base de datos",
            open_database_header: "Abre una base de datos seleccionando una de la lista.",
            delete_database: "Eliminar base de datos",
            delete_database_content: "Esta acción es irreversible y eliminará permanentemente el diagrama.",
            delete: "Eliminar",
            empty_diagram: "Diagrama vacío",
            import_database: {
                title: "Importar tu base de datos",
                import: "Importar",
                import_options: "¿Te gustaría importar usando :",
                import_error: "Error al analizar SQL",
                import_error_description: "No pudimos importar tu SQL porque contiene sintaxis inválida.",
                import_warning: "Advertencia al analizar SQL",
                import_warning_description: "Algunos elementos no pudieron ser procesados debido a declaraciones no compatibles o incompletas.",
            },
            open_database_table: {
                dialect: "Dialecto",
                name: "Nombre",
                created_at: "Creado el",
                tables: "Tablas"
            },
            export_sql: "Exportar SQL",
            export_sql_header: "Exporta tu diagrama de base de datos en código SQL"
        },
        clipboard: {
            copy: "Copiar",
            copied: "Copiado"
        },

        connection_status: {
            online: "En línea",
            offline: "Sin conexión",
            saving: "Guardando",
            saved: "Guardado",
            last_synced: "Última sincronización",
            min_ago: "min atrás",
            hour_ago: "hace una hora",
            just_now: "Justo ahora"
        },
        import: {
            instructions: "Instrucciones",
            install: "Instalar",
            run_command: "Ejecuta el siguiente comando en tu terminal.",
            example: "Ejemplo",
            copy_code: "Copia el contenido del archivo .sql en la sección de código a continuación.",
            pg_admin: {
                "step1": "Abre <bold>Pg Admin</bold>.",
                "step2": "Haz clic derecho en tu base de datos y selecciona <bold>Backup</bold> del menú contextual.",
                "step3": "Nombra tu archivo <code>.sql</code>, establece el formato en <bold>Plain</bold> y elige <bold>Encoding: UTF8.</bold>",
                "step4": "Asegúrate de que <bold>Only schema</bold> esté marcado y <bold>Only data</bold> desmarcado en la pestaña <bold>Data Options</bold>.",
                "step5": "Haz clic en <bold>Backup</bold> para exportar el archivo, luego copia su contenido en el editor de código a continuación."
            },
            workbench: {
                "step1": "Abre <bold>MySQL Workbench</bold> y <bold>conéctate</bold> a tu servidor MySQL.",
                "step2": "En el menú superior, ve a <bold>Server > Data Export</bold>.",
                "step3": "En las <bold>Opciones de exportación</bold>, elige <bold>Dump Structure Only</bold>.",
                "step4": "Marca <bold>Export to Self-Contained File</bold>, luego elige una ubicación y un nombre para el archivo <code>.sql</code>.",
                "step5": "Haz clic en <bold>Start Export</bold> para iniciar el proceso. Luego copia su contenido en el editor de código."

            },
            heidisql: {
                "step1": "<bold>Abre HeidiSQL</bold> y conéctate a tu servidor.",
                "step2": "En la <bold>barra lateral izquierda, haz clic derecho</bold> sobre la base de datos que quieres exportar.",
                "step3": "Selecciona <bold>Exportar base de datos como SQL</bold> del menú contextual.",
                "step4": "Selecciona <bold>Sin datos</bold> y asegúrate de que <bold>Crear</bold> esté marcado para exportar solo la estructura.",
                "step5": "Haz clic en el botón <bold>Exportar</bold> y finalmente copia el contenido del archivo <code>.sql</code> en el <bold>editor de código</bold> a continuación."

            },
            dbbrowser: {
                step1: "Inicia <bold>DB Browser for SQLite</bold>.",
                step2: "Haz clic en <bold>Archivo > Abrir base de datos</bold> y selecciona tu archivo <code>.sqlite</code> o <code>.db</code>.",
                step3: "Ve a <bold>Archivo > Exportar > Base de datos a archivo SQL</bold> desde el menú superior.",
                step4: "En el diálogo, elige <bold>Exportar solo esquema</bold> y haz clic en <bold>Guardar</bold>.",
                step5: "Finalmente, copia el contenido del archivo <code>.sql</code> en el <bold>editor de código</bold> a continuación."

            },

        }

    }

}

export const esLanguage: Language = {
    name: "Spanish",
    nativeName: "Español",
    code: "es",
};
