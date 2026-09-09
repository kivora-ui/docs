import {
  getDocuments,
  documentText,
  llmsIndex,
  textResponse,
} from "../_lib/docs-markdown";
import { getLocale } from "../_lib/i18n/server";
export async function GET() {
  const locale = await getLocale();
  return textResponse(
    [
      llmsIndex(locale),
      ...getDocuments(locale).map((doc) => documentText(doc, locale)),
    ].join("\n\n---\n\n"),
    undefined,
    locale,
  );
}
