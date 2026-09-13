"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { locales, localeNames, type Locale } from "@/i18n/config";

export function LocaleSwitcher({ current }: { current: Locale }) {
  const pathname = usePathname();

  const pathWithout = pathname.replace(/^\/(en|de)/, "") || "";

  return (
    <div className="flex items-center rounded-full border border-soul-400/20 bg-white/5 p-0.5 text-xs font-semibold">
      {locales.map((locale) => (
        <Link
          key={locale}
          href={`/${locale}${pathWithout}`}
          aria-current={locale === current ? "true" : undefined}
          className={
            locale === current
              ? "rounded-full bg-soul-500 px-3 py-1 text-white"
              : "rounded-full px-3 py-1 text-muted transition hover:text-ink"
          }
        >
          {localeNames[locale]}
        </Link>
      ))}
    </div>
  );
}
