import assert from "node:assert/strict";
import { test } from "node:test";
import { Temporal } from "@js-temporal/polyfill";
import { classes, maxPlaytimes, parseMatchmaking, parsePlaytimes, profilePlaytimes, profileSchema, rankMatches, type PlayerProfile } from "./profile";
import { locales } from "../i18n/config";

const base: PlayerProfile = { alias: "Mira", region: "EU", language: "en", role: "healer", activities: ["dungeons"], experience: "regular", ageGroup: "private", timezone: "Europe/Berlin", days: [1], startHour: 18, endHour: 22, adult: true, discoverable: true };
const now = Temporal.Instant.from("2026-09-13T00:00:00Z");

test("validates optional matchmaking choices and flexible roles", () => {
  const profile = profileSchema.parse({ ...base, role: "flexible", matchmaking: { classes: ["mage", "druid", "mage"], factions: ["horde", "alliance"], goals: ["mythicPlus"] } });
  assert.deepEqual(profile.matchmaking?.classes, ["mage", "druid"]);
  assert.deepEqual(profile.matchmaking?.factions, ["horde", "alliance"]);
  assert.equal(profileSchema.safeParse({ ...base, matchmaking: { classes: ["unknown"] } }).success, false);
  assert.equal(profileSchema.safeParse({ ...base, matchmaking: { goalPriority: "must" } }).success, false);
  assert.equal(profileSchema.safeParse({ ...base, matchmaking: { classPriority: "must" } }).success, false);
  assert.equal(profileSchema.safeParse({ ...base, matchmaking: null }).success, true);
  assert.deepEqual(profileSchema.parse({ ...base, matchmaking: { classes } }).matchmaking?.classes, classes);
  for (const invalid of [{ factionPriority: "must" }, { rolePriority: "must" }, { experiencePriority: "must" }, { factions: ["neutral"] }, { goals: ["unknown"] }, { preferredClasses: ["unknown"] }, { rolePreference: "unknown" }, { goalPriority: "unknown" }]) {
    assert.equal(profileSchema.safeParse({ ...base, matchmaking: invalid }).success, false);
  }
});

test("parses and clears multiple questionnaire selections from form data", () => {
  const form = new FormData();
  for (const playerClass of classes) form.append("classes", playerClass);
  for (const faction of ["horde", "alliance"]) form.append("factions", faction);
  form.append("goals", "leveling");
  form.append("goals", "social");
  form.append("preferredClasses", "mage");
  form.append("preferredClasses", "druid");
  form.set("classPriority", "must");
  const parsed = parseMatchmaking(form);
  assert.equal(parsed.success, true);
  assert.deepEqual(parsed.data?.classes, classes);
  assert.deepEqual(parsed.data?.factions, ["horde", "alliance"]);
  assert.deepEqual(parsed.data?.preferredClasses, ["mage", "druid"]);
  assert.deepEqual(parsed.data?.goals, ["leveling", "social"]);
  assert.deepEqual(parseMatchmaking(new FormData()).data?.classes, []);
  form.delete("preferredClasses");
  assert.equal(parseMatchmaking(form).success, false);
});

test("scores wishes reciprocally without exposing private questionnaire data", () => {
  const own = profileSchema.parse({ ...base, matchmaking: { classes: ["priest"], goals: ["mythicPlus"] } });
  const matching = profileSchema.parse({ ...base, matchmaking: { goals: ["mythicPlus"] } });
  const conflicting = profileSchema.parse({ ...base, matchmaking: { goals: ["social"] } });
  const matches = rankMatches(own, [{ id: "conflicting", profile: conflicting }, { id: "matching", profile: matching }], now);
  assert.equal(matches.length, 2);
  assert.equal(matches[0].id, "matching");
  assert.ok(matches[0].score > matches[1].score);
  assert.equal(matches[0].score, rankMatches(matching, [{ id: "own", profile: own }], now)[0].score);
  assert.equal(matches[1].score, rankMatches(conflicting, [{ id: "own", profile: own }], now)[0].score);
  assert.equal("matchmaking" in matches[0], false);
  assert.equal("classes" in matches[0], false);
});

