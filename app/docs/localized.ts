import { components, guides, groups } from "./catalog";
import { guideContent, propDescriptions } from "./content";
import { translateData, type Locale } from "../_lib/i18n";
import englishCode from "./examples.en.json";
const source = { components, guides, groups, guideContent, propDescriptions };
const english = translateData(source, "en");
const code = (value: string) =>
  (englishCode as Record<string, string>)[value] ?? value;
for (const component of english.components) {
  component.code = code(component.code);
  component.stories = component.stories.map((story) => ({
    ...story,
    code: code(story.code),
  }));
}
for (const sections of Object.values(english.guideContent)) {
  for (const section of sections)
    if (section.code) section.code = code(section.code);
}
export function getDocs(locale: Locale) {
  return locale === "es" ? source : english;
}
