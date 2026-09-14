"use client";

import { useId, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { isLocale, locales, nativeLocaleNames, type Locale } from "@/i18n/config";
import { chronicle } from "@/i18n/chronicle";

export function LocaleSwitcher({ current }: { current: Locale }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const optionsId = useId();
  const segments = pathname.split("/");
  const pathWithout = isLocale(segments[1]) ? segments.slice(2).join("/") : segments.slice(1).join("/");

  return (
    <div className="language-menu">
      <button className="language-trigger" type="button" aria-label={chronicle[current].language} aria-expanded={open} aria-controls={optionsId} onClick={() => setOpen(!open)}>
        {current.toUpperCase()} <ChevronDown size={13} />
      </button>
      {open && <div id={optionsId} className="language-options">
        {locales.map((locale) => (
          <Link key={locale} href={`/${locale}${pathWithout ? `/${pathWithout}` : ""}`} hrefLang={locale} lang={locale} aria-current={current === locale ? "page" : undefined} onClick={() => setOpen(false)}>{nativeLocaleNames[locale]}</Link>
        ))}
      </div>}
    </div>
  );
}
