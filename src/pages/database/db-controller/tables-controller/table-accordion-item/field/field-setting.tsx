import TagInput from "@/components/tag-input/tag-input";
import { DatabaseDialect } from "@/lib/database";
import { Modifiers, MySQLCharset, MySQLCollation, PostgreSQLCharset, PostgreSQLCollation, SQLiteCharset, SQLiteCollation } from "@/lib/field";
import { FieldInsertType, FieldType } from "@/lib/schemas/field-schema";
import { useDatabaseOperations } from "@/providers/database-provider/database-provider";
import { Button, Checkbox, Input, Select, SelectItem, SharedSelection, Switch, Textarea } from "@heroui/react";
import { Trash2 } from "lucide-react";
import React, { Ref, useCallback, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";




interface FieldSettingProps {
    field: FieldType
}



const FieldSetting: React.FC<FieldSettingProps> = ({ field }) => {

    const modifiers: string[] = field.type?.modifiers ? JSON.parse(field.type.modifiers) : [];

    const { deleteField, editField } = useDatabaseOperations();
    const { t } = useTranslation();
    const [charset, setCharset] = useState(new Set([field.charset]));
    const [collation, setCollation] = useState(new Set([field.collate]));

    const [note, setNote] = useState<string | undefined>(field.note as string | undefined);
    const defaultNameRef: Ref<HTMLInputElement> = useRef<HTMLInputElement>(null);
    const maxLengthRef: Ref<HTMLInputElement> = useRef<HTMLInputElement>(null);
    const scaleRef: Ref<HTMLInputElement> = useRef<HTMLInputElement>(null);
    const precisionRef: Ref<HTMLInputElement> = useRef<HTMLInputElement>(null);

    const collations = useMemo(() => {
        if (!field.type)
            return undefined;

        if (field.type.dialect == DatabaseDialect.MYSQL || field.type.dialect == DatabaseDialect.MARIADB)
            return MySQLCollation;
        if (field.type.dialect == DatabaseDialect.POSTGRES)
            return PostgreSQLCollation;
        if (field.type.dialect == DatabaseDialect.SQLITE)
            return SQLiteCollation;

    }, [field]);
    const charsets = useMemo(() => {
        if (!field.type)
            return undefined;

        if (field.type.dialect == DatabaseDialect.MYSQL || field.type.dialect == DatabaseDialect.MARIADB)
            return MySQLCharset;
        if (field.type.dialect == DatabaseDialect.POSTGRES)
            return PostgreSQLCharset;
        if (field.type.dialect == DatabaseDialect.SQLITE)
            return SQLiteCharset;

    }, [field])
    const removeField = () => {
        deleteField(field.id)
    }
 

    const updateFieldNote = useCallback(() => {
        editField({
            id: field.id,
            note: note,
        } as FieldInsertType)
    }, [field])
    const toggleUnqiue = useCallback((value: boolean) => {
        editField({
            id: field.id,
            unique: value
        } as FieldInsertType)
    }, [field]);

    const toggleUnsigned = useCallback((value: boolean) => {
        editField({
            id: field.id,
            unsigned: value
        } as FieldInsertType)
    }, [field]);

    const toggleAutoIncrement = useCallback((value: boolean) => {
        editField({
            id: field.id,
            autoIncrement: value
        } as FieldInsertType)
    }, [field]);


    const toggleZeroFill = useCallback((value: boolean) => {
        editField({
            id: field.id,
            zeroFill: value
        } as FieldInsertType)
    }, [field]);


    const changeCharset = useCallback((keys: SharedSelection) => {
  
        if (keys.anchorKey != field.charset) {
      
            editField({
                id: field.id,
                charset: keys.anchorKey,

            } as FieldInsertType);
        } 
        setCharset(keys as any);
    }, [field]);


    const changeCollation = useCallback((keys: SharedSelection) => {
 
        if (keys.anchorKey != field.collate) {
 
            editField({
                id: field.id,
                collate: keys.anchorKey,

            } as FieldInsertType);
        } 
        setCollation(keys as any);
    }, [field])

    const saveDefaultValue = useCallback(() => {
        const value: string | undefined = defaultNameRef.current?.value;
        editField({
            id: field.id,
            defaultValue: value ? String(value) : null,

        } as FieldInsertType);
    }, [defaultNameRef, field]);


    const saveMaxLength = useCallback(() => {
        const value: string | undefined = maxLengthRef.current?.value;
        editField({
            id: field.id,
            maxLength: value ? value : null,

        } as FieldInsertType);
    }, [maxLengthRef, field]);


    const savePrecision = useCallback(() => {
        const value: string | undefined = precisionRef.current?.value;
        editField({
            id: field.id,
            precision: value ? value : null,

        } as FieldInsertType);
    }, [precisionRef, field]);


    const saveScale = useCallback(() => {
        const value: string | undefined = scaleRef.current?.value;
        editField({
            id: field.id,
            scale: value ? value : null,

        } as FieldInsertType);
    }, [scaleRef, field]);



    const updateValues = useCallback((values: string[]) => {
        const jsonValues = JSON.stringify(values);
 
        if (jsonValues != field.values)
            editField({
                id: field.id,
                values: jsonValues,

            } as FieldInsertType);
    }, [field])

    const showNumericModifiers: boolean = modifiers.includes(Modifiers.AUTO_INCREMENT) || modifiers.includes(Modifiers.UNSIGNED) || modifiers.includes(Modifiers.ZEROFILL)
    const showDecimalModifiers: boolean = modifiers.includes(Modifiers.PRECISION) || modifiers.includes(Modifiers.SCALE);
    const showTextModifiers: boolean = modifiers.includes(Modifiers.COLLATE) || modifiers.includes(Modifiers.CHARSET);



    return (
        <div className="w-full flex flex-col gap-2 p-2 min-w-[260px] max-w-[260px]">
            <h3 className="font-semibold text-sm text-font/90">
                {t("db_controller.field_settings.title")}
            </h3>
            <hr className="border-divider" />

            <div className="flex w-full justify-between">
                <span className="text-xs text-icon font-medium dark:text-font/90">
                    {t("db_controller.field_settings.unique")}
                </span>
                <Checkbox defaultSelected={field.unique as boolean} size="md" onValueChange={toggleUnqiue} />
            </div>
            {
                showNumericModifiers && <>
                    <h3 className="font-semibold text-sm text-font/90">
                        {t("db_controller.field_settings.numeric_setting")}
                    </h3>
                    <hr className="border-divider" />
                    {
                        modifiers.includes(Modifiers.AUTO_INCREMENT) &&
                        <div className="flex w-full  justify-between">
                            <span className="text-xs text-icon font-medium dark:text-font/90">
                                {t("db_controller.field_settings.autoIncrement")}
                            </span>
                            <Checkbox defaultSelected={field.autoIncrement as boolean} size="md" onValueChange={toggleAutoIncrement} />
                        </div>
                    }
                    {
                        modifiers.includes(Modifiers.UNSIGNED) &&
                        <div className="flex w-full  justify-between">
                            <span className="text-xs text-icon font-medium dark:text-font/90">
                                {t("db_controller.field_settings.unsigned")}
                            </span>
                            <Checkbox defaultSelected={field.unsigned as boolean} size="md" onValueChange={toggleUnsigned} />
                        </div>
                    }
                    {
                        modifiers.includes(Modifiers.ZEROFILL) &&
                        <div className="flex w-full  justify-between">
                            <span className="text-xs text-icon font-medium dark:text-font/90">
                                {t("db_controller.field_settings.zeroFill")}
                            </span>
                            <Checkbox defaultSelected={field.zeroFill as boolean} size="md" onValueChange={toggleZeroFill} />
                        </div>
                    }

                </>
            }
            {
                showDecimalModifiers && <>
                    <h3 className="font-semibold text-sm text-font/90">
                        {t("db_controller.field_settings.decimal_setting")}
                    </h3>
                    <hr className="border-divider" />
                    <div className="flex gap-2">
                        {
                            modifiers.includes(Modifiers.PRECISION) &&
                            <div className="flex flex-col gap-2 w-full">
                                <label className="text-xs font-medium text-icon dark:text-font/90">
                                    {t("db_controller.field_settings.precision")}
                                </label>
                                <Input

                                    type="number"
                                    size="sm"
                                    ref={precisionRef}
                                    defaultValue={String(field.precision)}
                                    onBlur={savePrecision}
                                    radius="sm"
                                    variant="faded"
                                    placeholder={t("db_controller.field_settings.precision")}
                                    className="h-8 w-full focus-visible:ring-0 shadow-none "
                                    classNames={{
                                        inputWrapper: "dark:bg-default border-divider group-hover:border-primary ",
                                    }}

                                />
                            </div>
                        }
                        {
                            modifiers.includes(Modifiers.SCALE) &&
                            <div className="flex flex-col gap-2 w-full">
                                <label className="text-xs font-medium text-icon dark:text-font/90">
                                    {t("db_controller.field_settings.scale")}
                                </label>
                                <Input

                                    type="number"
                                    size="sm"

                                    ref={scaleRef}
                                    defaultValue={String(field.scale)}
                                    onBlur={saveScale}
                                    radius="sm"
                                    variant="faded"
                                    placeholder={t("db_controller.field_settings.scale")}
                                    className="h-8 w-full focus-visible:ring-0 shadow-none "
                                    classNames={{
                                        inputWrapper: "dark:bg-default border-divider group-hover:border-primary ",
                                    }}

                                />
                            </div>
                        }
                    </div>
                </>
            }
            {
                showTextModifiers &&
                <>
                    <h3 className="font-semibold text-sm text-font/90">
                        {t("db_controller.field_settings.text_setting")}
                    </h3>
                    <hr className="border-divider" />
                    {
                        modifiers.includes(Modifiers.CHARSET) && charsets && <>
                            <label className="text-xs font-medium text-icon dark:text-font/90">
                                {t("db_controller.field_settings.charset")}
                            </label>
                            <Select
                                className="w-full"
                                size="sm"
                                variant="bordered"
                                aria-label="charset"
                                placeholder={t("db_controller.field_settings.charset")}
                                selectedKeys={charset as any}
                                onSelectionChange={changeCharset}
                                classNames={{
                                    trigger: "border-divider group-hover:border-primary",
                                }}
                            >
                                {
                                    Object.values(charsets).map((charset: string) => (<SelectItem key={charset}>{charset}</SelectItem>))
                                }
                            </Select>
                        </>
                    }
                    {
                        modifiers.includes(Modifiers.COLLATE) && collations && <>
                            <label className="text-xs font-medium text-icon dark:text-font/90">
                                {t("db_controller.field_settings.collation")}
                            </label>
                            <Select
                                className="w-full"
                                size="sm"
                                variant="bordered"
                                aria-label="collation"
                                placeholder={t("db_controller.field_settings.collation")}
                                selectedKeys={collation as any}
                                onSelectionChange={changeCollation}
                                classNames={{
                                    trigger: "border-divider group-hover:border-primary",
                                }}
                            >
                                {
                                    Object.values(collations).map((collation: string) => (<SelectItem key={collation}>{collation}</SelectItem>))
                                }
                            </Select>
                        </>
                    }

                </>
            }
            {
                modifiers.includes(Modifiers.LENGTH) && <>
                    <label className="text-xs font-medium text-icon dark:text-font/90">
                        {t("db_controller.field_settings.max_length")}
                    </label>
                    <Input

                        type="number"
                        size="sm"
                        ref={maxLengthRef}
                        defaultValue={String(field.maxLength)}
                        onBlur={saveMaxLength}
                        radius="sm"
                        variant="faded"
                        placeholder={t("db_controller.field_settings.length")}
                        className="h-8 w-full focus-visible:ring-0 shadow-none "
                        classNames={{
                            inputWrapper: "dark:bg-default border-divider group-hover:border-primary ",
                        }}

                    />
                </>
            }
            {


                modifiers.includes(Modifiers.VALUES) && <>
                    <h3 className="font-semibold text-sm text-font/90">
                        {field.type.name != null && (field.type.name?.[0].toUpperCase() + field.type.name?.slice(1))} {t("db_controller.field_settings.values")}
                    </h3>
                    <hr className="border-divider" />
                    <TagInput
                        onItemsChange={updateValues}
                        defaultItems={field.values ? JSON.parse(field.values) : []}
                    />
                </>
            }


            <label className="text-xs font-medium text-icon dark:text-font/90">
                {t("db_controller.field_settings.default_value")}
            </label>
            <Input
                type="text"
                size="sm"
                ref={defaultNameRef}
                defaultValue={field.defaultValue as string}
                onBlur={saveDefaultValue}
                radius="sm"
                variant="faded"
                placeholder={t("db_controller.field_settings.value")}
                className="h-8 w-full focus-visible:ring-0 shadow-none "
                classNames={{
                    inputWrapper: "dark:bg-default border-divider group-hover:border-primary ",
                }}
            />

            <label className="text-xs font-medium text-icon dark:text-font/90">
                {t("db_controller.field_settings.note")}
            </label>
            <Textarea
                variant="bordered"
                className="w-full"
                label={t("db_controller.field_settings.field_note")}
                value={note}
                disableAutosize
                disableAnimation
                onValueChange={setNote}
                onBlur={updateFieldNote}
                classNames={{
                    inputWrapper: "bg-default border-divider ",
                    base: "max-w-xs",
                    input: "resize-y min-h-[60px] max-h-[180px]",
                }} />
            <hr className="border-divider" />
            <Button
                className="bg-default dark:bg-danger dark:border-none dark:text-white"
                radius="sm"
                variant="faded"
                color="danger"
                size="sm"
                onPressEnd={removeField}>
                <span className="font-medium text-sm ">
                    {t("db_controller.field_settings.delete_field")}
                </span>
                <Trash2 className="mr-1 size-3.5 text-danger dark:text-white" />
            </Button>
        </div>
    )
}


export default React.memo(FieldSetting); 