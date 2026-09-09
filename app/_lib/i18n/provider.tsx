"use client";
import {
  createContext,
  useContext,
  useTransition,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { localeCookie, translator, type Locale } from "./index";
const LocaleContext = createContext<Locale>("en");
export function LocaleProvider({
  locale,
  children,
}: {
  locale: Locale;
  children: ReactNode;
}) {
  return (
    <LocaleContext.Provider value={locale}>{children}</LocaleContext.Provider>
  );
}
export const useLocale = () => useContext(LocaleContext);
export const useT = () => translator(useLocale());
export function LanguagePicker() {
  const locale = useLocale();
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  return (
    <button
      className="language-picker"
      type="button"
      aria-label={locale === "es" ? "Cambiar a inglés" : "Switch to Spanish"}
      title={locale === "es" ? "Cambiar a inglés" : "Switch to Spanish"}
      aria-busy={pending}
      disabled={pending}
      onClick={() => {
        const next = locale === "es" ? "en" : "es";
        document.cookie = `${localeCookie}=${next}; Path=/; Max-Age=31536000; SameSite=Lax${location.protocol === "https:" ? "; Secure" : ""}`;
        startTransition(() => router.refresh());
      }}
    >
      <span aria-hidden="true">{locale.toUpperCase()}</span>
    </button>
  );
}
