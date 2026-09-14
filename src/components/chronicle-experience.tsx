"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import Link from "next/link";
import { ArrowDown, ArrowRight, ChevronDown, Compass, Download, Heart, Leaf, Menu, Shield, Sparkles, Swords, Users, X } from "lucide-react";
import type { Locale } from "@/i18n/config";
import { chronicle } from "@/i18n/chronicle";
import { profileText } from "@/i18n/profile";
import { Button } from "./ui/button";

const companions = [
  { name: "Mira", score: 94, icon: Leaf, className: "druid", dungeons: 17, raids: 6, overlap: 91 },
  { name: "Aelin", score: 86, icon: Sparkles, className: "mage", dungeons: 12, raids: 4, overlap: 84 },
  { name: "Thorne", score: 78, icon: Swords, className: "warrior", dungeons: 8, raids: 3, overlap: 76 },
  { name: "Kael", score: 89, icon: Shield, className: "paladin", dungeons: 14, raids: 5, overlap: 88 },
];

export function ChronicleExperience({ locale }: { locale: Locale }) {
  const text = chronicle[locale];
  const [menuOpen, setMenuOpen] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [active, setActive] = useState(0);
  const [downloadStatus, setDownloadStatus] = useState("");
  const root = useRef<HTMLDivElement>(null);
  const companion = companions[active];
  const CompanionIcon = companion.icon;

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    root.current?.querySelectorAll("[data-reveal]").forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);

  async function downloadCard() {
    try {
      await document.fonts.ready;
      const canvas = document.createElement("canvas");
      canvas.width = 1080;
      canvas.height = 1350;
      const context = canvas.getContext("2d");
      if (!context) throw new Error("Canvas unavailable");
      context.fillStyle = "#101c19";
      context.fillRect(0, 0, 1080, 1350);
      context.strokeStyle = "#bfa36b";
      context.lineWidth = 3;
      context.strokeRect(36, 36, 1008, 1278);
      context.strokeRect(48, 48, 984, 1254);
      context.textAlign = "center";
      context.fillStyle = "#c4ad7c";
      context.font = "24px Georgia";
      context.fillText("W O W   S O U L M A T E", 540, 140);
      context.font = "30px Georgia";
      context.fillText(text.matchLabel, 540, 300);
      context.fillStyle = "#f4f0e8";
      context.font = "100px Georgia";
      context.fillText(companion.name, 540, 445);
      context.fillStyle = "#e5abc4";
      context.font = "190px Georgia";
      context.fillText(`${companion.score}%`, 540, 680);
      context.font = "26px Georgia";
      context.fillText(text.compatibility, 540, 745);
      context.fillStyle = "#f4f0e8";
      context.font = "30px Georgia";
      [String(companion.dungeons), String(companion.raids), `${companion.overlap}%`].forEach((value, index) => {
        context.fillText(`${value} ${text.stats[index]}`, 540, 850 + index * 55);
      });
      context.font = "36px Georgia";
      context.fillText(text.verdict, 540, 1100);
      context.font = "23px Georgia";
      context.fillStyle = "#b4bdb3";
      context.fillText(text.demo, 540, 1220);
      const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/png"));
      if (!blob) throw new Error("Export unavailable");
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = `wow-soulmate-${companion.name.toLowerCase()}-${locale}-example.png`;
      anchor.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      setDownloadStatus(text.saved);
    } catch {
      setDownloadStatus(text.saveError);
    }
  }

  return (
    <div className="chronicle" ref={root}>
      <a className="skip-link" href="#discovery">{text.scroll}</a>
      <header className="world-header">
        <Link className="wordmark" href={`/${locale}`} aria-label="WoW Soulmate">
          <span className="brand-emblem"><Heart size={22} strokeWidth={1.4} /></span>
          <span>WoW <b>Soulmate</b><small>{text.concept}</small></span>
        </Link>
        <nav className="desktop-nav" aria-label={locale === "de" ? "Hauptnavigation" : "Main navigation"}>
          {text.nav.map((label, index) => <a key={label} href={["#discovery", "#connections", "#journey"][index]}>{label}</a>)}
        </nav>
        <div className="header-actions">
          <div className="language-switch" aria-label="Language">
            {(["en", "de"] as const).map((language) => <Link key={language} href={`/${language}`} hrefLang={language} aria-current={locale === language ? "page" : undefined}>{language.toUpperCase()}</Link>)}
          </div>
          <Button asChild className="header-cta"><Link href={`/${locale}/profile`}>{profileText[locale].login}<ArrowRight size={14} /></Link></Button>
          <button className="mobile-menu icon-button" aria-label={locale === "de" ? (menuOpen ? "Menü schließen" : "Menü öffnen") : (menuOpen ? "Close menu" : "Open menu")} aria-expanded={menuOpen} aria-controls="mobile-navigation" onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X /> : <Menu />}</button>
        </div>
        {menuOpen && <nav id="mobile-navigation" className="mobile-navigation">{text.nav.map((label, index) => <a key={label} href={["#discovery", "#connections", "#journey"][index]} onClick={() => setMenuOpen(false)}>{label}</a>)}<Link href={`/${locale}/profile`}>{profileText[locale].login}</Link></nav>}
      </header>

      <main>
        <section className="world-hero" aria-labelledby="hero-title">
          <img className="hero-landscape" src="/images/sierra.webp" alt="" fetchPriority="high" />
          <div className="hero-shade" />
          <div className="magic-dust" aria-hidden="true">{Array.from({ length: 18 }, (_, index) => <i key={index} style={{ "--index": index, left: `${(index * 37 + 7) % 100}%`, top: `${(index * 19 + 13) % 100}%` } as CSSProperties} />)}</div>
          <div className="hero-copy">
            <p className="eyebrow hero-eyebrow"><span />{text.badge}<span /></p>
            <h1 id="hero-title"><span>WoW</span>Soulmate</h1>
            <div className="ornament" aria-hidden="true"><span /><Heart size={17} /><span /></div>
            <h2>{text.subtitle}</h2>
            <p className="hero-intro">{text.intro}</p>
            <Button asChild><Link href={`/${locale}/profile`}><Shield size={18} />{profileText[locale].login}<ArrowRight size={17} /></Link></Button>
            <p className="hero-note">{text.heroNote}</p>
          </div>
          <div className="hero-bottom"><span>{text.launch}<strong>{text.date}</strong></span><a href="#discovery" className="scroll-cue"><span>{text.scroll}</span><ArrowDown size={18} /></a><span className="hero-bottom-end"><span className="status-dot" />{text.concept}</span></div>
        </section>

        <section id="discovery" className="discovery section-space">
          <div className="section-heading" data-reveal><p className="eyebrow">{text.chapter}</p><h2>{text.discovery}<br /><em>{text.discoveryAccent}</em></h2><p>{text.discoveryBody}</p></div>
          <div className="encounter-counts" data-reveal>{["386", "37", "8", "1"].map((value, index) => <div key={value} className={index === 3 ? "final-count" : ""}><span className="count-value">{value}</span><span>{text.counters[index]}</span>{index < 3 && <ArrowRight className="count-arrow" size={20} />}</div>)}</div>
          <p className="fine-print centered">{text.sample}</p>
        </section>

        <section id="match" className="match-section section-space">
          <div className="match-layout section-width">
            <div className="match-story" data-reveal><p className="eyebrow">{text.matchChapter}</p><h2>{text.matchTitle}<br /><em>{text.matchAccent}</em></h2><p className="body-copy">{text.matchBody}</p><ol className="encounter-log">{text.log.map((entry, index) => <li key={entry}><span className="log-icon">{index === 2 ? <Heart size={18} /> : index === 1 ? <Users size={18} /> : <Swords size={18} />}</span><div><small>{text.places[index]}</small><p>{entry}</p></div></li>)}</ol></div>
            <div className="match-stage" data-reveal>
              <div className="rune-ring" aria-hidden="true" />
              <article className={`match-artifact ${revealed ? "is-revealed" : ""}`} aria-label={text.example}>
                <span className="artifact-corner top-left" /><span className="artifact-corner top-right" /><span className="artifact-corner bottom-left" /><span className="artifact-corner bottom-right" />
                <p className="eyebrow">{text.matchLabel}</p>
                <div className="portrait-seal druid"><Leaf size={44} strokeWidth={1.1} /></div>
                <h3>{revealed ? "Mira" : "???"}</h3><p className="character-class">{revealed ? text.roles[0] : "· · ·"}</p>
                <div className="match-score" aria-live="polite">{revealed ? "94" : "?"}<span>%</span></div><p className="score-caption">{text.compatibility}</p>
                <div className="ornament" aria-hidden="true"><span /><Heart size={16} /><span /></div>
                {revealed ? <><dl className="match-stats">{["17", "6", "91%"].map((value, index) => <div key={value}><dt>{text.stats[index]}</dt><dd>{value}</dd></div>)}</dl><p className="match-verdict">{text.verdict}</p></> : <Button onClick={() => setRevealed(true)} className="reveal-button"><Sparkles size={17} />{text.reveal}</Button>}
                <p className="artifact-disclaimer">{text.example} · WoW Soulmate</p>
              </article>
              <p className="fine-print centered">{text.demo}</p>
            </div>
          </div>
        </section>

        <section id="connections" className="connections section-space">
          <div className="section-heading" data-reveal><p className="eyebrow">{text.networkChapter}</p><h2>{text.networkTitle}<br /><em>{text.networkAccent}</em></h2><p>{text.networkBody}</p></div>
          <div className="constellation section-width" data-reveal>
            <div className="graph-orbit orbit-one" aria-hidden="true" /><div className="graph-orbit orbit-two" aria-hidden="true" />
            <svg className="graph-lines" viewBox="0 0 900 430" preserveAspectRatio="none" aria-hidden="true">{[[200, 90], [710, 105], [225, 325], [700, 325]].map(([horizontal, vertical], index) => <path key={index} className={index === active ? "active-line" : ""} d={`M450 215 Q${horizontal} 215 ${horizontal} ${vertical}`} />)}</svg>
            <div className="graph-you"><span className="you-emblem"><Compass size={34} strokeWidth={1.2} /></span><strong>{text.you}</strong><small>Blackrock · EU</small></div>
            {companions.map((player, index) => { const PlayerIcon = player.icon; return <button key={player.name} className={`graph-player node-${index} ${player.className} ${active === index ? "selected" : ""}`} aria-pressed={active === index} aria-label={`${player.name}, ${player.score}% ${text.connection}`} onClick={() => { setActive(index); setDownloadStatus(""); }}><span className="node-avatar"><PlayerIcon size={25} strokeWidth={1.4} /></span><span className="node-text"><strong>{player.name}</strong><small>{text.roles[index]}</small><span>{player.score}% <Heart size={10} /></span></span></button>; })}
          </div>
          <div className="connection-caption" aria-live="polite"><CompanionIcon size={18} /><strong>{companion.name}</strong><span>{text.profiles[active]}</span></div>
          <p className="fine-print centered">{text.networkNote} {text.example}.</p>
        </section>

        <section id="journey" className="journey section-space section-width">
          <div className="section-heading" data-reveal><p className="eyebrow">{text.howChapter}</p><h2>{text.howTitle}<br /><em>{text.howAccent}</em></h2></div>
          <ol className="quest-steps" data-reveal>{text.how.map(([title, description], index) => { const StepIcon = [Compass, Users, Swords][index]; return <li key={title}><span className="step-number">0{index + 1}</span><StepIcon size={29} strokeWidth={1.2} /><h3>{title}</h3><p>{description}</p></li>; })}</ol>
        </section>

        <section className="share-section section-space">
          <div className="share-layout section-width">
            <div data-reveal><p className="eyebrow">{text.shareChapter}</p><h2>{text.shareTitle}<br /><em>{text.shareAccent}</em></h2><p className="body-copy">{text.shareBody}</p><Button onClick={downloadCard} className="secondary-button"><Download size={17} />{text.save}</Button><p className="download-status" role="status">{downloadStatus}</p></div>
            <figure className="share-artifact" data-reveal><div className="share-emblem"><Heart size={25} strokeWidth={1.4} /></div><p>{text.shareQuote}</p><strong>{companion.name}</strong><span className="share-percentage">{companion.score}<small>%</small></span><span className="eyebrow">{text.compatibility}</span><figcaption>{text.shareQuestion}</figcaption><span className="artifact-disclaimer">WOW SOULMATE · {text.example}</span></figure>
          </div>
        </section>

        <section id="waitlist" className="waitlist-section section-space">
          <div className="quest-marker" aria-hidden="true">!</div><div className="section-heading" data-reveal><p className="eyebrow">{text.waitChapter}</p><h2>{text.waitTitle}<br /><em>{text.waitAccent}</em></h2><p>{text.waitBody}</p></div>
          <div className="waitlist-content"><Button asChild><Link href={`/${locale}/profile`}><Shield size={18} />{profileText[locale].login}</Link></Button><p className="fine-print">{profileText[locale].loginBody}</p></div>
        </section>

        <section className="faq-section section-width"><h2>{text.faqTitle}</h2><div>{text.faqs.map(([question, answer]) => <details key={question}><summary>{question}<ChevronDown size={18} /></summary><p>{answer}</p></details>)}</div></section>
      </main>
      <footer className="world-footer section-width"><a href="#hero-title" className="footer-brand"><Heart size={21} /><span>WoW Soulmate</span></a><p className="footer-tagline">{text.footer}</p><div className="footer-bottom"><span>© 2026 WoW Soulmate</span><p>{text.independent}</p><details><summary>{text.privacy}</summary><p>{text.privacyBody}</p></details></div><a className="artwork-credit" href="https://americanart.si.edu/artwork/among-sierra-nevada-california-2059" target="_blank" rel="noreferrer">{text.artwork}</a></footer>
    </div>
  );
}