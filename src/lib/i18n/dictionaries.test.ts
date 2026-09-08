import { describe, expect, it } from "vitest";
import { en } from "./en";
import { es } from "./es";

function collectKeyPaths(value: unknown, prefix = ""): string[] {
  if (typeof value !== "object" || value === null) {
    return [prefix];
  }
  return Object.entries(value as Record<string, unknown>).flatMap(([key, nested]) =>
    collectKeyPaths(nested, prefix ? `${prefix}.${key}` : key)
  );
}

describe("dictionaries", () => {
  it("en and es expose exactly the same set of keys", () => {
    expect(collectKeyPaths(es).sort()).toEqual(collectKeyPaths(en).sort());
  });
});
