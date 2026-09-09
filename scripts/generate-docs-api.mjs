import ts from "typescript";
import fs from "node:fs";
import path from "node:path";
const entry = path.resolve("node_modules/@kivora/nextjs/dist/index.d.ts");
const program = ts.createProgram([entry], {
  target: ts.ScriptTarget.ESNext,
  module: ts.ModuleKind.NodeNext,
  moduleResolution: ts.ModuleResolutionKind.NodeNext,
  skipLibCheck: true,
  strict: true,
  esModuleInterop: true,
});
const checker = program.getTypeChecker();
const source = program.getSourceFile(entry);
const exports = checker.getExportsOfModule(checker.getSymbolAtLocation(source));
const common = new Set([
  "children",
  "className",
  "style",
  "id",
  "disabled",
  "value",
  "defaultValue",
  "onChange",
  "onClick",
  "type",
  "name",
  "placeholder",
  "required",
  "min",
  "max",
  "step",
  "maxLength",
  "rows",
  "htmlFor",
  "aria-label",
  "onSubmit",
  "src",
  "alt",
  "role",
  "tabIndex",
  "title",
  "checked",
  "defaultChecked",
  "autoComplete",
]);
const result = {};
for (let symbol of exports) {
  const name = symbol.name;
  if (!/^[A-Z]/.test(name) || /Props$|Controller$/.test(name)) continue;
  if (symbol.flags & ts.SymbolFlags.Alias)
    symbol = checker.getAliasedSymbol(symbol);
  if (!(symbol.flags & ts.SymbolFlags.Value)) continue;
  const declaration = symbol.valueDeclaration ?? symbol.declarations?.[0];
  if (!declaration) continue;
  const type = checker.getTypeOfSymbolAtLocation(symbol, declaration);
  const signatures = checker.getSignaturesOfType(type, ts.SignatureKind.Call);
  if (!signatures.length) continue;
  const properties = new Map();
  for (const signature of signatures) {
    const parameter = signature.parameters[0];
    if (!parameter) continue;
    const props = checker.getTypeOfSymbolAtLocation(parameter, declaration);
    const variants = props.isUnion() ? props.types : [props];
    for (const variant of variants)
      for (const prop of checker.getPropertiesOfType(variant)) {
        if (["key", "ref"].includes(prop.name)) continue;
        const declarations = prop.declarations ?? [];
        const isDOM =
          declarations.length &&
          declarations.every((d) =>
            d.getSourceFile().fileName.includes("@types/react/"),
          );
        if (isDOM && !common.has(prop.name)) continue;
        const propType = checker.getTypeOfSymbolAtLocation(
          prop,
          declarations[0] ?? declaration,
        );
        const nonNullable = checker.getNonNullableType(propType);
        const literals = nonNullable.isUnion()
          ? nonNullable.types
          : [nonNullable];
        const typeText = literals.every((type) => type.isStringLiteral())
          ? literals.map((type) => JSON.stringify(type.value)).join(" | ") +
            (propType.isUnion() &&
            propType.types.some((type) => type.flags & ts.TypeFlags.Null)
              ? " | null"
              : "")
          : checker
              .typeToString(
                propType,
                undefined,
                ts.TypeFormatFlags.NoTruncation,
              )
              .replace(/ \| undefined/g, "");
        const existing = properties.get(prop.name);
        properties.set(prop.name, {
          name: prop.name,
          type:
            existing && existing.type !== typeText
              ? `${existing.type} | ${typeText}`
              : typeText,
          required: !(prop.flags & ts.SymbolFlags.Optional),
          description: ts.displayPartsToString(
            prop.getDocumentationComment(checker),
          ),
        });
      }
  }
  result[name] = {
    props: [...properties.values()].sort(
      (a, b) =>
        Number(b.required) - Number(a.required) || a.name.localeCompare(b.name),
    ),
    declaration: declaration.getText(),
  };
}
fs.writeFileSync(
  "app/docs/api.generated.json",
  JSON.stringify(result, null, 2) + "\n",
);
console.log(
  `Generated API for ${Object.keys(result).length} component exports.`,
);
