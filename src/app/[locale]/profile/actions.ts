"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { isLocale, type Locale } from "@/i18n/config";
import { profileText, questionnaireText } from "@/i18n/profile";
import { currentSubject, identitySession } from "@/lib/auth";
import { parseMatchmaking, parsePlaytimes, profileSchema } from "@/lib/profile";
import { deleteProfile, saveProfile } from "@/lib/profile-store";

export type SaveState = { message: string; success: boolean };

export async function updateProfile(locale: Locale, _previous: SaveState, form: FormData): Promise<SaveState> {
  if (!isLocale(locale)) throw new Error("Invalid locale");
  const text = profileText[locale];
  const subject = await currentSubject();
  if (!subject) return { message: text.sessionExpired, success: false };
  const playtimes = parsePlaytimes(form);
  if (!playtimes.success) return { message: text.invalid, success: false };
  const matchmaking = parseMatchmaking(form);
  if (!matchmaking.success) return { message: questionnaireText[locale].invalid, success: false };
  const parsed = profileSchema.safeParse({
    alias: form.get("alias"), region: form.get("region"), language: form.get("language"), role: form.get("role"),
    about: form.get("about") ?? "",
    matchmaking: matchmaking.data,
    experience: form.get("experience"), ageGroup: form.get("ageGroup"), timezone: form.get("timezone"),
    activities: form.getAll("activities"), ...playtimes.data[0], playtimes: playtimes.data,
    adult: form.get("adult") === "on", discoverable: form.get("discoverable") === "on",
  });
  if (!parsed.success) return { message: text.invalid, success: false };
  try { await saveProfile(subject, parsed.data); }
  catch { return { message: text.databaseError, success: false }; }
  revalidatePath(`/${locale}/profile`);
  return { message: text.saved, success: true };
}

export async function logout(locale: Locale) {
  if (!isLocale(locale)) throw new Error("Invalid locale");
  (await identitySession()).destroy();
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
  redirect(`/${locale}/profile?status=deleted`);
}