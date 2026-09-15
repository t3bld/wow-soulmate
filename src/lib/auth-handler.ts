import { auth } from "./auth";
import { bnetLoginContext } from "./better-auth";
import { createRedditReceipt, redditEventCookie, redditEventLifetime } from "./reddit-events";
import { queueMetaConversion, queueRedditConversion } from "./reddit-events-server";

const allowedPaths = new Set(["/sign-in/social", "/callback/battlenet", "/get-session", "/sign-out", "/list-sessions", "/revoke-session", "/revoke-other-sessions", "/revoke-sessions"]);

export async function handleAuth(request: Request) {
  const path = new URL(request.url).pathname.replace(/^\/api\/auth/, "");
  if (!allowedPaths.has(path)) return new Response(null, { status: 404 });
  let body: unknown;
  if (request.method === "POST") {
    const reader = request.body?.getReader();
    const chunks: Uint8Array[] = [];
    let size = 0;
    if (reader) while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > 8192) { void reader.cancel(); return new Response(null, { status: 413 }); }
      chunks.push(value);
    }
    try { body = JSON.parse(Buffer.concat(chunks).toString("utf8")); } catch { return new Response(null, { status: 400 }); }
    if (!body || typeof body !== "object" || Array.isArray(body)) return new Response(null, { status: 400 });
    request = new Request(request.url, { method: "POST", headers: request.headers, body: JSON.stringify(body) });
  }
  if (path === "/sign-in/social") {
    if (request.method !== "POST") return new Response(null, { status: 405 });
    const input = body as Record<string, unknown>;
    if (input.provider !== "battlenet" || "idToken" in input || "scopes" in input || "additionalParams" in input) return new Response(null, { status: 400 });
  }
  const requestHeaders = new Headers(request.headers);
  requestHeaders.delete("x-soulmate-client-ip");
  if (process.env.VERCEL !== "1") requestHeaders.set("x-soulmate-client-ip", "127.0.0.1");
  const context: NonNullable<ReturnType<typeof bnetLoginContext.getStore>> = {};
  const response = await bnetLoginContext.run(context, () => auth().handler(new Request(request, { headers: requestHeaders })));
  if (context.firstLogin) {
    const cookieHeader = request.headers.get("cookie") ?? "";
    const receipt = createRedditReceipt(cookieHeader);
    if (receipt) {
      response.headers.append("Set-Cookie", `${redditEventCookie("BnetLoginCompleted")}=${encodeURIComponent(receipt)}; Path=/; Max-Age=${redditEventLifetime}; SameSite=Lax${process.env.NODE_ENV === "production" ? "; Secure" : ""}`);
      queueRedditConversion("BnetLoginCompleted", receipt, cookieHeader);
      queueMetaConversion("BnetLoginCompleted", receipt, cookieHeader, "/oauth/redirect", request.headers.get("user-agent") ?? "");
    }
  }
  response.headers.set("Cache-Control", "private, no-store");
  response.headers.set("Referrer-Policy", "no-referrer");
  return response;
}