"use client";

import { Code } from "@kivora/nextjs";
import { usePreferences } from "@/providers/app-providers";

export function InstallSnippet() {
  const { dictionary } = usePreferences();

  return (
    <section className="mx-auto max-w-3xl px-6 py-16 text-center">
      <h2 className="text-2xl font-bold text-foreground">{dictionary.install.heading}</h2>
      <p className="mt-2 text-muted-foreground">{dictionary.install.description}</p>
      <div className="mt-6 text-left">
        <Code language="bash" copyable filename="terminal">
          {"npx @kivora/init"}
        </Code>
      </div>
    </section>
  );
}
