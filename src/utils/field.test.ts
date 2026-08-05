import { describe, it, expect } from "vitest";

import { cloneField, getNextSequence } from "./field";

import { FieldType } from "@/lib/schemas/field-schema";

// Minimal field factory. FieldType is a Drizzle-inferred row type with many
// columns; these helpers only read `sequence` (and copy the rest), so a partial
// cast keeps the fixtures focused on what is under test.
const makeField = (overrides: Partial<FieldType> = {}): FieldType =>
  ({
    id: "f1",
    tableId: "t1",
    name: "col",
    sequence: 0,
    ...overrides,
  }) as FieldType;

describe("getNextSequence", () => {
  it("returns 0 for an empty field list", () => {
    expect(getNextSequence([])).toBe(0);
  });

  it("returns max sequence + 1", () => {
    const fields = [
      makeField({ sequence: 0 }),
      makeField({ sequence: 5 }),
      makeField({ sequence: 2 }),
    ];

    expect(getNextSequence(fields)).toBe(6);
  });

  it("handles a single field", () => {
    expect(getNextSequence([makeField({ sequence: 4 })])).toBe(5);
  });
});

describe("cloneField", () => {
  it("assigns a fresh id and preserves other properties", () => {
    const original = makeField({
      id: "original-id",
      name: "email",
      sequence: 3,
    });
    const clone = cloneField(original);

    expect(clone.id).not.toBe(original.id);
    expect(clone.name).toBe("email");
    expect(clone.sequence).toBe(3);
    expect(clone.tableId).toBe(original.tableId);
  });

  it("does not mutate the source field", () => {
    const original = makeField({ id: "original-id" });

    cloneField(original);
    expect(original.id).toBe("original-id");
  });
});
