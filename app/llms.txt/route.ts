import { llmsIndex, textResponse } from "../_lib/docs-markdown";
import { getLocale } from "../_lib/i18n/server";
export async function GET() {
  const locale = await getLocale();
  return textResponse(llmsIndex(locale), undefined, locale);
}
