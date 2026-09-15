import { z } from "zod";

export const wowRegions = ["eu", "us", "kr", "tw"] as const;
export const wowVersions = ["retail", "classic-era", "classic-progression", "classic-anniversary"] as const;
export type WowRegion = typeof wowRegions[number];
export type WowVersion = typeof wowVersions[number];

const namespacePrefixes: Record<WowVersion, string> = {
  retail: "profile",
  "classic-era": "profile-classic1x",
  "classic-progression": "profile-classic",
  "classic-anniversary": "profile-classicann",
};

export function wowNamespace(version: WowVersion, region: WowRegion) {
  return `${namespacePrefixes[version]}-${region}`;
}

const identifier = z.number().int().positive().safe();
const entity = z.object({ id: identifier, name: z.string().optional() });
const characterSchema = z.object({
  id: identifier,
  name: z.string().min(1).max(128),
  realm: entity.extend({ slug: z.string().min(1).max(128) }),
  playable_class: entity.optional(),
  playable_race: entity.optional(),
  faction: z.object({ type: z.string(), name: z.string().optional() }).optional(),
  level: z.number().int().nonnegative().optional(),
});
const accountSchema = z.object({ wow_accounts: z.array(z.object({ id: identifier, characters: z.array(characterSchema) })) });

export function parseWowCharacters(payload: unknown) {
  const account = accountSchema.parse(payload);
  const seen = new Set<string>();
  return account.wow_accounts.flatMap(wowAccount => wowAccount.characters.flatMap(character => {
    const key = `${character.realm.id}:${character.id}`;
    if (seen.has(key)) return [];
    seen.add(key);
    return [{ ...character, wowAccountId: wowAccount.id }];
  }));
}

export const wowFields = {
  summary: ["id", "name", "realm", "race", "character_class", "active_spec", "faction", "level", "guild", "achievement_points", "average_item_level", "equipped_item_level", "last_login_timestamp"],
  protected: ["id", "level", "experience", "total_time_played", "last_login_timestamp"],
  equipment: ["equipped_items"],
  specializations: ["specializations", "active_specialization", "specialization_groups"],
  statistics: ["health", "power", "power_type", "speed", "strength", "agility", "intellect", "stamina", "melee_crit", "melee_haste", "mastery", "versatility", "armor", "dodge", "parry", "block"],
  achievements: ["total_quantity", "total_points", "achievements"],
  achievementStatistics: ["categories"],
  pvp: ["honor_level", "pvp_map_statistics", "honorable_kills"],
  arena2v2: ["bracket", "rating", "season", "season_match_statistics", "weekly_match_statistics"],
  arena3v3: ["bracket", "rating", "season", "season_match_statistics", "weekly_match_statistics"],
  ratedBattlegrounds: ["bracket", "rating", "season", "season_match_statistics", "weekly_match_statistics"],
  professions: ["primaries", "secondaries"],
  raids: ["expansions"],
  dungeons: ["expansions"],
  mythicKeystone: ["current_mythic_rating", "current_period", "seasons"],
  quests: ["quests"],
  reputations: ["reputations"],
} as const;
export type WowDetail = keyof typeof wowFields;
type JsonValue = z.infer<ReturnType<typeof z.json>>;

function withoutLinks(value: JsonValue): JsonValue {
  if (Array.isArray(value)) return value.map(withoutLinks);
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.entries(value).filter(([key]) => !["_links", "key", "href", "access_token", "refresh_token"].includes(key)).map(([key, item]) => [key, withoutLinks(item)]));
  }
  return value;
}

export function projectWowDetail(kind: WowDetail, payload: unknown) {
  const data = z.record(z.string(), z.json()).parse(payload);
  if (kind === "protected") {
    const stats = z.object({
      total_time_played: z.number().nonnegative().optional(),
      level: z.number().int().nonnegative().optional(),
      experience: z.number().nonnegative().optional(),
    }).safeParse(data.protected_stats);
    if (stats.success) Object.assign(data, stats.data);
    if (!z.number().nonnegative().safeParse(data.total_time_played).success) delete data.total_time_played;
  }
  return Object.fromEntries(wowFields[kind].filter(key => data[key] !== undefined).map(key => [key, withoutLinks(data[key])]));
}

