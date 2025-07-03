import TagInput from "@/components/tag-input/tag-input";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/tooltip/tooltip";
import { DatabaseDialect } from "@/lib/database";
import { DataTypes, Modifiers, MySQLCharset, MySQLCollation, PostgreSQLCharset, PostgreSQLCollation, SQLiteCharset, SQLiteCollation } from "@/lib/field";
import { FieldInsertType, FieldType } from "@/lib/schemas/field-schema";
import { useDatabaseOperations } from "@/providers/database-provider/database-provider";
import { Button, Checkbox, Input, Select, SelectItem, SharedSelection, Switch, Textarea, Tooltip as HeroUITooltip } from "@heroui/react";
import { CircleHelp, Trash2, TriangleAlert } from "lucide-react";
import React, { Ref, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import FieldDefaultValue from "./field-default-value";




interface FieldSettingProps {
    field: FieldType
}

export interface ModifierValidation {
    isValid: boolean;
    errorMessage?: string;
}

const FieldSetting: React.FC<FieldSettingProps> = ({ field }) => {

    const modifiers: string[] = field.type?.modifiers ? JSON.parse(field.type.modifiers) : [];

    const { deleteField, editField } = useDatabaseOperations();
    const { t } = useTranslation();
    const [charset, setCharset] = useState(new Set([field.charset]));
    const [collation, setCollation] = useState(new Set([field.collate]));

    const [note, setNote] = useState<string | undefined>(field.note as string | undefined);

    const maxLengthRef: Ref<HTMLInputElement> = useRef<HTMLInputElement>(null);
    const scaleRef: Ref<HTMLInputElement> = useRef<HTMLInputElement>(null);
    const precisionRef: Ref<HTMLInputElement> = useRef<HTMLInputElement>(null);

    const [maxLengthValidation, setMaxLengthValidation] = useState<ModifierValidation>({
        isValid: true,
    });



    const [precisionValidation, setPrecisionValidation] = useState<ModifierValidation>({
        isValid: true,
    });


    const [scaleValidation, setScaleValidation] = useState<ModifierValidation>({
        isValid: true,
    });


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
    }, [field , note]) ; 

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



    const saveMaxLength = useCallback(() => {
        if (maxLengthValidation.isValid) {

            const value: string | undefined = maxLengthRef.current?.value;
            editField({
                id: field.id,
                maxLength: value ? value : null,

            } as FieldInsertType);
        }
    }, [maxLengthRef, maxLengthValidation, field]);


    const saveScaleAndPrecision = useCallback(() => {

        const precision: number | null = Number(precisionRef.current?.value)
        const scale: number | null = Number(scaleRef.current?.value);

        editField({
            id: field.id,
            precision: precisionValidation.isValid ? (precision > 0 ? precision : null) : undefined,
            scale: (scaleValidation.isValid && precision > 0) ? (scale > 0 ? scale : null) : null
        } as FieldInsertType)

    }, [field, scaleRef, precisionRef, scaleValidation, precisionValidation])


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



    const maxLengthChange = useCallback((value: any) => {
        if (value && value.trim().length > 0) {
            const isValid = Number.isInteger(Number(value)) && value > 0;

            setMaxLengthValidation({
                isValid,
                errorMessage: (field.type?.type == DataTypes.INTEGER ?
                    t("db_controller.field_settings.width")
                    :
                    t("db_controller.field_settings.max_length")) + " " + t("db_controller.field_settings.errors.max_length")
            })
        } else
            setMaxLengthValidation({
                isValid: true,
                errorMessage: undefined
            });

    }, [maxLengthRef, field]);






    const validateScaleAndPrecision = useCallback(() => {
        const scale: number | null = scaleRef.current && Number(scaleRef.current?.value);
        const precision: number | null = precisionRef.current && Number(precisionRef.current?.value);
        if (precision) {
            const isValid = Number.isInteger(precision) && precision > 0;
            setPrecisionValidation({
                isValid,
                errorMessage: t("db_controller.field_settings.errors.precision")
            });
        }
        else {
            setPrecisionValidation({
                isValid: true,
                errorMessage: undefined
            });
        }

        if (scale) {
            const isPositive = Number.isInteger(scale) && scale >= 0;
            let isLessThanPrecision: boolean = true;

            if (precision && precision >= 0) {
                isLessThanPrecision = precision >= scale;
            }
            const errorMessage: string | undefined = !isPositive ? t("db_controller.field_settings.errors.scale") :
                ((!isLessThanPrecision) ? t("db_controller.field_settings.errors.scale_max_value") : undefined)

            setScaleValidation({
                isValid: (isPositive && isLessThanPrecision) as boolean,
                errorMessage: errorMessage
            });

        } else {
            setScaleValidation({
                isValid: true,
                errorMessage: undefined
            });
        }

    }, [precisionRef, scaleRef])



    return (
        <div className="w-full flex flex-col gap-2 p-2 min-w-[260px] max-w-[260px]">
            <h3 className="font-semibold text-sm text-font/90">
                {t("db_controller.field_settings.title")}
            </h3>
            <hr className="border-divider" />
            {
                !modifiers.includes(Modifiers.NO_UNIQUE) &&
                <div className="flex w-full justify-between">
                    <span className="text-xs text-font/70 font-medium dark:text-font/90">
                        {t("db_controller.field_settings.unique")}
                    </span>
                    <Checkbox
                        defaultSelected={field.unique as boolean}
                        size="md"

                        classNames={{
                            wrapper: "before:border-divider group-data-[hover=true]:before:bg-default",
                        }}
                        onValueChange={toggleUnqiue} />
                </div>
            }
            {
                showNumericModifiers && <>
                    <h3 className="font-semibold text-sm text-font/90">
                        {t("db_controller.field_settings.numeric_setting")}
                    </h3>
                    <hr className="border-divider" />
                    {
                        modifiers.includes(Modifiers.AUTO_INCREMENT) &&
                        <div className="flex w-full  justify-between">
                            <span className="text-xs text-font/70 font-medium dark:text-font/90">
                                {t("db_controller.field_settings.autoIncrement")}
                            </span>
                            <Checkbox defaultSelected={field.autoIncrement as boolean} 
                            classNames={{
                            wrapper: "before:border-divider group-data-[hover=true]:before:bg-default",
                        }}
                            size="md" onValueChange={toggleAutoIncrement} />
                        </div>
                    }
                    {
                        modifiers.includes(Modifiers.UNSIGNED) &&
                        <div className="flex w-full  justify-between">
                            <span className="text-xs text-font/70 font-medium dark:text-font/90">
                                {t("db_controller.field_settings.unsigned")}
                            </span>
                            <Checkbox
                            classNames={{
                            wrapper: "before:border-divider group-data-[hover=true]:before:bg-default",
                        }}
                            defaultSelected={field.unsigned as boolean} size="md" onValueChange={toggleUnsigned} />
                        </div>
                    }
                    {
                        modifiers.includes(Modifiers.ZEROFILL) &&
                        <div className="flex w-full  justify-between">
                            <span className="text-xs text-font/70 font-medium dark:text-font/90">
                                {t("db_controller.field_settings.zeroFill")}
                            </span>
                            <Checkbox
                            classNames={{
                            wrapper: "before:border-divider group-data-[hover=true]:before:bg-default",
                        }}
                            defaultSelected={field.zeroFill as boolean} size="md" onValueChange={toggleZeroFill} />
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
                                <Tooltip>
                                    <TooltipTrigger>
                                        <label className="flex items-center text-font/70 justify-between text-xs font-medium  dark:text-font/90">
                                            <span>
                                                {t("db_controller.field_settings.precision")}
                                            </span>
                                            <CircleHelp className="size-3.5" />
                                        </label>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        {t("db_controller.field_settings.precision_def")}
                                    </TooltipContent>
                                </Tooltip>
                                <Input
                                    type="number"
                                    size="sm"
                                    ref={precisionRef}
                                    defaultValue={String(field.precision)}
                                    onBlur={saveScaleAndPrecision}
                                    onValueChange={validateScaleAndPrecision}
                                    isInvalid={!precisionValidation.isValid}
                                    endContent={
                                        !precisionValidation.isValid && <>
                                            <HeroUITooltip showArrow={true} content={precisionValidation.errorMessage} radius="sm" color="danger">

                                                <TriangleAlert className="size-4 text-danger cursor-default" />

                                            </HeroUITooltip>
                                        </>
                                    }
                                    radius="sm"
                                    variant="faded"
                                    placeholder={t("db_controller.field_settings.precision")}
                                    className="h-8 w-full focus-visible:ring-0 shadow-none "
                                    classNames={{
                                        inputWrapper: "dark:bg-default border-divider group-hover:border-primary  group-data-[focus=true]:border-primary ",
                                    }}

                                />
                            </div>
                        }
                        {
                            modifiers.includes(Modifiers.SCALE) &&
                            <div className="flex flex-col gap-2 w-full">
                                <Tooltip>
                                    <TooltipTrigger>
                                        <label className="flex items-center  justify-between text-xs font-medium text-icon dark:text-font/90">
                                            <span>
                                                {t("db_controller.field_settings.scale")}
                                            </span>
                                            <CircleHelp className="size-3.5" />
                                        </label>
                                    </TooltipTrigger>

                                    <TooltipContent>
                                        {t("db_controller.field_settings.scale_def")}
                                    </TooltipContent>
                                </Tooltip>
                                <Input
                                    type="number"
                                    size="sm"
                                    ref={scaleRef}
                                    defaultValue={String(field.scale)}
                                    onBlur={saveScaleAndPrecision}
                                    isDisabled={!precisionRef.current?.value || !precisionValidation.isValid}
                                    onValueChange={validateScaleAndPrecision}
                                    isInvalid={!scaleValidation.isValid}
                                    endContent={
                                        !scaleValidation.isValid && <>
                                            <HeroUITooltip showArrow={true} content={scaleValidation.errorMessage} radius="sm" color="danger">
                                                <TriangleAlert className="size-4 text-danger cursor-default" />
                                            </HeroUITooltip>
                                        </>
                                    }
                                    radius="sm"
                                    variant="faded"
                                    placeholder={t("db_controller.field_settings.scale")}
                                    className="h-8 w-full focus-visible:ring-0 shadow-none "
                                    classNames={{
                                        inputWrapper: "dark:bg-default border-divider group-hover:border-primary  group-data-[focus=true]:border-primary ",
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
                                size="sm"
                                variant="bordered"
                                aria-label="charset"
                                placeholder={t("db_controller.field_settings.charset")}
                                selectedKeys={charset as any}
                                onSelectionChange={changeCharset}
                                className="h-8 w-full focus-visible:ring-0 shadow-none "

                                classNames={{
                                    trigger: "border-divider group-hover:border-primary data-[focus=true]:border-primary data-[open=true]:border-primary",
                                    selectorIcon: "text-icon",
                                    popoverContent: "rounded-md "
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
                                size="sm"
                                variant="bordered"
                                aria-label="collation"
                                placeholder={t("db_controller.field_settings.collation")}
                                selectedKeys={collation as any}
                                onSelectionChange={changeCollation}
                                className="h-8 w-full focus-visible:ring-0 shadow-none "
                                classNames={{
                                    trigger: "border-divider group-hover:border-primary  data-[focus=true]:border-primary data-[open=true]:border-primary",
                                    selectorIcon: "text-icon",
                                    popoverContent: "rounded-md "

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
                    <label className="text-xs font-medium text-font/70 dark:text-font/90">
                        {
                            field.type?.type == DataTypes.INTEGER ?
                                t("db_controller.field_settings.integer_width")
                                :
                                t("db_controller.field_settings.max_length")
                        }
                    </label>
                    <Input
                        type="number"
                        size="sm"
                        ref={maxLengthRef}
                        defaultValue={String(field.maxLength)}
                        onBlur={saveMaxLength}
                        radius="sm"
                        isInvalid={!maxLengthValidation.isValid}
                        onValueChange={maxLengthChange}
                        endContent={
                            !maxLengthValidation.isValid && <>
                                <HeroUITooltip showArrow={true} content={maxLengthValidation.errorMessage} radius="sm" color="danger">

                                    <TriangleAlert className="size-4 text-danger cursor-default" />

                                </HeroUITooltip>
                            </>
                        }
                        variant="faded"
                        placeholder={
                            field.type?.type == DataTypes.INTEGER ?
                                t("db_controller.field_settings.width")
                                :
                                t("db_controller.field_settings.max_length")

                        }
                        className="h-8 w-full focus-visible:ring-0 shadow-none "
                        classNames={{
                            inputWrapper: "dark:bg-default border-divider group-hover:border-primary  group-data-[focus=true]:border-primary ",
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

            {
                !modifiers.includes(Modifiers.NO_DEFAULT) &&
                <FieldDefaultValue field={field} />
            }
            <label className="text-xs font-medium text-font/70 dark:text-font/90">
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
                    base: "max-w-xs",
                    input: "resize-y min-h-[60px] max-h-[180px]",
                    inputWrapper: "bg-default border-divider dark:bg-background-100 group-hover:border-primary group-data-[focus=true]:border-primary",
                    label: "text-font/90 group-data-[focus=true]:text-font/70 group-data-[filled-within=true]:text-font/70 "
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