test("checks must criteria in both directions but keeps unmet wishes", () => {
  const own = profileSchema.parse({ ...base, matchmaking: { goals: ["mythicPlus"], goalPriority: "must", classes: ["priest"], factions: ["alliance"] } });
  const other = profileSchema.parse({ ...base, matchmaking: { goals: ["mythicPlus"], preferredClasses: ["mage"], classPriority: "must" } });
  assert.equal(rankMatches(own, [{ id: "other", profile: other }], now).length, 0);
  assert.equal(rankMatches(other, [{ id: "own", profile: own }], now).length, 0);
  const wish = profileSchema.parse({ ...other, matchmaking: { ...other.matchmaking, classPriority: "wish" } });
  assert.equal(rankMatches(own, [{ id: "wish", profile: wish }], now).length, 1);
  assert.equal(rankMatches(own, [{ id: "legacy", profile: base }], now).length, 0);
});

test("distinguishes similar and complementary roles including flexible", () => {
  const own = profileSchema.parse({ ...base, matchmaking: { rolePreference: "similar", rolePriority: "must" } });
  assert.equal(rankMatches(own, [{ id: "tank", profile: { ...base, role: "tank" } }], now).length, 0);
  assert.equal(rankMatches(own, [{ id: "healer", profile: base }], now).length, 1);
  const complementary = profileSchema.parse({ ...own, matchmaking: { rolePreference: "complementary", rolePriority: "must" } });
  assert.equal(rankMatches(complementary, [{ id: "healer", profile: base }], now).length, 0);
  assert.equal(rankMatches(complementary, [{ id: "flexible", profile: { ...base, role: "flexible" } }], now).length, 1);
});

test("respects faction overlap and reciprocal experience preferences", () => {
  const own = profileSchema.parse({ ...base, experience: "new", matchmaking: { factions: ["horde"], factionPriority: "must", experiencePreference: "more", experiencePriority: "must" } });
  const other = profileSchema.parse({ ...base, experience: "veteran", matchmaking: { factions: ["horde", "alliance"], experiencePreference: "less", experiencePriority: "must" } });
  assert.equal(rankMatches(own, [{ id: "mentor", profile: other }], now).length, 1);
  const alliance = profileSchema.parse({ ...other, matchmaking: { ...other.matchmaking, factions: ["alliance"] } });
  assert.equal(rankMatches(own, [{ id: "alliance", profile: alliance }], now).length, 0);
  assert.equal(rankMatches(own, [{ id: "peer", profile: { ...other, experience: "new" } }], now).length, 0);
});

test("parses independently named playtimes after adding and removing blocks", () => {
  const form = new FormData();
  for (const identifier of ["0", "2"]) {
    form.append("playtimeId", identifier);
    form.append(`playtimes.${identifier}.days`, identifier === "0" ? "1" : "6");
    form.append(`playtimes.${identifier}.startHour`, "18");
    form.append(`playtimes.${identifier}.endHour`, "22");
  }
  assert.deepEqual(parsePlaytimes(form).data, [{ days: [1], startHour: 18, endHour: 22 }, { days: [6], startHour: 18, endHour: 22 }]);
  form.delete("playtimes.2.startHour");
  assert.equal(parsePlaytimes(form).success, false);
  form.set("playtimes.2.startHour", "");
  assert.equal(parsePlaytimes(form).success, false);
  form.set("playtimes.2.startHour", "18");
  form.append("playtimeId", "2");
  assert.equal(parsePlaytimes(form).success, false);
  assert.equal(parsePlaytimes(new FormData()).success, false);
});

test("validates every playtime and preserves legacy schedules", () => {
  const slot = { days: [1], startHour: 18, endHour: 22 };
  assert.deepEqual(profilePlaytimes(base), [slot]);
  assert.deepEqual(profilePlaytimes({ ...base, playtimes: null }), [slot]);
  assert.equal(profileSchema.safeParse({ ...base, playtimes: [slot, { ...slot, days: [6, 7] }] }).success, true);
  for (const playtimes of [[], Array(maxPlaytimes + 1).fill(slot), [{ ...slot, days: [] }], [{ ...slot, days: [8] }], [{ ...slot, startHour: 23 }], [{ ...slot, endHour: 18 }], [{ ...slot, endHour: 25 }]]) {
    assert.equal(profileSchema.safeParse({ ...base, playtimes }).success, false);
  }
});

