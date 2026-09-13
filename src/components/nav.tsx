import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/get-dictionary";
import { LocaleSwitcher } from "./locale-switcher";

export function Nav({ dict, locale }: { dict: Dictionary; locale: Locale }) {
  const links = [
    { href: "#reveal", label: dict.nav.reveal },
    { href: "#how", label: dict.nav.how },
    { href: "#vision", label: dict.nav.vision },
    { href: "#faq", label: dict.nav.faq },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-white/5 bg-void/70 backdrop-blur-xl">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-5">
        <a href="#top" className="flex items-center gap-2">
          <span className="text-lg">💜</span>
          <span className="font-[family-name:var(--font-display)] text-sm font-bold tracking-[0.18em] uppercase">
            WoW Soulmate
          </span>
        </a>

        <div className="hidden items-center gap-7 text-sm text-muted md:flex">
          {links.map((link) => (
            <a key={link.href} href={link.href} className="transition hover:text-ink">
              {link.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <LocaleSwitcher current={locale} />
          <a
            href="#waitlist"
            className="rounded-full bg-soul-500 px-4 py-2 text-xs font-semibold text-white transition hover:bg-soul-400"
          >
            {dict.nav.cta}
          </a>
        </div>
      </nav>
    </header>
  );
}
