import { Language } from "../types";


export const ar = {

    translation: {
        sidebar: {
            tables: "الجداول",
            relationships: "العلاقات"
        },
        db_controller: {
            filter : "تصفية" , 
            add_table : "إضافة جدول" , 
            add_field : "إضافة حقل" , 
            add_index : "إضافة فهرس" ,  
            add_relationship : "إضافة علاقة" , 
            show_code : "عرض الكود" , 
            fields : "الحقول" , 
            indexes : "الفهارس" , 
            note : "ملاحظة" , 
            name : "الاسم" , 
            type : "النوع" , 
            primary_key : "المفتاح الأساسي" , 
            nullable : "يسمح بالقيمة الفارغة" , 
            select_fields : "اختر الحقول" , 
            unique : "فريد" , 
            table_note : "ملاحظة الجدول" , 
            collapse : "إخفاء الكل" , 
            primary_table : "الجدول الأساسي" , 
            referenced_table : "الجدول المشار إليه" , 
            cardinality :{
                name : "العلاقة" , 
                one_to_one : "واحد إلى واحد" , 
                one_to_many : "واحد إلى متعدد" , 
                many_to_one : "متعدد إلى واحد" , 
                many_to_many : "متعدد إلى متعدد" , 
            }, 
            delete : "حذف" , 
        } , 
        table: {
            double_click: "انقر مرتين للتعديل"
        },
    }

}

export const arLanguage: Language = {
    name: 'Arabic',
    nativeName: 'العربية',
    code: 'ar',
};
