import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/tooltip/tooltip";
import { Field as FieldType } from "@/lib/interfaces/field";
import { Button, cn, select } from "@heroui/react";
import { Handle, Position, useConnection } from "@xyflow/react";
import { Check } from "lucide-react";
import React, { useState } from "react";



interface Props {
    field: FieldType,
    showHandles?: boolean
}



const Field: React.FC<Props> = ({ field, showHandles }) => {

    const [editMode, setEditMode] = useState<boolean>(false);

    const connection = useConnection();
 
    return (
        <div className="group relative flex h-8 items-center justify-between gap-1 border-t px-3 text-sm last:rounded-b-[6px] hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-200 ease-in-out ">
            {
                !editMode &&
                <>
                    <label
                        className=" truncate  text-sm "
                        onDoubleClick={() => setEditMode(true)}
                    >
                        {field.name}
                    </label>
                    <span className="content-center truncate text-right text-xs text-muted-foreground text-default-600" >
                        {field.type.name.split(' ')[0]}
                    </span>
                </>
            }
            {
                editMode &&
                <>
                    <input
                        //                    ref={inputRef}
                        onBlur={() => setEditMode(false)}
                        placeholder={field.name}
                        autoFocus
                        type="text"
                        //  value={fieldName}
                        onClick={(e) => e.stopPropagation()}
                        //                        onChange={(e) => setFieldName(e.target.value)}
                        className="rounded-md px-2 py-0.5 w-full border-[0.5px] border-blue-400  bg-slate-100 focus-visible:ring-0 dark:bg-slate-900  text-sm "

                    />
                    <Button
                        variant="light"
                        className="size-6 p-0 text-slate-500 hover:bg-primary-foreground hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200"
                        size="sm"
                        isIconOnly
                        onPress={() => setEditMode(false)}
                    >
                        <Check className="size-4" />
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
                    id={"left-"+ field.id}
                    className="w-4 h-4 border-3 bg-primary"
                />
                <Handle
                    type="source"
                    position={Position.Right}
                    className="w-4 h-4 border-3 bg-primary"
                    
                    id={"right-"+ field.id}
                    
                />
            </div>
            {
                <div className={
                    cn(
                        "absolute w-full left-0 ",
                        !connection.inProgress ? "invisible" : "visible"
                    )} >
                    <Handle
                        id={`${"target"}_${field.id}`}
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