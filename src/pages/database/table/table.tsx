import { Table as TableType } from "@/lib/interfaces/table";

import { Handle, Node, NodeProps, NodeResizer, Position } from "@xyflow/react";

import React, { useCallback, useState } from 'react';
import { Button, Card, CardBody, CardHeader, cn, Divider, Input } from "@heroui/react";
import {
    ChevronsLeftRight,
    ChevronsRightLeft,
    Table2,
    ChevronDown,
    ChevronUp,
    Check,
    CircleDotDashed,
    SquareDot,
    SquarePlus,
    SquareMinus,
    Divide,
} from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/tooltip/tooltip";
import { Field } from "@/lib/interfaces/field";
import FieldComponent from "./field";


export const MAX_TABLE_SIZE = 450;
export const MID_TABLE_SIZE = 337;
export const MIN_TABLE_SIZE = 224;
export const TABLE_MINIMIZED_FIELDS = 10;

export type TableProps = Node<{
    table: TableType, isOverlapping?: boolean;
    highlightOverlappingTables?: boolean;
}>

const Table: React.FC<NodeProps<TableProps>> = React.memo(({
    selected,
    dragging,
    id,
    data: { table, },
}) => {
    const [editMode, setEditMode] = useState<boolean>(false);

 
    return (

        <div className={cn(
            "w-full h-full bg-background  rounded-lg entity-card border-2   noselect ",
            selected
                ? ' border-2 border-primary-500'
                : '',

        )}>
            <div
                className="h-2 rounded-t-[6px] "
                style={{ backgroundColor: "rgb(255, 107, 138)" }}
            ></div>

      
            <div className="group gap-2 flex h-9 items-center justify-between bg-default px-2 dark:bg-default">
                <Table2 className="size-3.5 shrink-0 text-gray-600 dark:text-primary" />
                {
                    editMode && <>
                        <input
                            placeholder={table.name}
                            autoFocus
                            onBlur={() => setEditMode(false)}
                            type="text"
                            className="rounded-md px-2 py-0.5 w-full border-[0.5px] border-blue-400  bg-slate-100 focus-visible:ring-0 dark:bg-slate-900  text-sm "
                        />
                        <Button
                            variant="light"
                            className="size-6 p-0 text-slate-500 hover:bg-primary-foreground hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200"
                            size="sm"
                            onClick={() => setEditMode(false)}
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
                                Double click to edit
                            </TooltipContent>
                        </Tooltip>

                        <div className="hidden shrink-0 flex-row group-hover:flex">

                            <Button
                                variant="light"
                                size="sm"
                                className="size-6 p-0 text-slate-500 hover:bg-primary-foreground hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200"
                                isIconOnly
                            >
                                <CircleDotDashed className="size-4" />
                            </Button>
                            <Button

                                variant="light"
                                size="sm"
                                className="size-6 p-0 text-slate-500 hover:bg-primary-foreground hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200"
                                isIconOnly
                            >
                                {table.width !== MAX_TABLE_SIZE ? (
                                    <ChevronsLeftRight className="size-4" />
                                ) : (
                                    <ChevronsRightLeft className="size-4" />
                                )}
                            </Button>
                        </div>
                    </>
                }
            </div>

            <div>
                <div
                    className="transition-[max-height] duration-200 ease-in-out"
                >
                    {table.fields.map((field: Field) => (
                        <FieldComponent
                            key={field.id}
                            field={field}
                            showHandles={selected}
                        />
                    ))}
                </div>

            </div>
        </div>

    )
});

Table.displayName = 'table';

export default Table;


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