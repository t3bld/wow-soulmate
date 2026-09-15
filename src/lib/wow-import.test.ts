import assert from "node:assert/strict";
import { test } from "node:test";
import { importWowAccount, parseWowCharacters, projectWowDetail, wowNamespace, wowRegions, wowVersions } from "./wow-import";

const character = { id: 100, name: "Mira", realm: { id: 1, slug: "realm", name: "Realm" }, level: 60, playable_class: { id: 5, name: "Priest" } };

test("imports characters from every WoW license and separates all game namespaces", () => {
  const characters = parseWowCharacters({ wow_accounts: [{ id: 1, characters: [character] }, { id: 2, characters: [{ ...character, id: 200 }] }] });
  assert.deepEqual(characters.map(value => value.wowAccountId), [1, 2]);
  assert.equal(new Set(wowVersions.flatMap(version => wowRegions.map(region => wowNamespace(version, region)))).size, 16);
  assert.equal(wowNamespace("classic-anniversary", "eu"), "profile-classicann-eu");
});

test("invalid account data is not silently treated as an empty character list", () => {
  assert.throws(() => parseWowCharacters({}));
  assert.throws(() => parseWowCharacters({ wow_accounts: [{ id: 1, characters: [{ ...character, id: "100" }] }] }));
  assert.deepEqual(parseWowCharacters({ wow_accounts: [] }), []);
});

test("retains only relevant character fields and never invents played time", () => {
  assert.deepEqual(projectWowDetail("protected", { id: 100, total_time_played: 0, money: 123, position: { x: 1 }, access_token: "secret" }), { id: 100, total_time_played: 0 });
  assert.deepEqual(projectWowDetail("protected", { id: 100 }), { id: 100 });
  assert.deepEqual(projectWowDetail("protected", { id: 100, total_time_played: "unknown" }), { id: 100 });
  assert.deepEqual(projectWowDetail("protected", { id: 100, total_time_played: -1 }), { id: 100 });
  assert.deepEqual(projectWowDetail("protected", { id: 100, protected_stats: { total_time_played: 600, level: 60, experience: 0, money: 100 } }), { id: 100, level: 60, experience: 0, total_time_played: 600 });
  assert.deepEqual(projectWowDetail("summary", { guild: { id: 4, name: "Guild", key: { href: "https://invalid.test/?access_token=secret" } } }), { guild: { id: 4, name: "Guild" } });
});

test("imports private details only for owned, valid characters without forwarding tokens in URLs", async () => {
  const paths: string[] = [];
  const snapshot = await importWowAccount("secret", { fetchImpl: async (input, init) => {
    const url = new URL(String(input));
    assert.equal(url.hostname.endsWith(".api.blizzard.com"), true);
    assert.equal(url.searchParams.has("access_token"), false);
    assert.equal(init?.cache, "no-store");
    assert.equal(init?.redirect, "error");
    assert.equal(new Headers(init?.headers).get("Authorization"), "Bearer secret");
    paths.push(`${url.searchParams.get("namespace")}:${url.pathname}`);
    if (url.pathname === "/profile/user/wow") return Response.json({ wow_accounts: [{ id: 1, characters: url.searchParams.get("namespace") === "profile-eu" ? [character] : [] }] });
    if (url.pathname.endsWith("/status")) return Response.json({ id: 100, is_valid: true });
    if (url.pathname.includes("protected-character")) return Response.json({ id: 100, total_time_played: 600, money: 500 });
    if (url.pathname.endsWith("/mira")) return Response.json({ id: 100, level: 60 });
    return new Response(null, { status: 404 });
  } });
  assert.equal(paths.filter(path => path.endsWith(":/profile/user/wow")).length, 16);
  assert.equal(paths.some(path => path.endsWith("/encounters/raids")), true);
  const imported = snapshot.scopes[0].characters[0];
  assert.deepEqual(imported.details.protected, { status: "ok", data: { id: 100, total_time_played: 600 } });
  assert.equal(imported.details.professions?.status, "unavailable");
  assert.equal(snapshot.status, "partial");
  assert.equal(JSON.stringify(snapshot).includes("secret"), false);
});

test("removes invalid, deleted and name-reused characters before importing details", async () => {
  for (const invalid of [new Response(null, { status: 404 }), Response.json({ is_valid: false }), Response.json({ id: 100, is_valid: false }), Response.json({ id: 999, is_valid: true })]) {
    let detailsRequested = false;
    const snapshot = await importWowAccount("secret", { fetchImpl: async input => {
      const url = new URL(String(input));
      if (url.pathname === "/profile/user/wow") return Response.json({ wow_accounts: [{ id: 1, characters: url.searchParams.get("namespace") === "profile-eu" ? [character] : [] }] });
      if (url.pathname.endsWith("/status")) return invalid;
      detailsRequested = true;
      return Response.json({});
    } });
    assert.equal(detailsRequested, false);
    assert.equal(snapshot.scopes[0].characters.length, 0);
    assert.equal(snapshot.scopes[0].removedCharacters, 1);
  }
});

