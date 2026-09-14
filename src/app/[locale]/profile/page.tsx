import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, LogOut, Trash2, Heart } from "lucide-react";
import { isLocale } from "@/i18n/config";
import { profileText, questionnaireText } from "@/i18n/profile";
import { LocaleSwitcher } from "@/components/locale-switcher";
import { WorldFooter } from "@/components/world-footer";
import { authReady, currentSubject } from "@/lib/auth";
import { getProfile, matchCandidates } from "@/lib/profile-store";
import { rankMatches, type Match, type PlayerProfile } from "@/lib/profile";
import { ProfileForm } from "@/components/profile-form";
import { Button } from "@/components/ui/button";
import { logout, removeProfile } from "./actions";
import "./profile.css";

export const dynamic = "force-dynamic";
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return { title: `WoW Soulmate | ${profileText[locale].title}`, robots: { index: false, follow: false } };
}

export default async function ProfilePage({ params, searchParams }: { params: Promise<{ locale: string }>; searchParams: Promise<{ auth?: string; status?: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const query = await searchParams;
  const text = profileText[locale];
  const subject = await currentSubject();
  let profile: PlayerProfile | null = null;
  let matches: Match[] = [];
  let storageFailed = false;
  if (subject) {
    try {
      profile = await getProfile(subject);
      if (profile?.discoverable) matches = rankMatches(profile, await matchCandidates(subject, profile));
    } catch { storageFailed = true; }
  }
  return <div className="chronicle profile-world">
    <header className="profile-header section-width"><Link href={`/${locale}`}><ArrowLeft size={17} />{text.home}</Link><LocaleSwitcher current={locale} />{subject && <form action={logout.bind(null, locale)}><Button className="secondary-button"><LogOut size={16} />{text.logout}</Button></form>}</header>
    <main className="section-width profile-main">
      {subject && <><h1>{text.title}</h1><p className="profile-lead">{text.subtitle}</p></>}
      {query.auth === "failed" && <p className="profile-notice" role="alert">{text.failed}</p>}
      {query.status === "deleted" && <p className="profile-notice" role="status">{text.deleted}</p>}
      {query.status === "delete-error" && <p className="profile-notice" role="alert">{text.deleteError}</p>}
      {!subject ? <section className="login-section"><h1>{text.login2}</h1>{authReady() ? <Button asChild><a href={`/oauth/login?locale=${locale}`}>{text.login}<ArrowRight size={14} /></a></Button> : <p className="profile-notice">{text.notReady}</p>}</section> : <>
        {storageFailed ? <p className="profile-notice" role="alert">{text.databaseError}</p> : <ProfileForm locale={locale} profile={profile} />}
        {!storageFailed && <section className="profile-matches"><h2><Heart size={25} />{text.matches}</h2>{!profile?.discoverable ? <p className="profile-notice">{text.private}</p> : matches.length ? <ul>{matches.map(match => <li key={match.id}><div><h3>{match.alias}</h3><p>{match.role === "flexible" ? questionnaireText[locale].flexible : text.names[match.role]} · {text.names[match.experience]}</p></div><strong>{match.score}% <small>{text.score}</small></strong><p>{match.sharedHours.toLocaleString(locale)} {text.hours}</p><p>{match.activities.map(activity => text.names[activity]).join(" · ")}</p></li>)}</ul> : <p className="profile-notice">{text.empty}</p>}</section>}
        {profile && <form action={removeProfile.bind(null, locale)} className="profile-delete"><label className="consent-row"><input type="checkbox" name="confirmDelete" required /><span>{text.confirmDelete}</span></label><Button className="secondary-button"><Trash2 size={16} />{text.delete}</Button></form>}
      </>}
    </main>
    <WorldFooter locale={locale} />
  </div>;
}