export type WowRequestStatus = "ok" | "unavailable" | "forbidden" | "rate_limited" | "error" | "invalid_response" | "budget_exceeded";
export type WowDetailResult = { status: WowRequestStatus; data?: Record<string, JsonValue> };
export type WowCharacter = ReturnType<typeof parseWowCharacters>[number] & {
  validity: "unverified" | "valid";
  statusCheck: WowRequestStatus;
  details: Partial<Record<WowDetail, WowDetailResult>>;
};
export type WowScope = {
  region: WowRegion;
  version: WowVersion;
  namespace: string;
  status: WowRequestStatus;
  listedCharacters: number;
  removedCharacters: number;
  characters: WowCharacter[];
};
export type WowSnapshot = {
  schemaVersion: 1;
  startedAt: string;
  completedAt: string | null;
  status: "running" | "complete" | "partial";
  scopes: WowScope[];
};

const detailPaths: Record<WowDetail, string> = {
  summary: "", protected: "", equipment: "/equipment", specializations: "/specializations",
  statistics: "/statistics", achievements: "/achievements", achievementStatistics: "/achievements/statistics",
  pvp: "/pvp-summary", arena2v2: "/pvp-bracket/2v2", arena3v3: "/pvp-bracket/3v3", ratedBattlegrounds: "/pvp-bracket/rbg",
  professions: "/professions", raids: "/encounters/raids", dungeons: "/encounters/dungeons",
  mythicKeystone: "/mythic-keystone-profile", quests: "/quests/completed", reputations: "/reputations",
};
const retailOnly = new Set<WowDetail>(["professions", "raids", "dungeons", "mythicKeystone", "quests", "reputations"]);
const detailOrder: WowDetail[] = ["summary", "protected", "specializations", "professions", "pvp", "arena2v2", "arena3v3", "ratedBattlegrounds", "raids", "dungeons", "mythicKeystone", "equipment", "statistics", "achievements", "achievementStatistics", "quests", "reputations"];

async function parallelRequests<Item>(items: Item[], action: (item: Item) => Promise<void>) {
  let cursor = 0;
  await Promise.all(Array.from({ length: Math.min(4, items.length) }, async () => {
    while (cursor < items.length) {
      const item = items[cursor++];
      await action(item);
    }
  }));
}

