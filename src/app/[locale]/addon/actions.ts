"use server";

import { isLocale, type Locale } from "@/i18n/config";
import { addonText } from "@/i18n/addon";
import { profileText } from "@/i18n/profile";
import { currentSubject } from "@/lib/auth";
import { addonFeedbackSchema, deliverAddonFeedback } from "@/lib/addon-feedback";
import { claimFeedbackSlot } from "@/lib/profile-store";
import { recordRedditEvent } from "@/lib/reddit-events-server";

export type FeedbackState = { success: boolean; message: string };

export async function sendAddonFeedback(locale: Locale, _previous: FeedbackState, form: FormData): Promise<FeedbackState> {
  if (!isLocale(locale)) throw new Error("Invalid locale");
  const text = addonText[locale];
  const subject = await currentSubject();
  if (!subject) return { success: false, message: profileText[locale].sessionExpired };
  const parsed = addonFeedbackSchema.safeParse({ email: form.get("email"), message: form.get("message") });
  if (!parsed.success) return { success: false, message: text.invalid };
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.FEEDBACK_FROM_EMAIL;
  if (!apiKey || !from) return { success: false, message: text.failed };
  const result = await deliverAddonFeedback(parsed.data, { apiKey, from, subject, claimSlot: claimFeedbackSlot });
  if (result === "sent") await recordRedditEvent("AddonFeedbackSubmitted");
  return { success: result === "sent", message: text[result] };
}