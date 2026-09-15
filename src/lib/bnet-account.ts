import { z } from "zod";

const identitySchema = z.object({ sub: z.string().min(1).max(255) });
const battleTagSchema = z.string().trim().min(1).max(128);
const emailSchema = z.email().max(254);

export function parseBnetAccount(userInfo: unknown, expectedSubject: string) {
  const identity = identitySchema.parse(userInfo);
  if (identity.sub !== expectedSubject) throw new Error("Battle.net subject mismatch");
  const claims = userInfo as Record<string, unknown>;
  const battleTag = battleTagSchema.safeParse(claims.battletag);
  const email = emailSchema.safeParse(claims.email);
  return {
    battleTag: battleTag.success ? battleTag.data : null,
    email: email.success ? email.data : null,
    emailVerified: email.success && typeof claims.email_verified === "boolean" ? claims.email_verified : null,
  };
}

export type BnetAccount = ReturnType<typeof parseBnetAccount>;
export type BnetLogin = BnetAccount & { loggedInAt: string };

export function bnetProfileData(account: BnetLogin) {
  return {
    bnetBattleTag: account.battleTag,
    bnetEmail: account.email,
    bnetEmailVerified: account.emailVerified,
    bnetLastLoginAt: new Date(account.loggedInAt),
  };
}