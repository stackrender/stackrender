import { FieldInsertType, FieldType } from "@/lib/schemas/field-schema"
import { Checkbox, DatePicker, Input, Select, SelectItem, Switch, TimeInput, Tooltip } from "@heroui/react";
import React, { Ref, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { ModifierValidation } from "./field-setting";
import { DataTypes, TimeDefaultValues } from "@/lib/field";
import { Calendar, Clock, TriangleAlert } from "lucide-react";
import { useDatabaseOperations } from "@/providers/database-provider/database-provider";
import dayjs from 'dayjs';
import { now, parseAbsoluteToLocal, Time } from "@internationalized/date";
import { DatabaseDialect } from "@/lib/database";

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


    const [timeSelection, setTimeSelection] = useState<string[]>(() => {

        if (field.defaultValue == TimeDefaultValues.NOW)
            return [TimeDefaultValues.NOW];
        if (!field.defaultValue)
            return [TimeDefaultValues.NO_VALUE]

        if (field.type.name == "time" && field.defaultValue)
            return [TimeDefaultValues.CUSTOM]

        const date = new Date(field.defaultValue);

        if (!isNaN(date.getTime())) {
            return [TimeDefaultValues.CUSTOM];
        }
        return [TimeDefaultValues.NO_VALUE];
    });

    const [defaultDateTime, setDefaultDateTime] = useState<any>(() => {
        try {
            if (field.type.name == "time" && field.defaultValue) {

                const [hours, minuts, seconds] = field.defaultValue.split(":");
                return new Time(parseInt(hours), parseInt(minuts), parseInt(seconds))
            }

            if (field.defaultValue) {
                const date = new Date(field.defaultValue)
                return parseAbsoluteToLocal(date.toISOString());
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
    const [selectedValues, setSelectedValues] = useState<string[]>(() => {
        if (!field.defaultValue)
            return []
        if (defaultValueType.multiSelect)
            return field.defaultValue.split(",")

        return [field.defaultValue as string];

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



    const defaultValueChange = useCallback((value: any) => {
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


    const saveDefaultValue = useCallback(() => {


        if (defaultValueValidation.isValid) {
            let value: string | undefined;
            if (field.type.type != DataTypes.BOOLEAN)
                value = defaultValueRef.current?.value;
            else {
                value = String(defaultValueRef.current?.checked);
            }

            editField({
                id: field.id,
                defaultValue: value ? String(value) : null,
            } as FieldInsertType);
        }
    }, [defaultValueRef, field, defaultValueValidation]);




    const changeTimeDefaultValue = (selection: any) => {
        let value: string | undefined;

        if (!selection.currentKey)
            return;

        if (selection.currentKey == TimeDefaultValues.NOW)
            value = TimeDefaultValues.NOW;

        if (selection.currentKey == TimeDefaultValues.CUSTOM) {

            const currentDateTime = now(Intl.DateTimeFormat().resolvedOptions().timeZone)
            const date: Date = currentDateTime?.toDate();

            setDefaultDateTime(currentDateTime);
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

        setTimeSelection([selection?.currentKey]);
    }

    const saveDefaultDateTime = useCallback(() => {
        let value: string | undefined;
        if (field.type.name != "time") {
            const date = new Date(defaultDateTime?.toDate());
            if (field.type.name == "date")
                value = dayjs(date).format("YYYY-MM-DD")
            else if (field.type.name == "datetime" || field.type.name == "timestamp")
                value = dayjs(date).format("YYYY-MM-DD HH:mm:ss")
        }
        else {
            if (defaultDateTime) {
                value = `${defaultDateTime.hour}:${defaultDateTime.minute}:${defaultDateTime.second}`
            }
        }

        editField(({
            id: field.id,
            defaultValue: value ? String(value) : null
        }) as FieldInsertType);
    }, [field, defaultDateTime]);

    const enumValueChange = useCallback((selection: any) => {
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
    }, [field])


    return (
        <>
            {
                !defaultValueType.boolean &&
                <label className="text-xs font-medium text-font/70 dark:text-font/90">
                    {t("db_controller.field_settings.default_value")}
                </label>
            }
            {
                (defaultValueType.number || defaultValueType.string) &&

                <Input
                    type={defaultValueType.number ? "number" : "text"}
                    size="sm"
                    ref={defaultValueRef}
                    isInvalid={!defaultValueValidation.isValid}
                    endContent={
                        !defaultValueValidation.isValid && <>
                            <Tooltip showArrow={true} content={defaultValueValidation.errorMessage} radius="sm" color="danger">
                                <TriangleAlert className="size-4 text-danger cursor-default" />
                            </Tooltip>
                        </>
                    }
                    onValueChange={defaultValueChange}
                    defaultValue={field.defaultValue as string}
                    onBlur={saveDefaultValue}
                    radius="sm"
                    variant="faded"
                    placeholder={t("db_controller.field_settings.value")}
                    className="h-8 w-full focus-visible:ring-0 shadow-none "
                    classNames={{
                        inputWrapper: "dark:bg-default border-divider group-hover:border-primary  group-data-[focus=true]:border-primary ",
                    }}
                />
            }
            {
                defaultValueType.boolean &&
                <div className="flex items-center justify-between">

                    <span className="text-xs text-font/70 font-medium dark:text-font/90">
                        {t("db_controller.field_settings.default_value")}
                    </span>
                    <Checkbox
                        defaultSelected={field.defaultValue == "true"}
                        ref={defaultValueRef}
                        size="md"
                        onValueChange={saveDefaultValue}
                    />
                </div>
            }
            {
                defaultValueType.time &&
                <>
                    <Select

                        size="sm"
                        variant="bordered"
                        aria-label="Time"
                        selectedKeys={timeSelection}
                        onSelectionChange={changeTimeDefaultValue}
                        className="h-8 w-full focus-visible:ring-0 shadow-none "

                        classNames={{
                            trigger: "border-divider group-hover:border-primary data-[focus=true]:border-primary data-[open=true]:border-primary",
                            selectorIcon: "text-icon",
                            popoverContent: "rounded-md "
                        }}

                    >
                        <SelectItem key={TimeDefaultValues.NO_VALUE}>{t("db_controller.field_settings.time_default_value.no_value")}</SelectItem>
                        <SelectItem key={TimeDefaultValues.CUSTOM}>{t("db_controller.field_settings.time_default_value.custom")}</SelectItem>
                        {
                            (field.type.name == "datetime" || field.type.name == "timestamp") ?
                                <SelectItem key={TimeDefaultValues.NOW}>{t("db_controller.field_settings.time_default_value.now")}</SelectItem> : null
                        }
                    </Select>

                    {
                        timeSelection.at(0) == TimeDefaultValues.CUSTOM && field.type.name != "time" &&
                        <>
                            <DatePicker
                                aria-label="Custom datetime"
                                variant="bordered"
                                size="sm"
                                showMonthAndYearPickers
                                radius="sm"
                                value={defaultDateTime}

                                endContent={
                                    <Calendar className="text-icon size-4" />
                                }
                                onBlur={saveDefaultDateTime}
                                onChange={setDefaultDateTime}
                                granularity={field.type.name == "date" ? "day" : "second"}
                                hideTimeZone
                                className="h-8 w-full focus-visible:ring-0 shadow-none "
                                classNames={{
                                    inputWrapper: "border-divider group-hover:border-primary focus-within:border-primary",
                                    

                                }}
                                calendarProps={{
                                    classNames: {
                                        title: "text-font/90",
                                        header : "bg-background" , 
                                        
                                    } , 
                                    
                                    
                                }}
                                
                            />

                        </>
                    }
                    {
                        timeSelection.at(0) == TimeDefaultValues.CUSTOM && field.type.name == "time" &&
                        <TimeInput aria-label="Current Time"
                            ref={defaultValueRef}
                            value={defaultDateTime}
                            onChange={setDefaultDateTime}
                            variant="bordered"
                            endContent={
                                <Clock className="text-icon size-4" />
                            }
                            className="h-8 w-full focus-visible:ring-0 shadow-none "
                            classNames={{
                                inputWrapper: "border-divider group-hover:border-primary focus-within:border-primary",

                            }}
                            onBlur={saveDefaultDateTime}
                            granularity="second"
                            hourCycle={24}
                            hideTimeZone
                            size="sm" radius="sm" />
                    }
                </>

            }
            {
                (defaultValueType.select || defaultValueType.multiSelect) &&
                <Select 
                    size="sm"
                    variant="bordered"
                    aria-label="Enum Values"
                    placeholder={t('db_controller.field_settings.pick_value')}
                    selectedKeys={selectedValues}
                    onSelectionChange={enumValueChange}
                    selectionMode={!defaultValueType.multiSelect ? 'single' : "multiple"}
                    className="h-8 w-full focus-visible:ring-0 shadow-none "

                    classNames={{
                        trigger: "border-divider group-hover:border-primary data-[focus=true]:border-primary data-[open=true]:border-primary",
                        selectorIcon: "text-icon",
                        popoverContent: "rounded-md "

                    }}
                >
                    {
                        values.map((value: string) => (
                            <SelectItem key={value}>{value}</SelectItem>
                        ))
                    }


                </Select>

            }
        </>

    )
}


export default React.memo(fieldDefautlValue);





