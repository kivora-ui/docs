"use client";

import { useId } from "react";
import Editor from "react-simple-code-editor";
import { Highlight, themes } from "prism-react-renderer";
import { useDocsTheme } from "./docs-shell";
import styles from "../docs.module.css";

const accessibleLight = {
  plain: { color: "#383a42", backgroundColor: "transparent" },
  styles: [
    { types: ["comment", "prolog", "doctype", "cdata"], style: { color: "#595b64" } },
    { types: ["keyword", "operator"], style: { color: "#6f42a1" } },
    { types: ["string", "char", "regex"], style: { color: "#286638" } },
    { types: ["tag", "attr-name"], style: { color: "#a32f47" } },
    { types: ["function", "class-name"], style: { color: "#2457a7" } },
    { types: ["number", "boolean"], style: { color: "#875000" } },
  ],
};

export function CodeEditor({
  code,
  onChange,
  name,
}: {
  code: string;
  onChange: (code: string) => void;
  name: string;
}) {
  const { theme } = useDocsTheme();
  const editorId = useId();
  return (
    <div className={styles.editorScroll}>
      <label
        className="sr-only"
        htmlFor={editorId}
      >{`Código editable de ${name}`}</label>
      <Editor
        value={code}
        onValueChange={onChange}
        textareaId={editorId}
        textareaClassName={styles.editorInput}
        className={styles.editor}
        padding={{ top: 18, right: 20, bottom: 18, left: 58 }}
        tabSize={2}
        insertSpaces
        ignoreTabKey
        highlight={(source) => (
          <Highlight
            code={source}
            language="tsx"
            theme={theme === "dark" ? themes.oneDark : accessibleLight}
          >
            {({ tokens, getLineProps, getTokenProps }) => (
              <>
                {tokens.map((line, index) => (
                  <span
                    {...getLineProps({ line })}
                    className={styles.editorLine}
                    key={index}
                  >
                    <span className={styles.lineNumber} aria-hidden="true">
                      {index + 1}
                    </span>
                    {line.map((token, tokenIndex) => (
                      <span {...getTokenProps({ token })} key={tokenIndex}>
                        {token.empty ? " " : token.content}
                      </span>
                    ))}
                  </span>
                ))}
              </>
            )}
          </Highlight>
        )}
      />
    </div>
  );
}
