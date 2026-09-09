"use client";
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
  loading: () => (
    <div style={{ padding: 40, minHeight: 360 }} role="status">
      Preparando el playground…
    </div>
  ),
});
export function Playground(props: PlaygroundProps) {
  return <LivePlayground {...props} />;
}
