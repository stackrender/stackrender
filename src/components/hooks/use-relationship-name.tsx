import { Cardinality, RelationshipType } from "@/lib/schemas/relationship-schema";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";


export const useRelationshipName = (relationship: RelationshipType) => {
    const { t } = useTranslation();
    const name: string = useMemo(() => {
        return `${relationship.sourceTable.name}_${relationship.sourceField.name} - ${relationship.targetTable.name}_${relationship.targetField.name}_fk`
    }, [relationship, t])
    return {
        name
    }
}