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
            double_click: "انقر مزدوجًا للتعديل" , 
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
        }
    }
};

export const arLanguage: Language = {
    name: 'Arabic',
    nativeName: 'العربية',
    code: 'ar',
};
