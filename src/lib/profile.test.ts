import assert from "node:assert/strict";
import { test } from "node:test";
import { Temporal } from "@js-temporal/polyfill";
import { profileSchema, rankMatches, type PlayerProfile } from "./profile";

const base: PlayerProfile = { alias: "Mira", region: "EU", language: "en", role: "healer", activities: ["dungeons"], experience: "regular", ageGroup: "private", timezone: "Europe/Berlin", days: [1], startHour: 18, endHour: 22, adult: true, discoverable: true };
const now = Temporal.Instant.from("2026-09-13T00:00:00Z");

test("rejects invalid or underage profiles and overnight ambiguity", () => {
  for (const invalid of [{ adult: false }, { startHour: 22, endHour: 2 }, { activities: [] }, { days: [] }, { timezone: "invalid" }, { alias: "Mira#1234" }, { endHour: 25 }]) assert.equal(profileSchema.safeParse({ ...base, ...invalid }).success, false);
  assert.equal(profileSchema.safeParse(base).success, true);
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