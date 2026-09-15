import assert from "node:assert/strict";
import { test } from "node:test";
import config from "../../next.config";
import { validCronAuthorization } from "./auth-security";
import { feedbackRateLimitQuery } from "./feedback-rate-limit";
import { readFile } from "node:fs/promises";
import { Client, Pool } from "pg";
import { randomBytes } from "node:crypto";
import { locales } from "../i18n/config";
import { timezones } from "./profile";
import { contentSecurityPolicy, requestLimitKey, requestLimitQuery, requestPolicy, trustedClientIp } from "./request-security";

test("production CSP requires nonces and rejects inline handlers and eval", () => {
  const csp = contentSecurityPolicy("test-nonce-with-32-characters-long");
  const script = csp.split(";").map(value => value.trim()).find(value => value.startsWith("script-src "))!;
  assert.match(script, /'nonce-test-nonce-with-32-characters-long'/);
  assert.match(script, /'strict-dynamic'/);
  assert.doesNotMatch(script, /unsafe-inline|unsafe-eval/);
  assert.match(csp, /script-src-attr 'none'/);
  assert.match(csp, /frame-ancestors 'none'/);
  assert.match(csp, /connect-src 'self' https:\/\/alb.reddit.com/);
  assert.ok(csp.split(";").find(directive => directive.trim().startsWith("connect-src "))?.includes("https://www.facebook.com"));
  assert.match(script, /https:\/\/connect.facebook.net/);
  assert.match(contentSecurityPolicy("test-nonce-with-32-characters-long", true), /'unsafe-eval'/);
  assert.throws(() => contentSecurityPolicy("'; script-src *"));
});

test("shared request limits use trusted IPs and parameterized atomic SQL", () => {
  const headers = new Headers({ "x-forwarded-for": "1.2.3.4", "x-vercel-forwarded-for": "5.6.7.8" });
  assert.equal(trustedClientIp(headers, true), "5.6.7.8");
  assert.equal(trustedClientIp(headers, false), "127.0.0.1");
  assert.equal(trustedClientIp(new Headers({ "x-vercel-forwarded-for": "2001:db8:abcd:1234::1" }), true), trustedClientIp(new Headers({ "x-vercel-forwarded-for": "2001:db8:abcd:1234::ffff" }), true));
  assert.equal(trustedClientIp(new Headers({ "x-vercel-forwarded-for": "::ffff:5.6.7.8" }), true), "5.6.7.8");
  assert.throws(() => trustedClientIp(new Headers({ "x-forwarded-for": "1.2.3.4" }), true));
  assert.equal(requestPolicy("/oauth/login", "GET")?.max, 10);
  assert.equal(requestPolicy("/pt-BR/soulmates", "GET")?.bucket, "private-read");
  assert.equal(requestPolicy("/pl/profile", "POST")?.bucket, "write");
  assert.equal(requestPolicy("/en", "GET"), null);
  const key = requestLimitKey("secret-with-at-least-32-characters", "login", "5.6.7.8");
  const query = requestLimitQuery(key, 10, 60);
  assert.ok(query.values.includes(key));
  assert.equal(query.text.includes(key), false);
  assert.match(query.text, /ON CONFLICT/);
  assert.throws(() => requestLimitQuery("bad", 10, 60));
});

test("browser security headers cover all routes without breaking external assets", async () => {
  const rules = await config.headers!();
  const rule = rules.find(entry => entry.source === "/:path*");
  assert.ok(rule);
  const headers = Object.fromEntries(rule.headers.map(header => [header.key, header.value]));
  assert.equal(headers["X-Frame-Options"], "DENY");
  assert.equal(headers["X-Content-Type-Options"], "nosniff");
  assert.equal(headers["Referrer-Policy"], "no-referrer");
  assert.equal(headers["Content-Security-Policy"], "frame-ancestors 'none'; base-uri 'self'; object-src 'none'");
  assert.equal(headers["Permissions-Policy"], "camera=(), microphone=(), geolocation=()");
  assert.equal(headers["Strict-Transport-Security"], process.env.NODE_ENV === "production" ? "max-age=15552000" : undefined);
  assert.equal(config.poweredByHeader, false);
});

