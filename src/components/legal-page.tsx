import { ExternalLink } from "lucide-react";
import type { Locale } from "@/i18n/config";
import { legalText, legalUpdated, operator, type LegalDocument } from "@/i18n/legal";
import { chronicle } from "@/i18n/chronicle";
import { WorldHeader } from "./world-header";
import { WorldFooter } from "./world-footer";
import { CookieSettings } from "./marketing-consent";

export function LegalPage({ locale, document, showCookieSettings = false }: { locale: Locale; document: LegalDocument; showCookieSettings?: boolean }) {
  const text = legalText[locale];
  const updated = new Intl.DateTimeFormat(locale, { dateStyle: "long", timeZone: "UTC" }).format(new Date(`${legalUpdated}T00:00:00Z`));

  return <div className="chronicle legal-world">
    <a className="skip-link" href="#legal-content">{chronicle[locale].skip}</a>
    <WorldHeader locale={locale} />
    <main id="legal-content" className="legal-main section-width">
      <p className="eyebrow">WoW Soulmate</p>
      <h1>{document.title}</h1>
      <p className="legal-lead">{document.lead}</p>
      {showCookieSettings && <CookieSettings locale={locale} />}
      <section className="legal-operator">
        <h2>{text.operatorHeading}</h2>
        <address>
          <span>{operator.name}</span>
          <span>{operator.address[locale]}</span>
          <a href={`mailto:${operator.email}`}>{text.contactLabel}: {operator.email}</a>
        </address>
      </section>
      {document.sections.map((section) => <section key={section.heading}>
        <h2>{section.heading}</h2>
        {section.body.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
        {section.link && <a className="legal-link" href={section.link.href} target="_blank" rel="noreferrer">{section.link.label} <ExternalLink size={13} /></a>}
      </section>)}
      <p className="legal-updated">{text.updatedLabel}: {updated}</p>
    </main>
    <WorldFooter locale={locale} />
  </div>;
}
