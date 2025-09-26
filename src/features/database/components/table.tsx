

import { Edge, Node, NodeProps } from "@xyflow/react";
import hash from 'object-hash';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
    Check, 
    ChevronUp,
    ChevronDown,
} from 'lucide-react';
import FieldComponent from "../components/field";
import { FieldType } from "@/lib/schemas/field-schema";
import { TableInsertType, TableType } from "@/lib/schemas/table-schema";
import { useDatabaseOperations } from "@/providers/database-provider/database-provider";
import { useTranslation } from "react-i18next";
import { RelationshipType } from "@/lib/schemas/relationship-schema";
import { useDiagramOps } from "@/providers/diagram-provider/diagram-provider";
import { Card,  CardContent  , CardHeader  } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { IconFocus2, IconPencil,  IconTableFilled } from "@tabler/icons-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";



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
    }, [table]);


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
                color={table.color as string}
            />)
        })
    }, [table.fields, selected, highlightedEdges]);


    const toggleShowMore = useCallback(() => {
        setShowMore((previousShowMore) => !previousShowMore);
    }, []);

    return (
        <Card
            className={cn(
                "rounded-[12px] p-0.5  gap-0 transition-all duration-200",
                overlapping
                    ? 'ring-1 ring-destructive  scale-105 shadow-danger '
                    : '',
                !pulsing && overlapping
                    ? 'scale-105'
                    : '',
                pulsing && overlapping
                    ? 'scale-110'
                    : '',

                selected && !overlapping ? "ring-1 ring-primary" : ""
            )}
            style={
                (selected && table.color && !overlapping) ?
                    {
                        boxShadow: "0 0 0 1px " + table.color,
                    }
                    : undefined
            }

        >
            <CardHeader className="group rounded-t rounded-t-md p-1.5  flex items-center mb-0 bg-primary/10 "
                style={
                    table.color ? {
                        backgroundColor: table.color + "20" as string
                    } : undefined
                }
            >
                <IconTableFilled className="size-3.5 shrink-0 text-primary " style={{ color: table.color as string }} />
                {!editMode ? <>
                    <label
                        className=" w-full text-editable truncate  py-0.5 text-sm font-bold  text-primary"
                        onDoubleClick={() => setEditMode(true)}
                        style={{ color: table.color as string }}
                    >
                        {tableName}
                    </label>
                    <div className="flex gap-1 hidden shrink-0 flex-row group-hover:flex  ">
                        <Button variant="outline" size="icon" className="size-6 shrink-0 shadow-sm rounded-sm" onClick={() => setEditMode(true)}>
                            <IconPencil className="size-3 text-muted-foreground " />
                        </Button>
                        <Button variant="outline" size="icon" className="size-6 shrink-0 shadow-sm rounded-sm" onClick={focus}>
                            <IconFocus2 className="size-3 text-muted-foreground " />
                        </Button>
                    </div>
                </>
                    :
                    <>
                        <Input
                            type="text"
                            placeholder={tableName}
                            className={cn("h-6 font-bold pb-1.5 rounded-[4px] px-1",
                                table.color ? `focus-visible:ring-[${table.color}]/50 focus-visible:ring-[1px] focus-visible:border-0 ` : ""
                            )}
                            autoFocus
                            onChange={(event: any) => setTableName(event.target.value)}
                            value={tableName}
                            onBlur={saveTableName}
                            style={{ color: table.color as string }}
                        />
                        <div className="flex gap-1 shrink-0 flex-row  transition-opacity duration-200">
                            <Button variant="outline" size="icon" className="size-6 shrink-0 shadow-sm rounded-sm" onClick={() => setEditMode(true)}>
                                <Check className="size-3 text-muted-foreground" />
                            </Button>
                        </div>
                    </>

                }
            </CardHeader>
            <CardContent className="p-0 mt-0">
                {
                    !showMore ? fields.slice(0, MAX_FIELDS) : fields
                }

                {fields.length > MAX_FIELDS && (
                    <div
                        className="flex h-8 cursor-pointer items-center gap-1 justify-center text-xs  transition-colors duration-200 "
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
            </CardContent>

        </Card>

    )
};



export default React.memo(Table, (previousState: any, newState: any) => {
    // compare the previous state to the new one just to prevent re-rendering when we drag a table 
    const previousStateHash: string = hash(previousState.data);
    const newStateHash: string = hash(newState.data);
    return previousStateHash == newStateHash && previousState.selected == newState.selected;
});

