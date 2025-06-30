import { Language } from "../types";

export const ar = {
    translation: {
        sidebar: {
            tables: "الجداول",
            relationships: "العلاقات"
        },
        modal: {
            close: "إغلاق",
            create: "إنشاء"
        },
        color_picker: {
            default_color: "اللون الافتراضي"
        },
        db_controller: {
            filter: "تصفية",
            add_table: "إضافة جدول",
            add_field: "إضافة حقل",
            add_index: "إضافة فهرس",
            add_relationship: "إضافة علاقة",
            show_code: "عرض الكود",
            fields: "الحقول",
            indexes: "الفهارس",
            note: "ملاحظة",
            name: "الاسم",
            type: "النوع",
            nullable: "يمكن أن يكون فارغًا",
            select_fields: "اختر الحقول",
            unique: "فريد",
            table_note: "ملاحظة الجدول",
            collapse: "طي الكل",

            primary_key: "المفتاح الأساسي",
            foreign_key: "المفتاح الخارجي",

            source_table: "جدول المصدر",
            target_table: "جدول الهدف",

            select_table: "اختر الجدول",
            select_field: "اختر الحقل",

            cardinality: {
                name: "التعددية",
                one_to_one: "واحد إلى واحد",
                one_to_many: "واحد إلى متعدد",
                many_to_one: "متعدد إلى واحد",
                many_to_many: "متعدد إلى متعدد"
            },
            delete: "حذف",
            field_setting: "إعدادات الحقل",
            table_actions: "إجراءات الحقل",
            actions: "إجراءات",

            field_note: "ملاحظة الحقل",
            delete_field: "حذف الحقل",

            create_relationship: "إنشاء علاقة",
            relationship_error: "لإنشاء علاقة، يجب أن يكون نوع مفتاح المصدر ونوع المفتاح المرجعي متماثلين.",

            invalid_relationship: {
                title: "علاقة غير صالحة",
                description: "نوع مفتاح المصدر لا يتطابق مع نوع المفتاح المرجعي. يرجى التأكد من أن كلا المفتاحين لهما نفس نوع البيانات."
            }
        },
        table: {
            double_click: "انقر مزدوجًا للتعديل",
            overlapping_tables: "الجداول المتداخلة",
        },
        control_buttons: {
            redo: "إعادة",
            undo: "تراجع",
            zoom_in: "تكبير",
            zoom_out: "تصغير",
            adjust_positions: "تعديل المواقع",
            show_all: "عرض الكل"
        },
        menu: {
            file: "ملف",
            new: "جديد",
            open: "فتح",
            save: "حفظ",
            import: "استيراد",
            json: ".json",
            dbml: ".dbml",
            mysql: "MySql",
            postgresql: "Postgresql",
            export_sql: "تصدير SQL",
            generic: "عام",
            export_orm_models: "تصدير ORM Models",
            delete_project: "حذف المشروع",
            edit: "تحرير",
            undo: "تراجع",
            redo: "إعادة",
            clear: "مسح",
            view: "عرض",
            hide_controller: "إخفاء المتحكم",
            zoom_on_scroll: "التكبير عند التمرير",
            on: "تشغيل",
            off: "إيقاف",
            theme: "الثيم",
            light: "فاتح",
            dark: "داكن",
            help: "مساعدة",
            show_docs: "عرض المستندات",
            join_discord: "الانضمام إلى ديسكورد"
        },
        connection_status: {
            online: "متصل",
            offline: "غير متصل",
            saving: "جارٍ الحفظ",
            saved: "تم الحفظ",
            last_synced: "آخر مزامنة"
        },
        import: {
            instructions: "التعليمات",
            install: "التثبيت",
            run_command: "قم بتشغيل الأمر التالي في الطرفية.",
            example: "مثال",
            copy_code: "انسخ محتوى ملف .sql إلى قسم الكود أدناه.",
            pg_admin: {
                step1: "افتح <bold>Pg Admin</bold>.",
                step2: "انقر بزر الفأرة الأيمن على قاعدة البيانات واختر <bold>Backup</bold> من القائمة السياقية.",
                step3: "قم بتسمية ملف <code>.sql</code>، ثم اختر التنسيق <bold>Plain</bold>، وحدد <bold>Encoding: UTF8</bold>.",
                step4: "تأكد من أن <bold>Only schema</bold> محددة، و<bold>Only data</bold> غير محددة، وذلك في علامة تبويب <bold>Data Options</bold>.",
                step5: "انقر على <bold>Backup</bold> لتصدير الملف، ثم انسخ محتواه إلى قسم محرر الكود أدناه."
            },
            workbench: {
                step1: "افتح <bold>MySQL Workbench</bold> و<bold>اتصل</bold> بخادم MySQL الخاص بك.",
                step2: "من القائمة العلوية، انتقل إلى <bold>Server &gt; Data Export</bold>.",
                step3: "في قسم <bold>خيارات التصدير</bold>، اختر <bold>Dump Structure Only</bold>.",
                step4: "حدد <bold>Export to Self-Contained File</bold>، ثم اختر مكان الحفظ واسم ملف الإخراج <code>.sql</code>.",
                step5: "انقر على <bold>Start Export</bold> لبدء عملية التصدير، ثم انسخ محتوى الملف إلى قسم محرر الكود أدناه."
            }
        }
    }
};

export const arLanguage: Language = {
    name: 'Arabic',
    nativeName: 'العربية',
    code: 'ar',
};
