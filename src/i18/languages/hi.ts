import { Language } from "../types";

export const hi = {
    translation: {
        sidebar: {
            tables: "तालिकाएँ",
            relationships: "रिलेशनशिप्स"
        },

        color_picker: {
            default_color: "डिफ़ॉल्ट रंग"
        },
        navbar: {
            rename_db: "डेटाबेस का नाम बदलें",
            search: "खोजें"
        },
        db_controller: {
            filter: "फ़िल्टर",
            add_table: "तालिका जोड़ें",
            add_field: "फ़ील्ड जोड़ें",
            add_index: "इंडेक्स जोड़ें",
            delete_table: "तालिका हटाएँ",
            duplicate: "कॉपी करें",
            add_relationship: "रिलेशनशिप जोड़ें",
            show_code: "कोड दिखाएं",
            fields: "फ़ील्ड्स",
            indexes: "इंडेक्सेस",
            note: "नोट",
            name: "नाम",
            type: "प्रकार",
            nullable: "नल योग्य",
            select_fields: "फ़ील्ड चुनें",
            unique: "अद्वितीय",
            table_note: "तालिका नोट",
            collapse: "सभी को संक्षिप्त करें",
            primary_key: "प्राथमिक कुंजी",
            foreign_key: "विदेशी कुंजी",

            source_table: "स्रोत तालिका",
            referenced_table: "संदर्भित तालिका",

            select_table: "तालिका चुनें",
            select_field: "फ़ील्ड चुनें",

            empty_list: {
                no_tables: "कोई तालिकाएँ नहीं",
                no_tables_description: "शुरू करने के लिए एक तालिका बनाएं।",

                no_relationships: "कोई रिलेशनशिप्स नहीं",
                no_relationships_description: "दो तालिकाओं को जोड़ने के लिए रिलेशनशिप बनाएं"
            },

            cardinality: {
                name: "कार्डिनैलिटी",
                one_to_one: "एक से एक",
                one_to_many: "एक से अनेक",
                many_to_one: "अनेक से एक",
                many_to_many: "अनेक से अनेक"
            },
            foreign_key_actions: {
                title: "विदेशी कुंजी क्रियाएँ",
                on_delete: "हटाने पर",
                on_update: "अपडेट पर",
                actions: {
                    no_action: "कोई क्रिया नहीं",
                    cascade: "कैस्केड",
                    set_null: "नल सेट करें",
                    set_default: "डिफ़ॉल्ट सेट करें",
                    restrict: "प्रतिबंधित करें"
                }
            },
            field_settings: {
                title: "फ़ील्ड सेटिंग",
                unique: "अद्वितीय",
                unsigned: "असाइन किए बिना",
                numeric_setting: "संख्यात्मक सेटिंग",
                decimal_setting: "दशमलव सेटिंग",
                zeroFill: "शून्य भरें",
                autoIncrement: "स्वतः वृद्धि",
                note: "नोट",

                delete_field: "फ़ील्ड हटाएं",
                field_note: "फ़ील्ड नोट",
                precision: "सटीकता",
                text_setting: "टेक्स्ट सेटिंग",
                charset: "अक्षरसेट",
                collation: "कोलेशन",
                scale: "स्केल",
                max_length: "अधिकतम लंबाई",
                integer_width: "पूर्णांक चौड़ाई",
                width: "चौड़ाई",
                default_value: "डिफ़ॉल्ट मान",
                value: "मान",
                length: "लंबाई",
                values: "मान",
                type_enter: "टाइप करें और एंटर दबाएं",
                precision_def: "कुल अनुमत अंक (दशमलव से पहले और बाद)।",
                scale_def: "दशमलव के बाद अनुमत अंक।",
                time_default_value: {
                    no_value: "कोई मान नहीं",
                    custom: "कस्टम समय",
                    now: "अभी"
                },
                errors: {
                    max_length: "सकारात्मक संख्या होनी चाहिए, दशमलव नहीं।",
                    integer_default_value: "पूर्णांक के लिए अमान्य डिफ़ॉल्ट मान",
                    precision: "सटीकता सकारात्मक संख्या होनी चाहिए, दशमलव नहीं।",
                    scale: "स्केल सकारात्मक संख्या होनी चाहिए, दशमलव नहीं।",
                    scale_max_value: "स्केल ≤ सटीकता होनी चाहिए।"
                },
                pick_value: "मान चुनें"
            },
            delete: "हटाएँ",

            index_setting: "इंडेक्स सेटिंग",
            table_actions: "तालिका क्रियाएँ",
            actions: "क्रियाएँ",
            delete_index: "इंडेक्स हटाएं",
            index_name: "इंडेक्स नाम",
            create_relationship: "रिलेशनशिप बनाएं",
            relationship_error: "रिलेशनशिप बनाने के लिए, प्राथमिक कुंजी और विदेशी कुंजी समान प्रकार की होनी चाहिए।",

            invalid_relationship: {
                title: "अमान्य रिलेशनशिप",
                description: "स्रोत कुंजी प्रकार संदर्भित कुंजी प्रकार से मेल नहीं खाता। कृपया सुनिश्चित करें कि दोनों कुंजी एक ही डेटा प्रकार की हों।"
            },
            circular_dependency: {
                title: "परिपत्र निर्भरता मिली",
                toast_description: "तालिकाओं के बीच परिपत्र संदर्भ पाया गया। बाईं ओर के आरेख की जाँच करें और एक रिलेशनशिप हटाएं।",
                description: "आपकी स्कीमा में तालिकाओं के बीच एक परिपत्र विदेशी कुंजी संबंध है। इसे ठीक करने के लिए",
                suggestion: "नीचे दी गई चक्र उत्पन्न करने वाली रिलेशनशिप में से एक को हटाएं।",
                remove_relationship: "रिलेशनशिप हटाएं"
            }
        },
        table: {
            double_click: "संपादन के लिए डबल क्लिक करें",
            overlapping_tables: "ओवरलैपिंग तालिकाएँ",
            show_more: "और दिखाएं",
            show_less: "कम दिखाएं"
        },
        control_buttons: {
            redo: "फिर से करें",
            undo: "पूर्ववत करें",
            zoom_in: "ज़ूम इन",
            zoom_out: "ज़ूम आउट",
            adjust_positions: "स्थिति समायोजित करें",
            show_all: "सभी दिखाएं"
        },
        menu: {
            file: "फ़ाइल",
            new: "नया",
            open: "खोलें",
            save: "सहेजें",
            import: "आयात करें",
            json: ".json",
            dbml: ".dbml",
            mysql: "MySQL",
            postgresql: "PostgreSQL",
            export_sql: "SQL निर्यात करें",
            generic: "सामान्य",
            export_orm_models: "ORM मॉडल निर्यात करें",
            delete_project: "परियोजना हटाएं",
            edit: "संपादित करें",
            undo: "पूर्ववत करें",
            redo: "फिर से करें",
            clear: "साफ करें",
            view: "दृश्य",
            hide_controller: "कंट्रोलर छिपाएं",
            show_controller: "कंट्रोलर दिखाएं",
            cardinality_style: "कार्डिनैलिटी शैली",
            hidden: "छिपा हुआ",
            numeric: "संख्यात्मक",
            symbolic: "प्रतीकात्मक",
            theme: "थीम",
            light: "हल्का",
            dark: "गहरा",
            help: "मदद",
            show_docs: "दस्तावेज़ दिखाएं",
            join_discord: "डिस्कॉर्ड से जुड़ें"
        },

        modals: {
            close: "बंद करें",
            create: "बनाएं",
            pick_database: "अपना डेटाबेस चुनें।",
            create_database_header: "हर डेटाबेस विशिष्ट विशेषताएं और कार्यक्षमता प्रदान करता है।",
            db_name: "डेटाबेस का नाम",
            db_name_error: "कृपया डेटाबेस का नाम प्रदान करें",
            continue: "जारी रखें",
            open: "खोलें",
            open_database: "डेटाबेस खोलें",
            open_database_header: "सूची में से एक डेटाबेस चुनकर खोलें।",
            delete_database: "डेटाबेस हटाएं",
            delete_database_content: "यह क्रिया अपरिवर्तनीय है और आरेख को स्थायी रूप से हटा देगी।",
            delete: "हटाएँ",
            empty_diagram: "खाली आरेख",
            import_database: {
                title: "अपना डेटाबेस आयात करें",
                import: "आयात करें",
                import_options: "क्या आप निम्न के माध्यम से आयात करना चाहेंगे:",
                import_error: "SQL पार्सिंग त्रुटि",
                import_error_description: "हम आपका SQL आयात नहीं कर सके क्योंकि इसमें अमान्य सिंटैक्स है।",
                import_warning: "SQL पार्सिंग चेतावनी",
                import_warning_description: "कुछ तत्वों को समर्थन न होने या अधूरे घोषणाओं के कारण संसाधित नहीं किया जा सका।"
            },
            open_database_table: {
                dialect: "भाषा शैली",
                name: "नाम",
                created_at: "बनाया गया",
                tables: "टेबल्स"
            } , 
            export_sql: "SQL निर्यात करें",
            export_sql_header: "अपने डेटाबेस आरेख को SQL कोड में निर्यात करें"
        },
        clipboard: {
            copy: "कॉपी करें",
            copied: "कॉपी किया गया"
        },

        connection_status: {
            online: "ऑनलाइन",
            offline: "ऑफ़लाइन",
            saving: "सहेजा जा रहा है",
            saved: "सहेजा गया",
            last_synced: "अंतिम समन्वय",
            min_ago: "मिनट पहले",
            hour_ago: "घंटा पहले",
            just_now: "अभी"
        },
        import: {
            instructions: "निर्देश",
            install: "इंस्टॉल करें",
            run_command: "अपने टर्मिनल में निम्न कमांड चलाएं।",
            example: "उदाहरण",
            copy_code: "नीचे दिए गए कोड सेक्शन में .sql फ़ाइल की सामग्री कॉपी करें।",
            pg_admin: {
                step1: "<bold>Pg Admin</bold> खोलें।",
                step2: "अपने डेटाबेस पर राइट-क्लिक करें और <bold>Backup</bold> चुनें।",
                step3: "अपनी <code>.sql</code> फ़ाइल को नाम दें, फॉर्मेट को <bold>Plain</bold> पर सेट करें और <bold>Encoding: UTF8</bold> चुनें।",
                step4: "<bold>Data Options टैब</bold> में सुनिश्चित करें कि <bold>Only schema</bold> चयनित है और <bold>Only data</bold> चयनित नहीं है।",
                step5: "<bold>Backup</bold> पर क्लिक करें और फिर उसकी सामग्री को नीचे दिए गए कोड एडिटर में पेस्ट करें।"
            },
            workbench: {
                step1: "<bold>MySQL Workbench</bold> खोलें और अपने MySQL सर्वर से <bold>connect</bold> करें।",
                step2: "शीर्ष मेनू में <bold>Server > Data Export</bold> पर जाएं।",
                step3: "<bold>Export Options</bold> में <bold>Dump Structure Only</bold> चुनें।",
                step4: "<bold>Export to Self-Contained File</bold> को चेक करें, स्थान और नाम चुनें।",
                step5: "<bold>Start Export</bold> पर क्लिक करें और फिर फ़ाइल की सामग्री को नीचे दिए गए कोड एडिटर में कॉपी करें।"
            },
            heidisql: {
                step1: "<bold>HeidiSQL</bold> खोलें और अपने सर्वर से कनेक्ट करें।",
                step2: "बाएं साइडबार में, उस डेटाबेस पर <bold>राइट-क्लिक</bold> करें जिसे आप निर्यात करना चाहते हैं।",
                step3: "<bold>Export database as SQL</bold> चुनें।",
                step4: "<bold>No data</bold> चुनें और सुनिश्चित करें कि <bold>Create</bold> चेक किया गया है।",
                step5: "<bold>Export</bold> बटन पर क्लिक करें और फिर <code>.sql</code> फ़ाइल की सामग्री को नीचे कोड एडिटर में कॉपी करें।"
            },
            dbbrowser: {
                step1: "<bold>DB Browser for SQLite</bold> लॉन्च करें।",
                step2: "<bold>File > Open Database</bold> पर क्लिक करें और अपनी <code>.sqlite</code> या <code>.db</code> फ़ाइल चुनें।",
                step3: "शीर्ष मेनू से <bold>File > Export > Database to SQL file</bold> पर जाएं।",
                step4: "डायलॉग में <bold>Export schema only</bold> चुनें और <bold>Save</bold> पर क्लिक करें।",
                step5: "अंत में, <code>.sql</code> फ़ाइल की सामग्री को नीचे दिए गए <bold>code editor</bold> में कॉपी करें।"
            }
        }
    }
};

export const hiLanguage: Language = {
    name: "Hindi",
    nativeName: "हिन्दी",
    code: "hi",
};
