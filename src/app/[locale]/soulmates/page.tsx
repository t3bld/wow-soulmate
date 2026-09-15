import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { isLocale } from "@/i18n/config";
import { matchingText, profileText, questionnaireText } from "@/i18n/profile";
import { ProfileHeader } from "@/components/profile-header";
import { WorldFooter } from "@/components/world-footer";
import { currentSubject } from "@/lib/auth";
import { getProfile, matchCandidates } from "@/lib/profile-store";
import { rankMatches, type Match, type PlayerProfile } from "@/lib/profile";
import "../profile/profile.css";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return { title: `WoW Soulmate | ${matchingText[locale].title}`, robots: { index: false, follow: false } };
}

export default async function SoulmatesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const text = profileText[locale];
  const navigation = matchingText[locale];
  const subject = await currentSubject();
  if (!subject) redirect(`/${locale}`);
  let profile: PlayerProfile | null = null;
  let matches: Match[] = [];
  let storageFailed = false;
  try {
    profile = await getProfile(subject);
    if (profile?.discoverable) matches = rankMatches(profile, await matchCandidates(subject, profile));
  } catch { storageFailed = true; }
  if (!storageFailed && !profile) redirect(`/${locale}/profile`);

  return <div className="chronicle profile-world">
    <ProfileHeader locale={locale} active="soulmates" />
    <main className="section-width profile-main soulmates-main">
      <h1>{navigation.heading}</h1>
      {storageFailed ? <p className="profile-notice" role="alert">{text.databaseError}</p> : <section className="profile-matches">
        {!profile?.discoverable ? <p className="profile-notice">{text.private}</p> : matches.length ? <ul>{matches.map(match => <li key={match.id}>
          <div><h3>{match.alias}</h3><p>{match.roles.map(role => text.names[role]).join(", ")} · {text.names[match.experience]}</p></div>
          <strong>{match.score}% <small>{text.score}</small></strong>
          <p>{match.sharedHours.toLocaleString(locale)} {text.hours}</p>
          <p>{match.activities.map(activity => text.names[activity]).join(" · ")}</p>
        </li>)}</ul> : <p className="profile-notice">{text.empty}</p>}
      </section>}
    </main>
    <WorldFooter locale={locale} />
  </div>;
}