test("distinguishes unavailable Classic data, rate limits, missing consent and exhausted time from empty accounts", async () => {
  for (const [httpStatus, expected] of [[404, "unavailable"], [403, "forbidden"], [429, "rate_limited"], [503, "error"]] as const) {
    const snapshot = await importWowAccount("secret", { fetchImpl: async () => new Response(null, { status: httpStatus }) });
    assert.equal(snapshot.scopes.every(scope => scope.status === expected), true);
    assert.equal(snapshot.status, "partial");
  }
  const snapshot = await importWowAccount("secret", { budgetMs: 0, fetchImpl: async () => { throw new Error("must not fetch"); } });
  assert.equal(snapshot.scopes.every(scope => scope.status === "budget_exceeded"), true);
});

test("does not verify incomplete status responses or remove characters on malformed detail payloads", async () => {
  for (const statusData of [{ is_valid: true }, { id: 100, is_valid: true }]) {
    const snapshot = await importWowAccount("secret", { fetchImpl: async input => {
      const url = new URL(String(input));
      if (url.pathname === "/profile/user/wow") return Response.json({ wow_accounts: [{ id: 1, characters: url.searchParams.get("namespace") === "profile-eu" ? [character] : [] }] });
      if (url.pathname.endsWith("/status")) return Response.json(statusData);
      return Response.json({});
    } });
    const imported = snapshot.scopes[0].characters[0];
    assert.ok(imported);
    assert.equal(snapshot.status, "partial");
    if (statusData.id) {
      assert.equal(imported.details.summary?.status, "invalid_response");
    } else {
      assert.equal(imported.validity, "unverified");
      assert.equal(imported.statusCheck, "invalid_response");
      assert.deepEqual(imported.details, {});
    }
  }
});

test("stops import after deletion or superseding login rejects a checkpoint", async () => {
  let detailsRequested = false;
  await importWowAccount("secret", {
    checkpoint: async () => false,
    fetchImpl: async input => {
      const url = new URL(String(input));
      if (url.pathname === "/profile/user/wow") return Response.json({ wow_accounts: [{ id: 1, characters: [character] }] });
      detailsRequested = true;
      return Response.json({});
    },
  });
  assert.equal(detailsRequested, false);
});

