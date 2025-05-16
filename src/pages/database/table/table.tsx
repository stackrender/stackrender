

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
import { TableType } from "@/lib/schemas/table-schema";
import { useDatabase } from "@/providers/database-provider/database-provider";
import { useTranslation } from "react-i18next";
import { RelationshipType } from "@/lib/schemas/relationship-schema"; 
import { useDiagram } from "@/providers/diagram-provider/diagram-provider";


export type TableProps = Node<{
    table: TableType,
}>

const Table: React.FC<NodeProps<TableProps>> = ({ selected, data: { table } }) => {

    const [editMode, setEditMode] = useState<boolean>(false);
    const [tableName, setTableName] = useState<string>(table.name);
    const { editTable } = useDatabase();

    const { focusOnTable } = useDiagram();
    const { t } = useTranslation();

    useEffect(() => {
        setTableName(table.name);
    }, [table.name])

    const saveTableName = useCallback(async () => {
        await editTable({ id: table.id, name: tableName });
        setEditMode(false);
    }, []);

    const focus = useCallback(() => {
        focusOnTable(table.id, false);
    }, [])

    const edges = useStore((store) => store.edges) as Edge[];

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
 

  


    // console.log ("re-render" , table.name)

    return (

        <Card className={cn(
            "w-full h-full bg-background rounded-lg entity-card noselect overflow-visible ",
            selected
                ? 'ring-1 ring-primary'
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
            <div className="group gap-2 flex h-9 items-center justify-between bg-default/50 px-2 dark:bg-default ">
                <Table2 className="size-4 shrink-0 text-icon dark:text-primary" />
                {
                    editMode && <>
                        <input
                            placeholder={table.name}
                            autoFocus
                            onChange={(event: any) => setTableName(event.target.value)}
                            value={tableName}
                            onBlur={saveTableName}
                            type="text"
                            className="rounded-md outline-none px-2 py-0.5 w-full border-[0.5px] border-primary-700 font-bold  bg-slate-100 focus-visible:ring-0 dark:bg-slate-900  text-sm "
                        />
                        <Button
                            variant="light"
                            className="size-6 p-0 text-slate-500 hover:bg-primary-foreground hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200"
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
                                    className=" w-full text-editable truncate px-2 py-0.5 text-sm font-bold"
                                    onDoubleClick={() => setEditMode(true)}
                                >
                                    {table.name}
                                </label>
                            </TooltipTrigger>
                            <TooltipContent>
                                {t("table.double_click")}
                            </TooltipContent>
                        </Tooltip>

                        <div className="hidden shrink-0 flex-row group-hover:flex">

                            <Button
                                variant="light"
                                size="sm"
                                className="size-6 p-0 text-slate-500 hover:bg-primary-foreground hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200"
                                isIconOnly
                                onPressEnd={focus}
                            >
                                <Focus className="size-4 text-icon" />
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
//export default React.memo(Table ) ;


/* 
                                focused = { false}
                            tableNodeId={id}
                            field={field}
                            highlighted={selectedRelEdges.some(
                                (edge) =>
                                    edge.data?.relationship
                                        .sourceFieldId === field.id ||
                                    edge.data?.relationship
                                        .targetFieldId === field.id
                            )}
                            visible={visibleFields.includes(field)}
                            isConnectable={!table.isView}
                         

*/