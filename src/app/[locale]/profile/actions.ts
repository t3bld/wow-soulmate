"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { isLocale, type Locale } from "@/i18n/config";
import { profileText, questionnaireText, roleSelectionText } from "@/i18n/profile";
import { currentSubject, identitySession } from "@/lib/auth";
import { parseMatchmaking, parsePlaytimes, profileSchema, type PlayerProfile } from "@/lib/profile";
import { deleteProfile, discardPendingWowImport, saveProfile } from "@/lib/profile-store";

export type SaveState = { message: string; success: false } | { message: string; success: true; profile: PlayerProfile };

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
  const parsed = profileSchema.safeParse({
    alias: form.get("alias"), region: form.get("region"), language: form.get("language"), roles: roles.data,
    about: form.get("about") ?? "",
    matchmaking: matchmaking.data,
    experience: form.get("experience"), ageGroup: form.get("ageGroup"), timezone: form.get("timezone"),
    activities: form.getAll("activities"), playtimes: playtimes.data,
    adult: form.get("adult") === "on", discoverable: form.get("discoverable") === "on",
  });
  if (!parsed.success) return { message: text.invalid, success: false };
  try {
    const session = await identitySession();
    await saveProfile(subject, parsed.data, session.subject === subject ? session.account : undefined);
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
  const session = await identitySession();
  try {
    if (session.subject) await discardPendingWowImport(session.subject);
  } finally {
    session.destroy();
  }
  redirect(`/${locale}/profile`);
}

export async function removeProfile(locale: Locale, form: FormData) {
  if (!isLocale(locale)) throw new Error("Invalid locale");
  const subject = await currentSubject();
  if (!subject) redirect(`/${locale}/profile`);
  if (form.get("confirmDelete") !== "on") redirect(`/${locale}/profile?status=delete-error`);
  try { await deleteProfile(subject); }
  catch { redirect(`/${locale}/profile?status=delete-error`); }
  (await identitySession()).destroy();
  revalidatePath(`/${locale}/profile`);
  revalidatePath(`/${locale}/soulmates`);
  redirect(`/${locale}/profile?status=deleted`);
}