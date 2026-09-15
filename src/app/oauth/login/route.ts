import { NextRequest } from "next/server";
import { authSettings } from "@/lib/auth";
import { handleAuth } from "@/lib/auth-handler";
import { defaultLocale, isLocale } from "@/i18n/config";
import { profileText } from "@/i18n/profile";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const requestedLocale = request.nextUrl.searchParams.get("locale") ?? "";
  const locale = isLocale(requestedLocale) ? requestedLocale : defaultLocale;
  if (request.headers.get("sec-fetch-site") === "cross-site") return new Response(null, { status: 403 });
  try {
    const { origin } = authSettings();
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("Content-Type", "application/json");
    requestHeaders.set("Origin", origin);
    const result = await handleAuth(new Request(`${origin}/api/auth/sign-in/social`, {
      method: "POST", headers: requestHeaders,
      body: JSON.stringify({ provider: "battlenet", callbackURL: `${origin}/${locale}/soulmates`, errorCallbackURL: `${origin}/${locale}?auth=failed` }),
    }));
    if (!result.ok) return result;
    const data = await result.json();
    const destination = new URL(data.url);
    if (destination.origin !== "https://oauth.battle.net") throw new Error("Unexpected provider");
    const responseHeaders = new Headers({ Location: destination.href, "Cache-Control": "no-store", "Referrer-Policy": "no-referrer" });
    for (const cookie of result.headers.getSetCookie()) responseHeaders.append("Set-Cookie", cookie);
    return new Response(null, { status: 303, headers: responseHeaders });
  } catch {
    return new Response(profileText[locale].notReady, { status: 503, headers: { "Cache-Control": "no-store", "Content-Type": "text/plain; charset=utf-8" } });
  }
}