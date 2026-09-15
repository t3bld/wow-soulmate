import { createHmac } from "node:crypto";
import { isIP } from "node:net";
import ipaddr from "ipaddr.js";
import { Prisma } from "../generated/prisma/client";

export function contentSecurityPolicy(nonce: string, development = false) {
  if (!/^[A-Za-z0-9+/=_-]{20,128}$/.test(nonce)) throw new Error("Invalid CSP nonce");
  return [
    "default-src 'self'",
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic' https://www.redditstatic.com https://connect.facebook.net${development ? " 'unsafe-eval'" : ""}`,
    "script-src-attr 'none'",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob: https:",
    "font-src 'self'",
    `connect-src 'self' https://alb.reddit.com https://www.redditstatic.com https://connect.facebook.net https://www.facebook.com${development ? " ws: wss:" : ""}`,
    "object-src 'none'", "base-uri 'self'", "frame-ancestors 'none'", "frame-src 'none'",
    "form-action 'self' https://oauth.battle.net", "worker-src 'self' blob:",
    ...(!development ? ["upgrade-insecure-requests"] : []),
  ].join("; ");
}

export function trustedClientIp(headers: Headers, vercel: boolean) {
  if (!vercel) return "127.0.0.1";
  const value = headers.get("x-vercel-forwarded-for")?.trim();
  if (!value || !isIP(value)) throw new Error("Missing trusted client IP");
  const address = ipaddr.process(value);
  return address.kind() === "ipv6" ? ipaddr.IPv6.networkAddressFromCIDR(`${address.toString()}/64`).toString() : address.toString();
}

export function requestPolicy(path: string, method: string) {
  if (path === "/oauth/login" || path === "/api/auth/sign-in/social") return { bucket: "login", max: 10, seconds: 60 };
  if (path === "/oauth/redirect" || path.startsWith("/api/auth/")) return { bucket: "auth", max: 60, seconds: 60 };
  if (path === "/api/session") return { bucket: "session", max: 120, seconds: 60 };
  if (method !== "GET" && method !== "HEAD") return { bucket: "write", max: 30, seconds: 60 };
  if (/^\/[^/]+\/(profile|soulmates|addon)(\/|$)/.test(path)) return { bucket: "private-read", max: 90, seconds: 60 };
  return null;
}

export function requestLimitKey(secret: string, bucket: string, identifier: string) {
  if (secret.length < 32) throw new Error("Rate limit secret required");
  return createHmac("sha256", secret).update(JSON.stringify([bucket, identifier])).digest("hex");
}

export function requestLimitQuery(key: string, max: number, seconds: number) {
  if (!/^[a-f0-9]{64}$/.test(key) || !Number.isSafeInteger(max) || max < 1 || !Number.isSafeInteger(seconds) || seconds < 1 || seconds > 3600) throw new Error("Invalid rate limit");
  return Prisma.sql`INSERT INTO soulmate_request_rate_limits (key, count, "expiresAt")
    VALUES (${key}, 1, CURRENT_TIMESTAMP + ${seconds} * INTERVAL '1 second')
    ON CONFLICT (key) DO UPDATE SET
      count = CASE WHEN soulmate_request_rate_limits."expiresAt" <= CURRENT_TIMESTAMP THEN 1 ELSE soulmate_request_rate_limits.count + 1 END,
      "expiresAt" = CASE WHEN soulmate_request_rate_limits."expiresAt" <= CURRENT_TIMESTAMP THEN CURRENT_TIMESTAMP + ${seconds} * INTERVAL '1 second' ELSE soulmate_request_rate_limits."expiresAt" END
    WHERE soulmate_request_rate_limits."expiresAt" <= CURRENT_TIMESTAMP OR soulmate_request_rate_limits.count < ${max}
    RETURNING key`;
}