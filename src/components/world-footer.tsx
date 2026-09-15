import Link from "next/link";
import type { Locale } from "@/i18n/config";
import { chronicle } from "@/i18n/chronicle";
import { legalText } from "@/i18n/legal";

export function WorldFooter({ locale, homeHref = `/${locale}` }: { locale: Locale; homeHref?: string }) {
  const text = chronicle[locale];

  return <footer className="world-footer section-width">
    <a href={homeHref} className="footer-brand wordmark" aria-label="WoW Soulmate">
      <img className="nav-logo" src="https://blz-contentstack-images.akamaized.net/v3/assets/blt9c12f249ac15c7ec/bltee571c6de7ccbaf6/6a95adbf1deff31d75439029/camelot-icon.png" alt="" width={928} height={1039} />
      <span className="nav-logo-word">Soulmate</span>
    </a>
    <p className="footer-tagline">{text.footer}</p>
    <div className="footer-bottom">
      <div className="footer-credits">
        <span>© 2026 WoW Soulmate</span>
        <a className="artwork-credit" href="https://americanart.si.edu/artwork/among-sierra-nevada-california-2059" target="_blank" rel="noreferrer">{text.artwork}</a>
      </div>
      <div className="footer-info">
        <nav className="footer-legal">
          <Link href={`/${locale}/imprint`}>{legalText[locale].imprintLink}</Link>
          <Link href={`/${locale}/privacy`}>{legalText[locale].privacyLink}</Link>
        </nav>
        <p>{text.independent}</p>
      </div>
    </div>
  </footer>;
}