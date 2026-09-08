import { describe, expect, it } from "vitest";
import { monthlySignupsSeed, subscriberSeed, titleSeed } from "./seed";

describe("demo seed data", () => {
  it("has unique title ids and at least five playable titles", () => {
    const ids = titleSeed.map((title) => title.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(titleSeed.filter((title) => title.playerSource).length).toBeGreaterThanOrEqual(5);
    expect(titleSeed.length).toBe(12);
  });

  it("has unique subscriber ids and emails", () => {
    const ids = subscriberSeed.map((s) => s.id);
    const emails = subscriberSeed.map((s) => s.email);
    expect(new Set(ids).size).toBe(ids.length);
    expect(new Set(emails).size).toBe(emails.length);
    expect(subscriberSeed.length).toBe(20);
  });

  it("has a fixed 6-point monthly signups series", () => {
    expect(monthlySignupsSeed).toHaveLength(6);
    for (const point of monthlySignupsSeed) {
      expect(typeof point.month).toBe("string");
      expect(Number.isInteger(point.signups)).toBe(true);
    }
  });
});
