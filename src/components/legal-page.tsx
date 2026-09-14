import Link from "next/link";
import { ArrowLeft, ExternalLink } from "lucide-react";
import type { Locale } from "@/i18n/config";
import { legalText, legalUpdated, operator, type LegalDocument } from "@/i18n/legal";

export function LegalPage({ locale, document }: { locale: Locale; document: LegalDocument }) {
  const text = legalText[locale];
  const updated = new Intl.DateTimeFormat(locale, { dateStyle: "long", timeZone: "UTC" }).format(new Date(`${legalUpdated}T00:00:00Z`));

  return <div className="chronicle legal-world">
    <header className="legal-header section-width"><Link href={`/${locale}`}><ArrowLeft size={17} />{text.back}</Link></header>
    <main className="legal-main section-width">
      <p className="eyebrow">WoW Soulmate</p>
      <h1>{document.title}</h1>
      <p className="legal-lead">{document.lead}</p>
      <section className="legal-operator">
        <h2>{text.operatorHeading}</h2>
        <address>
          <span>{operator.name}</span>
          <span>{operator.street}</span>
          <span>{operator.city}</span>
          <span>{operator.country}</span>
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
  </div>;
}
