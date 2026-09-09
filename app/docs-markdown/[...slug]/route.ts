import { documents, documentText, llmsIndex, markdownHref, textResponse } from "../../_lib/docs-markdown";
export const dynamic = "force-static";
export function generateStaticParams() {
  return ["index.md", "componentes.md", ...documents.map(doc => markdownHref(doc.path).replace("/docs-markdown/", ""))].map(path => ({ slug: path.split("/") }));
}
export async function GET(_request: Request, { params }: { params: Promise<{ slug: string[] }> }) {
  const path = `/docs-markdown/${(await params).slug.join("/")}`;
  if (path === "/docs-markdown/index.md" || path === "/docs-markdown/componentes.md") return textResponse(llmsIndex(), path.endsWith("/index.md") ? "/docs" : "/docs/componentes");
  const doc = documents.find(doc => markdownHref(doc.path) === path);
  return doc ? textResponse(documentText(doc), doc.path) : new Response("Documento no encontrado", { status: 404 });
}