test("cron authentication rejects missing, weak and incorrect secrets", () => {
  const secret = "test-secret-".repeat(4);
  assert.equal(validCronAuthorization(`Bearer ${secret}`, secret), true);
  assert.equal(validCronAuthorization(null, secret), false);
  assert.equal(validCronAuthorization(`Bearer ${secret}`, undefined), false);
  assert.equal(validCronAuthorization("Bearer short", "short"), false);
  assert.equal(validCronAuthorization(`Bearer ${secret}wrong`, secret), false);
  assert.equal(validCronAuthorization(secret, secret), false);
});

test("feedback limit SQL parameterizes account keys", () => {
  const key = "a".repeat(64);
  const query = feedbackRateLimitQuery(key);
  assert.deepEqual(query.values, [key]);
  assert.equal(query.text.includes(key), false);
  assert.throws(() => feedbackRateLimitQuery("'; DROP TABLE users; --"));
});

test("feedback limit migration and rolling expiry work in a rollback-only temporary table", { skip: process.env.SECURITY_DB_TEST !== "1" }, async () => {
  const connectionString = process.env.DATABASE_URL_UNPOOLED ?? process.env.DATABASE_URL;
  assert.ok(connectionString);
  const client = new Client({ connectionString, connectionTimeoutMillis: 5000, statement_timeout: 5000 });
  await client.connect();
  try {
    await client.query("BEGIN");
    const migration = await readFile(new URL("../../prisma/migrations/20260915120000_feedback_rate_limit/migration.sql", import.meta.url), "utf8");
    await client.query(migration.replace("CREATE TABLE", "CREATE TEMP TABLE"));
    await client.query("SET LOCAL search_path = pg_temp");
    const key = "a".repeat(64);
    const claim = async (value: string) => {
      const query = feedbackRateLimitQuery(value);
      return client.query(query.text, query.values);
    };
    assert.equal((await claim(key)).rowCount, 1);
    assert.equal((await claim(key)).rowCount, 0);
    assert.equal((await claim("b".repeat(64))).rowCount, 1);
    await client.query("UPDATE soulmate_feedback_rate_limits SET next_allowed_at = CURRENT_TIMESTAMP - INTERVAL '1 second' WHERE key = $1", [key]);
    assert.equal((await claim(key)).rowCount, 1);
    assert.equal((await claim(key)).rowCount, 0);
  } finally {
    await client.query("ROLLBACK");
    await client.end();
  }
});

test("locale migration preserves profiles and validates languages and timezones in a temporary table", { skip: process.env.SECURITY_DB_TEST !== "1" }, async () => {
  const connectionString = process.env.DATABASE_URL_UNPOOLED ?? process.env.DATABASE_URL;
  assert.ok(connectionString);
  const client = new Client({ connectionString, connectionTimeoutMillis: 5000, statement_timeout: 5000 });
  await client.connect();
  try {
    await client.query("BEGIN");
    await client.query("SET LOCAL search_path = pg_temp");
    await client.query(`CREATE TEMP TABLE soulmate_profiles (
      language text NOT NULL CONSTRAINT profile_language_valid CHECK (language IN ('en','de','fr','es','it','pt','ru')),
      timezone text NOT NULL CONSTRAINT profile_timezone_valid CHECK (timezone IN ('Europe/Berlin','Europe/London','Europe/Paris','Europe/Madrid','Europe/Rome','Europe/Lisbon','Europe/Moscow','America/New_York','America/Los_Angeles','UTC'))
    )`);
    await client.query("INSERT INTO soulmate_profiles VALUES ('pt', 'Europe/Lisbon')");
    const migration = await readFile(new URL("../../prisma/migrations/20260915140000_brazilian_polish_locales/migration.sql", import.meta.url), "utf8");
    await client.query(migration);
    assert.deepEqual((await client.query("SELECT * FROM soulmate_profiles")).rows, [{ language: "pt", timezone: "Europe/Lisbon" }]);
    for (const locale of locales) {
      assert.equal((await client.query("INSERT INTO soulmate_profiles VALUES ($1, 'UTC')", [locale])).rowCount, 1);
    }
    for (const timezone of timezones) {
      assert.equal((await client.query("INSERT INTO soulmate_profiles VALUES ('pt-BR', $1)", [timezone])).rowCount, 1);
    }
    for (const values of [["xx", "UTC"], ["pt-br", "UTC"], ["pl", "Invalid/Zone"]]) {
      await client.query("SAVEPOINT invalid_value");
      await assert.rejects(client.query("INSERT INTO soulmate_profiles VALUES ($1, $2)", values), { code: "23514" });
      await client.query("ROLLBACK TO SAVEPOINT invalid_value");
    }
  } finally {
    await client.query("ROLLBACK");
    await client.end();
  }
});

