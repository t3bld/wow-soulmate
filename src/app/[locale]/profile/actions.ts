"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { isLocale, type Locale } from "@/i18n/config";
import { notificationEmailText, profileText, questionnaireText, roleSelectionText } from "@/i18n/profile";
import { currentIdentity, currentSubject, endSession } from "@/lib/auth";
import { notificationEmailSchema, ownProfileSchema, parseMatchmaking, parsePlaytimes, profileSchema, type OwnProfile } from "@/lib/profile";
import { database, deleteAccount, discardPendingWowImport, saveProfile } from "@/lib/profile-store";
import { recordRedditEvent } from "@/lib/reddit-events-server";

export type SaveState = { message: string; success: false } | { message: string; success: true; profile: OwnProfile };

export async function updateProfile(locale: Locale, _previous: SaveState, form: FormData): Promise<SaveState> {
  if (!isLocale(locale)) throw new Error("Invalid locale");
  const text = profileText[locale];
  const subject = await currentSubject();
  if (!subject) return { message: text.sessionExpired, success: false };
  const playtimes = parsePlaytimes(form);
  if (!playtimes.success) return { message: text.invalid, success: false };
  const matchmaking = parseMatchmaking(form);
  if (!matchmaking.success) return { message: questionnaireText[locale].invalid, success: false };
  const roles = profileSchema.shape.roles.safeParse(form.getAll("roles"));
  if (!roles.success) return { message: roleSelectionText[locale].required, success: false };
  const email = notificationEmailSchema.safeParse(form.get("notificationEmail"));
  if (!email.success) return { message: notificationEmailText[locale].invalid, success: false };
  const parsed = ownProfileSchema.safeParse({
    alias: form.get("alias"), region: form.get("region"), language: form.get("language"), roles: roles.data,
    about: form.get("about") ?? "",
    notificationEmail: email.data,
    matchmaking: matchmaking.data,
    experience: form.get("experience"), ageGroup: form.get("ageGroup"), timezone: form.get("timezone"),
    activities: form.getAll("activities"), playtimes: playtimes.data,
    adult: form.get("adult") === "on", discoverable: form.get("discoverable") === "on",
  });
  if (!parsed.success) return { message: text.invalid, success: false };
  try {
    const identity = await currentIdentity();
    if (!identity || identity.subject !== subject) return { message: text.sessionExpired, success: false };
    const saved = await saveProfile(subject, parsed.data, identity.account, identity.userId);
    if (saved.created) await recordRedditEvent("SignUp", `/${locale}/profile`);
  }
  catch (error) {
    const code = error && typeof error === "object" && "code" in error && typeof error.code === "string" && /^P\d{4}$/.test(error.code) ? error.code : undefined;
    const kind = error instanceof Error && /^[A-Za-z]+Error$/.test(error.name) ? error.name : "UnknownError";
    const invalidArgument = error instanceof Error ? error.message.match(/Unknown argument `([A-Za-z_][A-Za-z0-9_]*)`/)?.[1] : undefined;
    console.error("Profile save failed", { kind, code, invalidArgument });
    return { message: text.databaseError, success: false };
  }
  revalidatePath(`/${locale}/profile`);
  revalidatePath(`/${locale}/soulmates`);
  return { message: text.saved, success: true, profile: parsed.data };
}

export async function logout(locale: Locale) {
  if (!isLocale(locale)) throw new Error("Invalid locale");
  const subject = await currentSubject();
  try {
    if (subject) await discardPendingWowImport(subject);
  } finally {
    await endSession();
  }
  redirect(`/${locale}/profile`);
}

export async function removeProfile(locale: Locale, form: FormData) {
  if (!isLocale(locale)) throw new Error("Invalid locale");
  const identity = await currentIdentity();
  if (!identity) redirect(`/${locale}/profile`);
  const { subject, userId } = identity;
  if (form.get("confirmDelete") !== "on") redirect(`/${locale}/profile?status=delete-error`);
  if (Date.now() - identity.session.createdAt.getTime() > 900000) redirect(`/oauth/login?locale=${locale}`);
  try {
    await deleteAccount(subject, userId);
  }
  catch { redirect(`/${locale}/profile?status=delete-error`); }
  await endSession();
  revalidatePath(`/${locale}/profile`);
  revalidatePath(`/${locale}/soulmates`);
  redirect(`/${locale}/profile?status=deleted`);
}

export async function manageSessions(locale: Locale, form: FormData) {
  if (!isLocale(locale)) throw new Error("Invalid locale");
  const identity = await currentIdentity();
  if (!identity) redirect(`/${locale}`);
  const mode = form.get("mode");
  const sessionId = form.get("sessionId");
  if (mode !== "all" && mode !== "others" && (mode !== "one" || typeof sessionId !== "string" || sessionId.length > 255)) throw new Error("Invalid session action");
  try {
    await database().session.deleteMany({ where: {
      userId: identity.userId,
      ...(mode === "others" ? { id: { not: identity.session.id } } : mode === "one" ? { id: sessionId as string } : {}),
    } });
  } catch { redirect(`/${locale}/profile?status=session-error`); }
  if (mode === "all" || sessionId === identity.session.id) {
    await endSession();
    redirect(`/${locale}`);
  }
  revalidatePath(`/${locale}/profile`);
}