test("matches additional days and disjoint playtimes", () => {
  const own = { ...base, playtimes: [{ days: [1], startHour: 18, endHour: 22 }, { days: [6], startHour: 10, endHour: 12 }, { days: [6], startHour: 16, endHour: 18 }] };
  const weekend = { ...base, days: [6], startHour: 9, endHour: 19 };
  const match = rankMatches(own, [{ id: "weekend", profile: weekend }], now)[0];
  assert.equal(match.sharedHours, 4);
  assert.equal("playtimes" in match, false);
  assert.equal(rankMatches(own, [{ id: "gap", profile: { ...weekend, startHour: 12, endHour: 16 } }], now).length, 0);
});

test("merges overlapping, repeated and adjacent playtimes before scoring", () => {
  const own = { ...base, playtimes: [{ days: [1], startHour: 20, endHour: 22 }, { days: [1], startHour: 18, endHour: 21 }, { days: [1], startHour: 18, endHour: 21 }, { days: [1], startHour: 22, endHour: 24 }] };
  const candidate = { ...own, role: "tank" as const };
  const match = rankMatches(own, [{ id: "overlap", profile: candidate }], now)[0];
  assert.equal(match.sharedHours, 6);
  assert.equal(match.score, 100);
});

test("compares multiple windows across DST and different timezones", () => {
  const autumn = Temporal.Instant.from("2026-10-24T00:00:00Z");
  const own = { ...base, playtimes: [{ days: [7], startHour: 1, endHour: 4 }, { days: [7], startHour: 22, endHour: 24 }] };
  const candidate = { ...base, timezone: "UTC" as const, playtimes: [{ days: [7], startHour: 0, endHour: 3 }, { days: [7], startHour: 21, endHour: 23 }] };
  assert.equal(rankMatches(own, [{ id: "dst", profile: candidate }], autumn)[0].sharedHours, 5);
});

test("rejects invalid or underage profiles and overnight ambiguity", () => {
  for (const invalid of [{ adult: false }, { startHour: 22, endHour: 2 }, { activities: [] }, { days: [] }, { timezone: "invalid" }, { alias: "Mira#1234" }, { endHour: 25 }]) assert.equal(profileSchema.safeParse({ ...base, ...invalid }).success, false);
  assert.equal(profileSchema.safeParse(base).success, true);
});

test("accepts optional profile text, trims it and limits its length", () => {
  assert.equal(profileSchema.parse(base).about, undefined);
  assert.equal(profileSchema.parse({ ...base, about: "   " }).about, "");
  assert.equal(profileSchema.parse({ ...base, about: "  Relaxed adventures\nCollecting together  " }).about, "Relaxed adventures\nCollecting together");
  assert.equal(profileSchema.safeParse({ ...base, about: "a".repeat(1000) }).success, true);
  assert.equal(profileSchema.safeParse({ ...base, about: "a".repeat(1001) }).success, false);
  assert.equal(profileSchema.safeParse({ ...base, about: 123 }).success, false);
});

test("compares different timezones by actual instants", () => {
  const matches = rankMatches(base, [{ id: "other", profile: { ...base, role: "tank", timezone: "Europe/London", startHour: 17, endHour: 21 } }], now);
  assert.equal(matches[0].score, 100);
  assert.equal(matches[0].sharedHours, 4);
  assert.equal("subject" in matches[0], false);
});

test("respects DST, calendar day boundaries and end at midnight", () => {
  const autumn = Temporal.Instant.from("2026-10-24T00:00:00Z");
  const own = { ...base, days: [7], startHour: 1, endHour: 4 };
  const matches = rankMatches(own, [{ id: "dst", profile: { ...own, timezone: "UTC", startHour: 0, endHour: 3 } }], autumn);
  assert.equal(matches[0].sharedHours, 3);
  const late = { ...base, startHour: 22, endHour: 24 };
  assert.equal(rankMatches(late, [{ id: "late", profile: late }], now)[0].sharedHours, 2);
});

