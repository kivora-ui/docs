"use client";

import { Code, type CodeProps } from "@kivora/nextjs";
import { useEffect, useRef } from "react";
import styles from "./highlighted-code.module.css";
import { Light as SyntaxHighlighter } from "react-syntax-highlighter";
import typescript from "react-syntax-highlighter/dist/esm/languages/hljs/typescript";
import javascript from "react-syntax-highlighter/dist/esm/languages/hljs/javascript";
import xml from "react-syntax-highlighter/dist/esm/languages/hljs/xml";
import css from "react-syntax-highlighter/dist/esm/languages/hljs/css";
import bash from "react-syntax-highlighter/dist/esm/languages/hljs/bash";
import json from "react-syntax-highlighter/dist/esm/languages/hljs/json";

// Kivora's Code uses the light highlighter, which does not preload grammars.
for (const [name, grammar] of Object.entries({
  typescript,
  ts: typescript,
  tsx: typescript,
  javascript,
  js: javascript,
  jsx: javascript,
  xml,
  html: xml,
  css,
  bash,
  shell: bash,
  json,
})) {
  SyntaxHighlighter.registerLanguage(name, grammar);
}

export function HighlightedCode(props: CodeProps) {
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => {
    // Kivora exposes the root ref, but not SyntaxHighlighter's scroll container.
    // Make that actual container keyboard-scrollable, including in playgrounds.
    const scrollers = [...(root.current?.querySelectorAll("div") ?? [])]
      .filter(element => getComputedStyle(element).overflowX === "auto");
    for (const element of scrollers) {
      element.tabIndex = 0;
      element.setAttribute("role", "region");
      element.setAttribute("aria-label", `Código ${props.filename ?? props.language ?? "de ejemplo"}, desplazamiento horizontal`);
    }
  }, [props.children, props.filename, props.language, props.inline]);
  return <Code {...props} ref={root} data-code-theme={props.theme ?? "light"} className={`${styles.code} ${props.className ?? ""}`} />;
}
