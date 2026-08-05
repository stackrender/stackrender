import { describe, it, expect } from "vitest";

import { DatabaseDialect } from "@/lib/database";
import { getRenderer } from "@/utils/render/render-uttils";
import { getDataTypes } from "@/test/fixtures/data-types";
import { buildSampleDatabase } from "@/test/fixtures/database";

// getRenderer().renderDDL() takes a DatabaseType and emits dialect DDL. It runs
// the migration diff (empty database -> the fixture), so the output is the full
// CREATE for every table plus the foreign key. Assertions match on substrings
// and quote-agnostic patterns rather than exact strings, since formatting and
// identifier quoting differ per dialect and are not what these tests pin down.

interface RenderCase {
  name: string;
  dialect: DatabaseDialect;
  // Dialect-specific spelling of an auto-increment / identity column.
  autoIncrement: RegExp;
  // Dialect-specific spelling of a variable-length string type.
  varchar: RegExp;
}

const cases: RenderCase[] = [
  {
    name: "MySQL",
    dialect: DatabaseDialect.MYSQL,
    autoIncrement: /AUTO_INCREMENT/,
    varchar: /VARCHAR\s*\(\s*255\s*\)/i,
  },
  {
    name: "MariaDB",
    dialect: DatabaseDialect.MARIADB,
    autoIncrement: /AUTO_INCREMENT/,
    varchar: /VARCHAR\s*\(\s*255\s*\)/i,
  },
  {
    name: "PostgreSQL",
    dialect: DatabaseDialect.POSTGRES,
    // auto-increment integers become SERIAL in Postgres
    autoIncrement: /SERIAL/,
    varchar: /VARCHAR\s*\(\s*255\s*\)/i,
  },
  {
    name: "SQLite",
    dialect: DatabaseDialect.SQLITE,
    autoIncrement: /AUTOINCREMENT/,
    // SQLite has no VARCHAR; the text column renders as TEXT
    varchar: /TEXT\s*\(\s*255\s*\)/i,
  },
  {
    name: "Oracle",
    dialect: DatabaseDialect.ORACLE,
    autoIncrement: /IDENTITY/,
    varchar: /VARCHAR2\s*\(\s*255\s*\)/i,
  },
  {
    name: "SQL Server",
    dialect: DatabaseDialect.MSSQL,
    autoIncrement: /IDENTITY/,
    varchar: /VARCHAR\s*\(\s*255\s*\)/i,
  },
];

const render = (dialect: DatabaseDialect): Promise<string> =>
  getRenderer(dialect, getDataTypes(dialect))!.renderDDL(
    buildSampleDatabase(dialect),
  );

describe("getRenderer().renderDDL - emitted DDL across dialects", () => {
  for (const c of cases) {
    describe(c.name, () => {
      it("creates both tables with their columns", async () => {
        const sql = await render(c.dialect);

        expect(sql).toMatch(/CREATE TABLE\s+[`"]?users[`"]?/i);
        expect(sql).toMatch(/CREATE TABLE\s+[`"]?posts[`"]?/i);
        for (const col of ["id", "email", "status", "user_id", "title"]) {
          expect(sql).toContain(col);
        }
      });

      it("emits primary key, unique and auto-increment", async () => {
        const sql = await render(c.dialect);

        expect(sql).toMatch(/PRIMARY KEY/i);
        expect(sql).toMatch(/UNIQUE/i);
        expect(sql).toMatch(c.autoIncrement);
      });

      it("emits the text column type with its length", async () => {
        const sql = await render(c.dialect);

        expect(sql).toMatch(c.varchar);
      });

      it("emits the DEFAULT value", async () => {
        const sql = await render(c.dialect);

        expect(sql).toMatch(/DEFAULT\s+'active'/i);
      });

      it("emits the foreign key from posts to users with ON DELETE CASCADE", async () => {
        const sql = await render(c.dialect);

        expect(sql).toMatch(/FOREIGN KEY\s*\(\s*user_id\s*\)/i);
        expect(sql).toMatch(/REFERENCES\s+[`"]?users[`"]?\s*\(\s*id\s*\)/i);
        expect(sql).toMatch(/ON DELETE CASCADE/i);
      });
    });
  }
});
