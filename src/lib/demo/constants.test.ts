import { describe, expect, it } from "vitest";
import {
  GENRES,
  PLANS,
  PRICE_CENTS_BY_PLAN,
  STATUS_LABEL,
  SUBSCRIBER_STATUSES,
  TYPES,
} from "./constants";

describe("demo constants", () => {
  it("lists every plan exactly once and prices all of them", () => {
    expect(PLANS).toEqual(["Básico", "Estándar", "Premium"]);
    expect(new Set(PLANS).size).toBe(PLANS.length);
    for (const plan of PLANS) {
      expect(Number.isInteger(PRICE_CENTS_BY_PLAN[plan])).toBe(true);
    }
    expect(Object.keys(PRICE_CENTS_BY_PLAN)).toHaveLength(PLANS.length);
  });

  it("lists the three distinct subscriber statuses and labels all of them", () => {
    expect(SUBSCRIBER_STATUSES).toEqual(["active", "paused", "cancelled"]);
    expect(new Set(SUBSCRIBER_STATUSES).size).toBe(SUBSCRIBER_STATUSES.length);
    for (const status of SUBSCRIBER_STATUSES) {
      expect(typeof STATUS_LABEL[status]).toBe("string");
    }
    expect(Object.keys(STATUS_LABEL)).toHaveLength(SUBSCRIBER_STATUSES.length);
  });

  it("lists every genre and title type exactly once", () => {
    expect(GENRES).toEqual(["Acción", "Drama", "Documental", "Ciencia ficción", "Animación"]);
    expect(new Set(GENRES).size).toBe(GENRES.length);
    expect(TYPES).toEqual(["Película", "Serie"]);
    expect(new Set(TYPES).size).toBe(TYPES.length);
  });
});
