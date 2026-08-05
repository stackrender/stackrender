import { describe, it, expect, beforeAll } from "vitest";
import { init } from "@guanmingchiu/sqlparser-ts";

import { DatabaseDialect } from "@/lib/database";
import { getImporter } from "@/utils/import/import-utils";
import { getRenderer } from "@/utils/render/render-uttils";
import { getDataTypes } from "@/test/fixtures/data-types";
import { DatabaseType } from "@/lib/schemas/database-schema";
import { TableType } from "@/lib/schemas/table-schema";
import { IndexType } from "@/lib/schemas/index-schema";
import { RelationshipType } from "@/lib/schemas/relationship-schema";
import { FieldType } from "@/lib/schemas/field-schema";

// Round-trip: parse DDL -> model -> render DDL -> parse again, and assert the
// two models are equal. This is the strongest integration check of the
// import/render pipeline. We compare a normalized model (names, resolved type
// names, key/constraint flags, relationships), not raw SQL, since formatting
// and identifier quoting legitimately differ.

type ParseResult = ReturnType<ReturnType<typeof getImporter>["parseSql"]>;

// Adapter: assemble a DatabaseType (what renderDDL consumes) from parseSql
// output (tables + id-based relationships). The app normally round-trips this
// through the SQLite database; here we build it in memory. Relationship
// source/target objects are embedded because the SQLite renderer reads them off
// the raw database when ordering tables.
const toDatabase = (
  dialect: DatabaseDialect,
  result: ParseResult,
): DatabaseType => {
  const tables = result.tables.map(
    (t) => ({ ...t, indices: [] as IndexType[] }) as TableType,
  );
  const table = (id: string) => tables.find((t) => t.id === id);
  const relationships = result.relationships.map((r) => {
    const source = table(r.sourceTableId);
    const target = table(r.targetTableId);

    return {
      ...r,
      databaseId: "db",
      sourceTable: source,
      targetTable: target,
      sourceField: source?.fields?.find((f) => f.id === r.sourceFieldId),
      targetField: target?.fields?.find((f) => f.id === r.targetFieldId),
    } as RelationshipType;
  });

  return {
    id: "db",
    name: "roundtrip",
    dialect,
    numOfTables: tables.length,
    createdAt: null,
    tables,
    relationships,
  } as DatabaseType;
};

const byName = (a: { name?: string | null }, b: { name?: string | null }) =>
  (a.name ?? "").localeCompare(b.name ?? "");

const normalize = (dialect: DatabaseDialect, result: ParseResult) => {
  const types = getDataTypes(dialect);
  const typeName = (id?: string | null) =>
    types.find((t) => t.id === id)?.name ?? null;
  const tableName = (id: string) =>
    result.tables.find((t) => t.id === id)?.name ?? id;
  const fieldName = (tableId: string, fieldId: string) =>
    result.tables
      .find((t) => t.id === tableId)
      ?.fields?.find((f: FieldType) => f.id === fieldId)?.name ?? fieldId;

  return {
    tables: [...result.tables].sort(byName).map((t) => ({
      name: t.name,
      columns: [...(t.fields ?? [])].sort(byName).map((f: FieldType) => ({
        name: f.name,
        type: typeName(f.typeId),
        isPrimary: !!f.isPrimary,
        // a primary key is non-nullable in every SQL dialect; canonicalize it.
        // (SQL Server renders the PK as a table constraint, and the importer
        // only forces NOT NULL for inline primary keys, so without this the
        // round-tripped nullable flag would spuriously differ for MSSQL.)
        nullable: f.isPrimary ? false : !!f.nullable,
        unique: !!f.unique,
        autoIncrement: !!f.autoIncrement,
        maxLength: f.maxLength ?? null,
        defaultValue: f.defaultValue ?? null,
      })),
    })),
    relationships: result.relationships
      .map((r) => ({
        source: `${tableName(r.sourceTableId)}.${fieldName(
          r.sourceTableId,
          r.sourceFieldId,
        )}`,
        target: `${tableName(r.targetTableId)}.${fieldName(
          r.targetTableId,
          r.targetFieldId,
        )}`,
        cardinality: r.cardinality,
        onDelete: r.onDelete ?? null,
      }))
      .sort((a, b) => (a.source + a.target).localeCompare(b.source + b.target)),
  };
};

