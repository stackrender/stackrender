
import { FieldType } from "@/lib/schemas/field-schema";
import { useDatabaseOperations } from "@/providers/database-provider/database-provider";
import { useDiagramOps } from "@/providers/diagram-provider/diagram-provider";

import { Handle, Position } from "@xyflow/react";
import React, { useCallback, useEffect, useState } from "react";

import hash from 'object-hash';
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { IconCheck, IconKey, IconKeyframe, IconMessageCircle, IconPencil, IconTrash } from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Props {
    field: FieldType,
    showHandles?: boolean,
    highlight?: boolean,
    color?: string
}


export const LEFT_PREFIX = "left_";
export const RIGHT_PREFIX = "right_";
export const TARGET_PREFIX = "target_";


const Field: React.FC<Props> = (props) => {

    const { field, showHandles, highlight, color } = props;
    const [editMode, setEditMode] = useState<boolean>(false);
    const { deleteField, editField } = useDatabaseOperations();
    const [fieldName, setFieldName] = useState<string>(field.name);
    const { isConnectionInProgress } = useDiagramOps();

    useEffect(() => {
        setFieldName(field.name);
    }, [field.name]);

    const removeField = useCallback(() => {
        deleteField(field.id)
    }, [])

    const saveFieldName = useCallback(() => {
        editField({
            id: field.id,
            name: fieldName
        } as FieldType);
        setEditMode(false);
    }, [fieldName]);


    return (
        <div className={cn(
            "group relative flex h-8 items-center justify-between gap-1 px-1.5 text-sm hover:bg-secondary transition-all duration-200 ease-in-out ",
            highlight ? "bg-secondary" : ""
        )}>
            <div className="text-muted-foreground flex items-center truncate  gap-1.5">
                {
                    field.isPrimary &&
                    <IconKey className="size-3" />
                }
                {
                    field.nullable && !field.isPrimary &&
                    <IconKeyframe className="size-3" />
                }
                {
                    !field.nullable && !field.isPrimary &&
                    <IconKeyframe className="size-3 fill-muted-foreground" />
                }
                {
                    !editMode ?
                        <label
                            className={"truncate flex gap-1 text-xs text-foreground  "}
                            onDoubleClick={() => setEditMode(true)}
                        >
                            {fieldName}
                            {
                                field.note &&
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <IconMessageCircle className="size-3 text-muted-foreground  " />
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        {field.note}
                                    </TooltipContent>
                                </Tooltip>
                            }
                        </label>
                        :
                        <Input
                            onBlur={saveFieldName}
                            placeholder={field.name}
                            autoFocus
                            type="text"
                            value={fieldName}
                            onClick={(e) => e.stopPropagation()}
                            onChange={(e) => setFieldName(e.target.value)}
                            className="h-6 font-bold pb-1.5 rounded-sm px-1"
                        />

                }
            </div>
            {
                !editMode ?
                    <div className="text-xs text-muted-foreground flex   shrink-0 ">
                        <div className="group-hover:opacity-0">
                            {field.type?.name?.split(' ')[0]}
                        </div>
                        <div className="flex gap-1 opacity-0 shrink-0 flex-row group-hover:opacity-100 transition-opacity duration-200 absolute right-1 top-1 ">
                            <Button variant="outline" size="icon" className="size-6 shrink-0 shadow-sm rounded-sm" onClick={() => setEditMode(true)}>
                                <IconPencil className="size-3 text-muted-foreground " />
                            </Button>
                            <Button variant="outline" size="icon" className="size-6 shrink-0 shadow-sm rounded-sm" onClick={removeField}>
                                <IconTrash className="size-3 text-destructive " />
                            </Button>
                        </div>
                    </div>
                    :
                    <div className="text-xs text-muted-foreground flex ml-1">
                        <Button variant="outline" size="icon" className="size-6 shrink-0 shadow-sm rounded-sm" onClick={() => setEditMode(true)}>
                            <IconCheck className="size-3 text-muted-foreground " />
                        </Button>
                    </div>
            }

            <div className={
                cn(
                    "absolute w-full left-0 ",
                    !showHandles ? "invisible" : "visible"
                )} >
                <Handle
                    type="source"
                    position={Position.Left}
                    id={LEFT_PREFIX + field.id}
                    className={cn(
                        "!w-2.5 !h-2.5  !bg-card !border-2  !-left-1 shadow-sm",
                        !color ? "!border-primary" : ``
                    )}
                    style={color ? {
                        borderColor: color,

                    } : undefined}

                />
                <Handle
                    type="source"
                    position={Position.Right}
                    id={RIGHT_PREFIX + field.id}
                    className={cn(
                        "!w-2.5 !h-2.5  !bg-card !border-2 !-right-1 shadow-sm",
                        !color ? "!border-primary" : ``
                    )}
                    style={color ? {
                        borderColor: color,

                    } : undefined}

                />
            </div>

            <div className={
                cn(
                    "!absolute w-full !left-0  h-full  hover:cursor-crosshair relative w-full ",
                    (!isConnectionInProgress) ? "invisible" : "visible"
                )}>
                <Handle
                    id={`${TARGET_PREFIX}${field.id}`}
                    className={
                        'absolute !w-full  !h-full !border-none !rounded-none  !transform-none !left-0 !top-0   opacity-0'
                    }
                    position={Position.Left}
                    type="target"
                />
            </div>

        </div>
    )
}


export default React.memo(Field, (previousState, newState) => {
    return hash(previousState) == hash(newState);
}); 