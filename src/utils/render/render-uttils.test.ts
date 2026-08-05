import { describe, it, expect } from "vitest";

import {
  fixCharsetPlacement,
  fixSQLiteColumnOrder,
  getPostgresEnumName,
} from "./render-uttils";

import { FieldType } from "@/lib/schemas/field-schema";
import { TableType } from "@/lib/schemas/table-schema";

describe("fixCharsetPlacement", () => {
  it("moves CHARACTER SET / COLLATE directly after the column type", () => {
    const sql = [
      "CREATE TABLE users (",
      "name VARCHAR(255) NOT NULL CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,",
      "email TEXT",
      ")",
    ].join("\n");

    const out = fixCharsetPlacement(sql);

    expect(out).toContain(
      "name VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL",
    );
    // charset/collation must sit before the remaining attributes
    const line = out.split("\n").find((l) => l.includes("CHARACTER SET")) ?? "";

    expect(line.indexOf("CHARACTER SET")).toBeLessThan(
      line.indexOf("NOT NULL"),
    );
  });

  it("leaves columns without charset/collation untouched", () => {
    const sql = ["CREATE TABLE t (", "email TEXT", ")"].join("\n");

    expect(fixCharsetPlacement(sql)).toContain("email TEXT");
  });
});

describe("fixSQLiteColumnOrder", () => {
  it("reorders INTEGER PK attributes to PRIMARY KEY / AUTOINCREMENT / NOT NULL", () => {
    const sql = [
      "CREATE TABLE t (",
      "id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT",
      ")",
    ].join("\n");

    expect(fixSQLiteColumnOrder(sql)).toContain(
      "id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL",
    );
  });

  it("leaves non-primary-key INTEGER columns unchanged", () => {
    const sql = ["CREATE TABLE t (", "age INTEGER DEFAULT 0", ")"].join("\n");

    expect(fixSQLiteColumnOrder(sql)).toContain("age INTEGER DEFAULT 0");
  });
});

describe("getPostgresEnumName", () => {
  it("builds <table>_<lowercased field>_enum", () => {
    const table = { name: "Order" } as TableType;
    const field = { name: "Status" } as FieldType;

    expect(getPostgresEnumName(table, field)).toBe("Order_status_enum");
  });
});
