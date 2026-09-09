"use client";

import { HighlightedCode } from "./highlighted-code";
import { useDocsTheme } from "./docs-shell";
import styles from "../docs.module.css";

function detectLanguage(code: string, label: string) {
  if (/\.css\b/i.test(label) || /^\s*(@import|:root|\.[\w-]+\s*\{)/m.test(code))
    return "css";
  if (/\.json\b/i.test(label)) return "json";
  if (/^\s*(npm |npx |pnpm |yarn |#)/m.test(code)) return "bash";
  if (/\.m?js\b/i.test(label)) return "javascript";
  return "tsx";
}

export function CodeBlock({
  code,
  label = "Terminal",
  language,
}: {
  code: string;
  label?: string;
  language?: string;
}) {
  const { theme } = useDocsTheme();
  return (
    <HighlightedCode
      className={styles.codeBlock}
      filename={label}
      language={language ?? detectLanguage(code, label)}
      theme={theme === "dark" ? "dark" : "light"}
      showLineNumbers
      copyable
      wrapLongLines={false}
    >
      {code}
    </HighlightedCode>
  );
}
