import "server-only";
import { randomBytes } from "node:crypto";
import { cookies } from "next/headers";
import { getIronSession } from "iron-session";
import * as oidc from "openid-client";
import type { Locale } from "@/i18n/config";
import type { BnetLogin } from "./bnet-account";

const devFallback = globalThis as typeof globalThis & { soulmateDevSessionPassword?: string };

function sessionPassword() {
  const configured = process.env.SESSION_PASSWORD;
  if (configured && configured.length >= 32) return configured;
  if (process.env.NODE_ENV === "production") throw new Error("SESSION_PASSWORD required");
  // Dev-only ephemeral key: local sessions end when the server restarts.
  return (devFallback.soulmateDevSessionPassword ??= randomBytes(32).toString("hex"));
}

export function authSettings() {
  const origin = new URL(process.env.APP_URL || "http://localhost:3000");
  if (origin.pathname !== "/" || origin.search || origin.hash || origin.username || origin.password) throw new Error("Invalid APP_URL");
  if (origin.protocol !== "https:" && !(process.env.NODE_ENV !== "production" && origin.hostname === "localhost" && origin.protocol === "http:")) throw new Error("HTTPS required");
  const clientId = process.env.BNET_CLIENT_ID;
  const clientSecret = process.env.BNET_CLIENT_SECRET;
  if (!clientId || !clientSecret) throw new Error("Auth not configured");
  return { origin: origin.origin, redirectUri: `${origin.origin}/oauth/redirect`, clientId, clientSecret, password: sessionPassword(), secure: origin.protocol === "https:" };
}

export function authReady() {
  try { authSettings(); return true; } catch { return false; }
}

export async function authClient() {
  const settings = authSettings();
  return oidc.discovery(new URL("https://oauth.battle.net"), settings.clientId, settings.clientSecret, oidc.ClientSecretBasic(settings.clientSecret), { timeout: 10 });
}

type LoginTransaction = { state: string; nonce: string; verifier: string; createdAt: number; locale: Locale };
type IdentitySession = { subject: string; expiresAt: number; account?: BnetLogin };

export async function loginTransaction() {
  const settings = authSettings();
  return getIronSession<LoginTransaction>(await cookies(), {
    password: settings.password, cookieName: "soulmate_oauth", ttl: 600,
    cookieOptions: { httpOnly: true, secure: settings.secure, sameSite: "lax", path: "/" },
  });
}

export async function identitySession() {
  const settings = authSettings();
  return getIronSession<IdentitySession>(await cookies(), {
    password: settings.password, cookieName: "soulmate_session", ttl: 86400,
    cookieOptions: { httpOnly: true, secure: settings.secure, sameSite: "lax", path: "/" },
  });
}

export async function currentSubject() {
  if (!authReady()) return null;
  const session = await identitySession();
  return session.subject && session.expiresAt && session.expiresAt > Date.now() ? session.subject : null;
}