 
import { DatabaseDialect } from "@/lib/database";
import { DataTypes, Modifiers, MySQLCharset, MySQLCollation, PostgreSQLCharset, PostgreSQLCollation, SQLiteCharset, SQLiteCollation } from "@/lib/field";
import { FieldInsertType, FieldType } from "@/lib/schemas/field-schema";
import { useDatabaseOperations } from "@/providers/database-provider/database-provider";



import React, { Ref, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import FieldDefaultValue from "./field-default-value";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { IconInfoCircle, IconTrash } from "@tabler/icons-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { InputTags } from "@/components/input-tags";
import { Textarea } from "@/components/ui/textarea";




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
    const [charset, setCharset] = useState<string | undefined>(field.charset || "none");
    const [collation, setCollation] = useState<string | undefined>(field.collate || "none");

    const [note, setNote] = useState<string >(field.note ? field.note : "");

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


    const [jsonValues, setJsonValues] = useState<any[]>(field.values ? JSON.parse(field.values) : []);
    const [mountScale, setMountScale] = useState<boolean>(false);

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
    }, [field, note]);

    const toggleUnique = useCallback((value: boolean) => {
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



    const changeCharset = useCallback((charset: string) => {
        setCharset(charset);
        editField({
            id: field.id,
            charset: charset == "none" ? null : charset,
        } as FieldInsertType);
    }, [field]);

    const changeCollation = useCallback((collation: string) => {

        setCollation(collation);
        editField({
            id: field.id,
            collate: collation == "none" ? null : collation,

        } as FieldInsertType);

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

        setJsonValues(values)

        const jsonValues = JSON.stringify(values);
        if (jsonValues != field.values)
            editField({
                id: field.id,
                values: jsonValues,

            } as FieldInsertType);

    }, [field])

    const showNumericModifiers: boolean =  modifiers.includes(Modifiers.UNSIGNED) || modifiers.includes(Modifiers.ZEROFILL)
    const showDecimalModifiers: boolean = modifiers.includes(Modifiers.PRECISION) || modifiers.includes(Modifiers.SCALE);
    const showTextModifiers: boolean = modifiers.includes(Modifiers.COLLATE) || modifiers.includes(Modifiers.CHARSET);



    const maxLengthChange = useCallback((input: any) => {
        const value = input.target.value;

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



    useEffect(() => {
        if (precisionRef.current) {
            setMountScale(true);
        }
    }, []);



    return (
        <div className="w-full flex flex-col gap-2   max-w-[260px]">
            <h3 className="font-medium text-sm">
                {t("db_controller.field_settings.title")}
            </h3>
            <Separator />
            {
                !modifiers.includes(Modifiers.NO_UNIQUE) &&
                <div className="flex items-center justify-between ">
                    <Label htmlFor="unique">
                        {t("db_controller.field_settings.unique")}
                    </Label>
                    <Switch id="unique" onCheckedChange={toggleUnique} defaultChecked={field.unique as boolean} />
                </div>
            }
            {
                modifiers.includes(Modifiers.AUTO_INCREMENT) &&
                <div className="flex w-full  justify-between">
                    <Label htmlFor="autoincrement">
                        {t("db_controller.field_settings.autoIncrement")}
                    </Label>
                    <Switch id="autoincrement" onCheckedChange={toggleAutoIncrement} defaultChecked={field.autoIncrement as boolean} />
                </div>
            }
            {
                showNumericModifiers && <>
                    <h3 className="font-medium text-sm">
                        {t("db_controller.field_settings.numeric_setting")}
                    </h3>
                    <Separator />
                    {
                        modifiers.includes(Modifiers.UNSIGNED) &&
                        <div className="flex w-full  justify-between">
                            <Label htmlFor="unsigned">
                                {t("db_controller.field_settings.unsigned")}
                            </Label>
                            <Switch id="unsigned" onCheckedChange={toggleUnsigned} defaultChecked={field.unsigned as boolean} />
                        </div>
                    }
                    {
                        modifiers.includes(Modifiers.ZEROFILL) &&
                        <div className="flex w-full  justify-between">
                            <Label htmlFor="zerofill">
                                {t("db_controller.field_settings.zeroFill")}
                            </Label>
                            <Switch id="zerofill" onCheckedChange={toggleZeroFill} defaultChecked={field.zeroFill as boolean} />
                        </div>
                    }
                    <Separator/>


                </>
            }

            {
                showDecimalModifiers && <>
                    <h3 className="font-medium text-sm ">
                        {t("db_controller.field_settings.decimal_setting")}
                    </h3>
                    <Separator />
                    <div className="flex gap-2">
                        {
                            modifiers.includes(Modifiers.PRECISION) &&
                            <div className="flex flex-col gap-2 w-full">
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Label className="flex items-center justify-between  font-medium" htmlFor="precision">
                                            <span>
                                                {t("db_controller.field_settings.precision")}
                                            </span>
                                            <IconInfoCircle className="size-3.5" />
                                        </Label>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        {t("db_controller.field_settings.precision_def")}
                                    </TooltipContent>
                                </Tooltip>
                                <Input
                                    id="precision"
                                    type="number"
                                    ref={precisionRef}
                                    defaultValue={String(field.precision)}
                                    onBlur={saveScaleAndPrecision}
                                    onChange={validateScaleAndPrecision}
                                    aria-invalid={!precisionValidation.isValid}
                                    placeholder={t("db_controller.field_settings.precision")}
                                />


                            </div>
                        }
                        {
                            modifiers.includes(Modifiers.SCALE) &&
                            <div className="flex flex-col gap-2 w-full">


                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Label className="flex items-center justify-between font-medium" htmlFor="scale">
                                            <span>
                                                {t("db_controller.field_settings.scale")}
                                            </span>
                                            <IconInfoCircle className="size-3.5" />
                                        </Label>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        {t("db_controller.field_settings.scale_def")}
                                    </TooltipContent>
                                </Tooltip>
                                {
                                    mountScale &&
                                    <Input
                                        id="scale"
                                        type="number"
                                        ref={scaleRef}
                                        defaultValue={String(field.scale)}
                                        onBlur={saveScaleAndPrecision}
                                        disabled={!precisionRef.current?.value || !precisionValidation.isValid}
                                        onChange={validateScaleAndPrecision}
                                        aria-invalid={!scaleValidation.isValid}
                                        placeholder={t("db_controller.field_settings.scale")}
                                    />
                                }


                            </div>
                        }
                    </div>
                    {
                        !precisionValidation.isValid &&
                        <p className="text-destructive text-xs">
                            {precisionValidation.errorMessage}
                        </p>
                    }
                    {
                        !scaleValidation.isValid &&
                        <p className="text-destructive text-xs">
                            {scaleValidation.errorMessage}
                        </p>
                    }

                </>
            }

            {
                showTextModifiers &&
                <>
                    <h3 className="font-medium text-sm ">
                        {t("db_controller.field_settings.text_setting")}
                    </h3>
                    <Separator />
                    {
                        (modifiers.includes(Modifiers.CHARSET) && charsets) && <>
                            <Label htmlFor="charset">
                                {t("db_controller.field_settings.charset")}
                            </Label>
                            <Select
                                aria-label="charset"
                                value={charset as any}
                                onValueChange={changeCharset as any}
                            >
                                <SelectTrigger id="charset" className="w-full flex ">
                                    <SelectValue placeholder={t("db_controller.field_settings.charset")} />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value={"none"} >
                                        No charset
                                    </SelectItem>

                                    {
                                        Object.values(charsets).map((charset: string) => (
                                            <SelectItem
                                                key={charset}
                                                value={charset}
                                            >
                                                {charset}
                                            </SelectItem>
                                        ))
                                    }
                                </SelectContent>
                            </Select>
                        </>
                    }
                    {
                        (modifiers.includes(Modifiers.COLLATE) && collations) && <>
                            <Label htmlFor="collation">
                                {t("db_controller.field_settings.collation")}
                            </Label>
                            <Select
                                aria-label="collation"
                                value={collation as any}
                                onValueChange={changeCollation as any}

                            >
                                <SelectTrigger id="collation" className="w-full">
                                    <SelectValue placeholder={t("db_controller.field_settings.collation")} />
                                </SelectTrigger>
                                <SelectContent>

                                    <SelectItem value={"none"} >
                                        No collation
                                    </SelectItem>
                                    {
                                        Object.values(collations).map((collation: string) => (<SelectItem 
                                            key={collation}
                                            value={collation}>{collation}</SelectItem>))
                                    }
                                </SelectContent>
                            </Select>
                        </>
                    }

                </>
            }
            {
                modifiers.includes(Modifiers.LENGTH) && <>
                    <Label htmlFor="length">
                        {
                            field.type?.type == DataTypes.INTEGER ?
                                t("db_controller.field_settings.integer_width")
                                :
                                t("db_controller.field_settings.max_length")
                        }
                    </Label>

                    <Input
                        type="number"
                        id="length"
                        ref={maxLengthRef}
                        defaultValue={String(field.maxLength)}
                        onBlur={saveMaxLength}
                        aria-invalid={!maxLengthValidation.isValid}
                        onChange={maxLengthChange}
                        placeholder={
                            field.type?.type == DataTypes.INTEGER ?
                                t("db_controller.field_settings.width")
                                :
                                t("db_controller.field_settings.max_length")
                        }
                    />
                    {
                        !maxLengthValidation.isValid &&
                        <p className="text-destructive text-xs">
                            {maxLengthValidation.errorMessage}
                        </p>
                    }
                </>
            }

            {
                modifiers.includes(Modifiers.VALUES) && <>
                    <Label htmlFor="values">
                        {field.type.name != null && (field.type.name?.[0].toUpperCase() + field.type.name?.slice(1))} {t("db_controller.field_settings.values")}
                    </Label>
                    <Separator />
                    <InputTags
                        value={jsonValues}
                        onChange={updateValues as any}
                        placeholder="Enter values, comma separated..."
                    />
                </>
            }
            {
                !modifiers.includes(Modifiers.NO_DEFAULT) &&
                <>
                    <Separator />
                    <FieldDefaultValue field={field} />

                </>
            }
            
            <Label htmlFor="collation">
                {t("db_controller.field_settings.note")}
            </Label>
            <Textarea
                placeholder={t("db_controller.field_settings.field_note")}
                value={note}
                onChange={(event: any) => setNote(event.target.value)}
                onBlur={updateFieldNote}
                className="resize-none min-h-[86px] focus-visible:ring-0 bg-secondary dark:bg-background"
            />
            <Separator />
            <Button
                variant={"destructive"}
                size="sm"
                onClick={removeField}>

                {t("db_controller.field_settings.delete_field")}
                <IconTrash className="size-4" />

            </Button>

        </div>
    )
}


export default React.memo(FieldSetting);

 