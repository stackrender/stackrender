import { Language } from "../types";

export const ar = {
  translation: {
    sidebar: {
      tables: "الجداول",
      relationships: "العلاقات"
    },
    color_picker: {
      default_color: "اللون الافتراضي"
    },
    navbar: {
      rename_db: "إعادة تسمية قاعدة البيانات",
      search: "بحث"
    },
    db_controller: {
      filter: "تصفية",
      add_table: "إضافة جدول",
      add_field: "إضافة حقل",
      add_index: "إضافة فهرس",
      delete_table: "حذف الجدول",
      duplicate: "تكرار",
      add_relationship: "إضافة علاقة",
      show_code: "عرض الكود",
      fields: "الحقول",
      indexes: "الفهارس",
      note: "ملاحظة",
      name: "الاسم",
      type: "النوع",
      nullable: "يسمح بالقيمة الفارغة",
      select_fields: "اختر الحقول",
      unique: "فريد",
      table_note: "ملاحظة الجدول",
      collapse: "طي الكل",
      primary_key: "المفتاح الأساسي",
      foreign_key: "المفتاح الخارجي",
      source_table: "الجدول المصدر",
      referenced_table: "الجدول المشار إليه",
      select_table: "اختر جدولًا",
      select_field: "اختر حقلًا",
      empty_list: {
        no_tables: "لا توجد جداول",
        no_tables_description: "أنشئ جدولًا للبدء.",
        no_relationships: "لا توجد علاقات",
        no_relationships_description: "أنشئ علاقات لربط جدولين"
      },
      cardinality: {
        name: "القرينة",
        one_to_one: "واحد إلى واحد",
        one_to_many: "واحد إلى متعدد",
        many_to_one: "متعدد إلى واحد",
        many_to_many: "متعدد إلى متعدد"
      },
      foreign_key_actions: {
        title: "إجراءات المفتاح الخارجي",
        on_delete: "عند الحذف",
        on_update: "عند التحديث",
        actions: {
          no_action: "لا إجراء",
          cascade: "تسلسل",
          set_null: "تعيين كـ Null",
          set_default: "تعيين كافتراضي",
          restrict: "تقييد"
        }
      },
      field_settings: {
        title: "إعدادات الحقل",
        unique: "فريد",
        unsigned: "بدون إشارة",
        numeric_setting: "إعداد رقمي",
        decimal_setting: "إعداد عشري",
        zeroFill: "تعبئة بالأصفار",
        autoIncrement: "زيادة تلقائية",
        note: "ملاحظة",
        delete_field: "حذف الحقل",
        field_note: "ملاحظة الحقل",
        precision: "الدقة",
        text_setting: "إعداد النص",
        charset: "ترميز الحروف",
        collation: "التجميع",
        scale: "المقياس",
        max_length: "الطول الأقصى",
        integer_width: "عرض العدد الصحيح",
        width: "العرض",
        default_value: "القيمة الافتراضية",
        value: "القيمة",
        length: "الطول",
        values: "القيم",
        type_enter: "اكتب واضغط Enter",
        precision_def: "إجمالي الأرقام المسموحة (قبل + بعد الفاصلة).",
        scale_def: "عدد الأرقام بعد الفاصلة.",
        time_default_value: {
          no_value: "لا توجد قيمة",
          custom: "وقت مخصص",
          now: "الآن"
        },
        errors: {
          max_length: "يجب أن يكون عددًا موجبًا بدون فواصل عشرية.",
          integer_default_value: "قيمة افتراضية غير صالحة لعدد صحيح",
          precision: "يجب أن تكون الدقة عددًا موجبًا بدون فواصل عشرية.",
          scale: "يجب أن يكون المقياس عددًا موجبًا بدون فواصل عشرية.",
          scale_max_value: "يجب أن يكون المقياس ≤ الدقة."
        },
        pick_value: "اختر قيمة"
      },
      delete: "حذف",
      index_setting: "إعدادات الفهرس",
      table_actions: "إجراءات الجدول",
      actions: "إجراءات",
      delete_index: "حذف الفهرس",
      index_name: "اسم الفهرس",
      create_relationship: "إنشاء علاقة",
      relationship_error: "لإنشاء علاقة، يجب أن يكون المفتاح الأساسي والمفتاح الخارجي من نفس النوع.",
      invalid_relationship: {
        title: "علاقة غير صالحة",
        description: "نوع مفتاح المصدر لا يتطابق مع نوع المفتاح المشار إليه. تأكد من أن كليهما من نفس نوع البيانات."
      },
      circular_dependency: {
        title: "تم الكشف عن تبعية دائرية",
        toast_description: "تم العثور على مرجع دائري بين الجداول. تحقق من المخطط على اليسار وقم بإزالة إحدى العلاقات لإصلاح ذلك.",
        description: "يحتوي المخطط الخاص بك على علاقة مفتاح خارجي دائرية بين الجداول. لإصلاحها،",
        suggestion: "قم بإزالة إحدى العلاقات أدناه التي تسبب الدورة.",
        remove_relationship: "إزالة العلاقة"
      }
    },
    table: {
      double_click: "انقر مرتين للتعديل",
      overlapping_tables: "جداول متداخلة",
      show_more: "عرض المزيد",
      show_less: "عرض أقل"
    },
    control_buttons: {
      redo: "إعادة",
      undo: "تراجع",
      zoom_in: "تكبير",
      zoom_out: "تصغير",
      adjust_positions: "ضبط المواقع",
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
      mysql: "MySQL",
      postgresql: "PostgreSQL",
      export_sql: "تصدير SQL",
      generic: "عام",
      export_orm_models: "تصدير نماذج ORM",
      delete_project: "حذف المشروع",
      edit: "تعديل",
      undo: "تراجع",
      redo: "إعادة",
      clear: "مسح",
      view: "عرض",
      hide_controller: "إخفاء لوحة التحكم",
      show_controller: "عرض لوحة التحكم",
      cardinality_style: "نمط القرينة",
      hidden: "مخفي",
      numeric: "رقمي",
      symbolic: "رمزي",
      theme: "الثيم",
      light: "فاتح",
      dark: "داكن",
      help: "مساعدة",
      show_docs: "عرض المستندات",
      join_discord: "انضم إلى Discord"
    },
    modals: {
      close: "إغلاق",
      create: "إنشاء",
      pick_database: "اختر قاعدة البيانات الخاصة بك.",
      create_database_header: "كل قاعدة بيانات تقدم ميزات مختلفة.",
      db_name: "اسم قاعدة البيانات",
      db_name_error: "يرجى إدخال اسم قاعدة البيانات",
      continue: "متابعة",
      open: "فتح",
      open_database: "فتح قاعدة بيانات",
      open_database_header: "افتح قاعدة بيانات عن طريق اختيار واحدة من القائمة.",
      delete_database: "حذف قاعدة البيانات",
      delete_database_content: "هذا الإجراء لا يمكن التراجع عنه وسيمسح المخطط نهائيًا.",
      delete: "حذف",
      import_database: {
        title: "استيراد قاعدة البيانات",
        import: "استيراد",
        import_options: "هل ترغب في الاستيراد باستخدام:",
        import_error: "خطأ في تحليل SQL",
        import_error_description: "تعذر استيراد SQL الخاص بك بسبب وجود صيغة غير صحيحة.",
        import_warning: "تحذير تحليل SQL",
        import_warning_description: "بعض العناصر لم يتم معالجتها بسبب تصريحات غير مدعومة أو غير مكتملة."
      },
      export_sql: "تصدير SQL",
      export_sql_header: "تصدير مخطط قاعدة البيانات على شكل كود SQL"
    },
    clipboard: {
      copy: "نسخ",
      copied: "تم النسخ"
    },
    connection_status: {
      online: "متصل",
      offline: "غير متصل",
      saving: "يتم الحفظ...",
      saved: "تم الحفظ",
      last_synced: "آخر مزامنة",
      min_ago: "دقيقة مضت",
      hour_ago: "ساعة مضت",
      just_now: "الآن"
    },
    import: {
      instructions: "التعليمات",
      install: "تثبيت",
      run_command: "قم بتشغيل الأمر التالي في الطرفية:",
      example: "مثال",
      copy_code: "انسخ محتوى ملف .sql إلى محرر الكود أدناه.",
      pg_admin: {
        step1: "افتح <bold>Pg Admin</bold>.",
        step2: "انقر بزر الماوس الأيمن على قاعدة البيانات واختر <bold>Backup</bold>.",
        step3: "قم بتسمية ملف <code>.sql</code>، حدد Format إلى <bold>Plain</bold>، واختر <bold>Encoding: UTF8.</bold>",
        step4: "تأكد من تحديد <bold>Only schema</bold> وإلغاء تحديد <bold>Only data</bold> في <bold>علامة تبويب خيارات البيانات</bold>.",
        step5: "اضغط <bold>Backup</bold> لتصدير الملف، ثم انسخ محتواه إلى محرر الكود أدناه."
      },
      workbench: {
        step1: "افتح <bold>MySQL Workbench</bold> واتصل بخادم MySQL الخاص بك.",
        step2: "من القائمة العلوية، اذهب إلى <bold>Server > Data Export</bold>.",
        step3: "في <bold>خيارات التصدير</bold>، اختر <bold>Dump Structure Only</bold>.",
        step4: "حدد <bold>Export to Self-Contained File</bold>، ثم اختر مكانًا واسمًا لملف <code>.sql</code>.",
        step5: "اضغط على <bold>Start Export</bold>، ثم انسخ محتوى الملف إلى محرر الكود أدناه."
      },
      heidisql: {
        step1: "<bold>افتح HeidiSQL</bold> واتصل بالخادم.",
        step2: "في <bold>الشريط الجانبي الأيسر</bold>، انقر بزر الماوس الأيمن على قاعدة البيانات التي تريد تصديرها.",
        step3: "اختر <bold>Export database as SQL</bold>.",
        step4: "حدد <bold>No data</bold> وتأكد من تحديد <bold>Create</bold> لتصدير البنية فقط.",
        step5: "انقر على <bold>Export</bold>، ثم انسخ محتوى ملف <code>.sql</code> إلى محرر الكود."
      },
      dbbrowser: {
        step1: "شغل <bold>DB Browser for SQLite</bold>.",
        step2: "اذهب إلى <bold>File > Open Database</bold> واختر ملف <code>.sqlite</code> أو <code>.db</code>.",
        step3: "من القائمة، اختر <bold>File > Export > Database to SQL file</bold>.",
        step4: "في النافذة، اختر <bold>Export schema only</bold> ثم انقر <bold>Save</bold>.",
        step5: "أخيرًا، انسخ محتوى ملف <code>.sql</code> إلى محرر الكود أدناه."
      }
    }
  }
}

export const arLanguage: Language = {
    name: 'Arabic',
    nativeName: 'العربية',
    code: 'ar',
};
