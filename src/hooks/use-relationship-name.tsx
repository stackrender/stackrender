import {  RelationshipType } from "@/lib/schemas/relationship-schema";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";


export const useRelationshipName = (relationship: RelationshipType) => {
    const { t } = useTranslation();
    const name: string = useMemo(() => {
        return getDefaultRelationshipName(relationship) ; 
    }, [relationship, t])
    return {
        name
    }
}


export const getDefaultRelationshipName = (relationship: RelationshipType) => {

    if (!relationship.sourceTable || !relationship.targetTable || !relationship.sourceField || !relationship.targetField)
        return "";
    return `${relationship.sourceTable?.name}_${relationship.sourceField?.name} - ${relationship.targetTable?.name}_${relationship.targetField?.name}_fk`
}