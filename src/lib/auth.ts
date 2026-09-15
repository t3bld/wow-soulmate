import "server-only";
import { randomBytes } from "node:crypto";
import { cookies, headers } from "next/headers";
import { after } from "next/server";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { createSoulmateAuth } from "./better-auth";
import { beginWowImport, database, saveBnetLogin, saveWowImport } from "./profile-store";
import { importWowAccount } from "./wow-import";
import { requestLimitKey, requestLimitQuery } from "./request-security";

const development = globalThis as typeof globalThis & { soulmateDevAuthSecret?: string };

export function authSettings() {
  const origin = new URL(process.env.APP_URL || "http://localhost:3000");
  if (origin.pathname !== "/" || origin.search || origin.hash || origin.username || origin.password) throw new Error("Invalid APP_URL");
  if (origin.protocol !== "https:" && !(process.env.NODE_ENV !== "production" && origin.hostname === "localhost" && origin.protocol === "http:")) throw new Error("HTTPS required");
  const clientId = process.env.BNET_CLIENT_ID;
  const clientSecret = process.env.BNET_CLIENT_SECRET;
  let secret = process.env.BETTER_AUTH_SECRET;
  if (!secret && process.env.NODE_ENV !== "production") secret = development.soulmateDevAuthSecret ??= randomBytes(32).toString("base64");
  if (!secret || secret.length < 32 || !clientId || !clientSecret || !process.env.DATABASE_URL) throw new Error("Auth not configured");
  return { origin: origin.origin, secret, clientId, clientSecret };
}

export function authReady() {
  try { authSettings(); return true; } catch { return false; }
}

let instance: ReturnType<typeof createSoulmateAuth> | undefined;
export function auth() {
  return instance ??= createSoulmateAuth({
    ...authSettings(),
    database: prismaAdapter(database(), { provider: "postgresql", transaction: true }),
    onLogin: async ({ subject, account, accessToken }) => {
      try {
        await saveBnetLogin(subject, account);
        const runId = await beginWowImport(subject);
        after(async () => {
          try { await importWowAccount(accessToken, { checkpoint: snapshot => saveWowImport(subject, runId, snapshot) }); }
          catch { console.error("WoW character import could not finish"); }
        });
      } catch { console.error("WoW character import could not start"); }
    },
  });
}

export async function currentIdentity() {
  if (!authReady()) return null;
  const requestHeaders = await headers();
  if (!requestHeaders.get("cookie")?.includes("soulmate.session_token=")) return null;
  const session = await auth().api.getSession({ headers: requestHeaders, query: { disableCookieCache: true } });
  if (!session) return null;
  const user = await database().user.findUnique({ where: { id: session.user.id } });
  if (!user) return null;
  const key = requestLimitKey(authSettings().secret, "account", user.id);
  if (!(await database().$queryRaw<unknown[]>(requestLimitQuery(key, 120, 60))).length) throw new Error("Account request limit reached");
  return {
    userId: user.id, subject: user.bnetSubject, session: session.session,
    account: { battleTag: user.bnetBattleTag, email: user.bnetEmail, emailVerified: user.bnetEmailVerified, loggedInAt: user.bnetLastLoginAt ?? user.createdAt.toISOString() },
  };
}

export async function currentSubject() {
  return (await currentIdentity())?.subject ?? null;
}

export async function endSession() {
  await auth().api.signOut({ headers: await headers() });
  const jar = await cookies();
  for (const name of ["__Host-soulmate.session_token", "soulmate.session_token", "__Host-soulmate_session", "soulmate_session"]) jar.delete(name);
}