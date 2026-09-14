import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Shield, LogOut, Trash2, Heart } from "lucide-react";
import { isLocale } from "@/i18n/config";
import { profileText } from "@/i18n/profile";
import { authReady, currentSubject } from "@/lib/auth";
import { getProfile, matchCandidates } from "@/lib/profile-store";
import { rankMatches, type Match, type PlayerProfile } from "@/lib/profile";
import { ProfileForm } from "@/components/profile-form";
import { Button } from "@/components/ui/button";
import { logout, removeProfile } from "./actions";
import "./profile.css";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "WoW Soulmate | Profile", robots: { index: false, follow: false } };

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
    <header className="profile-header section-width"><Link href={`/${locale}`}><ArrowLeft size={17} />{text.home}</Link><Link href={`/${locale === "en" ? "de" : "en"}/profile`} hrefLang={locale === "en" ? "de" : "en"}>{locale === "en" ? "DE" : "EN"}</Link>{subject && <form action={logout.bind(null, locale)}><Button className="secondary-button"><LogOut size={16} />{text.logout}</Button></form>}</header>
    <main className="section-width profile-main">
      <p className="eyebrow">WoW Soulmate · Early Access · 18+</p><h1>{text.title}</h1><p className="profile-lead">{text.subtitle}</p>
      {query.auth === "failed" && <p className="profile-notice" role="alert">{text.failed}</p>}
      {query.status === "deleted" && <p className="profile-notice" role="status">{text.deleted}</p>}
      {query.status === "delete-error" && <p className="profile-notice" role="alert">{text.deleteError}</p>}
      {!subject ? <section className="login-section"><Shield size={35} /><h2>Battle.net</h2><p>{text.loginBody}</p>{authReady() ? <Button asChild><a href={`/oauth/login?locale=${locale}`}><Shield size={17} />{text.login}</a></Button> : <p className="profile-notice">{text.notReady}</p>}<p className="profile-help">{text.privacy}</p></section> : <>
        {storageFailed ? <p className="profile-notice" role="alert">{text.databaseError}</p> : <ProfileForm locale={locale} profile={profile} />}
        {!storageFailed && <section className="profile-matches"><h2><Heart size={25} />{text.matches}</h2><p className="profile-help">{text.method}</p>{!profile?.discoverable ? <p className="profile-notice">{text.private}</p> : matches.length ? <ul>{matches.map(match => <li key={match.id}><div><h3>{match.alias}</h3><p>{text.names[match.role]} · {text.names[match.experience]}</p></div><strong>{match.score}% <small>{text.score}</small></strong><p>{match.sharedHours.toLocaleString(locale)} {text.hours}</p><p>{match.activities.map(activity => text.names[activity]).join(" · ")}</p></li>)}</ul> : <p className="profile-notice">{text.empty}</p>}</section>}
        <p className="profile-help privacy-summary">{text.privacy}</p>
        {profile && <form action={removeProfile.bind(null, locale)} className="profile-delete"><label className="consent-row"><input type="checkbox" name="confirmDelete" required /><span>{text.confirmDelete}</span></label><Button className="secondary-button"><Trash2 size={16} />{text.delete}</Button></form>}
      </>}
    </main>
  </div>;
}