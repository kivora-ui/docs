"use client";
import { useT } from "../../_lib/i18n/provider";
import React, { useEffect, useMemo, useRef, useState } from "react";
import * as Kivora from "@kivora/nextjs";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  AreaChart,
  Area,
} from "recharts";
import { LiveProvider, LivePreview, LiveError } from "react-live";
import {
  Check,
  Heart,
  Search,
  Code2,
  Copy,
  Monitor,
  RotateCcw,
  Smartphone,
} from "lucide-react";
import type { PlaygroundProps } from "./playground";
import styles from "../docs.module.css";
import { CodeEditor } from "./code-editor";
import { HighlightedCode } from "./highlighted-code";
const lucideIcons = { Check, Heart, Search };
const scope = {
  ...lucideIcons,
  ...Kivora,
  Code: HighlightedCode,
  React,
  useState,
  useEffect,
  useMemo,
  useRef,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  AreaChart,
  Area,
};
const controlNames = [
  "variant",
  "size",
  "disabled",
  "placeholder",
  "showValue",
  "value",
  "max",
  "min",
  "step",
  "ratio",
  "animate",
  "showCount",
  "autoResize",
  "copyable",
  "showLineNumbers",
  "orientation",
  "align",
  "label",
];
function sourceFile(code: string) {
  const symbols = Object.keys(Kivora).filter((name) =>
    new RegExp(`\\b${name}\\b`).test(code),
  );
  const hooks = ["useState", "useEffect", "useRef", "useMemo"].filter((name) =>
    new RegExp(`\\b${name}\\b`).test(code),
  );
  const charts = [
    "BarChart",
    "Bar",
    "LineChart",
    "Line",
    "XAxis",
    "YAxis",
    "CartesianGrid",
    "AreaChart",
    "Area",
  ].filter((name) => new RegExp(`\\b${name}\\b`).test(code));
  const icons = Object.keys(lucideIcons).filter((name) =>
    new RegExp(`\\b${name}\\b`).test(code),
  );
  const imports = [
    '"use client";',
    ...(icons.length
      ? [`import { ${icons.join(", ")} } from "lucide-react";`]
      : []),
    ...(hooks.length ? [`import { ${hooks.join(", ")} } from "react";`] : []),
    ...(symbols.length
      ? [`import { ${symbols.join(", ")} } from "@kivora/nextjs";`]
      : []),
    ...(charts.length
      ? [`import { ${charts.join(", ")} } from "recharts";`]
      : []),
  ];
  return `${imports.join("\n")}\n\n${code.trim().startsWith("function ") ? `export default ${code}` : `export default function Example() {\n  return (\n    ${code}\n  );\n}`}`;
}
export default function LivePlayground({ doc, props }: PlaygroundProps) {
  const t = useT();
  const [story, setStory] = useState(0);
  const [code, setCode] = useState(doc.code);
  const [narrow, setNarrow] = useState(false);
  const [copied, setCopied] = useState("");
  const stories = [{ name: t("Básico"), code: doc.code }, ...doc.stories];
  const controls = props
    .filter(
      (prop) =>
        controlNames.includes(prop.name) &&
        (prop.type === "boolean" ||
          prop.type === "string" ||
          prop.type === "number" ||
          /^"[^"]+"( \| .+)*$/.test(prop.type)),
    )
    .slice(0, 8);
  const root = doc.exports[0];
  function updateProp(
    name: string,
    value: string,
    kind: "string" | "boolean" | "number",
  ) {
    const opening = new RegExp(`<${root}(?=[\\s/>])([^>]*?)(\\s*/?>)`);
    setCode((current) =>
      current.replace(opening, (match, attrs, ending) => {
        const attrPattern = new RegExp(
          `\\s+${name}(?:=(?:"[^"]*"|'[^']*'|\\{[^}]*\\}))?(?=\\s|$)`,
          "g",
        );
        const next =
          kind === "string"
            ? `${name}=${JSON.stringify(value)}`
            : `${name}={${kind === "number" ? (Number.isFinite(Number(value)) ? Number(value) : 0) : value}}`;
        return `<${root}${attrs.replace(attrPattern, "")} ${next}${ending}`;
      }),
    );
  }
  function propValue(name: string) {
    const match = code.match(
      new RegExp(
        `<${root}(?=[\\s/>])[^>]*?\\s${name}(?:="([^"]*)"|=\\{([^}]*)\\})?(?=\\s|/?>)`,
      ),
    );
    return match ? (match[1] ?? match[2] ?? "true") : "";
  }
  async function copy() {
    try {
      await navigator.clipboard.writeText(sourceFile(code));
      setCopied(t("Copiado"));
    } catch {
      setCopied(t("No se pudo copiar"));
    }
    window.setTimeout(() => setCopied(""), 2000);
  }
  return (
    <div className={styles.playground}>
      <div className={styles.playToolbar}>
        <div
          className={styles.storyTabs}
          role="group"
          aria-label={t("Ejemplos del componente")}
        >
          {stories.map((item, index) => (
            <button
              key={item.name}
              aria-pressed={story === index}
              onClick={() => {
                setStory(index);
                setCode(item.code);
              }}
            >
              {item.name}
            </button>
          ))}
        </div>
        <div className={styles.previewActions}>
          <button
            aria-label={narrow ? t("Vista de escritorio") : t("Vista móvil")}
            aria-pressed={narrow}
            onClick={() => setNarrow(!narrow)}
          >
            {narrow ? <Smartphone size={15} /> : <Monitor size={15} />}
          </button>
          <button
            aria-label={t("Restablecer ejemplo")}
            onClick={() => setCode(stories[story].code)}
          >
            <RotateCcw size={14} />
          </button>
        </div>
      </div>
      <LiveProvider code={code} scope={scope} enableTypeScript>
        <div className={styles.previewCanvas} data-narrow={narrow}>
          <span className={styles.previewCaption}>
            <i />
            {t("VISTA PREVIA EN DIRECTO")}
          </span>
          <LivePreview className={styles.preview} data-testid="live-preview" />
        </div>
        <LiveError
          data-testid="playground-error"
          className={styles.liveError}
          role="alert"
        />
      </LiveProvider>
      {controls.length > 0 && (
        <details className={styles.propControls} open>
          <summary>
            {t("Propiedades")}
            <span>{t("Ajusta el componente sin escribir código")}</span>
          </summary>
          <div>
            {controls.map((prop) => (
              <label key={prop.name}>
                <span>{prop.name}</span>
                {prop.type === "boolean" ? (
                  <input
                    type="checkbox"
                    checked={propValue(prop.name) === "true"}
                    onChange={(event) =>
                      updateProp(
                        prop.name,
                        String(event.target.checked),
                        "boolean",
                      )
                    }
                  />
                ) : prop.type.includes('"') ? (
                  <select
                    value={propValue(prop.name)}
                    onChange={(event) =>
                      updateProp(prop.name, event.target.value, "string")
                    }
                  >
                    <option value="" disabled>
                      {t("Por defecto")}
                    </option>
                    {[...prop.type.matchAll(/"([^"]+)"/g)].map(
                      (match, index) => (
                        <option key={`${match[1]}-${index}`} value={match[1]}>
                          {match[1]}
                        </option>
                      ),
                    )}
                  </select>
                ) : (
                  <input
                    aria-label={t("Propiedad {0}", { 0: prop.name })}
                    type={prop.type === "number" ? "number" : "text"}
                    value={propValue(prop.name)}
                    placeholder={t("Por defecto")}
                    onChange={(event) =>
                      updateProp(
                        prop.name,
                        event.target.value,
                        prop.type === "number" ? "number" : "string",
                      )
                    }
                  />
                )}
              </label>
            ))}
          </div>
        </details>
      )}
      <div className={styles.editorHeader}>
        <span>
          <Code2 size={14} />
          {t("Código editable")}
          <small>JSX</small>
        </span>
        <button onClick={copy} aria-label={t("Copiar ejemplo completo")}>
          {copied === t("Copiado") ? <Check size={14} /> : <Copy size={14} />}
          <span aria-live="polite">{copied || t("Copiar")}</span>
        </button>
      </div>
      <CodeEditor code={code} onChange={setCode} name={doc.name} />
      <div className={styles.editorHint}>
        {t(
          "Edita el JSX y observa el resultado. Kivora, los hooks de React y los gráficos del ejemplo ya están importados. «Copiar» incluye los imports.",
        )}
      </div>
    </div>
  );
}
