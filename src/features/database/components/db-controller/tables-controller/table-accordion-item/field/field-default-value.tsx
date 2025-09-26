import { FieldInsertType, FieldType } from "@/lib/schemas/field-schema"

import React, { Ref, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { ModifierValidation } from "./field-setting";
import { DataTypes, TimeDefaultValues } from "@/lib/field";

import { useDatabaseOperations } from "@/providers/database-provider/database-provider";
import dayjs from 'dayjs';
import { now  } from "@internationalized/date";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { MultiSelect } from "@/components/multi-select";
import { DatePicker } from "@/components/date-picker";

interface DefaultValueType {
    number?: boolean;
    string?: boolean;
    boolean?: boolean;
    time?: boolean;
    select?: boolean;
    multiSelect?: boolean
}

interface FieldDefaultValueProps {
    field: FieldType;
}



const fieldDefautlValue: React.FC<FieldDefaultValueProps> = ({ field }) => {
    const { editField } = useDatabaseOperations();

    const { t } = useTranslation();
    const [defaultValueValidation, setDefaultValueValidation] = useState<ModifierValidation>({
        isValid: true,
    });

    const defaultValueRef: Ref<HTMLInputElement> = useRef<HTMLInputElement>(null);
    const [values, setValues] = useState<string[]>([]);


    const [timeSelection, setTimeSelection] = useState<string>(() => {

        if (field.defaultValue == TimeDefaultValues.NOW)
            return TimeDefaultValues.NOW;
        if (!field.defaultValue)
            return TimeDefaultValues.NO_VALUE

        if (field.type.name == "time" && field.defaultValue)
            return TimeDefaultValues.CUSTOM

        const date = new Date(field.defaultValue);

        if (!isNaN(date.getTime())) {
            return TimeDefaultValues.CUSTOM;
        }
        return TimeDefaultValues.NO_VALUE;
    });

    const [defaultDateTime, setDefaultDateTime] = useState<any>(() => {
        try {
            if (field.type.name == "time" ) {
                return field.defaultValue ; 
            }

            if (field.defaultValue) {
                const date = new Date(field.defaultValue);
                return date;

            }
            return undefined;
        } catch (error) {
            return undefined;
        }
    });
 
    const defaultValueType: DefaultValueType = useMemo(() => {
        return {
            number: field.type?.type == DataTypes.INTEGER || field.type?.type == DataTypes.NUMERIC,
            string: field.type?.type == DataTypes.TEXT || field.type?.name == "year",
            boolean: field.type?.type == DataTypes.BOOLEAN,
            time: field.type?.type == DataTypes.TIME && field.type?.name != "year",
            select: field.type?.type == DataTypes.ENUM && field.type?.name != "set",
            multiSelect: field.type?.type == DataTypes.ENUM && field.type?.name == "set"
        }
    }, [field]);



    const [selectedValues, setSelectedValues] = useState<string[] | string>(() => {

        if (defaultValueType.select) {
            if (!field.defaultValue)
                return "none";
            else
                return field.defaultValue
        }
        else {
            if (!field.defaultValue)
                return []
            if (defaultValueType.multiSelect)
                return field.defaultValue.split(",")

            return [field.defaultValue as string];
        }
    });


    useEffect(() => {
        if (field.values && field.values.length > 0) {
            try {
                const jsonValues: string[] = JSON.parse(field.values);

                setValues(jsonValues);
            } catch (error) {
                setValues([]);
            }
        }
    }, [field.values]);



    const defaultValueChange = useCallback((event: any) => {
        const value = event.target.value;
        if (value && value.trim().length > 0) {
            if (field.type?.type == DataTypes.INTEGER) {
                const isValid: boolean = Number.isInteger(Number(value));
                setDefaultValueValidation({
                    isValid,
                    errorMessage: t("db_controller.field_settings.errors.integer_default_value")
                })
            }
        } else {
            setDefaultValueValidation({
                isValid: true,
                errorMessage: undefined
            });
        }
    }, [field, defaultValueRef]);


    const saveDefaultValue = useCallback((booleanValue?: boolean) => {


        if (defaultValueValidation.isValid) {
            let value: string | undefined;

            if (field.type.type != DataTypes.BOOLEAN)
                value = defaultValueRef.current?.value;
            else {
                value = String(booleanValue);
            }

            editField({
                id: field.id,
                defaultValue: value ? String(value) : null,
            } as FieldInsertType);
        }
    }, [defaultValueRef, field, defaultValueValidation]);




    const changeTimeDefaultValue = (selection: any) => {


        let value: string | undefined;

        if (!selection)
            return;

        if (selection == TimeDefaultValues.NOW)
            value = TimeDefaultValues.NOW;

        if (selection == TimeDefaultValues.CUSTOM) {

            const currentDateTime = now(Intl.DateTimeFormat().resolvedOptions().timeZone)
            const date: Date = currentDateTime?.toDate();

            setDefaultDateTime(date);
            if (field.type.name == "date")
                value = dayjs(date).format("YYYY-MM-DD")
            else if (field.type.name == "datetime" || field.type.name == "timestamp")
                value = dayjs(date).format("YYYY-MM-DD HH:mm:ss")
            else if (field.type.name == "time")
                value = dayjs(date).format("HH:mm:ss")

        }

        editField(({
            id: field.id,
            defaultValue: value ? String(value) : null
        }) as FieldInsertType)

        setTimeSelection(selection);
    }

    const saveDefaultDateTime = useCallback((date: Date | undefined) => {

        let value: string | undefined;

        

        if (field.type.name != "time" && date) {
            setDefaultDateTime(date);

            if (field.type.name == "date")
                value = dayjs(date).format("YYYY-MM-DD")
            else if (field.type.name == "datetime" || field.type.name == "timestamp" || field.type.name == "timestamptz")
                value = dayjs(date).format("YYYY-MM-DD HH:mm:ss")
        }
        else if ( field.type.name == "time") {
            value = defaultDateTime ; 
        }


        editField(({
            id: field.id,
            defaultValue: value ? String(value) : null
        }) as FieldInsertType);
    }, [field, defaultDateTime]);

    const enumValueChange = useCallback((selection: any) => {

        if (defaultValueType.select) {
            setSelectedValues(selection);
            editField({
                id: field.id,
                defaultValue: selection == "none" ? null : selection
            } as FieldInsertType);

            return;
        }
        let values: string | null = null;
        const arraySelection = Array.from(selection);

        if (arraySelection.length > 0) {
            values = arraySelection.join(',');
        } else {
            values = null;
        }


        editField({
            id: field.id,
            defaultValue: values
        } as FieldInsertType);

        setSelectedValues(selection);
    }, [field, defaultValueType])



    return (
        <>
            {
                !defaultValueType.boolean &&

                <Label htmlFor="default_value">
                    {t("db_controller.field_settings.default_value")}
                </Label>
            }
            {
                (defaultValueType.number || defaultValueType.string) &&
                <>
                    <Input
                        type={defaultValueType.number ? "number" : "text"}
                        id="default_value"
                        ref={defaultValueRef}
                        aria-invalid={!defaultValueValidation.isValid}
                        onChange={defaultValueChange}
                        defaultValue={field.defaultValue as string}
                        onBlur={saveDefaultValue as any}
                        placeholder={t("db_controller.field_settings.value")}
                    />
                    {
                        !defaultValueValidation.isValid &&
                        <p className="text-destructive text-xs">
                            {defaultValueValidation.errorMessage}
                        </p>
                    }
                </>

            }

            {
                defaultValueType.boolean &&
                <div className="flex w-full  justify-between">
                    <Label htmlFor="default_value">
                        {t("db_controller.field_settings.default_value")}
                    </Label>
                    <Switch
                        id="default_value"
                        onCheckedChange={saveDefaultValue as any}
                        defaultChecked={field.defaultValue == "true"} />
                </div>
            }

            {

                (defaultValueType.select) &&

                <Select
                    aria-label="value"
                    value={selectedValues as any}
                    onValueChange={enumValueChange as any}

                >
                    <SelectTrigger id="charset" className="w-full flex ">
                        <SelectValue placeholder={t('db_controller.field_settings.pick_value')} />
                    </SelectTrigger>

                    <SelectContent>
                        <SelectItem value={"none"} >
                            No Default value
                        </SelectItem>

                        {
                            values.map((value: string) => (
                                <SelectItem
                                    key={value}
                                    value={value}
                                >
                                    {value}
                                </SelectItem>
                            ))
                        }
                    </SelectContent>
                </Select>
            }
            {
                (defaultValueType.multiSelect) &&
                <MultiSelect
                    options={
                        values.map((value: string) => ({ value, label: value })) as any
                    }
                    onValueChange={enumValueChange}
                    defaultValue={selectedValues as any}
                    placeholder="Select fields..."
                    variant={"secondary"}
                    hideSelectAll
                />

            }
            {
                defaultValueType.time &&
                <>
                    <Select
                        aria-label="Time"
                        value={timeSelection}
                        onValueChange={changeTimeDefaultValue}
                    >
                        <SelectTrigger id="time" className="w-full flex">
                            <SelectValue placeholder={t('db_controller.field_settings.pick_value')} />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value={TimeDefaultValues.NO_VALUE} >
                                {t("db_controller.field_settings.time_default_value.no_value")}
                            </SelectItem>
                            <SelectItem value={TimeDefaultValues.CUSTOM}>{t("db_controller.field_settings.time_default_value.custom")}</SelectItem>
                            {
                                (field.type.name == "datetime" || field.type.name?.includes("timestamp")) ?
                                    <SelectItem value={TimeDefaultValues.NOW}>{t("db_controller.field_settings.time_default_value.now")}</SelectItem> : null
                            }
                        </SelectContent>



                    </Select>
                    {
                        timeSelection == TimeDefaultValues.CUSTOM && field.type.name != "time" &&
                        <DatePicker
                            value={defaultDateTime}
                            onValueChange={saveDefaultDateTime}
                        />

                    }
                    {
                        timeSelection == TimeDefaultValues.CUSTOM && field.type.name == "time" &&
                        <>
                            <Label htmlFor="time">
                                Time
                            </Label>
                            <Input
                                id="time"
                                type="time"
                                step={1} 
                                defaultValue={defaultDateTime}
                                onChange={(event) =>  setDefaultDateTime( event.target.value)}
                                onBlur={saveDefaultDateTime as any}
                                className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"

                            />
                        </>
                    }
                </>
            }
        </>
    )
}


export default React.memo(fieldDefautlValue);





