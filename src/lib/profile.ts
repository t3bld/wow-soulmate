import { z } from "zod";
import { Temporal } from "@js-temporal/polyfill";
import { locales } from "../i18n/config";

export const activities = ["dungeons", "raids", "pvp", "questing", "collecting", "roleplay"] as const;
export const roles = ["tank", "healer", "damage", "flexible"] as const;
export const classes = ["warrior", "paladin", "hunter", "rogue", "priest", "deathKnight", "shaman", "mage", "warlock", "monk", "druid", "demonHunter", "evoker"] as const;
export const factions = ["horde", "alliance"] as const;
export const goals = ["leveling", "mythicPlus", "raidProgress", "ratedPvp", "achievements", "social"] as const;
export const priorities = ["wish", "must"] as const;
export const rolePreferences = ["any", "similar", "complementary"] as const;
export const experiencePreferences = ["any", "similar", "more", "less"] as const;
export const experiences = ["new", "returning", "regular", "veteran"] as const;
export const ageGroups = ["private", "18-24", "25-34", "35-44", "45+"] as const;
export const timezones = ["Europe/Berlin", "Europe/London", "Europe/Paris", "Europe/Madrid", "Europe/Rome", "Europe/Lisbon", "Europe/Moscow", "America/New_York", "America/Los_Angeles", "UTC"] as const;

export const maxPlaytimes = 14;
export const playtimeSchema = z.object({
  days: z.array(z.number().int().min(1).max(7)).min(1).max(7).transform(values => [...new Set(values)]),
  startHour: z.number().int().min(0).max(23),
  endHour: z.number().int().min(1).max(24),
}).refine(playtime => playtime.endHour > playtime.startHour, { path: ["endHour"], message: "End must be later on the same day" });

const playtimesSchema = z.array(playtimeSchema).min(1).max(maxPlaytimes);

export function parsePlaytimes(form: FormData) {
  const identifiers = z.array(z.string().regex(/^\d+$/)).min(1).max(maxPlaytimes).refine(values => new Set(values).size === values.length).safeParse(form.getAll("playtimeId"));
  if (!identifiers.success) return identifiers;
  const hour = (name: string) => {
    const value = form.get(name);
    return typeof value === "string" && value.trim() !== "" ? Number(value) : NaN;
  };
  return playtimesSchema.safeParse(identifiers.data.map(identifier => ({
    days: form.getAll(`playtimes.${identifier}.days`).map(value => typeof value === "string" && value.trim() !== "" ? Number(value) : NaN),
    startHour: hour(`playtimes.${identifier}.startHour`),
    endHour: hour(`playtimes.${identifier}.endHour`),
  })));
}

export const matchmakingSchema = z.object({
  classes: z.array(z.enum(classes)).max(classes.length).transform(values => [...new Set(values)]).default([]),
  factions: z.array(z.enum(factions)).max(factions.length).transform(values => [...new Set(values)]).default([]),
  goals: z.array(z.enum(goals)).max(goals.length).transform(values => [...new Set(values)]).default([]),
  goalPriority: z.enum(priorities).default("wish"),
  preferredClasses: z.array(z.enum(classes)).max(classes.length).transform(values => [...new Set(values)]).default([]),
  classPriority: z.enum(priorities).default("wish"),
  factionPriority: z.enum(priorities).default("wish"),
  rolePreference: z.enum(rolePreferences).default("any"),
  rolePriority: z.enum(priorities).default("wish"),
  experiencePreference: z.enum(experiencePreferences).default("any"),
  experiencePriority: z.enum(priorities).default("wish"),
}).superRefine((value, context) => {
  for (const [priority, selected] of [["goalPriority", value.goals.length], ["classPriority", value.preferredClasses.length], ["factionPriority", value.factions.length], ["rolePriority", value.rolePreference !== "any"], ["experiencePriority", value.experiencePreference !== "any"]] as const) {
    if (value[priority] === "must" && !selected) context.addIssue({ code: "custom", path: [priority], message: "A must criterion requires a selection" });
  }
});

