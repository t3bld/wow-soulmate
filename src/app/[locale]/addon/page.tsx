import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { isLocale } from "@/i18n/config";
import { addonText } from "@/i18n/addon";
import { currentSubject } from "@/lib/auth";
import { ProfileHeader } from "@/components/profile-header";
import { WorldFooter } from "@/components/world-footer";
import { AddonFeedbackForm } from "@/components/addon-feedback-form";
import "../profile/profile.css";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return { title: addonText[locale].title, robots: { index: false, follow: false } };
}

export default async function AddonPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  if (!await currentSubject()) redirect(`/${locale}`);
  const text = addonText[locale];
  return <div className="chronicle profile-world">
    <ProfileHeader locale={locale} active="addon" />
    <main className="section-width profile-main addon-main">
      <h1>{text.title}</h1>
      <p className="profile-summary-status">{text.status}</p>
      <p className="profile-lead">{text.idea}</p>
      <AddonFeedbackForm locale={locale} available={Boolean(process.env.RESEND_API_KEY && process.env.FEEDBACK_FROM_EMAIL)} />
    </main>
    <WorldFooter locale={locale} />
  </div>;
}