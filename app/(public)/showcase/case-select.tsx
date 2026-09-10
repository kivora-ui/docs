"use client";
import { useId, useState } from "react";
import { Select } from "@kivora/nextjs";
import { useT } from "../../_lib/i18n/provider";
export function CaseSelect({ label, value, options, onChange }: { label: string; value: string; options: { value: string; label: string }[]; onChange: (value: string) => void }) {
  const id = useId();
  const t = useT();
  const [host, setHost] = useState<HTMLDivElement | null>(null);
  return <div ref={setHost} style={{ minWidth: 0, width: "100%" }}><Select instanceId={id} inputId={id} aria-label={label} options={options} value={options.find(option => option.value === value)} onChange={option => { if (option) onChange(option.value); }} isSearchable={false} menuPortalTarget={host?.closest("dialog") ?? host?.closest(".kivora-theme") as HTMLElement | undefined} menuPosition="fixed" menuPlacement="auto" maxMenuHeight={200} noOptionsMessage={() => t("Sin resultados")} styles={{ control: base => ({ ...base, minHeight: 32, fontSize: 12, background: "var(--color-background)", borderColor: "var(--color-border)" }), singleValue: base => ({ ...base, color: "var(--color-foreground)" }), menu: base => ({ ...base, background: "var(--color-background)", color: "var(--color-foreground)", border: "1px solid var(--color-border)", fontSize: 12 }), menuPortal: base => ({ ...base, zIndex: 1000 }), option: (base, state) => ({ ...base, background: state.isFocused || state.isSelected ? "var(--color-secondary)" : "transparent", color: "var(--color-foreground)", cursor: "pointer" }) }} /></div>;
}
