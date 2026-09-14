"use client";

import { useActionState, useRef, useState } from "react";
import { Plus, Save, Trash2 } from "lucide-react";
import { updateProfile } from "@/app/[locale]/profile/actions";
import { activities, ageGroups, classes, experiencePreferences, experiences, factions, goals, maxPlaytimes, priorities, profilePlaytimes, rolePreferences, roles, timezones, type PlayerProfile } from "@/lib/profile";
import { profileText, questionnaireText } from "@/i18n/profile";
import { locales, nativeLocaleNames, type Locale } from "@/i18n/config";
import { Button } from "./ui/button";

export function ProfileForm({ locale, profile }: { locale: Locale; profile: PlayerProfile | null }) {
  const text = profileText[locale];
  const questionnaire = questionnaireText[locale];
  const matchmaking = profile?.matchmaking;
  const [state, action, pending] = useActionState(updateProfile.bind(null, locale), { message: "", success: false });
  const [playtimes, setPlaytimes] = useState(() => (profile ? profilePlaytimes(profile) : [{ days: [], startHour: 18, endHour: 22 }]).map((playtime, id) => ({ ...playtime, id })));
  const nextPlaytimeId = useRef(playtimes.length);
  return <form action={action} className="adventurer-form">
    <fieldset disabled={pending}>
      <div className="profile-fields">
        <label>{text.alias}<input name="alias" required minLength={2} maxLength={24} defaultValue={profile?.alias || ""} autoComplete="nickname" /></label>
        <label>{text.language}<select name="language" defaultValue={profile?.language || locale}>{locales.map(language => <option key={language} value={language} lang={language}>{nativeLocaleNames[language]}</option>)}</select></label>
        <div className="profile-fields profile-location" role="group" aria-label={`${text.region}, ${text.timezone}`}>
          <label>{text.region}<select name="region" defaultValue={profile?.region || "EU"}><option>EU</option><option>US</option></select></label>
          <label>{text.timezone}<select name="timezone" defaultValue={profile?.timezone || "Europe/Berlin"}>{timezones.map(value => <option key={value}>{value}</option>)}</select></label>
        </div>
        <label>{text.role}<select name="role" defaultValue={profile?.role || "damage"}>{roles.map(role => <option key={role} value={role}>{role === "flexible" ? questionnaire.flexible : text.names[role]}</option>)}</select></label>
        <label>{text.experience}<select name="experience" defaultValue={profile?.experience || "returning"}>{experiences.map(value => <option key={value} value={value}>{text.names[value]}</option>)}</select></label>
        <label>{text.ageGroup}<select name="ageGroup" defaultValue={profile?.ageGroup || "private"}>{ageGroups.map(value => <option key={value} value={value}>{text.names[value] || value}</option>)}</select></label>
        <label className="profile-about">{text.about}<textarea name="about" rows={5} maxLength={1000} defaultValue={profile?.about || ""} aria-describedby="profile-about-help" /><span id="profile-about-help" className="profile-help">{text.aboutHelp}</span></label>
      </div>
      <fieldset className="profile-options"><legend>{text.activities}</legend>{activities.map(activity => <label key={activity}><input type="checkbox" name="activities" value={activity} defaultChecked={profile?.activities.includes(activity) || false} /><span>{text.names[activity]}</span></label>)}</fieldset>
      <section className="profile-questionnaire" aria-labelledby="profile-own-title">
        <h2 id="profile-own-title">{questionnaire.own}</h2>
        <fieldset className="profile-options"><legend>{questionnaire.classes}</legend>{classes.map(playerClass => <label key={playerClass}><input type="checkbox" name="classes" value={playerClass} defaultChecked={matchmaking?.classes.includes(playerClass) || false} /><span>{questionnaire.classesNames[playerClass]}</span></label>)}</fieldset>
        <fieldset className="profile-options"><legend>{questionnaire.factions}</legend>{factions.map(faction => <label key={faction}><input type="checkbox" name="factions" value={faction} defaultChecked={matchmaking?.factions.includes(faction) || false} /><span>{questionnaire.factionsNames[faction]}</span></label>)}</fieldset>
        <fieldset className="profile-options"><legend>{questionnaire.goals}</legend>{goals.map(goal => <label key={goal}><input type="checkbox" name="goals" value={goal} defaultChecked={matchmaking?.goals.includes(goal) || false} /><span>{questionnaire.goalsNames[goal]}</span></label>)}</fieldset>
      </section>
      <section className="profile-questionnaire" aria-labelledby="profile-seeking-title">
        <h2 id="profile-seeking-title">{questionnaire.seeking}</h2>
        <fieldset className="profile-options"><legend>{questionnaire.preferredClasses}</legend>{classes.map(playerClass => <label key={playerClass}><input type="checkbox" name="preferredClasses" value={playerClass} defaultChecked={matchmaking?.preferredClasses.includes(playerClass) || false} /><span>{questionnaire.classesNames[playerClass]}</span></label>)}</fieldset>
        <div className="profile-fields">
          {(["goalPriority", "classPriority", "factionPriority"] as const).map(name => <label key={name}>{questionnaire[name]}<select name={name} defaultValue={matchmaking?.[name] || "wish"}>{priorities.map(priority => <option key={priority} value={priority}>{questionnaire.priorities[priority]}</option>)}</select></label>)}
        </div>
        <div className="profile-fields profile-preference-row">
          <label>{questionnaire.rolePreference}<select name="rolePreference" defaultValue={matchmaking?.rolePreference || "any"}>{rolePreferences.map(preference => <option key={preference} value={preference}>{questionnaire.rolePreferences[preference]}</option>)}</select></label>
          <label>{questionnaire.rolePriority}<select name="rolePriority" defaultValue={matchmaking?.rolePriority || "wish"}>{priorities.map(priority => <option key={priority} value={priority}>{questionnaire.priorities[priority]}</option>)}</select></label>
          <label>{questionnaire.experiencePreference}<select name="experiencePreference" defaultValue={matchmaking?.experiencePreference || "any"}>{experiencePreferences.map(preference => <option key={preference} value={preference}>{questionnaire.experiencePreferences[preference]}</option>)}</select></label>
          <label>{questionnaire.experiencePriority}<select name="experiencePriority" defaultValue={matchmaking?.experiencePriority || "wish"}>{priorities.map(priority => <option key={priority} value={priority}>{questionnaire.priorities[priority]}</option>)}</select></label>
        </div>
      </section>
      <fieldset className="profile-playtimes" aria-describedby="playtimes-help">
        <legend>{text.playtimesTitle}</legend>
        {playtimes.map((playtime, index) => <fieldset key={playtime.id} className="playtime-block">
          <legend>{text.playtime} {index + 1}</legend>
          <input type="hidden" name="playtimeId" value={playtime.id} />
          <fieldset className="profile-options playtime-days"><legend>{text.days}</legend>{text.weekdays.map((day, dayIndex) => <label key={day}><input type="checkbox" name={`playtimes.${playtime.id}.days`} value={dayIndex + 1} checked={playtime.days.includes(dayIndex + 1)} onChange={event => {
            const checked = event.target.checked;
            setPlaytimes(current => current.map(slot => slot.id === playtime.id ? { ...slot, days: checked ? [...slot.days, dayIndex + 1] : slot.days.filter(value => value !== dayIndex + 1) } : slot));
          }} /><span>{day}</span></label>)}</fieldset>
          <div className="playtime-controls">
            <div className="profile-fields schedule-fields">
              <label>{text.start}<select name={`playtimes.${playtime.id}.startHour`} value={playtime.startHour} onChange={event => {
                const startHour = Number(event.target.value);
                setPlaytimes(current => current.map(slot => slot.id === playtime.id ? { ...slot, startHour } : slot));
              }}>{Array.from({ length: 24 }, (_, hour) => <option key={hour} value={hour}>{String(hour).padStart(2, "0")}:00</option>)}</select></label>
              <label>{text.end}<select name={`playtimes.${playtime.id}.endHour`} value={playtime.endHour} onChange={event => {
                const endHour = Number(event.target.value);
                setPlaytimes(current => current.map(slot => slot.id === playtime.id ? { ...slot, endHour } : slot));
              }}>{Array.from({ length: 24 }, (_, hourIndex) => hourIndex + 1).map(hour => <option key={hour} value={hour}>{String(hour).padStart(2, "0")}:00</option>)}</select></label>
            </div>
            <Button type="button" className="secondary-button playtime-remove" title={`${text.removePlaytime} ${index + 1}`} aria-label={`${text.removePlaytime} ${index + 1}`} disabled={playtimes.length === 1} onClick={() => setPlaytimes(current => current.filter(slot => slot.id !== playtime.id))}><Trash2 size={17} /></Button>
          </div>
        </fieldset>)}
        <Button type="button" className="secondary-button" disabled={playtimes.length >= maxPlaytimes} onClick={() => {
          const id = nextPlaytimeId.current++;
          setPlaytimes(current => [...current, { id, days: [], startHour: 18, endHour: 22 }]);
        }}><Plus size={17} />{text.addPlaytime}</Button>
        <p id="playtimes-help" className="profile-help">{text.playtimeHelp}</p>
      </fieldset>
      <label className="consent-row"><input type="checkbox" name="adult" required defaultChecked={profile?.adult || false} /><span>{text.adult}</span></label>
      <label className="consent-row"><input type="checkbox" name="discoverable" defaultChecked={profile?.discoverable || false} /><span>{text.discoverable}</span></label>
      <Button type="submit" disabled={pending}><Save size={17} />{pending ? text.saving : text.save}</Button>
    </fieldset>
    <p role="status" className={state.success ? "profile-feedback" : "form-error"}>{state.message}</p>
  </form>;
}