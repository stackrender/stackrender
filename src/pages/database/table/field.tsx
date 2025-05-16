import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/tooltip/tooltip";
import { FieldType } from "@/lib/schemas/field-schema";
import { useDatabase } from "@/providers/database-provider/database-provider";
import { useDiagram } from "@/providers/diagram-provider/diagram-provider";
import { Button, cn, select } from "@heroui/react";
import { Handle, Position, useConnection } from "@xyflow/react";
import { Check, KeyRound, Trash, Trash2 } from "lucide-react";
import React, { useEffect, useState } from "react";



interface Props {
    field: FieldType,
    showHandles?: boolean,
    highlight?: boolean , 
    showTargetHandle? : boolean 
}


export const LEFT_PREFIX = "left_";
export const RIGHT_PREFIX = "right_";
export const TARGET_PREFIX = "target_";


const Field: React.FC<Props> = ({ field, showHandles, highlight }) => {

    const [editMode, setEditMode] = useState<boolean>(false);
    const { deleteField, editField } = useDatabase();
    const [fieldName, setFieldName] = useState<string>(field.name);
    const {isConnectionInProgress} = useDiagram() ; 

    useEffect(() => {
        setFieldName(field.name);
    }, [field.name]);



    const removeField = () => {
        deleteField(field.id)
    }


    const saveFieldName = () => {
        editField({
            id: field.id,
            name: fieldName
        } as FieldType);
        setEditMode(false);
    }

 
    
    return (
        <div className={cn(
            "group relative flex h-8 items-center justify-between gap-1 border-t border-default px-3 text-sm last:rounded-b-[6px] hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-200 ease-in-out" , 
            highlight ? "bg-primary/5" : ""
        )}>
            {
                !editMode &&
                <>
                    <label
                        className={cn(
                            "truncate  text-xs text-slate-900",
                            field.isPrimary ? "font-semibold" : ""
                        )}
                        onDoubleClick={() => setEditMode(true)}
                    >
                        {field.name}
                    </label>
                    <span className={cn("content-center truncate flex items-center h-full gap-1 text-right text-xs text-default-600 group-hover:hidden font-semibold text-icon",
                        field.isPrimary ? "font-semibold text-slate-700" : ""
                    )}>
                        {field.isPrimary && <KeyRound className="size-3" />}  {field.type?.name?.split(' ')[0]}{field.nullable ? "?" : ""}
                    </span>

                    <Button
                        radius="none"
                        isIconOnly
                        variant="faded"
                        size="sm"
                        color="danger"
                        className=" bg-transparent border-none hidden group-hover:flex "
                        onPressEnd={removeField}

                    >
                        <Trash2 className="size-3" />
                    </Button>

                </>
            }
            {
                editMode &&
                <>
                    <input

                        onBlur={saveFieldName}
                        placeholder={field.name}
                        autoFocus
                        type="text"
                        value={fieldName}
                        onClick={(e) => e.stopPropagation()}
                        onChange={(e) => setFieldName(e.target.value)}

                        className="rounded-md outline-none px-2 py-0.5 w-full border-[0.5px] border-primary-700  bg-slate-100 focus-visible:ring-0 dark:bg-slate-900  text-sm "

                    />
                    <Button
                        variant="light"
                        className="size-6 p-0 text-slate-500 hover:bg-primary-foreground hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200"
                        size="sm"
                        isIconOnly
                        onPress={saveFieldName}
                    >
                        <Check className="size-3" />
                    </Button>
                </>
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
                    className="w-4 h-4 border-4 bg-primary"
                />
                <Handle
                    type="source"
                    position={Position.Right}
                    className="w-4 h-4 border-4 bg-primary"
                    id={RIGHT_PREFIX + field.id}
                />
            </div>
            {
                <div className={
                    cn(
                        "absolute w-full left-0 ",
                        !isConnectionInProgress ? "invisible" : "visible"
                    )} >
                    <Handle
                        id={`${TARGET_PREFIX}${field.id}`}
                        className={
                            true
                                ? '!absolute !left-0 !top-0 !h-full !w-full !transform-none !rounded-none !border-none !opacity-0'
                                : `!invisible`
                        }
                        position={Position.Left}
                        type="target"
                    />
                </div>
            }
        </div>
    )
}


export default React.memo(Field); 