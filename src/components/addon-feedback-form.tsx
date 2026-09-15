"use client";

import { useActionState, useState } from "react";
import { Send } from "lucide-react";
import type { Locale } from "@/i18n/config";
import { addonText } from "@/i18n/addon";
import { operator } from "@/i18n/legal";
import { sendAddonFeedback, type FeedbackState } from "@/app/[locale]/addon/actions";
import { redditEventSignal } from "@/lib/reddit-events";
import { Button } from "./ui/button";

export function AddonFeedbackForm({ locale, available }: { locale: Locale; available: boolean }) {
  const text = addonText[locale];
  const [state, action, pending] = useActionState<FeedbackState, FormData>(async (previous, data) => {
    const result = await sendAddonFeedback(locale, previous, data);
    if (result.success) window.dispatchEvent(new Event(redditEventSignal));
    return result;
  }, { success: false, message: "" });
  const [message, setMessage] = useState("");
  return <form action={action} className="adventurer-form addon-feedback" aria-busy={pending}>
    <h2>{text.feedback}</h2>
    {!available && <p className="profile-notice" role="status">{text.unavailable} <a href={`mailto:${operator.email}`}>{operator.email}</a></p>}
    {state.success ? <p className="profile-notice" role="status">{state.message}</p> : <>
      <fieldset disabled={pending || !available}>
        <div className="profile-fields">
          <label className="profile-about">{text.message}<textarea name="message" required minLength={10} maxLength={4000} rows={7} value={message} onChange={event => setMessage(event.target.value)} /></label>
        </div>
        <Button type="submit" disabled={pending || !available}><Send size={16} aria-hidden="true" />{pending ? text.pending : text.submit}</Button>
      </fieldset>
      {state.message && <p className="profile-notice" role="alert">{state.message}</p>}
    </>}
  </form>;
}