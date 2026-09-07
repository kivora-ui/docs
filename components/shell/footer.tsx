"use client";

import { usePreferences } from "@/app/providers";

const PACKAGES = [
  { name: "@kivora/nextjs", href: "https://www.npmjs.com/package/@kivora/nextjs" },
  { name: "@kivora/native", href: "https://www.npmjs.com/package/@kivora/native" },
  { name: "@kivora/theme", href: "https://www.npmjs.com/package/@kivora/theme" },
  { name: "@kivora/init", href: "https://www.npmjs.com/package/@kivora/init" },
] as const;

export function Footer() {
  const { dictionary } = usePreferences();

  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-10">
        <p className="text-sm font-semibold text-foreground">{dictionary.footer.packagesHeading}</p>
        <ul className="flex flex-wrap gap-4">
          {PACKAGES.map((pkg) => (
            <li key={pkg.name}>
              <a
                href={pkg.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                {pkg.name}
              </a>
            </li>
          ))}
        </ul>
        <p className="text-xs text-muted-foreground">{dictionary.footer.copyright}</p>
      </div>
    </footer>
  );
}
