"use client";
import { useT, useLocale } from "../../_lib/i18n/provider";
import dynamic from "next/dynamic";
import type { ComponentDoc } from "../catalog";
export type PropInfo = {
  name: string;
  type: string;
  required: boolean;
  description: string;
};
export type PlaygroundProps = { doc: ComponentDoc; props: PropInfo[] };
const LivePlayground = dynamic(() => import("./live-playground"), {
  ssr: false,
  loading: Loading,
});
function Loading() {
  const t = useT();
  return (
    <div style={{ padding: 40, minHeight: 360 }} role="status">
      {t("Preparando el playground…")}
    </div>
  );
}
export function Playground(props: PlaygroundProps) {
  const locale = useLocale();
  return <LivePlayground key={`${props.doc.slug}-${locale}`} {...props} />;
}
