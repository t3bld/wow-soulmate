import assert from "node:assert/strict";
import { test } from "node:test";
import { createHash, randomUUID } from "node:crypto";
import { readFile } from "node:fs/promises";
import { Client } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { memoryAdapter } from "better-auth/adapters/memory";
import { exportJWK, generateKeyPair, SignJWT } from "jose";
import { bnetLoginContext, createSoulmateAuth, internalBnetEmail } from "./better-auth";

for (const postgres of [false, true]) test(`Battle.net OIDC, private tokens, CSRF and immediate session revocation (${postgres ? "PostgreSQL" : "memory"})`, { skip: postgres && process.env.AUTH_DB_TEST !== "1" }, async () => {
  const origin = "https://soulmate.test";
  const issuer = "https://oauth.battle.net";
  const keys = await generateKeyPair("RS256");
  const publicKey = { ...await exportJWK(keys.publicKey), kid: "test-key", alg: "RS256", use: "sig" };
  const store: Record<string, any[]> = { user: [], account: [], session: [], verification: [], rateLimit: [] };
  const completed: string[] = [];
  const firstLogins: string[] = [];
  const schema = `auth_test_${randomUUID().replaceAll("-", "")}`;
  let management: Client | undefined;
  let database: PrismaClient | undefined;
  let nonce = "";
  let challenge = "";
  let subject = "12345";
  let invalidNonce = false;
  let mismatchedSubject = false;
  let invalidAudience = false;
  let invalidSignature = false;
  let missingIdToken = false;
  let tokenExchanges = 0;
  const realFetch = globalThis.fetch;
  globalThis.fetch = async (input, init) => {
    const url = typeof input === "string" ? input : input instanceof URL ? input.href : input.url;
    if (url === `${issuer}/.well-known/openid-configuration`) return Response.json({ issuer, authorization_endpoint: `${issuer}/authorize`, token_endpoint: `${issuer}/token`, userinfo_endpoint: `${issuer}/userinfo`, jwks_uri: `${issuer}/jwks`, id_token_signing_alg_values_supported: ["RS256"] });
    if (url === `${issuer}/jwks`) return Response.json({ keys: [publicKey] });
    if (url === `${issuer}/token`) {
      tokenExchanges++;
      const body = new URLSearchParams(String(init?.body));
      assert.equal(createHash("sha256").update(body.get("code_verifier") ?? "").digest("base64url"), challenge);
      assert.equal(body.get("redirect_uri"), `${origin}/oauth/redirect`);
      let token = await new SignJWT({ nonce: invalidNonce ? "incorrect" : nonce }).setProtectedHeader({ alg: "RS256", kid: "test-key" }).setSubject(subject).setIssuer(issuer).setAudience(invalidAudience ? "attacker" : "test-client").setIssuedAt().setExpirationTime("5m").sign(keys.privateKey);
      if (invalidSignature) token = token.replace(/\.[^.]+$/, ".invalid-signature");
      return Response.json({ access_token: "private-access-token", refresh_token: "private-refresh-token", id_token: missingIdToken ? undefined : token, token_type: "Bearer", expires_in: 300, scope: "openid wow.profile" });
    }
    if (url === `${issuer}/userinfo`) return Response.json({ sub: mismatchedSubject ? "other-user" : subject, battletag: "Private#1234" });
    throw new Error(`Unexpected network request: ${url}`);
  };
  try {
    if (postgres) {
      const connectionString = process.env.DATABASE_URL_UNPOOLED ?? process.env.DATABASE_URL;
      assert.ok(connectionString);
      management = new Client({ connectionString, connectionTimeoutMillis: 5000, statement_timeout: 10000 });
      await management.connect();
      await management.query(`CREATE SCHEMA "${schema}"`);
      await management.query(`SET search_path TO "${schema}"`);
      await management.query(await readFile(new URL("../../prisma/migrations/20260915180000_better_auth/migration.sql", import.meta.url), "utf8"));
      database = new PrismaClient({ adapter: new PrismaPg({ connectionString, max: 2, connectionTimeoutMillis: 5000, statement_timeout: 10000 }, { schema }) });
    }
    const auth = createSoulmateAuth({ origin, clientId: "test-client", clientSecret: "test-client-secret", secret: "unit-test-only-secret-with-at-least-32-characters", database: database ? prismaAdapter(database, { provider: "postgresql", transaction: true }) : memoryAdapter(store), onLogin: async login => { completed.push(login.subject); assert.equal(login.accessToken, "private-access-token"); } });
    const call = async (path: string, cookie = "", body?: object, requestOrigin = origin) => {
      const context: NonNullable<ReturnType<typeof bnetLoginContext.getStore>> = {};
      const response = await bnetLoginContext.run(context, () => auth.handler(new Request(`${origin}/api/auth${path}`, {
      method: body ? "POST" : "GET",
      headers: { cookie, origin: requestOrigin, "content-type": "application/json", "x-soulmate-client-ip": "127.0.0.1" },
      ...(body ? { body: JSON.stringify(body) } : {}),
      })));
      if (context.firstLogin) firstLogins.push(context.login!.subject);
      if (database) {
        store.user = await database.user.findMany();
        store.account = await database.account.findMany();
        store.session = await database.session.findMany({ orderBy: { createdAt: "asc" } });
      }
      return response;
    };
    const cookieFrom = (response: Response) => response.headers.getSetCookie().map(cookie => cookie.split(";")[0]).join("; ");
    const begin = async () => {
      const response = await call("/sign-in/social", "", { provider: "battlenet", callbackURL: `${origin}/pl/soulmates` });
      assert.equal(response.status, 200);
      const url = new URL((await response.json()).url);
      nonce = url.searchParams.get("nonce")!;
      challenge = url.searchParams.get("code_challenge")!;
      assert.ok(nonce);
      assert.ok(challenge);
      assert.equal(url.searchParams.get("code_challenge_method"), "S256");
      assert.equal(url.searchParams.get("scope"), "openid wow.profile");
      return { path: `/callback/battlenet?code=test-code&state=${url.searchParams.get("state")}`, cookie: cookieFrom(response) };
    };
    const login = async () => {
      const start = await begin();
      const response = await call(start.path, start.cookie);
      assert.equal(response.status, 302);
      assert.equal(response.headers.get("location"), `${origin}/pl/soulmates`);
      const cookie = cookieFrom(response);
      assert.match(cookie, /__Host-soulmate.session_token=/);
      const sessionCookie = response.headers.getSetCookie().find(value => value.startsWith("__Host-soulmate.session_token="))!;
      assert.match(sessionCookie, /HttpOnly/i);
      assert.match(sessionCookie, /Secure/i);
      assert.match(sessionCookie, /SameSite=Lax/i);
      assert.doesNotMatch(sessionCookie, /Domain=/i);
      const replay = await call(start.path, start.cookie);
      assert.notEqual(replay.headers.get("location"), `${origin}/pl/soulmates`);
      return cookie;
    };
    const first = await login();
    assert.deepEqual(completed, ["12345"]);
    assert.deepEqual(firstLogins, ["12345"]);
    assert.equal(store.user[0].email, internalBnetEmail(subject));
    assert.equal(store.account[0].accountId, subject);
    for (const field of ["accessToken", "refreshToken", "idToken", "password"]) assert.equal(store.account[0][field], null);
    assert.ok(store.session[0].expiresAt.getTime() - Date.now() <= 86400000);
    const firstToken = store.session[0].token;
    const second = await login();
    assert.equal(store.user.length, 1);
    assert.equal(store.session.length, 2);
    assert.deepEqual(firstLogins, ["12345"]);
    assert.equal((await call("/revoke-session", second, { token: firstToken })).status, 200);
    assert.equal(await (await call("/get-session", first)).json(), null);
    const third = await login();
    assert.equal((await call("/revoke-other-sessions", second, {})).status, 200);
    assert.equal(await (await call("/get-session", third)).json(), null);
    assert.ok(await (await call("/get-session", second)).json());
    subject = "67890";
    const foreign = await login();
    const foreignToken = store.session.find(session => session.userId === store.user.find(user => user.bnetSubject === subject).id).token;
    await call("/revoke-session", second, { token: foreignToken });
    assert.ok(await (await call("/get-session", foreign)).json());
    assert.equal((await call("/revoke-sessions", second, {})).status, 200);
    assert.equal(await (await call("/get-session", second)).json(), null);
    assert.equal((await call("/sign-out", foreign, {}, "https://attacker.test")).status, 403);
    assert.ok(await (await call("/get-session", foreign)).json());
    assert.equal((await call("/sign-out", foreign, {})).status, 200);
    assert.equal(await (await call("/get-session", foreign)).json(), null);
    for (const failure of ["nonce", "subject", "audience", "signature", "missing-token"]) {
      invalidNonce = failure === "nonce";
      mismatchedSubject = failure === "subject";
      invalidAudience = failure === "audience";
      invalidSignature = failure === "signature";
      missingIdToken = failure === "missing-token";
      const before = completed.length;
      const start = await begin();
      const response = await call(start.path, start.cookie);
      assert.notEqual(response.headers.get("location"), `${origin}/pl/soulmates`);
      assert.equal(store.session.length, 0);
      assert.equal(completed.length, before);
    }
    const before = tokenExchanges;
    await call("/callback/battlenet?code=stolen&state=unknown");
    assert.equal(tokenExchanges, before);
    assert.deepEqual(firstLogins, ["12345", "67890"]);
    assert.equal((await call("/sign-in/social", "", { provider: "battlenet", callbackURL: "https://attacker.test" })).status, 403);
  } finally {
    globalThis.fetch = realFetch;
    await database?.$disconnect();
    if (management) {
      try { await management.query(`DROP SCHEMA IF EXISTS "${schema}" CASCADE`); }
      finally { await management.end(); }
    }
  }
});