"use client";

import { useRouter } from "next/navigation";
import { startTransition, useActionState, useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
import { ArrowLeft, ArrowRight, Check, Pencil, Plus, Save, Trash2, X } from "lucide-react";
import { updateProfile, type SaveState } from "@/app/[locale]/profile/actions";
import { activities, ageGroups, classes, experiencePreferences, experiences, factions, maxPlaytimes, notificationEmailSchema, parseMatchmaking, parsePlaytimes, priorities, profilePlaytimes, profileRoles, profileSchema, rolePreferences, roles, timezones, type OwnProfile } from "@/lib/profile";
import { notificationEmailText, profileOverviewText, profileText, questionnaireText, roleSelectionText } from "@/i18n/profile";
import { locales, nativeLocaleNames, type Locale } from "@/i18n/config";
import { ProfileAccountActions } from "./profile-account-actions";
import { Button } from "./ui/button";
import { redditEventSignal } from "@/lib/reddit-events";

export function ProfileForm({ locale, profile }: { locale: Locale; profile: OwnProfile | null }) {
  const router = useRouter();
  const text = profileText[locale];
  const overview = profileOverviewText[locale];
  const questionnaire = questionnaireText[locale];
  const [savedProfile, setSavedProfile] = useState(profile);
  const [editing, setEditing] = useState(!profile);
  const [saved, setSaved] = useState(false);
  const regionRef = useRef<HTMLElement>(null);
  const focusRequested = useRef(false);

  useEffect(() => {
    if (!focusRequested.current) return;
    focusRequested.current = false;
    regionRef.current?.focus({ preventScroll: true });
    regionRef.current?.scrollIntoView({ block: "start", behavior: "instant" });
  }, [editing]);

  function changeView(nextEditing: boolean) {
    focusRequested.current = true;
    setEditing(nextEditing);
  }

  const preferences = savedProfile?.matchmaking;
  const groups = savedProfile ? [
    { title: text.wizard.titles[0], rows: [
      [text.alias, savedProfile.alias],
      [text.ageGroup, text.names[savedProfile.ageGroup] || savedProfile.ageGroup],
      [text.language, nativeLocaleNames[savedProfile.language]],
      [text.region, savedProfile.region],
      [text.about, savedProfile.about],
    ] },
    { title: text.wizard.titles[1], rows: [
      [roleSelectionText[locale].label, profileRoles(savedProfile).map(role => text.names[role]).join(", ")],
      [text.experience, text.names[savedProfile.experience]],
      [questionnaire.classes, preferences?.classes.map(value => questionnaire.classesNames[value]).join(", ")],
      [questionnaire.factions, preferences?.factions.map(value => questionnaire.factionsNames[value]).join(", ")],
    ] },
    { title: text.wizard.titles[3], rows: [
      [questionnaire.preferredClasses, preferences?.preferredClasses.map(value => questionnaire.classesNames[value]).join(", ")],
      [questionnaire.classPriority, preferences && questionnaire.priorities[preferences.classPriority]],
      [questionnaire.rolePreference, preferences && questionnaire.rolePreferences[preferences.rolePreference]],
      [questionnaire.rolePriority, preferences && questionnaire.priorities[preferences.rolePriority]],
      [questionnaire.experiencePreference, preferences && questionnaire.experiencePreferences[preferences.experiencePreference]],
      [questionnaire.experiencePriority, preferences && questionnaire.priorities[preferences.experiencePriority]],
    ] },
  ] : [];

  return <><section ref={regionRef} className="profile-editor" tabIndex={-1} aria-label={text.title}>
    {editing ? <ProfileWizard locale={locale} profile={savedProfile} onCancel={savedProfile ? () => changeView(false) : undefined} onSaved={updated => {
      setSavedProfile(updated);
      setSaved(true);
      if (!profile) {
        router.push(`/${locale}/soulmates`);
        return;
      }
      changeView(false);
    }} /> : savedProfile && <>
      <div className="profile-summary-header">
        <div><h2>{savedProfile.alias}</h2><p className="profile-summary-status">{savedProfile.discoverable ? overview.visible : overview.hidden}</p></div>
        <Button type="button" className="secondary-button" onClick={() => { setSaved(false); changeView(true); }}><Pencil size={16} aria-hidden="true" />{overview.edit}</Button>
      </div>
      <div className="profile-summary-details">
        {groups.map((group, index) => <section className="profile-summary-group" key={group.title} aria-labelledby={`profile-summary-group-${index}`}>
          <h3 id={`profile-summary-group-${index}`}>{group.title}</h3>
          <dl>{group.rows.map(([label, value]) => <div key={label} className={label === text.about ? "profile-summary-wide" : undefined}>
            <dt>{label}</dt><dd className={!value ? "profile-summary-empty" : undefined}>{value || overview.empty}</dd>
          </div>)}</dl>
          {index === 1 && <section className="profile-summary-adventures" aria-labelledby="profile-summary-adventures">
            <h4 id="profile-summary-adventures">{text.activities}</h4>
            <ul>{savedProfile.activities.map(activity => <li key={activity}><Check size={15} aria-hidden="true" />{text.names[activity]}</li>)}</ul>
          </section>}
        </section>)}
        <section className="profile-summary-group" aria-labelledby="profile-summary-playtimes">
          <h3 id="profile-summary-playtimes">{text.playtimesTitle}</h3>
          <dl><div><dt>{text.timezone}</dt><dd>{savedProfile.timezone}</dd></div></dl>
          <div className="profile-summary-schedule"><table>
            <thead><tr><th scope="col">{text.days}</th><th scope="col">{text.start}</th><th scope="col">{text.end}</th></tr></thead>
            <tbody>{profilePlaytimes(savedProfile).map((slot, index) => <tr key={index}>
              <th scope="row">{[...slot.days].sort((first, second) => first - second).map(day => text.weekdays[day - 1]).join(", ")}</th>
              <td>{String(slot.startHour).padStart(2, "0")}:00</td><td>{String(slot.endHour).padStart(2, "0")}:00</td>
            </tr>)}</tbody>
          </table></div>
        </section>
        <section className="profile-summary-group" aria-labelledby="profile-summary-settings">
          <h3 id="profile-summary-settings">{overview.settings}</h3>
          <p className="profile-summary-status">{savedProfile.discoverable ? overview.visible : overview.hidden}</p>
          <dl><div><dt>{notificationEmailText[locale].label}</dt><dd>{savedProfile.notificationEmail || overview.empty}</dd></div></dl>
          {savedProfile.adult && <p className="profile-summary-consent"><Check size={16} aria-hidden="true" />{text.adult}</p>}
        </section>
      </div>
    </>}
    <p role="status" className="profile-feedback">{saved && !editing ? text.saved : ""}</p>
  </section>
    {!editing && savedProfile && <ProfileAccountActions locale={locale} canDelete />}
  </>;
}

function ProfileWizard({ locale, profile, onSaved, onCancel }: { locale: Locale; profile: OwnProfile | null; onSaved: (profile: OwnProfile) => void; onCancel?: () => void }) {
  const text = profileText[locale];
  const questionnaire = questionnaireText[locale];
  const wizard = text.wizard;
  const matchmaking = profile?.matchmaking;
  const [step, setStep] = useState(0);
  const formRef = useRef<HTMLFormElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const [state, action, pending] = useActionState<SaveState, FormData>(async (previous, data) => {
    const result = await updateProfile(locale, previous, data);
    if (result.success) {
      window.dispatchEvent(new Event(redditEventSignal));
      onSaved(result.profile);
    }
    return result;
  }, { message: "", success: false });
  const [playtimes, setPlaytimes] = useState(() => (profile ? profilePlaytimes(profile) : [{ days: [], startHour: 18, endHour: 22 }]).map((playtime, id) => ({ ...playtime, id })));
  const nextPlaytimeId = useRef(playtimes.length);
  const lastStep = wizard.titles.length - 1;
  const progress = Math.round(step / lastStep * 100);

  function showStep(nextStep: number) {
    flushSync(() => setStep(nextStep));
    headingRef.current?.focus({ preventScroll: true });
    formRef.current?.scrollIntoView({ block: "start", behavior: "instant" });
  }

  function validateStep(index: number) {
    const form = formRef.current!;
    const controls = Array.from(form.querySelectorAll<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>(`[data-profile-step="${index}"] input, [data-profile-step="${index}"] select, [data-profile-step="${index}"] textarea`));
    controls.forEach(control => control.setCustomValidity(""));
    const data = new FormData(form);
    const setError = (name: string, message: string) => controls.find(control => control.name === name)?.setCustomValidity(message);

    if (index === 0 && !profileSchema.shape.alias.safeParse(data.get("alias")).success) setError("alias", text.invalid);
    if (index === lastStep && !notificationEmailSchema.safeParse(data.get("notificationEmail")).success) setError("notificationEmail", notificationEmailText[locale].invalid);
    if (index === 1 && !profileSchema.shape.roles.safeParse(data.getAll("roles")).success) setError("roles", roleSelectionText[locale].required);
    if (index === 2 && !data.getAll("activities").length) setError("activities", wizard.activitiesRequired);
    if (index === 2 || index === 3 || index === 4) {
      const result = parseMatchmaking(data);
      if (!result.success) result.error.issues.forEach(issue => setError(String(issue.path[0]), questionnaire.invalid));
    }
    if (index === 5) {
      const result = parsePlaytimes(data);
      if (!result.success) result.error.issues.forEach(issue => {
        const playtime = playtimes[Number(issue.path[0])];
        if (playtime) setError(`playtimes.${playtime.id}.${String(issue.path[1])}`, issue.path[1] === "days" ? wizard.daysRequired : wizard.timeInvalid);
      });
    }
    const invalid = controls.find(control => !control.validity.valid);
    if (!invalid) return true;
    if (index !== step) showStep(index);
    invalid.reportValidity();
    return false;
  }

  return <form ref={formRef} className="adventurer-form" noValidate onSubmit={event => {
    event.preventDefault();
    if (pending) return;
    if (step < lastStep) {
      if (validateStep(step)) showStep(step + 1);
      return;
    }
    for (let index = 0; index <= lastStep; index++) {
      if (!validateStep(index)) return;
    }
    const data = new FormData(event.currentTarget);
    startTransition(() => action(data));
  }} onInput={event => {
    event.currentTarget.querySelectorAll<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>("input, select, textarea").forEach(control => control.setCustomValidity(""));
  }} aria-busy={pending}>
    <header className="profile-wizard-header">
      <div className="profile-progress-label"><strong>{progress} %</strong></div>
      <progress className="profile-progress" aria-label={`${progress} %`} max={100} value={progress}>{progress} %</progress>
      <h2 id="profile-wizard-title" ref={headingRef} tabIndex={-1}>{wizard.titles[step]}</h2>
    </header>
    <fieldset disabled={pending}>
      <section className="profile-step" data-profile-step={0} hidden={step !== 0} aria-labelledby="profile-wizard-title">
      <div className="profile-fields">
        <label>{text.alias}<input name="alias" required minLength={2} maxLength={24} defaultValue={profile?.alias || ""} autoComplete="nickname" /></label>
        <label>{text.language}<select name="language" defaultValue={profile?.language || locale}>{locales.map(language => <option key={language} value={language} lang={language}>{nativeLocaleNames[language]}</option>)}</select></label>
        <label>{text.region}<select name="region" defaultValue={profile?.region || "EU"}><option>EU</option><option>US</option></select></label>
        <label>{text.ageGroup}<select name="ageGroup" required defaultValue={profile?.ageGroup || ""}><option value="" disabled hidden>{text.ageGroup}</option>{ageGroups.map(value => <option key={value} value={value}>{text.names[value] || value}</option>)}</select></label>
        <label className="profile-about">{text.about}<textarea name="about" rows={4} maxLength={1000} defaultValue={profile?.about || ""} /></label>
      </div>
      </section>
      <section className="profile-step" data-profile-step={1} hidden={step !== 1} aria-labelledby="profile-wizard-title">
      <fieldset className="profile-options"><legend>{roleSelectionText[locale].label}</legend>{roles.map(role => <label key={role}><input type="checkbox" name="roles" value={role} defaultChecked={profile ? profileRoles(profile).includes(role) : false} /><span>{text.names[role]}</span></label>)}</fieldset>
        <fieldset className="profile-options"><legend>{questionnaire.classes}</legend>{classes.map(playerClass => <label key={playerClass}><input type="checkbox" name="classes" value={playerClass} defaultChecked={matchmaking?.classes.includes(playerClass) || false} /><span>{questionnaire.classesNames[playerClass]}</span></label>)}</fieldset>
        <fieldset className="profile-options"><legend>{questionnaire.factions}</legend>{factions.map(faction => <label key={faction}><input type="checkbox" name="factions" value={faction} defaultChecked={matchmaking?.factions.includes(faction) || false} /><span>{questionnaire.factionsNames[faction]}</span></label>)}</fieldset>
      <div className="profile-fields">
        <label>{text.experience}<select name="experience" defaultValue={profile?.experience || "returning"}>{experiences.map(value => <option key={value} value={value}>{text.names[value]}</option>)}</select></label>
      </div>
      </section>
      <section className="profile-step" data-profile-step={2} hidden={step !== 2} aria-labelledby="profile-wizard-title">
        <fieldset className="profile-options"><legend>{text.activities}</legend>{activities.map(activity => <label key={activity}><input type="checkbox" name="activities" value={activity} defaultChecked={profile?.activities.includes(activity) || false} /><span>{text.names[activity]}</span></label>)}</fieldset>
      </section>
      <section className="profile-step" data-profile-step={3} hidden={step !== 3} aria-labelledby="profile-wizard-title">
        <fieldset className="profile-options"><legend>{questionnaire.preferredClasses}</legend>{classes.map(playerClass => <label key={playerClass}><input type="checkbox" name="preferredClasses" value={playerClass} defaultChecked={matchmaking?.preferredClasses.includes(playerClass) || false} /><span>{questionnaire.classesNames[playerClass]}</span></label>)}</fieldset>
        <div className="profile-fields">
          <label>{questionnaire.classPriority}<select name="classPriority" defaultValue={matchmaking?.classPriority || "wish"}>{priorities.map(priority => <option key={priority} value={priority}>{questionnaire.priorities[priority]}</option>)}</select></label>
        </div>
      </section>
      <section className="profile-step" data-profile-step={4} hidden={step !== 4} aria-labelledby="profile-wizard-title">
        <div className="profile-fields">
          <label>{questionnaire.rolePreference}<select name="rolePreference" defaultValue={matchmaking?.rolePreference || "any"}>{rolePreferences.map(preference => <option key={preference} value={preference}>{questionnaire.rolePreferences[preference]}</option>)}</select></label>
          <label>{questionnaire.rolePriority}<select name="rolePriority" defaultValue={matchmaking?.rolePriority || "wish"}>{priorities.map(priority => <option key={priority} value={priority}>{questionnaire.priorities[priority]}</option>)}</select></label>
          <label>{questionnaire.experiencePreference}<select name="experiencePreference" defaultValue={matchmaking?.experiencePreference || "any"}>{experiencePreferences.map(preference => <option key={preference} value={preference}>{questionnaire.experiencePreferences[preference]}</option>)}</select></label>
          <label>{questionnaire.experiencePriority}<select name="experiencePriority" defaultValue={matchmaking?.experiencePriority || "wish"}>{priorities.map(priority => <option key={priority} value={priority}>{questionnaire.priorities[priority]}</option>)}</select></label>
        </div>
      </section>
      <section className="profile-step" data-profile-step={5} hidden={step !== 5} aria-labelledby="profile-wizard-title">
      <div className="profile-fields">
        <label>{text.timezone}<select name="timezone" defaultValue={profile?.timezone || "Europe/Berlin"}>{timezones.map(value => <option key={value}>{value}</option>)}</select></label>
      </div>
      <fieldset className="profile-playtimes">
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
      </fieldset>
      </section>
      <section className="profile-step" data-profile-step={6} hidden={step !== 6} aria-labelledby="profile-wizard-title">
      <label className="consent-row"><input type="checkbox" name="adult" required defaultChecked={profile?.adult || false} /><span>{text.adult}</span></label>
      <label className="consent-row"><input type="checkbox" name="discoverable" defaultChecked={profile?.discoverable || false} /><span>{text.discoverable}</span></label>
      <div className="profile-fields">
        <label className="profile-about">{notificationEmailText[locale].label}<input type="email" name="notificationEmail" maxLength={254} autoComplete="email" autoCapitalize="none" spellCheck={false} defaultValue={profile?.notificationEmail || ""} aria-describedby="notification-email-hint" /></label>
      </div>
      <p id="notification-email-hint" className="profile-help">{notificationEmailText[locale].hint}</p>
      </section>
      <div className="profile-wizard-actions">
        {onCancel && <Button type="button" className="secondary-button" onClick={onCancel}><X size={17} aria-hidden="true" />{profileOverviewText[locale].cancel}</Button>}
        {step > 0 && <Button type="button" className="secondary-button" onClick={() => showStep(step - 1)}><ArrowLeft size={17} aria-hidden="true" />{wizard.back}</Button>}
        <Button type="submit" className="profile-wizard-next" disabled={pending}>{step === lastStep ? <><Save size={17} aria-hidden="true" />{pending ? text.saving : text.save}</> : <>{wizard.next}<ArrowRight size={17} aria-hidden="true" /></>}</Button>
      </div>
    </fieldset>
    <p role="status" className={state.success ? "profile-feedback" : "form-error"}>{state.message}</p>
  </form>;
}