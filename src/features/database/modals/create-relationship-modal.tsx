 
import { Combobox } from "@/components/combobox";
import Modal, { ModalProps } from "@/components/modal";
import { Label } from "@/components/ui/label";
import { FieldType } from "@/lib/schemas/field-schema";
import { RelationshipInsertType } from "@/lib/schemas/relationship-schema";
import { TableType } from "@/lib/schemas/table-schema";
import { useDatabase, useDatabaseOperations } from "@/providers/database-provider/database-provider";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { v4 } from "uuid";




interface CreateRelationshipModalProps extends ModalProps {
    onRelationshipChanges?: (relationship: RelationshipInsertType) => void,
    onRlationshipCreated?: (id: string) => void

}


const CreateRelationshipModal: React.FC<CreateRelationshipModalProps> = ({ onRelationshipChanges, isOpen, onOpenChange, onRlationshipCreated }) => {
    const [isValid, setIsValid] = useState<boolean>(false);
    const { createRelationship } = useDatabaseOperations();

    const [relationship, setRelationship] = useState<RelationshipInsertType>({
        sourceTableId: "",
        targetTableId: "",
        sourceFieldId: "",
        targetFieldId: ""
    } as RelationshipInsertType)


    const { database } = useDatabase();
    const { tables } = database || { tables: [] };

    const { t } = useTranslation();

    const sourceFields: FieldType[] = useMemo(() => {
        const sourceTable: TableType | undefined = tables.find((table: TableType) => table.id == relationship.sourceTableId);
        return sourceTable?.fields ? sourceTable.fields : [];
    }, [tables, relationship.sourceTableId]);


    const targetFields: FieldType[] = useMemo(() => {
        const targetTable: TableType | undefined = tables.find((table: TableType) => table.id == relationship.targetTableId);
        return targetTable?.fields ? targetTable.fields : [];
    }, [tables, relationship.targetTableId]);


    const fieldTypesMatches: boolean = useMemo(() => {
        const sourceField: FieldType | undefined = sourceFields.find((field: FieldType) => field.id == relationship.sourceFieldId);
        const targetField: FieldType | undefined = targetFields.find((field: FieldType) => field.id == relationship.targetFieldId);
        if (sourceField && targetField)
            return sourceField.typeId == targetField.typeId;
        else
            return true;
    }, [relationship, sourceFields, targetFields])


    useEffect(() => setRelationship({ ...relationship, sourceFieldId: "" }), [sourceFields]);
    useEffect(() => setRelationship({ ...relationship, targetFieldId: "" }), [targetFields]);

    useEffect(() => {
        onRelationshipChanges && onRelationshipChanges(relationship)
    }, [relationship, sourceFields, targetFields]);

    useEffect(() => {
        setIsValid((relationship.sourceFieldId && relationship.targetFieldId && fieldTypesMatches) as boolean)
    }, [relationship, fieldTypesMatches]);


    const addRelationship = useCallback(() => {
        const id: string = v4();
        createRelationship({
            ...relationship,
            id,
        } as RelationshipInsertType);
        onRlationshipCreated && onRlationshipCreated(id);
        onOpenChange && onOpenChange(false);
    }, [relationship, onOpenChange]);


    return (
        <Modal
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            title={t("db_controller.create_relationship")}
            actionName={t("modals.create")}
               className="md:min-w-[520px] w-full"
            isDisabled={!isValid}
            actionHandler={addRelationship}
        >

            <div className="grid grid-cols-2 grid-rows-2 gap-4">
                <div className="space-y-2">
                    <Label  >

                        {t("db_controller.source_table")}
                    </Label>


                    <Combobox
                        items={tables}
                        label="name"
                        placeholder={t("db_controller.select_table")}
                        onSelectionChange={(key) => setRelationship({ ...relationship, sourceTableId: key })}
                        className="flex flex-1 w-full"
                    />
                </div>
                <div className="space-y-2">
                    <Label  >

                        {t("db_controller.referenced_table")}
                    </Label>
                    <Combobox
                        items={tables}
                        label="name"
                        placeholder={t("db_controller.select_table")}
                        onSelectionChange={(key) => setRelationship({ ...relationship, targetTableId: key })}
                        className="flex flex-1 w-full"
                    />
                </div>
                <div className="space-y-2">
                    <Label >
                        {t("db_controller.primary_key")}
                    </Label>


                    <Combobox
                        items={sourceFields}
                        label="name"
                        placeholder={t("db_controller.select_field")}
                        onSelectionChange={(key) => setRelationship({ ...relationship, sourceFieldId: key })}
                        className="flex flex-1 w-full"
                        selectedItem={relationship.sourceFieldId}
                        isDisabled={!relationship.sourceTableId}
                    />
                </div>
                <div className="space-y-2">
                    <Label >

                        {t("db_controller.foreign_key")}
                    </Label>
                    <Combobox
                        items={targetFields}
                        label="name"
                        placeholder={t("db_controller.select_field")}
                        onSelectionChange={(key) => setRelationship({ ...relationship, targetFieldId: key })}
                        className="flex flex-1 w-full"
                        selectedItem={relationship.targetFieldId}
                        isDisabled={!relationship.targetTableId}
                    />
                </div>
            </div>
            {
                !fieldTypesMatches &&
                <div className="w-full text-destructive text-sm  ">
                    {t("db_controller.relationship_error")}

                </div>
            }

        </Modal>
    )
}


export default CreateRelationshipModal; 