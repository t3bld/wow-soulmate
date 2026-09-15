import "server-only";
import { PrismaPg } from "@prisma/adapter-pg";
import { Prisma, PrismaClient } from "@/generated/prisma/client";
import { randomUUID } from "node:crypto";
import { matchmakingSchema, ownProfileSchema, profileSchema, type OwnProfile, type PlayerProfile, type PublicProfile } from "./profile";
import { bnetProfileData, type BnetLogin } from "./bnet-account";
import type { WowSnapshot } from "./wow-import";
import { feedbackRateLimitQuery } from "./feedback-rate-limit";

const globalDatabase = globalThis as typeof globalThis & { soulmatePrisma?: PrismaClient; soulmatePrismaSchema?: string };
const databaseSchema = JSON.stringify([Prisma.prismaVersion.client, Prisma.ModelName, Prisma.ProfileScalarFieldEnum, Prisma.ProfilePlaytimeScalarFieldEnum, Prisma.WowImportScalarFieldEnum]);
const questionnaireInclude = { playtimes: { orderBy: { position: "asc" as const } } };

function questionnaireData(row: Prisma.ProfileGetPayload<{ include: typeof questionnaireInclude }>) {
  const { classes, factions, preferredClasses, classPriority, rolePreference, rolePriority, experiencePreference, experiencePriority } = row;
  return { ...row, matchmaking: { classes, factions, preferredClasses, classPriority, rolePreference, rolePriority, experiencePreference, experiencePriority } };
}

export function database() {
  if (!process.env.DATABASE_URL) throw new Error("Database not configured");
  if (globalDatabase.soulmatePrisma && globalDatabase.soulmatePrismaSchema !== databaseSchema) {
    const outdated = globalDatabase.soulmatePrisma;
    globalDatabase.soulmatePrisma = undefined;
    void outdated.$disconnect().catch(() => console.error("Could not disconnect outdated Prisma client"));
  }
  globalDatabase.soulmatePrismaSchema = databaseSchema;
  return globalDatabase.soulmatePrisma ??= new PrismaClient({
    adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL, max: 3, connectionTimeoutMillis: 5000, idleTimeoutMillis: 10000, statement_timeout: 10000 }),
    omit: { profile: { bnetBattleTag: true, bnetEmail: true, bnetEmailVerified: true, bnetLastLoginAt: true, notificationEmail: true } },
  });
}

export async function getProfile(subject: string): Promise<OwnProfile | null> {
  const row = await database().profile.findUnique({ where: { subject }, include: questionnaireInclude, omit: { notificationEmail: false } });
  return row ? ownProfileSchema.parse(questionnaireData(row)) : null;
}

export async function saveProfile(subject: string, profile: OwnProfile, account?: BnetLogin, userId?: string) {
  const { playtimes, matchmaking, ...parsed } = ownProfileSchema.parse(profile);
  const data = { ...parsed, ...matchmakingSchema.parse(matchmaking ?? {}) };
  const slots = playtimes.map((playtime, position) => ({ ...playtime, position }));
  return withProfileLock(subject, async transaction => {
    if (userId && !await transaction.user.findFirst({ where: { id: userId, bnetSubject: subject }, select: { id: true } })) throw new Error("Account deleted");
    const existing = await transaction.profile.findUnique({ where: { subject }, select: { id: true } });
    const saved = await transaction.profile.upsert({
      where: { subject },
      create: { subject, ...data, ...(account ? bnetProfileData(account) : {}), playtimes: { create: slots } },
      update: { ...data, playtimes: { deleteMany: {}, create: slots } },
    });
    const pending = await transaction.wowImport.findUnique({ where: { subject }, select: { startedAt: true, expiresAt: true } });
    if (pending && pending.expiresAt > new Date()) {
      await transaction.wowImport.update({ where: { subject }, data: { profileId: saved.id, expiresAt: new Date(pending.startedAt.getTime() + 29 * 86400000) } });
    }
    return { created: !existing };
  });
}

export async function saveBnetLogin(subject: string, account: BnetLogin) {
  await database().profile.updateMany({ where: { subject }, data: bnetProfileData(account) });
}

export async function deleteProfile(subject: string) {
  await withProfileLock(subject, async transaction => {
    await transaction.wowImport.deleteMany({ where: { subject } });
    await transaction.profile.deleteMany({ where: { subject } });
  });
}

export async function deleteAccount(subject: string, userId: string) {
  await withProfileLock(subject, async transaction => {
    await transaction.wowImport.deleteMany({ where: { subject } });
    await transaction.profile.deleteMany({ where: { subject } });
    await transaction.user.delete({ where: { id: userId, bnetSubject: subject } });
  });
}

async function withProfileLock<Result>(subject: string, action: (transaction: Prisma.TransactionClient) => Promise<Result>) {
  return database().$transaction(async transaction => {
    await transaction.$queryRaw`SELECT pg_advisory_xact_lock(hashtextextended(${subject}, 0))::text`;
    return action(transaction);
  }, { maxWait: 10000, timeout: 15000 });
}

export async function beginWowImport(subject: string) {
  await purgeExpiredWowImports();
  return withProfileLock(subject, async transaction => {
    const profile = await transaction.profile.findUnique({ where: { subject }, select: { id: true } });
    const startedAt = new Date();
    const runId = randomUUID();
    const snapshot: WowSnapshot = { schemaVersion: 1, startedAt: startedAt.toISOString(), completedAt: null, status: "running", scopes: [] };
    const data = { runId, profileId: profile?.id ?? null, snapshot: snapshot as Prisma.InputJsonValue, startedAt, expiresAt: new Date(startedAt.getTime() + (profile ? 29 : 1) * 86400000) };
    await transaction.wowImport.upsert({ where: { subject }, create: { subject, ...data }, update: data });
    return runId;
  });
}

export async function saveWowImport(subject: string, runId: string, snapshot: WowSnapshot) {
  const result = await database().wowImport.updateMany({
    where: { subject, runId, expiresAt: { gt: new Date() } },
    data: { snapshot: snapshot as Prisma.InputJsonValue },
  });
  return result.count === 1;
}

export async function discardPendingWowImport(subject: string) {
  await withProfileLock(subject, transaction => transaction.wowImport.deleteMany({ where: { subject, profileId: null } }));
}

export async function purgeExpiredWowImports() {
  return database().wowImport.deleteMany({ where: { expiresAt: { lte: new Date() } } });
}

export async function claimFeedbackSlot(key: string) {
  const rows = await database().$queryRaw<{ key: string }[]>(feedbackRateLimitQuery(key));
  return rows.length === 1;
}

export async function purgeExpiredFeedbackLimits() {
  return database().$executeRaw`DELETE FROM soulmate_feedback_rate_limits WHERE next_allowed_at <= CURRENT_TIMESTAMP`;
}

export async function matchCandidates(subject: string, own: PlayerProfile): Promise<PublicProfile[]> {
  const rows = await database().profile.findMany({
    where: { subject: { not: subject }, discoverable: true, region: own.region, language: own.language },
    orderBy: { id: "asc" },
    include: questionnaireInclude,
    take: 500,
  });
  return rows.flatMap(row => {
    const parsed = profileSchema.safeParse(questionnaireData(row));
    return parsed.success ? [{ id: row.id, profile: parsed.data }] : [];
  });
}