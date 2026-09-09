import { describe, it, expect } from "vitest";
import { resolveLocale, translator } from "./index";
import english from "./en.json";
import { components, guides } from "../../docs/catalog";
import { guideContent, propDescriptions } from "../../docs/content";
import examples from "../../docs/examples.en.json";
import { getDocs } from "../../docs/localized";

describe("locale negotiation", () => {
  it.each([
    [null, undefined, "en"],
    ["", undefined, "en"],
    ["es-ES,es;q=0.9", undefined, "es"],
    ["es-MX", undefined, "es"],
    ["en-GB,es;q=0.8", undefined, "en"],
    ["fr-FR,es;q=0.8", undefined, "en"],
    ["es;q=0.2,en;q=0.9", undefined, "en"],
    ["es;q=0,en;q=0.5", undefined, "en"],
    ["es;q=invalid", undefined, "en"],
    ["*", undefined, "en"],
    ["en", "es", "es"],
    ["es", "en", "en"],
    ["es", "fr", "es"],
    ["fr", "invalid", "en"],
  ])("resolves %s with preference %s as %s", (header, cookie, expected) => {
    expect(resolveLocale(header, cookie)).toBe(expected);
  });
  it("interpolates values without changing user-provided names", () => {
    expect(translator("en")("Editar a {0}", { 0: "Sofía Martín" })).toBe(
      "Edit Sofía Martín",
    );
  });
});
describe("documentation translations", () => {
  it("covers descriptions, usage, guide text and API explanations", () => {
    const strings = [
      ...components.flatMap((c) => [
        c.group,
        c.description,
        c.usage,
        ...(c.note ? [c.note] : []),
      ]),
      ...guides.flatMap((g) => [g.name, g.description]),
      ...Object.values(guideContent).flatMap((sections) =>
        sections.flatMap((s) => [
          s.title,
          ...(s.paragraphs ?? []),
          ...(s.bullets ?? []),
          ...(s.links ?? []).map((l) => l.label),
        ]),
      ),
      ...Object.values(propDescriptions),
    ];
    expect(strings.filter((s) => !(s in english))).toEqual([]);
  });
  it("preserves paths and original Spanish data when translating examples", () => {
    const es = getDocs("es");
    const en = getDocs("en");
    for (const doc of es.components) {
      for (const code of [doc.code, ...doc.stories.map(story => story.code)]) expect(code in examples).toBe(true);
    }
    expect(en.components.map((c) => c.slug)).toEqual(
      es.components.map((c) => c.slug),
    );
    expect(en.guides.map((g) => g.slug)).toEqual(es.guides.map((g) => g.slug));
    expect(en.components.find((c) => c.name === "Button")?.code).toContain(
      "Create project",
    );
    expect(es.components.find((c) => c.name === "Button")?.code).toContain(
      "Crear proyecto",
    );
    expect(en.components.find((c) => c.name === "FileUpload")?.code).toContain(
      'locale="en"',
    );
  });
});
