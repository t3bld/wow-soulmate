import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { isLocale } from "@/i18n/config";
import { matchingText, profileText } from "@/i18n/profile";
import { ProfileHeader } from "@/components/profile-header";
import { WorldFooter } from "@/components/world-footer";
import { currentSubject } from "@/lib/auth";
import { getProfile } from "@/lib/profile-store";
import type { PlayerProfile } from "@/lib/profile";
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
  let storageFailed = false;
  try {
    profile = await getProfile(subject);
  } catch { storageFailed = true; }
  if (!storageFailed && !profile) redirect(`/${locale}/profile`);

  return <div className="chronicle profile-world">
    <ProfileHeader locale={locale} active="soulmates" />
    <main className="section-width profile-main soulmates-main">
      <h1>{navigation.heading}</h1>
      <p className="profile-notice">{navigation.betaNotice}</p>
      {storageFailed && <p className="profile-notice" role="alert">{text.databaseError}</p>}
    </main>
    <WorldFooter locale={locale} />
  </div>;
}