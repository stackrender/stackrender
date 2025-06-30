

import { RelationshipInsertType, RelationshipType } from "@/lib/schemas/relationship-schema";
import { useDatabaseOperations } from "@/providers/database-provider/database-provider";
import { useDiagramOps } from "@/providers/diagram-provider/diagram-provider";
import { Button, cn, Input, Listbox, ListboxItem, Popover, PopoverContent, PopoverTrigger } from "@heroui/react";
import { Check, ChevronRight, EllipsisVertical, Focus, Pencil, Trash } from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import hash from "object-hash";
import { getDefaultRelationshipName } from "@/utils/relationship";


interface RelationshipAccordionHeaderProps {
    isOpen?: boolean;
    relationship: RelationshipType
}

const RelationshipAccordionHeader: React.FC<RelationshipAccordionHeaderProps> = ({ isOpen, relationship }) => {
    const defaultName : string = useMemo(() => {
        return getDefaultRelationshipName(relationship);
    }, [relationship])


    const [editMode, setEditMode] = useState<boolean>(false);

    const { editRelationship, deleteRelationship } = useDatabaseOperations();
    const { t } = useTranslation();

    const [popOverOpen, setPopOverOpen] = useState<boolean>(false);
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
        setPopOverOpen(false);
    }

    useEffect(() => {
        setName(relationship.name ? relationship.name : defaultName);
    }, [relationship.name]);


    return (
        <div className="group w-full flex h-12 gap-1  flex p-2 items-center" >
            <div className={cn(
                'tarnsition-all duration-200  text-icon  hover:text-font/90',
                isOpen ? "rotate-[90deg]" : ""
            )}>
                <ChevronRight className="size-4" />
            </div>
            {
                editMode && <>
                    <Input
                        placeholder={"Usres"}
                        autoFocus
                        size="sm"
                        variant="bordered"
                        value={name}
                        onValueChange={setName}
                        onBlur={editRelationshipName}
                        type="text"
                        onClick={(event) => event.stopPropagation()}
                        classNames={{
                            inputWrapper: "rounded-sm  focus-visible:border-0 text-sm dark:bg-content1 bg-background group-data-[hover=true]:border-primary group-data-[focus=true]:border-primary border-primary  ",
                            input: "font-semibold text-black dark:text-font"
                        }}
                    />
                    <Button
                        variant="light"
                        className=" text-icon hover:bg-default hover:text-font/90 "
                        size="sm"
                        onPress={editRelationshipName}
                        isIconOnly
                    >
                        <Check className="size-4 " />
                    </Button>
                </>
            }
            {

                !editMode && <>

                    <label
                        className=" flex-1 truncate  px-2 py-1 text-sm font-semibold text-black dark:text-font"
                    >
                        {relationship.name ? relationship.name : defaultName}
                    </label>
                    <div className="flex w-fit shrink-0 items-center justify-stretch  ">
                        <div className="hidden shrink-0  group-hover:block  ">

                            <Button
                                size="sm"
                                isIconOnly
                                variant="light"
                                className="text-icon hover:bg-default hover:text-font/90"
                                onPressEnd={() => focusOnRelationship(relationship.id, true)}
                            >
                                <Focus className="size-4" />
                            </Button>
                            <Button
                                size="sm"
                                isIconOnly
                                variant="light"
                                className="text-icon hover:bg-default hover:text-font/90"
                                onPress={() => setEditMode(true)}
                            >
                                <Pencil className="size-4 " />
                            </Button>
                        </div>
                        <Popover placement="bottom" radius="sm" shadow="sm" showArrow isOpen={popOverOpen} onOpenChange={setPopOverOpen} >
                            <PopoverTrigger>
                                <Button
                                    size="sm"
                                    isIconOnly
                                    variant="light"
                                    className="text-icon hover:bg-default hover:text-font/90"
                                >
                                    <EllipsisVertical className="size-4 " />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-[160px]" >
                                <div className="w-full flex flex-col gap-2 ">
                                    <h3 className="font-semibold text-sm text-font/90 p-2">
                                        {t("db_controller.actions")}
                                    </h3>
                                </div>
                                <hr className="border-divider" />
                                <Listbox aria-label="Actions" className="p-0 pb-1" >

                                    <ListboxItem
                                        key="delete"
                                        className="text-danger"
                                        color="danger"
                                        onPressEnd={onDeleteRelationship}
                                        endContent={<Trash className="size-4" />}
                                    >
                                        {t("db_controller.delete")}
                                    </ListboxItem>
                                </Listbox>
                            </PopoverContent>
                        </Popover>



                    </div>
                </>
            }
        </div>
    )
}


export default React.memo(RelationshipAccordionHeader, (previousState, newState) => {
    return hash(previousState) == hash(newState);
}); 