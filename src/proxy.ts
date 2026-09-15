import { randomBytes } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { database } from "./lib/profile-store";
import { authSettings } from "./lib/auth";
import { contentSecurityPolicy, requestLimitKey, requestLimitQuery, requestPolicy, trustedClientIp } from "./lib/request-security";

export async function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const policy = requestPolicy(path, request.method);
  if (policy && !path.startsWith("/api/cron/")) {
    try {
      const settings = authSettings();
      const ip = trustedClientIp(request.headers, process.env.VERCEL === "1");
      const key = requestLimitKey(settings.secret, policy.bucket, ip);
      const rows = await database().$queryRaw<unknown[]>(requestLimitQuery(key, policy.max, policy.seconds));
      if (!rows.length) return new NextResponse("Too many requests", { status: 429, headers: { "Retry-After": String(policy.seconds), "Cache-Control": "no-store" } });
    } catch {
      return new NextResponse("Temporarily unavailable", { status: 503, headers: { "Retry-After": "30", "Cache-Control": "no-store" } });
    }
  }
  if (path.startsWith("/api/") || path.startsWith("/oauth/")) return NextResponse.next();
  const nonce = randomBytes(24).toString("base64");
  const csp = contentSecurityPolicy(nonce, process.env.NODE_ENV === "development");
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-nonce", nonce);
  requestHeaders.set("Content-Security-Policy", csp);
  const response = NextResponse.next({ request: { headers: requestHeaders } });
  response.headers.set("Content-Security-Policy", csp);
  response.headers.set("Cache-Control", "private, no-store");
  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|images/|favicon.ico|robots.txt|sitemap.xml).*)"],
};