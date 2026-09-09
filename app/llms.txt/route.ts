import { llmsIndex, textResponse } from "../_lib/docs-markdown";
export const dynamic = "force-static";
export function GET() { return textResponse(llmsIndex()); }