interface RoundTripCase {
  name: string;
  dialect: DatabaseDialect;
  sql: string;
}

const cases: RoundTripCase[] = [
  {
    name: "MySQL",
    dialect: DatabaseDialect.MYSQL,
    sql: `
CREATE TABLE users (
  id INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  status VARCHAR(20) NOT NULL DEFAULT 'active'
);
CREATE TABLE posts (
  id INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY,
  user_id INTEGER NOT NULL,
  title VARCHAR(255) NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);`,
  },
  {
    name: "MariaDB",
    dialect: DatabaseDialect.MARIADB,
    sql: `
CREATE TABLE users (
  id INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  status VARCHAR(20) NOT NULL DEFAULT 'active'
);
CREATE TABLE posts (
  id INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY,
  user_id INTEGER NOT NULL,
  title VARCHAR(255) NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);`,
  },
  {
    name: "PostgreSQL",
    dialect: DatabaseDialect.POSTGRES,
    sql: `
CREATE TABLE users (
  id integer PRIMARY KEY,
  email varchar(255) NOT NULL UNIQUE,
  status varchar(20) NOT NULL DEFAULT 'active'
);
CREATE TABLE posts (
  id integer PRIMARY KEY,
  user_id integer NOT NULL,
  title varchar(255) NOT NULL,
  CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);`,
  },
  {
    name: "SQLite",
    dialect: DatabaseDialect.SQLITE,
    sql: `
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL DEFAULT 'active'
);
CREATE TABLE posts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  title TEXT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);`,
  },
  {
    name: "Oracle",
    dialect: DatabaseDialect.ORACLE,
    sql: `
CREATE TABLE users (
  id NUMBER PRIMARY KEY,
  email VARCHAR2(255) NOT NULL UNIQUE,
  status VARCHAR2(20) DEFAULT 'active' NOT NULL
);
CREATE TABLE posts (
  id NUMBER PRIMARY KEY,
  user_id NUMBER NOT NULL,
  title VARCHAR2(255) NOT NULL,
  CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users (id)
);`,
  },
  {
    name: "SQL Server",
    dialect: DatabaseDialect.MSSQL,
    sql: `
CREATE TABLE users (
  id INT IDENTITY(1,1) PRIMARY KEY,
  email NVARCHAR(255) NOT NULL UNIQUE,
  status NVARCHAR(20) NOT NULL DEFAULT 'active'
);
CREATE TABLE posts (
  id INT IDENTITY(1,1) PRIMARY KEY,
  user_id INT NOT NULL,
  title NVARCHAR(255) NOT NULL,
  CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users (id)
);`,
  },
];

describe("import -> render -> import round-trip", () => {
  beforeAll(async () => {
    await init();
  });

  for (const c of cases) {
    it(`${c.name} model is stable`, async () => {
      const first = getImporter(c.dialect, getDataTypes(c.dialect)).parseSql(
        c.sql,
      );

      // sanity: the seed actually produced the model we intend to round-trip
      expect(first.errors).toHaveLength(0);
      expect(first.tables).toHaveLength(2);
      expect(first.relationships).toHaveLength(1);

      const rendered = await getRenderer(
        c.dialect,
        getDataTypes(c.dialect),
      )!.renderDDL(toDatabase(c.dialect, first));

      const second = getImporter(c.dialect, getDataTypes(c.dialect)).parseSql(
        rendered,
      );

      expect(second.errors).toHaveLength(0);

      expect(normalize(c.dialect, second)).toEqual(normalize(c.dialect, first));
    });
  }
});