test("parallel requests cannot exceed the shared database limit", { skip: process.env.SECURITY_DB_TEST !== "1" }, async () => {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL_UNPOOLED ?? process.env.DATABASE_URL, max: 5, connectionTimeoutMillis: 5000, statement_timeout: 5000 });
  const key = randomBytes(32).toString("hex");
  const query = requestLimitQuery(key, 3, 60);
  try {
    const results = await Promise.all(Array.from({ length: 20 }, () => pool.query(query.text, query.values)));
    assert.equal(results.filter(result => result.rowCount === 1).length, 3);
    assert.equal(results.filter(result => result.rowCount === 0).length, 17);
  } finally {
    try { await pool.query("DELETE FROM soulmate_request_rate_limits WHERE key = $1", [key]); }
    finally { await pool.end(); }
  }
});

test("Better Auth migration, credential prohibition, cascading revocation and atomic rate limits", { skip: process.env.SECURITY_DB_TEST !== "1" }, async () => {
  const client = new Client({ connectionString: process.env.DATABASE_URL_UNPOOLED ?? process.env.DATABASE_URL, connectionTimeoutMillis: 5000, statement_timeout: 5000 });
  await client.connect();
  try {
    await client.query("BEGIN");
    await client.query("SET LOCAL search_path = pg_temp");
    const migration = await readFile(new URL("../../prisma/migrations/20260915180000_better_auth/migration.sql", import.meta.url), "utf8");
    await client.query(migration.replaceAll("CREATE TABLE", "CREATE TEMP TABLE"));
    await client.query(`INSERT INTO auth_users (id, name, email, "bnetSubject", "updatedAt") VALUES ('test', 'test', 'test@bnet.invalid', 'test', now())`);
    await client.query(`INSERT INTO auth_sessions (id, token, "userId", "expiresAt", "updatedAt") VALUES ('session', 'token', 'test', now() + INTERVAL '1 day', now())`);
    await client.query(`INSERT INTO auth_accounts (id, "accountId", "providerId", "userId", "updatedAt") VALUES ('account', 'test', 'battlenet', 'test', now())`);
    await client.query("SAVEPOINT reject_token");
    await assert.rejects(client.query(`UPDATE auth_accounts SET "accessToken" = 'forbidden'`), { code: "23514" });
    await client.query("ROLLBACK TO SAVEPOINT reject_token");
    await client.query("DELETE FROM auth_users WHERE id = 'test'");
    assert.equal((await client.query("SELECT * FROM auth_sessions")).rowCount, 0);
    assert.equal((await client.query("SELECT * FROM auth_accounts")).rowCount, 0);
    const query = requestLimitQuery("c".repeat(64), 3, 60);
    for (let count = 0; count < 3; count++) assert.equal((await client.query(query.text, query.values)).rowCount, 1);
    assert.equal((await client.query(query.text, query.values)).rowCount, 0);
    await client.query(`UPDATE soulmate_request_rate_limits SET "expiresAt" = now() - INTERVAL '1 second'`);
    assert.equal((await client.query(query.text, query.values)).rowCount, 1);
  } finally { await client.query("ROLLBACK"); await client.end(); }
});