import { z } from "zod";
import { Temporal } from "@js-temporal/polyfill";

export const activities = ["dungeons", "raids", "pvp", "questing", "collecting"] as const;
export const roles = ["tank", "healer", "damage"] as const;
export const experiences = ["new", "returning", "regular", "veteran"] as const;
export const ageGroups = ["private", "18-24", "25-34", "35-44", "45+"] as const;
export const timezones = ["Europe/Berlin", "Europe/London", "America/New_York", "America/Los_Angeles", "UTC"] as const;

export const profileSchema = z.object({
  alias: z.string().trim().min(2).max(24).regex(/^[\p{L}\p{N} _-]+$/u),
  region: z.enum(["EU", "US"]),
  language: z.enum(["en", "de"]),
  role: z.enum(roles),
  activities: z.array(z.enum(activities)).min(1).max(5).transform(values => [...new Set(values)]),
  experience: z.enum(experiences),
  ageGroup: z.enum(ageGroups),
  timezone: z.enum(timezones),
  days: z.array(z.number().int().min(1).max(7)).min(1).max(7).transform(values => [...new Set(values)]),
  startHour: z.number().int().min(0).max(23),
  endHour: z.number().int().min(1).max(24),
  adult: z.literal(true),
  discoverable: z.boolean(),
}).refine(profile => profile.endHour > profile.startHour, { path: ["endHour"], message: "End must be later on the same day" });

export type PlayerProfile = z.infer<typeof profileSchema>;
export type PublicProfile = { id: string; profile: PlayerProfile };
export type Match = { id: string; alias: string; score: number; sharedHours: number; activities: string[]; role: string; experience: string };

function windows(profile: PlayerProfile, now: Temporal.Instant) {
  const horizon = now.add({ hours: 168 });
  const firstDate = now.toZonedDateTimeISO(profile.timezone).toPlainDate();
  const result: [number, number][] = [];
  for (let offset = 0; offset <= 7; offset++) {
    const date = firstDate.add({ days: offset });
    if (!profile.days.includes(date.dayOfWeek)) continue;
    const start = date.toZonedDateTime({ timeZone: profile.timezone, plainTime: { hour: profile.startHour } }).epochMilliseconds;
    const endDate = profile.endHour === 24 ? date.add({ days: 1 }) : date;
    const end = endDate.toZonedDateTime({ timeZone: profile.timezone, plainTime: { hour: profile.endHour % 24 } }).epochMilliseconds;
    const clippedStart = Math.max(start, now.epochMilliseconds);
    const clippedEnd = Math.min(end, horizon.epochMilliseconds);
    if (clippedEnd > clippedStart) result.push([clippedStart, clippedEnd]);
  }
  return result;
}

export function rankMatches(own: PlayerProfile, candidates: PublicProfile[], now = Temporal.Now.instant()): Match[] {
  if (!own.discoverable) return [];
  const ownWindows = windows(own, now);
  const ownTime = ownWindows.reduce((sum, [start, end]) => sum + end - start, 0);
  return candidates.flatMap(({ id, profile }): Match[] => {
    if (!profile.discoverable || own.region !== profile.region || own.language !== profile.language) return [];
    const sharedActivities = own.activities.filter(activity => profile.activities.includes(activity));
    if (!sharedActivities.length) return [];
    const candidateWindows = windows(profile, now);
    const candidateTime = candidateWindows.reduce((sum, [start, end]) => sum + end - start, 0);
    let overlap = 0;
    for (const [ownStart, ownEnd] of ownWindows) {
      for (const [otherStart, otherEnd] of candidateWindows) overlap += Math.max(0, Math.min(ownEnd, otherEnd) - Math.max(ownStart, otherStart));
    }
    if (!overlap || !ownTime || !candidateTime) return [];
    const schedule = overlap / Math.max(ownTime, candidateTime);
    const interests = sharedActivities.length / new Set([...own.activities, ...profile.activities]).size;
    const experience = own.experience === profile.experience ? 1 : 0.5;
    const role = own.role !== profile.role ? 1 : 0.5;
    const compareAge = own.ageGroup !== "private" && profile.ageGroup !== "private";
    const age = compareAge && own.ageGroup === profile.ageGroup ? 5 : 0;
    const totalWeight = compareAge ? 100 : 95;
    const score = Math.round((schedule * 50 + interests * 30 + experience * 5 + role * 10 + age) / totalWeight * 100);
    return [{ id, alias: profile.alias, score, sharedHours: Math.round(overlap / 3600000 * 10) / 10, activities: sharedActivities, role: profile.role, experience: profile.experience }];
  }).sort((first, second) => second.score - first.score || second.sharedHours - first.sharedHours || first.id.localeCompare(second.id)).slice(0, 12);
}