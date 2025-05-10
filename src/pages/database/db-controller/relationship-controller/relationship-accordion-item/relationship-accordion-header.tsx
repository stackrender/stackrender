import { useRelationshipName } from "@/components/hooks/use-relationship-name";
import { randomColor } from "@/lib/colors";
import { RelationshipInsertType, RelationshipType } from "@/lib/schemas/relationship-schema";
import { useDatabase } from "@/providers/database-provider/database-provider";
import { Button, cn, Input } from "@heroui/react";
import { Check, ChevronRight, EllipsisVertical, Focus, Pencil } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";



interface RelationshipAccordionHeaderProps {
    isOpen?: boolean;
    relationship: RelationshipType
}


const RelationshipAccordionHeader: React.FC<RelationshipAccordionHeaderProps> = ({ isOpen, relationship }) => {

    const [editMode, setEditMode] = useState<boolean>(false);
    const { name: defaultName } = useRelationshipName(relationship);
    const { editRelationship } = useDatabase();

    const [name, setName] = useState<string>(relationship.name ? relationship.name : defaultName)


    const editRelationshipName = () => {
        if (relationship.name || name.trim().toLocaleLowerCase() != defaultName)
            editRelationship({
                id: relationship.id,
                name
            } as RelationshipInsertType);
        setEditMode(false);
    }

    return (
        <div className="group w-full flex h-12 gap-1  flex p-2 items-center" >
            <div className={cn(
                'tarnsition-all duration-200',
                isOpen ? "rotate-[90deg]" : ""
            )}>
                <ChevronRight className="size-4 text-icon" />
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
                        className="rounded-md px-2 py-0.5 w-full  border-blue-400  focus-visible:ring-0 dark:bg-slate-900  text-sm "
                    />
                    <Button
                        variant="light"
                        className="size-6 p-0 text-slate-500 hover:bg-primary-foreground hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200"
                        size="sm"
                        onPress={editRelationshipName}
                        isIconOnly
                    >
                        <Check className="size-4 text-icon" />
                    </Button>
                </>
            }
            {

                !editMode && <>

                    <label
                        className="w-full  truncate px-2 py-1 text-sm font-semibold text-black"
                    >
                        {relationship.name ? relationship.name : defaultName}
                    </label>
                    <div className="hidden shrink-0 flex-row group-hover:flex">

                        <Button
                            size="sm"
                            isIconOnly
                            variant="light"
                        >
                            <Focus className="size-4 text-icon" />
                        </Button>
                        <Button
                            size="sm"
                            isIconOnly
                            variant="light"
                            onPress={() => setEditMode(true)}
                        >
                            <Pencil className="size-4 text-icon" />
                        </Button>
                    </div>
                    <Button
                        size="sm"
                        isIconOnly
                        variant="light"
                    >
                        <EllipsisVertical className="size-4 text-slate-500" />
                    </Button>
                </>
            }
        </div>

    )
}


export default RelationshipAccordionHeader; 