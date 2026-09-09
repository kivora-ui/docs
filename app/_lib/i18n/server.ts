import { cache } from "react";
import { cookies, headers } from "next/headers";
import { localeCookie, resolveLocale, translator } from "./index";
export const getLocale = cache(async () => {
  const [cookieStore, requestHeaders] = await Promise.all([
    cookies(),
    headers(),
  ]);
  return resolveLocale(
    requestHeaders.get("accept-language"),
    cookieStore.get(localeCookie)?.value,
  );
});
export async function getT() {
  return translator(await getLocale());
}
