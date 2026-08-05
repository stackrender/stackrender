import { describe, it, expect } from "vitest";

import { orderTables } from "./tables";

import { SortableTable } from "@/lib/table";

// `relationships` holds the ids of the tables this table depends on (its foreign
// keys / parents), so a valid topological order lists dependencies first.

describe("orderTables", () => {
  it("orders a dependency chain parent-first", () => {
    const tables: SortableTable[] = [
      { tableId: "C", relationships: ["B"] },
      { tableId: "A", relationships: [] },
      { tableId: "B", relationships: ["A"] },
    ];

    const order = orderTables(tables);

    expect(order).toHaveLength(3);
    expect(order.indexOf("A")).toBeLessThan(order.indexOf("B"));
    expect(order.indexOf("B")).toBeLessThan(order.indexOf("C"));
  });

  it("places a table after every dependency it references", () => {
    const tables: SortableTable[] = [
      { tableId: "orders", relationships: ["users", "products"] },
      { tableId: "users", relationships: [] },
      { tableId: "products", relationships: [] },
    ];

    const order = orderTables(tables);

    expect(order.indexOf("users")).toBeLessThan(order.indexOf("orders"));
    expect(order.indexOf("products")).toBeLessThan(order.indexOf("orders"));
  });

  it("throws a CircularDependencyError describing the cycle", () => {
    const tables: SortableTable[] = [
      { tableId: "A", relationships: ["B"] },
      { tableId: "B", relationships: ["A"] },
    ];

    let caught: unknown;

    try {
      orderTables(tables);
    } catch (error) {
      caught = error;
    }

    expect(caught).toBeDefined();
    const err = caught as {
      success: boolean;
      message: string;
      cycle: string[];
    };

    expect(err.success).toBe(false);
    expect(err.message).toBe("Cycle detected");
    expect(Array.isArray(err.cycle)).toBe(true);
    // the cycle is reported as a closed loop (first node repeated at the end)
    expect(err.cycle[0]).toBe(err.cycle[err.cycle.length - 1]);
    expect(err.cycle).toContain("A");
    expect(err.cycle).toContain("B");
  });
});