test("database import lifecycle attaches privately, rejects stale runs, expires and deletes without resurrection", { skip: process.env.WOW_IMPORT_DB_TEST !== "1" }, async () => {
  const { randomUUID } = await import("node:crypto");
  const { beginWowImport, saveWowImport, saveProfile, getProfile, deleteProfile, discardPendingWowImport, purgeExpiredWowImports, matchCandidates } = await import("./profile-store");
  const { profileSchema } = await import("./profile");
  const subject = `wow-import-test-${randomUUID()}`;
  const snapshot = await importWowAccount("unused", { fetchImpl: async () => Response.json({ wow_accounts: [] }) });
  const profile = profileSchema.parse({ alias: "Import test", region: "EU", language: "en", roles: ["healer"], activities: ["dungeons"], experience: "regular", ageGroup: "25-34", timezone: "Europe/Berlin", playtimes: [{ days: [1], startHour: 18, endHour: 22 }], adult: true, discoverable: false });
  const database = () => (globalThis as typeof globalThis & { soulmatePrisma: import("../generated/prisma/client").PrismaClient }).soulmatePrisma;
  try {
    const staleRun = await beginWowImport(subject);
    const outdatedClient = database();
    const cache = globalThis as typeof globalThis & { soulmatePrismaSchema?: string };
    cache.soulmatePrismaSchema = "outdated-schema";
    assert.equal(await getProfile(subject), null);
    assert.notEqual(database(), outdatedClient);
    const refreshedClient = database();
    await getProfile(subject);
    assert.equal(database(), refreshedClient);
    const currentRun = await beginWowImport(subject);
    assert.equal(await saveWowImport(subject, staleRun, snapshot), false);
    assert.equal(await saveWowImport(subject, currentRun, snapshot), true);
    await saveProfile(subject, profile);
    assert.deepEqual((await getProfile(subject))?.roles, ["healer"]);
    await saveProfile(subject, { ...profile, roles: ["tank", "healer"] });
    assert.deepEqual((await getProfile(subject))?.roles, ["tank", "healer"]);
    assert.deepEqual((await database().profile.findUniqueOrThrow({ where: { subject } })).roles, ["tank", "healer"]);
    assert.equal(Object.hasOwn((await getProfile(subject))!, "role"), false);
    const multiple = profileSchema.parse({ ...profile, playtimes: [{ days: [6, 7], startHour: 10, endHour: 12 }, { days: [1], startHour: 22, endHour: 24 }], matchmaking: { classes: ["mage"], factions: ["alliance"], preferredClasses: ["priest"], classPriority: "must", rolePreference: "complementary", rolePriority: "must", experiencePreference: "similar", experiencePriority: "must" } });
    await saveProfile(subject, multiple);
    assert.deepEqual(await getProfile(subject), { ...multiple, about: "" });
    const stored = await database().profile.findUniqueOrThrow({ where: { subject }, include: { playtimes: true } });
    assert.equal(stored.playtimes.length, 2);
    assert.deepEqual(stored.classes, ["mage"]);
    assert.deepEqual(stored.preferredClasses, ["priest"]);
    assert.equal(Object.hasOwn(stored, "matchmaking"), false);
    await saveProfile(subject, { ...multiple, discoverable: true });
    const candidate = (await matchCandidates(`${subject}-viewer`, multiple)).find(candidate => candidate.id === stored.id);
    assert.deepEqual(candidate?.profile, { ...multiple, about: "", discoverable: true });
    assert.equal((await matchCandidates(subject, multiple)).some(candidate => candidate.id === stored.id), false);
    await saveProfile(subject, { ...profile, alias: "Updated profile" });
    assert.equal((await getProfile(subject))?.alias, "Updated profile");
    assert.deepEqual((await getProfile(subject))?.playtimes, profile.playtimes);
    assert.equal(await database().profilePlaytime.count({ where: { profileId: stored.id } }), 1);
    for (const data of [{ roles: [] }, { roles: ["unknown"] }, { roles: ["flexible"] }, { roles: ["tank", "flexible"] }, { roles: ["tank", "tank"] }, { activities: [] }, { ageGroup: "private" }, { ageGroup: "" }, { region: "unknown" }, { adult: false }, { classPriority: "must" }, { rolePreference: "any", rolePriority: "must" }]) {
      await assert.rejects(database().profile.update({ where: { subject }, data }));
    }
    for (const data of [{ days: [] }, { days: [8] }, { days: [1, 1] }, { startHour: 22, endHour: 2 }, { endHour: 25 }, { position: 14 }]) {
      await assert.rejects(database().profilePlaytime.update({ where: { profileId_position: { profileId: stored.id, position: 0 } }, data }));
    }
    await assert.rejects(database().profilePlaytime.deleteMany({ where: { profileId: stored.id } }));
    assert.equal(await database().profilePlaytime.count({ where: { profileId: stored.id } }), 1);
    await assert.rejects(database().profile.create({ data: { subject: `${subject}-no-playtimes`, alias: "No schedule", region: "EU", language: "en", roles: ["healer"], activities: ["dungeons"], experience: "regular", ageGroup: "25-34", timezone: "Europe/Berlin", adult: true } }));
    const attached = await database().wowImport.findUniqueOrThrow({ where: { subject } });
    assert.ok(attached.profileId);
    assert.equal(attached.expiresAt.getTime() - attached.startedAt.getTime(), 29 * 86400000);
    assert.equal(Object.hasOwn((await getProfile(subject))!, "wowImport"), false);
    assert.equal(Object.hasOwn((await database().profile.findUniqueOrThrow({ where: { subject } })), "wowImport"), false);
    await discardPendingWowImport(subject);
    assert.equal(await saveWowImport(subject, currentRun, snapshot), true);
    await deleteProfile(subject);
    assert.equal(await database().profilePlaytime.count({ where: { profileId: stored.id } }), 0);
    assert.equal(await saveWowImport(subject, currentRun, snapshot), false);

    const pendingRun = await beginWowImport(subject);
    await discardPendingWowImport(subject);
    assert.equal(await saveWowImport(subject, pendingRun, snapshot), false);

    const expiredRun = await beginWowImport(subject);
    await database().wowImport.update({ where: { subject }, data: { expiresAt: new Date(0) } });
    assert.equal(await saveWowImport(subject, expiredRun, snapshot), false);
    await purgeExpiredWowImports();
    assert.equal(await database().wowImport.findUnique({ where: { subject } }), null);

    await Promise.all([saveProfile(subject, profile), beginWowImport(subject)]);
    assert.ok((await database().wowImport.findUniqueOrThrow({ where: { subject } })).profileId);
    await database().profile.delete({ where: { subject } });
    assert.equal(await database().wowImport.findUnique({ where: { subject } }), null);
  } finally {
    await deleteProfile(`${subject}-no-playtimes`);
    await deleteProfile(subject);
    await database().$disconnect();
  }
});