

import { RelationshipInsertType, RelationshipType } from "@/lib/schemas/relationship-schema";
import { useDatabaseOperations } from "@/providers/database-provider/database-provider";
import { useDiagramOps } from "@/providers/diagram-provider/diagram-provider"; 
import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import hash from "object-hash";
import { getDefaultRelationshipName } from "@/utils/relationship";
import { AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { IconCheck, IconDotsVertical, IconFocus2, IconPencil, IconTrash } from "@tabler/icons-react";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";


interface RelationshipAccordionTriggerProps {
    isOpen?: boolean;
    relationship: RelationshipType
}

const RelationshipAccordionTrigger: React.FC<RelationshipAccordionTriggerProps> = ({ isOpen, relationship }) => {
    const defaultName: string = useMemo(() => {
        return getDefaultRelationshipName(relationship);
    }, [relationship])


    const [editMode, setEditMode] = useState<boolean>(false);

    const { editRelationship, deleteRelationship } = useDatabaseOperations();
    const { t } = useTranslation();

    
    const [name, setName] = useState<string>(relationship.name ? relationship.name : defaultName);
    const { focusOnRelationship } = useDiagramOps();


    const editRelationshipName = () => {
        if (relationship.name || name.trim().toLocaleLowerCase() != defaultName)
            editRelationship({
                id: relationship.id,
                name
            } as RelationshipInsertType);
        setEditMode(false);
    }

    const onDeleteRelationship = () => {
        deleteRelationship(relationship.id);

    }

    useEffect(() => {
        setName(relationship.name ? relationship.name : defaultName);
    }, [relationship.name]);

    return (
        <AccordionTrigger className="group h-12 py-3">
            {
                !editMode &&
                <>
                    <div className="w-full flex">
                        <label
                            className="py-2 !truncate  text-sm cursor-pointer max-w-80"
                        >
                            {relationship.name ? relationship.name : defaultName}
                        </label>
                    </div>
                    <div className="hidden shrink-0 flex-row group-hover:flex gap-2">
                        <Button variant="outline" size="icon" className="size-7 shrink-0  " onClick={(event: any) => {
                            event.stopPropagation();
                            setEditMode(true)
                        }}>
                            <IconPencil className="size-4 text-muted-foreground " />
                        </Button>
                        <Button variant="outline" size="icon" className="size-7 shrink-0  " onClick={(event: any) => {
                            event.stopPropagation();
                            focusOnRelationship(relationship.id, true)
                        }}>
                            <IconFocus2 className="size-4 text-muted-foreground " />
                        </Button>
                    </div>
                </>
            }
            {
                editMode && <>
                    <Input
                        placeholder={"Relationship name"}
                        value={name}
                        onChange={(event: any) => setName(event.target.value)}
                        onBlur={editRelationshipName}
                        autoFocus
                        type="text"
                        onClick={(event) => event.stopPropagation()}
                        className="h-8"

                    />
                    <Button variant="ghost" size="icon" className="size-7 shrink-0 rounded-sm" onClick={editRelationshipName}>
                        <IconCheck className="size-4 text-muted-foreground " />
                    </Button>
                </>
            }
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="size-7 shrink-0  rounded-sm" >
                        <IconDotsVertical className="size-4 text-muted-foreground " />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="min-w-[164px]">
                    <DropdownMenuLabel>
                        {t("db_controller.actions")}
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />

                    <DropdownMenuItem variant="destructive" onClick={onDeleteRelationship}>
                        {t("db_controller.delete")}
                        <DropdownMenuShortcut>
                            <IconTrash className="size-4 text-destructive" />
                        </DropdownMenuShortcut>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

        </AccordionTrigger>
 
    )
}


export default React.memo(RelationshipAccordionTrigger, (previousState, newState) => {
    return hash(previousState) == hash(newState);
}); 