export function parseMatchmaking(form: FormData) {
  return matchmakingSchema.safeParse({
    classes: form.getAll("classes"), factions: form.getAll("factions"), goals: form.getAll("goals"), preferredClasses: form.getAll("preferredClasses"),
    goalPriority: form.get("goalPriority") ?? "wish", classPriority: form.get("classPriority") ?? "wish", factionPriority: form.get("factionPriority") ?? "wish",
    rolePreference: form.get("rolePreference") ?? "any", rolePriority: form.get("rolePriority") ?? "wish",
    experiencePreference: form.get("experiencePreference") ?? "any", experiencePriority: form.get("experiencePriority") ?? "wish",
  });
}

export const profileSchema = z.object({
  alias: z.string().trim().min(2).max(24).regex(/^[\p{L}\p{N} _-]+$/u),
  about: z.string().trim().max(1000).optional(),
  matchmaking: matchmakingSchema.nullish(),
  region: z.enum(["EU", "US"]),
  language: z.enum(locales),
  role: z.enum(roles),
  activities: z.array(z.enum(activities)).min(1).max(6).transform(values => [...new Set(values)]),
  experience: z.enum(experiences),
  ageGroup: z.enum(ageGroups),
  timezone: z.enum(timezones),
  ...playtimeSchema.shape,
  playtimes: playtimesSchema.nullish(),
  adult: z.literal(true),
  discoverable: z.boolean(),
}).refine(profile => profile.endHour > profile.startHour, { path: ["endHour"], message: "End must be later on the same day" });

export type PlayerProfile = z.infer<typeof profileSchema>;
export type PublicProfile = { id: string; profile: PlayerProfile };
export type Match = { id: string; alias: string; score: number; sharedHours: number; activities: string[]; role: string; experience: string };

export function profilePlaytimes(profile: PlayerProfile) {
  return profile.playtimes ?? [{ days: profile.days, startHour: profile.startHour, endHour: profile.endHour }];
}

const commonWords = new Set("the and for with that this you your are have looking ich und der die das ein eine mit für von auf bin ist sind suche nach mir mich auch nicht des den dem wir uns du dir dich dein deine sich was wichtig moi toi les des une pour avec dans est suis mon mes qui que pas nous vous cherche sono con per una uno del della che non cerco mio mia questo los las una uno para con por soy que mis sin busco como muito uma com para por sou meu minha que não procuro мне меня тебя для что это как без или хочу ищу нет мой моя мои мне они она его при про быть чтобы есть очень".split(" "));

function descriptionTerms(profile: PlayerProfile): Set<string> {
  const words = profile.about?.normalize("NFKC").toLocaleLowerCase(profile.language).match(/[\p{L}\p{N}]+/gu) ?? [];
  return new Set(words.filter(word => word.length >= 3 && !commonWords.has(word)));
}

function windows(profile: PlayerProfile, now: Temporal.Instant) {
  const horizon = now.add({ hours: 168 });
  const firstDate = now.toZonedDateTimeISO(profile.timezone).toPlainDate();
  const result: [number, number][] = [];
  const playtimes = profilePlaytimes(profile);
  for (let offset = 0; offset <= 7; offset++) {
    const date = firstDate.add({ days: offset });
    for (const playtime of playtimes) {
      if (!playtime.days.includes(date.dayOfWeek)) continue;
      const start = date.toZonedDateTime({ timeZone: profile.timezone, plainTime: { hour: playtime.startHour } }).epochMilliseconds;
      const endDate = playtime.endHour === 24 ? date.add({ days: 1 }) : date;
      const end = endDate.toZonedDateTime({ timeZone: profile.timezone, plainTime: { hour: playtime.endHour % 24 } }).epochMilliseconds;
      const clippedStart = Math.max(start, now.epochMilliseconds);
      const clippedEnd = Math.min(end, horizon.epochMilliseconds);
      if (clippedEnd > clippedStart) result.push([clippedStart, clippedEnd]);
    }
  }
  const merged: [number, number][] = [];
  for (const [start, end] of result.sort((first, second) => first[0] - second[0])) {
    const previous = merged.at(-1);
    if (previous && start <= previous[1]) previous[1] = Math.max(previous[1], end);
    else merged.push([start, end]);
  }
  return merged;
}

