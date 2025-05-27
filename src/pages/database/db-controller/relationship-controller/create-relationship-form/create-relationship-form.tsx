import Autocomplete from "@/components/auto-complete/auto-complete";
import { FieldType } from "@/lib/schemas/field-schema";
import { RelationshipInsertType } from "@/lib/schemas/relationship-schema";
import { TableType } from "@/lib/schemas/table-schema";
import { useDatabase } from "@/providers/database-provider/database-provider";
import { FileKey, FileMinus2, FileOutput,  KeyRound } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";




interface CreateRelationshipFormProps {
    onRelationshipChanges: (relationship: RelationshipInsertType) => void,
    onValidationChanges?: (isValid: boolean) => void

}


const CreateRelationshipForm: React.FC<CreateRelationshipFormProps> = ({ onRelationshipChanges, onValidationChanges }) => {

    const [relationship, setRelationship] = useState<RelationshipInsertType>({
        sourceTableId: "",
        targetTableId: "",
        sourceFieldId: "",
        targetFieldId: ""
    } as RelationshipInsertType)


    const { database } = useDatabase();
    const { tables } = database;

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
        onValidationChanges && onValidationChanges((relationship.sourceFieldId && relationship.targetFieldId && fieldTypesMatches) as boolean)
    }, [relationship, fieldTypesMatches])

    return (
        <>
            <div className="grid grid-cols-2 grid-rows-2 gap-4">
                <div className="space-y-2">
                    <label className="font-medium flex text-slate-700 flex items-center gap-1 text-sm">
                        <FileOutput className="size-4 text-icon" />
                        {t("db_controller.source_table")}
                    </label>
                    <Autocomplete
                        items={tables}
                        placeholder={t("db_controller.select_table")}
                        onSelectionChange={(key) => setRelationship({ ...relationship, sourceTableId: key })}
                    />
                </div>
                <div className="space-y-2">
                    <label className="font-medium flex text-slate-700 flex items-center gap-1 text-sm">
                        <FileMinus2 className="size-4 text-icon" />
                        {t("db_controller.target_table")}
                    </label>

                    <Autocomplete
                        items={tables}
                        placeholder={t("db_controller.select_table")}
                        onSelectionChange={(key) => setRelationship({ ...relationship, targetTableId: key })}
                    />
                </div>
                <div className="space-y-2">
                    <label className="font-medium flex text-slate-700 flex items-center gap-1 text-sm">
                        <KeyRound className="size-4 text-icon" />
                        {t("db_controller.primary_key")}

                    </label>
                    <Autocomplete
                        placeholder={t("db_controller.select_field")}
                        items={sourceFields}
                        onSelectionChange={(key) => setRelationship({ ...relationship, sourceFieldId: key })}
                        isDisabled={!relationship.sourceTableId}
                        selectedItem={relationship.sourceFieldId}
                    />
                </div>
                <div className="space-y-2">
                    <label className="font-medium flex text-slate-700 flex items-center gap-1 text-sm">
                        <FileKey className="size-4 text-icon" />
                        {t("db_controller.foreign_key")}
                    </label>
                    <Autocomplete
                        placeholder={t("db_controller.select_field")}
                        onSelectionChange={(key) => setRelationship({ ...relationship, targetFieldId: key })}
                        isDisabled={!relationship.targetTableId}
                        items={targetFields}
                        selectedItem={relationship.targetFieldId}
                    />

                </div>
            </div>
            {
                !fieldTypesMatches &&
                <div className="w-full text-danger text-sm  ">
                    {t("db_controller.relationship_error")}

                </div>
            }
        </>
    )
}


export default CreateRelationshipForm; 