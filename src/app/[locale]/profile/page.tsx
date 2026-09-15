import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { isLocale } from "@/i18n/config";
import { profileText } from "@/i18n/profile";
import { ProfileHeader } from "@/components/profile-header";
import { WorldFooter } from "@/components/world-footer";
import { currentSubject } from "@/lib/auth";
import { getProfile } from "@/lib/profile-store";
import { type PlayerProfile } from "@/lib/profile";
import { ProfileForm } from "@/components/profile-form";
import { ProfileSessions } from "@/components/profile-sessions";
import { securityText } from "@/i18n/security";
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
  if (!subject) redirect(`/${locale}`);
  let profile: PlayerProfile | null = null;
  let storageFailed = false;
  try {
    profile = await getProfile(subject);
  } catch { storageFailed = true; }
  return <div className="chronicle profile-world">
    <ProfileHeader locale={locale} active="profile" hasProfile={Boolean(profile)} />
    <main className="section-width profile-main">
      <h1>{text.title}</h1>
      {query.auth === "failed" && <p className="profile-notice" role="alert">{text.failed}</p>}
      {query.status === "deleted" && <p className="profile-notice" role="status">{text.deleted}</p>}
      {query.status === "delete-error" && <p className="profile-notice" role="alert">{text.deleteError}</p>}
      {query.status === "session-error" && <p className="profile-notice" role="alert">{securityText[locale].error}</p>}
      {storageFailed ? <p className="profile-notice" role="alert">{text.databaseError}</p> : <ProfileForm locale={locale} profile={profile} />}
      <ProfileSessions locale={locale} />
    </main>
    <WorldFooter locale={locale} />
  </div>;
}