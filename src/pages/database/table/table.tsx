

import { Edge, Node, NodeProps } from "@xyflow/react";
import hash from 'object-hash';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Button, Card, cn, } from "@heroui/react";
import {
    Table2,
    Check,
    Focus,
    ChevronUp,
    ChevronDown,
} from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/tooltip/tooltip";

import FieldComponent from "./field";
import { FieldType } from "@/lib/schemas/field-schema";
import { TableInsertType, TableType } from "@/lib/schemas/table-schema";
import { useDatabaseOperations } from "@/providers/database-provider/database-provider";
import { useTranslation } from "react-i18next";
import { RelationshipType } from "@/lib/schemas/relationship-schema";
import { useDiagramOps } from "@/providers/diagram-provider/diagram-provider";



export type TableProps = Node<{
    table: TableType,
    overlapping?: boolean,
    pulsing?: boolean,
    highlightedEdges: Edge[]

}>

const MAX_FIELDS = 10;
const Table: React.FC<NodeProps<TableProps>> = (props) => {
    const { selected, data: { table, overlapping = false, pulsing = false, highlightedEdges = [] } } = props

    const [editMode, setEditMode] = useState<boolean>(false);
    const [tableName, setTableName] = useState<string>(table.name);
    const { editTable } = useDatabaseOperations();
    const [showMore, setShowMore] = useState<boolean>(false);

    const { focusOnTable } = useDiagramOps();
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


    const toggleShowMore = useCallback(() => {
        setShowMore((previousShowMore) => !previousShowMore);
    }, []);
 

    return (
        <Card className={cn(
            "w-full h-full bg-background rounded-md ring-1 ring-default-600  overflow-visible dark:bg-background-50 dark:ring-divider",
            selected
                ? 'ring-2 ring-primary dark:ring-primary'
                : '',
            overlapping
                ? 'ring-2 dark:ring-danger ring-danger  scale-105 shadow-danger '
                : '',
            !pulsing && overlapping
                ? 'scale-105'
                : '',
            pulsing && overlapping
                ? 'scale-110'
                : '',
        )}
            shadow="none"
        >
            <div className="px-[1px] ">
                <div
                    className=" border-t-[4px] rounded-t-[6px] border-primary"
                    style={{ borderColor: table.color as string }}
                ></div>
            </div>
            <div className="group gap-2 flex h-9 items-center justify-between bg-default/50 px-2 dark:bg-black/20">
                <Table2 className="size-4 shrink-0 text-icon  " />
                {
                    editMode && <>
                        <input
                            placeholder={table.name}
                            autoFocus
                            onChange={(event: any) => setTableName(event.target.value)}
                            value={tableName}
                            onBlur={saveTableName}
                            type="text"
                            className="rounded-md outline-none px-2 py-0.5 w-full border-[0.5px] border-primary-700 font-bold bg-slate-100 focus-visible:ring-0  text-sm dark:bg-transparent dark:text-white"
                        />
                        <Button
                            variant="light"
                            className="size-6 p-0 text-icon hover:bg-primary-foreground hover:text-font/90"
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
                                    className=" w-full text-editable truncate px-2 py-0.5 text-sm font-bold dark:text-white "
                                    onDoubleClick={() => setEditMode(true)}
                                >
                                    {tableName}
                                </label>
                            </TooltipTrigger>
                            <TooltipContent >
                                {t("table.double_click")}
                            </TooltipContent>
                        </Tooltip>

                        <div className="hidden shrink-0 flex-row group-hover:flex">

                            <Button
                                variant="light"
                                size="sm"
                                className="size-6 p-0 text-icon hover:bg-primary-foreground   "
                                isIconOnly
                                onPressEnd={focus}
                            >
                                <Focus className="size-4 " />
                            </Button>
                        </div>
                    </>
                }
            </div>

            {
                !showMore ? fields.slice(0, MAX_FIELDS) : fields
            }

            {fields.length > MAX_FIELDS && (
                <div
                    className="flex h-8 cursor-pointer items-center gap-1 justify-center  border-t border-default text-xs text-slate-500 transition-colors duration-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                    onClick={toggleShowMore}
                >
                    {showMore ? (
                        <>
                            <ChevronUp className=" size-4" />
                            {t('table.show_less')}
                        </>
                    ) : (
                        <>
                            <ChevronDown className="size-4" />
                            {t('table.show_more')}
                        </>
                    )}
                </div>
            )}
        </Card>


    )
};

export default React.memo(Table , (previousState: any, newState: any) => {
 
    
    const previousStateHash: string = hash(previousState.data);
    const newStateHash: string = hash(newState.data);
    return previousStateHash == newStateHash && previousState.selected == newState.selected;
});

/*
, 


*/
