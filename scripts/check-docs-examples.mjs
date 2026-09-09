import ts from "typescript";
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const transpiled = ts.transpileModule(
  fs.readFileSync("app/docs/catalog.ts", "utf8"),
  {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022,
    },
  },
).outputText;
const mod = { exports: {} };
new Function("exports", "require", "module", transpiled)(
  mod.exports,
  require,
  mod,
);
const { components } = mod.exports;
const api = JSON.parse(fs.readFileSync("app/docs/api.generated.json", "utf8"));
const documented = new Set(
  components.flatMap((component) => component.exports),
);
const missing = Object.keys(api).filter((name) => !documented.has(name));
if (missing.length) {
  console.error("Exports without a family:", missing);
  process.exitCode = 1;
}
const names = [
  ...new Set([...documented, "useAudioPlayer", "UploadController", "toast"]),
];
const header = `import { Check, Heart, Search } from 'lucide-react';\nimport * as Kivora from '@kivora/nextjs';\nimport React, {useState,useEffect,useMemo,useRef} from 'react';\nimport { BarChart,Bar,LineChart,Line,XAxis,YAxis,CartesianGrid,AreaChart,Area } from 'recharts';\nconst {${names.join(",")}}=Kivora;\n`;
let source = header;
for (const [index, component] of components.entries())
  for (const [storyIndex, story] of [
    { name: "basic", code: component.code },
    ...component.stories,
  ].entries()) {
    source += `\n// ${component.name} / ${story.name}\nfunction Doc${index}Story${storyIndex}() {\n`;
    source += story.code.startsWith("function ")
      ? `${story.code}\n return <Example/>;`
      : `return (${story.code});`;
    source += "\n}\n";
  }
const filename = path.resolve("app/docs/.examples-check.tsx");
fs.writeFileSync(filename, source);
try {
  const program = ts.createProgram([filename], {
    target: ts.ScriptTarget.ESNext,
    module: ts.ModuleKind.ESNext,
    moduleResolution: ts.ModuleResolutionKind.Bundler,
    jsx: ts.JsxEmit.ReactJSX,
    strict: true,
    skipLibCheck: true,
    esModuleInterop: true,
    noEmit: true,
  });
  const errors = ts.getPreEmitDiagnostics(program);
  if (errors.length) {
    console.log(
      ts.formatDiagnosticsWithColorAndContext(errors, {
        getCurrentDirectory: () => process.cwd(),
        getCanonicalFileName: (f) => f,
        getNewLine: () => "\n",
      }),
    );
    process.exitCode = 1;
  } else
    console.log(
      `All examples typecheck across ${components.length} component families.`,
    );
} finally {
  fs.unlinkSync(filename);
}
