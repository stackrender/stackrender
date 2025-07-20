import { ForeignKeyActions } from "@/lib/field"
import { DatabaseType } from "@/lib/schemas/database-schema"
import { FieldType } from "@/lib/schemas/field-schema"
import { Cardinality, RelationshipType } from "@/lib/schemas/relationship-schema"
import { tablesRelations, TableType } from "@/lib/schemas/table-schema"
import { v4 } from "uuid"
import pluralize from 'pluralize';
export const getRelationshipSourceAndTarget = (sourceTableId: string, sourceField: FieldType, targetTableId: string, targetField: FieldType) => {
    if (sourceField.isPrimary || targetField.isPrimary) {
        if (sourceField.isPrimary) {
            return {
                sourceTableId: sourceTableId,
                targetTableId: targetTableId,
                sourceFieldId: sourceField.id,
                targetFieldId: targetField.id,
            }
        } else {
            return {

                sourceTableId: targetTableId,
                targetTableId: sourceTableId,
                sourceFieldId: targetField.id,
                targetFieldId: sourceField.id,
            }
        }
    }
    else if (sourceField.unique || targetField.unique) {
        if (sourceField.unique) {
            return {

                sourceTableId: sourceTableId,
                targetTableId: targetTableId,
                sourceFieldId: sourceField.id,
                targetFieldId: targetField.id,
            }
        } else {
            return {

                sourceTableId: targetTableId,
                targetTableId: sourceTableId,
                sourceFieldId: targetField.id,
                targetFieldId: sourceField.id,
            }
        }
    } else {
        return {
            sourceTableId: sourceTableId,
            targetTableId: targetTableId,
            sourceFieldId: sourceField.id,
            targetFieldId: targetField.id,
        }
    }
}


export const getForeignRelationships = (table: TableType): RelationshipType[] => {

    let foreignRelationships = (table.sourceRelations ? table.sourceRelations?.filter((relationship: RelationshipType) =>
        relationship.cardinality == Cardinality.many_to_one
    ) : []).map((relationship: RelationshipType) => {
        return {
            ...relationship,
            sourceTable: relationship.targetTable,
            targetTable: relationship.sourceTable,
            sourceField: relationship.targetField,
            targetField: relationship.sourceField,

        }
    });

    foreignRelationships = foreignRelationships.concat(
        table.targetRelations ? table.targetRelations?.filter((relationship: RelationshipType) =>
            relationship.cardinality == Cardinality.one_to_many || relationship.cardinality == Cardinality.one_to_one
        ) : []);

    return foreignRelationships;
}


export const getDefaultRelationshipName = (relationship: RelationshipType) => {
    if (!relationship.sourceTable || !relationship.targetTable || !relationship.sourceField || !relationship.targetField)
        return "";
    return `fk_${relationship.sourceTable?.name}_${relationship.targetTable?.name}`
}




export const decomposeManyToMany = (database: DatabaseType): DatabaseType => {
    // Clone the tables and relationships to avoid mutating the original database object
    let relationships: RelationshipType[] = [...database.relationships];
    let tables: TableType[] = [...database.tables];

    // Filter out all many-to-many relationships to process
    let manyToManyRelationships = relationships.filter(
        (relationship: RelationshipType) => relationship.cardinality == Cardinality.many_to_many
    );

    // Loop through each many-to-many relationship
    for (const relationship of manyToManyRelationships) {
        // Find the source and target tables
        const sourceTable: TableType = tables.find(
            (table: TableType) => table.id == relationship.sourceTableId
        ) as TableType;

        const targetTable: TableType = tables.find(
            (table: TableType) => table.id == relationship.targetTableId
        ) as TableType;

        // Find the source and target fields involved in the relationship
        const sourceField: FieldType = sourceTable.fields.find(
            (field: FieldType) => field.id == relationship.sourceFieldId
        ) as FieldType;

        const targetField: FieldType = targetTable.fields.find(
            (field: FieldType) => field.id == relationship.targetFieldId
        ) as FieldType;

        // Convert table names to singular if they are plural
        const singularSourceTableName: string = pluralize.isPlural(sourceTable.name)
            ? pluralize.singular(sourceTable.name)
            : sourceTable.name;

        const singularTargetTableName: string = pluralize.isPlural(targetTable.name)
            ? pluralize.singular(targetTable.name)
            : targetTable.name;

        // Create a foreign key field pointing to the source table
        const junctionSourceField: FieldType = {
            id: v4(),
            name: `${singularSourceTableName}_${sourceField.name}`,
            nullable: false,
            typeId: sourceField.typeId,
            type: sourceField.type,
            isPrimary: true
        } as FieldType;

        // Create a foreign key field pointing to the target table
        const junctionTargetField: FieldType = {
            id: v4(),
            name: `${singularTargetTableName}_${targetField.name}`,
            nullable: false,
            typeId: targetField.typeId,
            type: targetField.type,
            isPrimary: true
        } as FieldType;

        // Define the new junction table combining both foreign keys
        const junctionTable: TableType = {
            id: v4(),
            name: `${singularSourceTableName}_${targetTable.name}`,
            fields: [
                junctionSourceField,
                junctionTargetField
            ]
        } as TableType;

        // Create a one-to-many relationship from the source table to the junction table
        const junctionSourceRelationship: RelationshipType = {
            id: v4(),
            sourceTable: sourceTable,
            targetTable: junctionTable,
            sourceTableId: sourceTable.id,
            targetTableId: junctionTable.id,

            sourceField: sourceField,
            sourceFieldId: sourceField.id,
            targetField: junctionSourceField,
            targetFieldId: junctionSourceField.id,

            cardinality: Cardinality.one_to_many,
            onDelete: ForeignKeyActions.CASCADE
        } as RelationshipType;

        // Create a one-to-many relationship from the target table to the junction table
        const junctionTargetRelationship: RelationshipType = {
            id: v4(),
            sourceTable: targetTable,
            targetTable: junctionTable,
            sourceTableId: targetTable.id,
            targetTableId: junctionTable.id,

            sourceField: targetField,
            sourceFieldId: targetField.id,
            targetField: junctionTargetField,
            targetFieldId: junctionTargetField.id,

            cardinality: Cardinality.one_to_many,
            onDelete: ForeignKeyActions.CASCADE
        } as RelationshipType;

        // Add the new junction table and the two relationships to the database
        tables.push(junctionTable);
        relationships.push(junctionSourceRelationship);
        relationships.push(junctionTargetRelationship);
    }

    // Return the updated database object with the new junction tables and relationships added
    return {
        ...database,
        tables,
        relationships
    };
}