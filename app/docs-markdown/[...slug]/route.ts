import {
  getDocuments,
  documentText,
  llmsIndex,
  markdownHref,
  textResponse,
} from "../../_lib/docs-markdown";
import { getLocale } from "../../_lib/i18n/server";
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string[] }> },
) {
  const locale = await getLocale();
  const path = `/docs-markdown/${(await params).slug.join("/")}`;
  if (
    path === "/docs-markdown/index.md" ||
    path === "/docs-markdown/componentes.md"
  )
    return textResponse(
      llmsIndex(locale),
      path.endsWith("/index.md") ? "/docs" : "/docs/componentes",
      locale,
    );
  const doc = getDocuments(locale).find(
    (doc) => markdownHref(doc.path) === path,
  );
  return doc
    ? textResponse(documentText(doc, locale), doc.path, locale)
    : new Response(
        locale === "es" ? "Documento no encontrado" : "Document not found",
        { status: 404 },
      );
}
