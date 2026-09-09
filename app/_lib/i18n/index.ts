import english from "./en.json";
export type Locale = "es" | "en";
export const localeCookie = "kivora-locale";

/** Use the client's preferred language; unsupported preferences fall back to English. */
export function resolveLocale(
  acceptLanguage: string | null,
  preference?: string,
): Locale {
  if (preference === "es" || preference === "en") return preference;
  const languages = (acceptLanguage ?? "")
    .split(",")
    .map((entry, index) => {
      const [tag, ...params] = entry.trim().toLowerCase().split(";");
      const quality = params.find((param) => param.trim().startsWith("q="));
      const q = quality ? Number(quality.trim().slice(2)) : 1;
      return { tag, q, index };
    })
    .filter(
      (item) =>
        item.tag && Number.isFinite(item.q) && item.q > 0 && item.q <= 1,
    )
    .sort((a, b) => b.q - a.q || a.index - b.index);
  return /^es(?:-|$)/.test(languages[0]?.tag ?? "") ? "es" : "en";
}
export function translator(locale: Locale) {
  return (source: string, values?: Record<string, string | number>) => {
    const text =
      locale === "es"
        ? source
        : ((english as Record<string, string>)[source] ?? source);
    return values
      ? text.replace(/\{(\d+)\}/g, (match, key) => String(values[key] ?? match))
      : text;
  };
}
export function translateData<T>(value: T, locale: Locale): T {
  if (locale === "es") return value;
  const t = translator(locale);
  function visit(item: unknown, key = ""): unknown {
    if (typeof item === "string")
      return ["slug", "href", "icon", "code", "exports"].includes(key)
        ? item
        : t(item);
    if (Array.isArray(item)) return item.map((child) => visit(child, key));
    if (item && typeof item === "object")
      return Object.fromEntries(
        Object.entries(item).map(([key, child]) => [key, visit(child, key)]),
      );
    return item;
  }
  return visit(value) as T;
}