export async function importWowAccount(accessToken: string, options: {
  fetchImpl?: typeof fetch;
  now?: () => number;
  budgetMs?: number;
  checkpoint?: (snapshot: WowSnapshot) => Promise<boolean>;
} = {}): Promise<WowSnapshot> {
  const now = options.now ?? Date.now;
  const fetchImpl = options.fetchImpl ?? fetch;
  const started = now();
  const deadline = started + (options.budgetMs ?? 220_000);
  const snapshot: WowSnapshot = { schemaVersion: 1, startedAt: new Date(started).toISOString(), completedAt: null, status: "running", scopes: [] };
  const blockedRegions = new Map<WowRegion, WowRequestStatus>();
  let stopped = false;

  async function request(scope: WowScope, path: string): Promise<WowDetailResult> {
    if (stopped || now() >= deadline) return { status: "budget_exceeded" };
    const blocked = blockedRegions.get(scope.region);
    if (blocked) return { status: blocked };
    const url = new URL(path, `https://${scope.region}.api.blizzard.com`);
    url.searchParams.set("namespace", scope.namespace);
    url.searchParams.set("locale", "en_US");
    try {
      const response = await fetchImpl(url, {
        headers: { Authorization: `Bearer ${accessToken}`, Accept: "application/json" },
        cache: "no-store", redirect: "error",
        signal: AbortSignal.timeout(Math.max(1, Math.min(8000, deadline - now()))),
      });
      if (!response.ok) {
        const status: WowRequestStatus = response.status === 404 ? "unavailable" : response.status === 401 || response.status === 403 ? "forbidden" : response.status === 429 ? "rate_limited" : "error";
        if (response.status === 429 || response.status === 401) blockedRegions.set(scope.region, status);
        return { status };
      }
      const parsed = z.record(z.string(), z.json()).safeParse(await response.json());
      return parsed.success ? { status: "ok", data: parsed.data } : { status: "invalid_response" };
    } catch {
      return { status: now() >= deadline ? "budget_exceeded" : "error" };
    }
  }

  async function checkpoint() {
    if (options.checkpoint && !await options.checkpoint(snapshot)) stopped = true;
  }

  snapshot.scopes = wowVersions.flatMap(version => wowRegions.map(region => ({
    version, region, namespace: wowNamespace(version, region), status: "budget_exceeded" as const,
    listedCharacters: 0, removedCharacters: 0, characters: [],
  })));
  await parallelRequests(snapshot.scopes, async scope => {
    const result = await request(scope, "/profile/user/wow");
    scope.status = result.status;
    if (result.status !== "ok") return;
    try {
      const characters = parseWowCharacters(result.data);
      scope.characters = characters.map(character => ({ ...character, validity: "unverified", statusCheck: "budget_exceeded", details: {} }));
      scope.listedCharacters = characters.length;
    } catch {
      scope.status = "invalid_response";
    }
  });
  await checkpoint();
  const entries = snapshot.scopes.flatMap(scope => scope.characters.map(character => ({ scope, character })));
  const characterPath = (character: WowCharacter) => `/profile/wow/character/${encodeURIComponent(character.realm.slug)}/${encodeURIComponent(character.name.toLowerCase())}`;
  const removed = new Set<WowCharacter>();

  await parallelRequests(entries, async ({ scope, character }) => {
    const result = await request(scope, `${characterPath(character)}/status`);
    const validity = z.object({ id: identifier.optional(), is_valid: z.boolean() }).safeParse(result.data);
    character.statusCheck = result.status;
    if (result.status === "unavailable" || (validity.success && (!validity.data.is_valid || (validity.data.id !== undefined && validity.data.id !== character.id)))) {
      removed.add(character);
      scope.removedCharacters++;
    } else if (result.status === "ok" && validity.success && validity.data.id === character.id) {
      character.validity = "valid";
    } else if (result.status === "ok") {
      character.statusCheck = "invalid_response";
    }
  });
  for (const scope of snapshot.scopes) scope.characters = scope.characters.filter(character => !removed.has(character));
  await checkpoint();

  for (const kind of detailOrder) {
    if (stopped) break;
    await parallelRequests(entries.filter(({ scope, character }) => !removed.has(character) && character.validity === "valid" && (scope.version === "retail" || !retailOnly.has(kind))), async ({ scope, character }) => {
      const path = kind === "protected" ? `/profile/user/wow/protected-character/${character.realm.id}-${character.id}` : `${characterPath(character)}${detailPaths[kind]}`;
      const result = await request(scope, path);
      if (kind === "summary" && result.status === "unavailable") {
        removed.add(character);
        scope.removedCharacters++;
        return;
      }
      if (result.status !== "ok") {
        character.details[kind] = { status: result.status };
        return;
      }
      if ((kind === "summary" || kind === "protected") && result.data?.id !== character.id) {
        if (identifier.safeParse(result.data?.id).success) {
          removed.add(character);
          scope.removedCharacters++;
        } else {
          character.details[kind] = { status: "invalid_response" };
        }
        return;
      }
      const data = projectWowDetail(kind, result.data);
      character.details[kind] = Object.keys(data).length ? { status: "ok", data } : { status: "invalid_response" };
    });
    for (const scope of snapshot.scopes) scope.characters = scope.characters.filter(character => !removed.has(character));
    await checkpoint();
  }
  snapshot.completedAt = new Date(now()).toISOString();
  snapshot.status = !stopped && snapshot.scopes.every(scope => scope.status === "ok" && scope.characters.every(character => character.validity === "valid" && Object.values(character.details).every(detail => detail.status === "ok"))) ? "complete" : "partial";
  await checkpoint();
  return snapshot;
}