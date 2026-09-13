import { notFound } from "next/navigation";
import { isLocale } from "@/i18n/config";
import { ChronicleExperience } from "@/components/chronicle-experience";

export default async function LandingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  return <ChronicleExperience locale={locale} />;
}
