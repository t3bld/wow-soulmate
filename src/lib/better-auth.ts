import { AsyncLocalStorage } from "node:async_hooks";
import { createHash } from "node:crypto";
import { betterAuth, type BetterAuthOptions } from "better-auth";
import { createAuthMiddleware } from "better-auth/api";
import { genericOAuth } from "better-auth/plugins";
import { decodeJwt } from "jose";
import { parseBnetAccount, type BnetLogin } from "./bnet-account";

type PendingLogin = { subject: string; account: BnetLogin; accessToken: string };
export const bnetLoginContext = new AsyncLocalStorage<{ login?: PendingLogin; createdUserId?: string; firstLogin?: boolean }>();

export function internalBnetEmail(subject: string) {
  return `${createHash("sha256").update(subject).digest("hex")}@bnet.invalid`;
}

export function withoutOAuthTokens() {
  return { accessToken: null, refreshToken: null, idToken: null, accessTokenExpiresAt: null, refreshTokenExpiresAt: null, password: null };
}

export function createSoulmateAuth(settings: {
  origin: string; secret: string; clientId: string; clientSecret: string;
  database: BetterAuthOptions["database"];
  onLogin?: (login: PendingLogin) => Promise<void>;
}) {
  const secure = settings.origin.startsWith("https:");
  return betterAuth({
    appName: "WoW Soulmate",
    baseURL: settings.origin,
    secret: settings.secret,
    database: settings.database,
    trustedOrigins: [settings.origin],
    emailAndPassword: { enabled: false },
    session: { expiresIn: 86400, disableSessionRefresh: true, freshAge: 900, cookieCache: { enabled: false } },
    account: { accountLinking: { enabled: false }, storeStateStrategy: "database", storeAccountCookie: false },
    user: {
      additionalFields: {
        bnetSubject: { type: "string", required: false, input: false, returned: false },
        bnetBattleTag: { type: "string", required: false, input: false, returned: false },
        bnetEmail: { type: "string", required: false, input: false, returned: false },
        bnetEmailVerified: { type: "boolean", required: false, input: false, returned: false },
        bnetLastLoginAt: { type: "string", required: false, input: false, returned: false },
      },
    },
    rateLimit: { enabled: true, storage: "database", window: 60, max: 60, customRules: { "/sign-in/social": { window: 60, max: 10 } } },
    advanced: {
      useSecureCookies: false,
      cookiePrefix: secure ? "__Host-soulmate" : "soulmate",
      defaultCookieAttributes: { httpOnly: true, secure, sameSite: "lax", path: "/" },
      ipAddress: { ipAddressHeaders: process.env.VERCEL === "1" ? ["x-vercel-forwarded-for"] : ["x-soulmate-client-ip"] },
    },
    databaseHooks: {
      user: {
        create: { before: async user => {
          const login = bnetLoginContext.getStore()?.login;
          if (!login) return false;
          return { data: { ...user, bnetSubject: login.subject, bnetBattleTag: login.account.battleTag, bnetEmail: login.account.email, bnetEmailVerified: login.account.emailVerified, bnetLastLoginAt: login.account.loggedInAt } };
        }, after: async user => {
          const context = bnetLoginContext.getStore();
          if (context) context.createdUserId = user.id;
        } },
        update: { before: async user => {
          const login = bnetLoginContext.getStore()?.login;
          if (!login) return false;
          return { data: { ...user, bnetBattleTag: login.account.battleTag, bnetEmail: login.account.email, bnetEmailVerified: login.account.emailVerified, bnetLastLoginAt: login.account.loggedInAt } };
        } },
      },
      account: {
        create: { before: async account => ({ data: { ...account, ...withoutOAuthTokens() } }) },
        update: { before: async account => ({ data: { ...account, ...withoutOAuthTokens() } }) },
      },
    },
    hooks: {
      after: createAuthMiddleware(async context => {
        const pending = bnetLoginContext.getStore();
        const login = pending?.login;
        if (login && context.context.newSession?.user.bnetSubject === login.subject) {
          pending.firstLogin = pending.createdUserId === context.context.newSession.user.id;
          await settings.onLogin?.(login);
        }
      }),
    },
    plugins: [genericOAuth({ config: [{
      providerId: "battlenet",
      discoveryUrl: "https://oauth.battle.net/.well-known/openid-configuration",
      requireIdTokenVerification: true,
      clientId: settings.clientId,
      clientSecret: settings.clientSecret,
      tokenEndpointAuth: { method: "client_secret_basic" },
      scopes: ["openid", "wow.profile"],
      redirectURI: `${settings.origin}/oauth/redirect`,
      pkce: true,
      disableProviderLogout: true,
      overrideUserInfo: true,
      getUserInfo: async tokens => {
        if (!tokens.idToken || !tokens.accessToken) throw new Error("Missing OIDC tokens");
        const subject = decodeJwt(tokens.idToken).sub;
        if (!subject || subject.length > 255) throw new Error("Invalid Battle.net subject");
        const response = await fetch("https://oauth.battle.net/userinfo", {
          headers: { Authorization: `Bearer ${tokens.accessToken}` },
          cache: "no-store", redirect: "error", signal: AbortSignal.timeout(10000),
        });
        if (!response.ok) throw new Error("Battle.net userinfo unavailable");
        const account = { ...parseBnetAccount(await response.json(), subject), loggedInAt: new Date().toISOString() };
        const context = bnetLoginContext.getStore();
        if (context) context.login = { subject, account, accessToken: tokens.accessToken };
        return { sub: subject, name: "Battle.net player", email: internalBnetEmail(subject), emailVerified: false, account };
      },
      mapProfileToUser: profile => {
        const account = profile.account as BnetLogin;
        return { bnetSubject: profile.sub, bnetBattleTag: account.battleTag, bnetEmail: account.email, bnetEmailVerified: account.emailVerified, bnetLastLoginAt: account.loggedInAt };
      },
    }] })],
    logger: { level: "error", log: () => console.error("Authentication request failed") },
    telemetry: { enabled: false },
  });
}