function preferenceFit(own: PlayerProfile, other: PlayerProfile) {
  const preferences = own.matchmaking;
  if (!preferences) return { allowed: true, fit: null };
  const checks: { matches: boolean; priority: typeof priorities[number] }[] = [];
  if (preferences.goals.length) checks.push({ matches: preferences.goals.some(goal => other.matchmaking?.goals.includes(goal)), priority: preferences.goalPriority });
  if (preferences.preferredClasses.length) checks.push({ matches: preferences.preferredClasses.some(playerClass => other.matchmaking?.classes.includes(playerClass)), priority: preferences.classPriority });
  if (preferences.factions.length) checks.push({ matches: preferences.factions.some(faction => other.matchmaking?.factions.includes(faction)), priority: preferences.factionPriority });
  if (preferences.rolePreference !== "any") checks.push({
    matches: own.role === "flexible" || other.role === "flexible" || (preferences.rolePreference === "similar" ? own.role === other.role : own.role !== other.role),
    priority: preferences.rolePriority,
  });
  if (preferences.experiencePreference !== "any") {
    const difference = experiences.indexOf(other.experience) - experiences.indexOf(own.experience);
    checks.push({ matches: preferences.experiencePreference === "similar" ? difference === 0 : preferences.experiencePreference === "more" ? difference > 0 : difference < 0, priority: preferences.experiencePriority });
  }
  return { allowed: checks.every(check => check.matches || check.priority !== "must"), fit: checks.length ? checks.filter(check => check.matches).length / checks.length : null };
}

export function rankMatches(own: PlayerProfile, candidates: PublicProfile[], now = Temporal.Now.instant()): Match[] {
  if (!own.discoverable) return [];
  const ownTerms = descriptionTerms(own);
  const ownWindows = windows(own, now);
  const ownTime = ownWindows.reduce((sum, [start, end]) => sum + end - start, 0);
  return candidates.flatMap(({ id, profile }): Match[] => {
    if (!profile.discoverable || own.region !== profile.region || own.language !== profile.language) return [];
    const ownPreferences = preferenceFit(own, profile);
    const otherPreferences = preferenceFit(profile, own);
    if (!ownPreferences.allowed || !otherPreferences.allowed) return [];
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
    const role = own.role === "flexible" || profile.role === "flexible" || own.role !== profile.role ? 1 : 0.5;
    const compareAge = own.ageGroup !== "private" && profile.ageGroup !== "private";
    const age = compareAge && own.ageGroup === profile.ageGroup ? 5 : 0;
    const totalWeight = compareAge ? 100 : 95;
    const otherTerms = descriptionTerms(profile);
    const sharedTerms = [...ownTerms].filter(term => otherTerms.has(term)).length;
    const textBonus = sharedTerms ? sharedTerms / new Set([...ownTerms, ...otherTerms]).size * 5 : 0;
    const baseScore = (schedule * 50 + interests * 30 + experience * 5 + role * 10 + age) / totalWeight * 100;
    const fits = [ownPreferences.fit, otherPreferences.fit].filter(fit => fit !== null);
    const preferenceScore = fits.length ? baseScore * 0.8 + fits.reduce((sum, fit) => sum + fit, 0) / fits.length * 20 : baseScore;
    const score = Math.min(100, Math.round(preferenceScore + textBonus));
    return [{ id, alias: profile.alias, score, sharedHours: Math.round(overlap / 3600000 * 10) / 10, activities: sharedActivities, role: profile.role, experience: profile.experience }];
  }).sort((first, second) => second.score - first.score || second.sharedHours - first.sharedHours || first.id.localeCompare(second.id)).slice(0, 12);
}