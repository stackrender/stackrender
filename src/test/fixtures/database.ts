import { getDataTypes } from "./data-types";

import { DatabaseDialect } from "@/lib/database";
import { ForeignKeyActions } from "@/lib/field";
import { DataType } from "@/lib/schemas/data-type-schema";
import { DatabaseType } from "@/lib/schemas/database-schema";
import { FieldType } from "@/lib/schemas/field-schema";
import { IndexType } from "@/lib/schemas/index-schema";
import { TableType } from "@/lib/schemas/table-schema";
import {
  Cardinality,
  RelationshipType,
} from "@/lib/schemas/relationship-schema";

// Pick a data type by preferred name, falling back to a category predicate.
// The seed arrays list types in dialect-specific order, so selecting by
// category alone would grab e.g. CHAR before VARCHAR or TINYINT before INTEGER;
// naming the canonical type keeps the rendered DDL representative per dialect.
const pick = (
  types: DataType[],
  names: string[],
  fallback: (t: DataType) => boolean,
): DataType => {
  for (const name of names) {
    const match = types.find((t) => t.name?.toLowerCase() === name);

    if (match) return match;
  }

  return types.find(fallback) as DataType;
};

// Resolve a representative type per category for a dialect, straight from the
// seed data types, so the fixture uses real type ids the renderer can hydrate.
const resolveTypes = (dialect: DatabaseDialect) => {
  const types = getDataTypes(dialect);
  const integer = pick(
    types,
    ["integer", "int", "number"],
    (t) => t.type === "integer" || t.type === "numeric",
  );
  const varchar = pick(
    types,
    ["varchar", "varchar2", "nvarchar", "character varying"],
    (t) => t.type === "text",
  );

  return { integer, varchar };
};

const field = (over: Partial<FieldType>): FieldType =>
  ({
    isPrimary: false,
    nullable: true,
    unique: false,
    autoIncrement: false,
    sequence: 0,
    ...over,
  }) as FieldType;

/**
 * A minimal but representative two-table schema (users, posts) with a
 * primary key, an auto-increment column, a NOT NULL UNIQUE text column with a
 * length, a DEFAULT, and a posts -> users foreign key. Ids are stable strings
 * so assertions and failures are readable. Relationship source/target objects
 * are left for prepareForMigration/optimizeOps to hydrate from the ids, exactly
 * as the app does before rendering.
 */
export const buildSampleDatabase = (dialect: DatabaseDialect): DatabaseType => {
  const { integer, varchar } = resolveTypes(dialect);

  const usersFields: FieldType[] = [
    field({
      id: "users.id",
      tableId: "users",
      name: "id",
      typeId: integer.id,
      isPrimary: true,
      nullable: false,
      autoIncrement: true,
    }),
    field({
      id: "users.email",
      tableId: "users",
      name: "email",
      typeId: varchar.id,
      nullable: false,
      unique: true,
      maxLength: 255,
    }),
    field({
      id: "users.status",
      tableId: "users",
      name: "status",
      typeId: varchar.id,
      nullable: false,
      maxLength: 20,
      defaultValue: "active",
    }),
  ];

  const postsFields: FieldType[] = [
    field({
      id: "posts.id",
      tableId: "posts",
      name: "id",
      typeId: integer.id,
      isPrimary: true,
      nullable: false,
      autoIncrement: true,
    }),
    field({
      id: "posts.user_id",
      tableId: "posts",
      name: "user_id",
      typeId: integer.id,
      nullable: false,
    }),
    field({
      id: "posts.title",
      tableId: "posts",
      name: "title",
      typeId: varchar.id,
      nullable: false,
      maxLength: 255,
    }),
  ];

  const users = {
    id: "users",
    name: "users",
    fields: usersFields,
    indices: [] as IndexType[],
    sequence: 0,
  } as TableType;

  const posts = {
    id: "posts",
    name: "posts",
    fields: postsFields,
    indices: [] as IndexType[],
    sequence: 1,
  } as TableType;

  const tables: TableType[] = [users, posts];

  // Embed the source/target table and field objects the way the app's data
  // layer hands them to the renderer. The SQLite renderer orders tables up
  // front by reading relationship.sourceTable / targetTable off the original
  // database (before prepareForMigration re-hydrates), so these must be present.
  const relationships: RelationshipType[] = [
    {
      id: "rel_posts_users",
      name: null,
      sourceTableId: "users",
      targetTableId: "posts",
      sourceFieldId: "users.id",
      targetFieldId: "posts.user_id",
      sourceTable: users,
      targetTable: posts,
      sourceField: usersFields[0],
      targetField: postsFields[1],
      cardinality: Cardinality.one_to_many,
      onDelete: ForeignKeyActions.CASCADE,
      databaseId: "db",
    } as RelationshipType,
  ];

  return {
    id: "db",
    name: "testdb",
    dialect,
    numOfTables: tables.length,
    createdAt: null,
    tables,
    relationships,
  } as DatabaseType;
};
