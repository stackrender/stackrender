

import { Edge, Node, NodeProps, useConnection, useStore } from "@xyflow/react";

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Button, Card, cn, } from "@heroui/react";
import {
    Table2,
    Check,
    Focus,
} from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/tooltip/tooltip";

import FieldComponent from "./field";
import { FieldType } from "@/lib/schemas/field-schema";
import { TableInsertType, TableType } from "@/lib/schemas/table-schema";
import { useDatabase, useDatabaseOperations } from "@/providers/database-provider/database-provider";
import { useTranslation } from "react-i18next";
import { RelationshipType } from "@/lib/schemas/relationship-schema";
import { useDiagram } from "@/providers/diagram-provider/diagram-provider";
import useGetRelatedEdges from "@/hooks/use-get-related-edges";

export type TableProps = Node<{
    table: TableType,
    overlapping?: boolean,
    pulsing?: boolean,
}>

const Table: React.FC<NodeProps<TableProps>> = (props) => {
    const { selected, data: { table, overlapping = false, pulsing = false } } = props;
    const [editMode, setEditMode] = useState<boolean>(false);
    const [tableName, setTableName] = useState<string>(table.name);
    const { editTable } = useDatabaseOperations();
    const edges = useGetRelatedEdges(table.id as string);
    const { focusOnTable } = useDiagram();
    const { t } = useTranslation();

    useEffect(() => {
        setTableName(table.name);
    }, [table.name])

    const saveTableName = useCallback(async () => {
        await editTable({ id: table.id, name: tableName } as TableInsertType);
        setEditMode(false);
    }, [tableName]);

    const focus = useCallback(() => {
        focusOnTable(table.id, false);
    }, [table])

    const highlightedEdges: Edge[] = useMemo(() => {
        return edges.filter((edge: Edge) => edge.animated || edge.selected);
    }, [edges]);

    const fields: React.ReactNode[] = useMemo(() => {
        return table.fields.map((field: FieldType) => {
            const highlight: boolean = highlightedEdges.find((edge: any) =>
                (edge.data?.relationship as RelationshipType).sourceFieldId == field.id ||
                (edge.data?.relationship as RelationshipType).targetFieldId == field.id) != null;

            return (<FieldComponent
                key={field.id}
                field={field}
                showHandles={selected}
                highlight={highlight}
            />)
        })
    }, [table.fields, selected, highlightedEdges]);


    useEffect(() => {
        console.log("re-render ", table.name)

    }, [useDatabase]) ; 

    return (

        <Card className={cn(
            "w-full h-full bg-background rounded-lg  noselect overflow-visible dark:bg-default-900",
            selected
                ? 'ring-2 ring-primary'
                : '',

            overlapping
                ? 'ring-2  dark:ring-offset-default-900 ring-danger ring-offset-1 scale-105 shadow-danger '
                : '',

            !pulsing
                ? 'scale-100'
                : '',
            pulsing
                ? 'scale-105'
                : '',
        )}
            shadow="sm"

        >
            <div className="px-[2px] ">
                <div
                    className=" border-t-[4px] rounded-t-[6px] border-primary"
                    style={{ borderColor: table.color as string }}
                ></div>
            </div>
            <div className="group gap-2 flex h-9 items-center justify-between bg-default/50 px-2 dark:bg-black/20">
                <Table2 className="size-4 shrink-0 text-icon dark:text-white" />
                {
                    editMode && <>
                        <input
                            placeholder={table.name}
                            autoFocus
                            onChange={(event: any) => setTableName(event.target.value)}
                            value={tableName}
                            onBlur={saveTableName}
                            type="text"
                            className="rounded-md outline-none px-2 py-0.5 w-full border-[0.5px] border-primary-700 font-bold  bg-slate-100 focus-visible:ring-0  text-sm dark:bg-transparent dark:text-white"
                        />
                        <Button
                            variant="light"
                            className="size-6 p-0 text-slate-500 hover:bg-primary-foreground hover:text-slate-700 dark:text-white"
                            size="sm"
                            onPressEnd={saveTableName}
                            isIconOnly
                        >
                            <Check className="size-3" />
                        </Button>
                    </>
                }
                {
                    !editMode &&
                    <>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <label
                                    className=" w-full text-editable truncate px-2 py-0.5 text-sm font-bold dark:text-white dark:group-hover:bg-default-900"
                                    onDoubleClick={() => setEditMode(true)}
                                >
                                    {tableName}
                                </label>
                            </TooltipTrigger>
                            <TooltipContent className="dark:bg-default-900">
                                {t("table.double_click")}
                            </TooltipContent>
                        </Tooltip>

                        <div className="hidden shrink-0 flex-row group-hover:flex">

                            <Button
                                variant="light"
                                size="sm"
                                className="size-6 p-0 text-slate-500 hover:bg-primary-foreground hover:text-slate-700  dark:hover:bg-default-800 "
                                isIconOnly
                                onPressEnd={focus}
                            >
                                <Focus className="size-4 text-icon dark:text-white" />
                            </Button>
                        </div>
                    </>
                }
            </div>
            <div className="transition-[max-height] duration-200 ease-in-out">
                {fields}
            </div>
        </Card>


    )
};

export default React.memo(Table)