test("excludes incompatible or private candidates and private viewers", () => {
  for (const difference of [{ region: "US" }, { language: "de" }, { discoverable: false }, { days: [2] }, { activities: ["pvp"] }, { startHour: 8, endHour: 12 }]) {
    const candidate = profileSchema.parse({ ...base, ...difference });
    assert.deepEqual(rankMatches(base, [{ id: "other", profile: candidate }], now), []);
  }
  assert.deepEqual(rankMatches({ ...base, discoverable: false }, [{ id: "other", profile: base }], now), []);
});

test("returns strongest matches first with deterministic tie order", () => {
  const matches = rankMatches(base, [{ id: "z", profile: base }, { id: "a", profile: { ...base, role: "tank" } }, { id: "b", profile: { ...base, startHour: 20 } }], now);
  assert.equal(matches[0].id, "a");
  assert.ok(matches.every(match => match.score >= 0 && match.score <= 100));
});

test("accepts every supported group language and only matches the same language", () => {
  for (const language of locales) {
    const own = profileSchema.parse({ ...base, language });
    const candidates = locales.map(candidateLanguage => ({
      id: candidateLanguage,
      profile: profileSchema.parse({ ...base, language: candidateLanguage }),
    }));
    assert.deepEqual(rankMatches(own, candidates, now).map(match => match.id), [language]);
  }
  assert.equal(profileSchema.safeParse({ ...base, language: "xx" }).success, false);
});

test("accepts additional European timezones", () => {
  for (const timezone of ["Europe/Paris", "Europe/Madrid", "Europe/Rome", "Europe/Lisbon", "Europe/Moscow"]) {
    const own = profileSchema.parse({ ...base, timezone });
    assert.equal(rankMatches(own, [{ id: timezone, profile: own }], now)[0].sharedHours, 4);
  }
});

test("uses shared description terms as a bounded bonus without exposing the text", () => {
  const own = { ...base, about: "Relaxed collecting" };
  const matches = rankMatches(own, [
    { id: "different", profile: { ...base, about: "Competitive speedruns" } },
    { id: "shared", profile: { ...base, about: "RELAXED, collecting! collecting" } },
    { id: "empty", profile: { ...base, about: "" } },
  ], now);
  const originalScore = rankMatches(base, [{ id: "original", profile: base }], now)[0].score;
  assert.equal(matches[0].id, "shared");
  assert.equal(matches[0].score, Math.min(100, originalScore + 5));
  assert.ok(matches.slice(1).every(match => match.score === originalScore));
  assert.equal("about" in matches[0], false);
  assert.equal(rankMatches(base, [{ id: "text", profile: own }], now)[0].score, originalScore);
  assert.equal(rankMatches(own, [{ id: "no-text", profile: base }], now)[0].score, originalScore);
  assert.equal(rankMatches(own, [{ id: "private", profile: { ...own, discoverable: false } }], now).length, 0);
  assert.equal(rankMatches(own, [{ id: "no-overlap", profile: { ...own, days: [2] } }], now).length, 0);
});

test("normalizes multilingual description terms and ignores common filler words", () => {
  for (const [language, about] of [["de", "Gemütliche Abenteuer"], ["fr", "Exploration détendue"], ["es", "Exploración tranquila"], ["it", "Esplorazione tranquilla"], ["pt", "Exploração tranquila"], ["ru", "Спокойные приключения"]] as const) {
    const own = { ...base, language, about };
    const matched = rankMatches(own, [{ id: "shared", profile: { ...own, about: about.normalize("NFD").toLocaleUpperCase(language) } }], now)[0];
    const withoutText = rankMatches({ ...own, about: "" }, [{ id: "shared", profile: own }], now)[0];
    assert.ok(matched.score > withoutText.score, language);
  }
  const own = { ...base, about: "the and for with your" };
  assert.equal(rankMatches(own, [{ id: "filler", profile: own }], now)[0].score, rankMatches(base, [{ id: "base", profile: base }], now)[0].score);
});