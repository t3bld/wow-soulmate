"use client";

import { useActionState } from "react";
import { Save } from "lucide-react";
import { updateProfile } from "@/app/[locale]/profile/actions";
import { activities, ageGroups, experiences, roles, timezones, type PlayerProfile } from "@/lib/profile";
import { profileText } from "@/i18n/profile";
import type { Locale } from "@/i18n/config";
import { Button } from "./ui/button";

export function ProfileForm({ locale, profile }: { locale: Locale; profile: PlayerProfile | null }) {
  const text = profileText[locale];
  const [state, action, pending] = useActionState(updateProfile.bind(null, locale), { message: "", success: false });
  return <form action={action} className="adventurer-form">
    <fieldset disabled={pending}>
      <div className="profile-fields">
        <label>{text.alias}<input name="alias" required minLength={2} maxLength={24} defaultValue={profile?.alias || ""} autoComplete="nickname" /></label>
        <label>{text.region}<select name="region" defaultValue={profile?.region || "EU"}><option>EU</option><option>US</option></select></label>
        <label>{text.language}<select name="language" defaultValue={profile?.language || locale}><option value="en">English</option><option value="de">Deutsch</option></select></label>
        <label>{text.role}<select name="role" defaultValue={profile?.role || "damage"}>{roles.map(role => <option key={role} value={role}>{text.names[role]}</option>)}</select></label>
        <label>{text.experience}<select name="experience" defaultValue={profile?.experience || "returning"}>{experiences.map(value => <option key={value} value={value}>{text.names[value]}</option>)}</select></label>
        <label>{text.ageGroup}<select name="ageGroup" defaultValue={profile?.ageGroup || "private"}>{ageGroups.map(value => <option key={value} value={value}>{text.names[value] || value}</option>)}</select></label>
      </div>
      <fieldset className="profile-options"><legend>{text.activities}</legend>{activities.map(activity => <label key={activity}><input type="checkbox" name="activities" value={activity} defaultChecked={profile?.activities.includes(activity) || false} /><span>{text.names[activity]}</span></label>)}</fieldset>
      <fieldset className="profile-options"><legend>{text.days}</legend>{text.weekdays.map((day, index) => <label key={day}><input type="checkbox" name="days" value={index + 1} defaultChecked={profile?.days.includes(index + 1) || false} /><span>{day}</span></label>)}</fieldset>
      <div className="profile-fields schedule-fields">
        <label>{text.timezone}<select name="timezone" defaultValue={profile?.timezone || "Europe/Berlin"}>{timezones.map(value => <option key={value}>{value}</option>)}</select></label>
        <label>{text.start}<select name="startHour" defaultValue={profile?.startHour ?? 18}>{Array.from({ length: 24 }, (_, hour) => <option key={hour} value={hour}>{String(hour).padStart(2, "0")}:00</option>)}</select></label>
        <label>{text.end}<select name="endHour" defaultValue={profile?.endHour ?? 22}>{Array.from({ length: 24 }, (_, index) => index + 1).map(hour => <option key={hour} value={hour}>{String(hour).padStart(2, "0")}:00</option>)}</select></label>
      </div>
      <p className="profile-help">{text.schedule}</p>
      <label className="consent-row"><input type="checkbox" name="adult" required defaultChecked={profile?.adult || false} /><span>{text.adult}</span></label>
      <label className="consent-row"><input type="checkbox" name="discoverable" defaultChecked={profile?.discoverable || false} /><span>{text.discoverable}</span></label>
      <Button type="submit" disabled={pending}><Save size={17} />{pending ? text.saving : text.save}</Button>
    </fieldset>
    <p role="status" className={state.success ? "profile-feedback" : "form-error"}>{state.message}</p>
  </form>;
}