export * from "./types";
export { en } from "./en";
export { es } from "./es";

import type { Dictionary, Locale } from "./types";
import { en } from "./en";
import { es } from "./es";

export const dictionaries: Record<Locale, Dictionary> = { en, es };
