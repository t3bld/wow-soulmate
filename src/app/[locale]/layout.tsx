import type { Metadata } from "next";
import { Cinzel, Manrope } from "next/font/google";
import { notFound } from "next/navigation";
import "../chronicle.css";
import { isLocale, locales, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";

const manrope = Manrope({ subsets: ["latin", "cyrillic"], variable: "--font-sans", display: "swap" });
const cinzel = Cinzel({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  variable: "--font-display",
  display: "swap",
});

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

function getSiteUrl() {
  const explicit = process.env.APP_URL;
  if (explicit) return new URL(explicit);

  const vercelUrl =
    process.env.VERCEL_PROJECT_PRODUCTION_URL ?? process.env.VERCEL_URL;
  if (vercelUrl) return new URL(`https://${vercelUrl}`);

  return new URL("http://localhost:3000");
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const dict = getDictionary(isLocale(locale) ? locale : "en");

  return {
    metadataBase: getSiteUrl(),
    title: dict.meta.title,
    description: dict.meta.description,
    openGraph: {
      title: dict.meta.title,
      description: dict.meta.description,
      type: "website",
      siteName: "WoW Soulmate",
    },
    twitter: {
      card: "summary_large_image",
      title: dict.meta.title,
      description: dict.meta.description,
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const typedLocale: Locale = locale;

  return (
    <html lang={typedLocale} className={`${manrope.variable} ${cinzel.variable}`}>
      <body className="font-[family-name:var(--font-sans)] antialiased">{children}</body>
    </html>
  );
}
