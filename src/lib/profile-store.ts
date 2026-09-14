import "server-only";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/generated/prisma/client";
import { matchmakingSchema, profilePlaytimes, profileSchema, type PlayerProfile, type PublicProfile } from "./profile";

const globalDatabase = globalThis as typeof globalThis & { soulmatePrisma?: PrismaClient };

function database() {
  if (!process.env.DATABASE_URL) throw new Error("Database not configured");
  return globalDatabase.soulmatePrisma ??= new PrismaClient({
    adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL, max: 3, connectionTimeoutMillis: 5000, idleTimeoutMillis: 10000, statement_timeout: 10000 }),
  });
}

export async function getProfile(subject: string): Promise<PlayerProfile | null> {
  const row = await database().profile.findUnique({ where: { subject } });
  return row ? profileSchema.parse(row) : null;
}

export async function saveProfile(subject: string, profile: PlayerProfile) {
  const parsed = profileSchema.parse(profile);
  const playtimes = profilePlaytimes(parsed);
  const data = { ...parsed, ...playtimes[0], playtimes, matchmaking: parsed.matchmaking ?? matchmakingSchema.parse({}) };
  await database().profile.upsert({ where: { subject }, create: { subject, ...data }, update: data });
}

export async function deleteProfile(subject: string) {
  await database().profile.deleteMany({ where: { subject } });
}

export async function matchCandidates(subject: string, own: PlayerProfile): Promise<PublicProfile[]> {
  const rows = await database().profile.findMany({
    where: { subject: { not: subject }, discoverable: true, region: own.region, language: own.language },
    orderBy: { id: "asc" },
    take: 500,
  });
  return rows.flatMap(row => {
    const parsed = profileSchema.safeParse(row);
    return parsed.success ? [{ id: row.id, profile: parsed.data }] : [];
  });
}