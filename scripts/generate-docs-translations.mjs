import fs from "node:fs";
import ts from "typescript";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const dictionary = JSON.parse(fs.readFileSync("app/_lib/i18n/en.json", "utf8"));
function load(file) {
  const loaded = { exports: {} };
  const output = ts.transpileModule(fs.readFileSync(file, "utf8"), {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022,
    },
  }).outputText;
  new Function("exports", "require", "module", output)(
    loaded.exports,
    require,
    loaded,
  );
  return loaded.exports;
}
const { components } = load("app/docs/catalog.ts");
const { guideContent } = load("app/docs/content.ts");
const examples = [
  ...components.flatMap((doc) => [
    doc.code,
    ...doc.stories.map((story) => story.code),
  ]),
  ...Object.values(guideContent).flatMap((sections) =>
    sections.flatMap((section) => (section.code ? [section.code] : [])),
  ),
];
const translations = {};
for (const source of examples) {
  const file = ts.createSourceFile(
    "example.tsx",
    source,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TSX,
  );
  const edits = [];
  function visit(node) {
    if (ts.isJsxText(node)) {
      const key = node.text.replace(/\s+/g, " ").trim();
      if (dictionary[key])
        edits.push([
          node.pos,
          node.end,
          `${/^\s/.test(node.text) ? " " : ""}${dictionary[key]}${/\s$/.test(node.text) ? " " : ""}`,
        ]);
    } else if (ts.isStringLiteral(node)) {
      const isLocale =
        ts.isJsxAttribute(node.parent) &&
        ["locale", "localeCode"].includes(node.parent.name.text);
      if (isLocale && node.text === "es")
        edits.push([node.getStart(file), node.end, '"en"']);
      else if (dictionary[node.text])
        edits.push([
          node.getStart(file),
          node.end,
          JSON.stringify(dictionary[node.text]),
        ]);
    }
    ts.forEachChild(node, visit);
  }
  visit(file);
  let translated = source;
  for (const [start, end, replacement] of edits.sort((a, b) => b[0] - a[0]))
    translated =
      translated.slice(0, start) + replacement + translated.slice(end);
  translations[source] = translated;
}
fs.writeFileSync(
  "app/docs/examples.en.json",
  `${JSON.stringify(translations, null, 2)}\n`,
);
console.log(`Generated ${Object.keys(translations).length} English examples.`);
