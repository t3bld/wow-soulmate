"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { ArrowDown, ArrowRight, ChevronDown, Clock3, Compass, Globe2, GraduationCap, Heart, Leaf, Shield, Sparkles, Swords, Users } from "lucide-react";
import { nativeLocaleNames, type Locale } from "@/i18n/config";
import { chronicle, compatibilityText } from "@/i18n/chronicle";
import { WorldFooter } from "./world-footer";
import { WorldHeader } from "./world-header";
import { profileText } from "@/i18n/profile";
import { Button } from "./ui/button";
import { Countdown } from "./countdown";
import { WarlockPortal } from "./warlock-portal";
import { getDictionary } from "@/i18n/get-dictionary";

const companions = [
  { name: "Mira", score: 94, icon: Leaf, portrait: "/images/druid-profile.png", className: "druid", dungeons: 17, raids: 6, overlap: 91, playtime: { pattern: "daily", hours: 2 }, experience: "regular", role: "healer", activities: ["dungeons", "raids"] },
  { name: "Aelin", score: 86, icon: Sparkles, portrait: "/images/mage-profile.png", className: "mage", dungeons: 12, raids: 4, overlap: 84, playtime: { pattern: "weeknights", hours: 3 }, experience: "returning", role: "damage", activities: ["dungeons", "collecting", "roleplay"] },
  { name: "Thorne", score: 78, icon: Swords, portrait: null, className: "warrior", dungeons: 8, raids: 3, overlap: 76, playtime: { pattern: "weekends", hours: 5 }, experience: "veteran", role: "damage", activities: ["pvp", "questing"] },
  { name: "Kael", score: 78, icon: Shield, portrait: "/images/pala-profile.png", className: "paladin", dungeons: 14, raids: 5, overlap: 88, playtime: { pattern: "weekends", hours: 6 }, experience: "veteran", role: "tank", activities: ["raids", "questing", "pvp"] },
];

function CompanionAvatar({ player, size }: { player: (typeof companions)[number]; size: number }) {
  const FallbackIcon = player.icon;
  return <span className="node-avatar">{player.portrait ? <img src={player.portrait} alt="" width={500} height={500} loading="lazy" decoding="async" /> : <FallbackIcon size={size} strokeWidth={1.4} aria-hidden="true" />}</span>;
}

function playtimeLabel(player: (typeof companions)[number], locale: Locale) {
  const labels = compatibilityText[locale];
  const hours = new Intl.NumberFormat(locale, { style: "unit", unit: "hour", unitDisplay: "short" }).format(player.playtime.hours);
  return `${labels.patterns[player.playtime.pattern]} · ${hours}`;
}

function CompatibilityDetails({ player, locale }: { player: (typeof companions)[number]; locale: Locale }) {
  const labels = compatibilityText[locale];
  const profile = profileText[locale];
  const details = [
    { icon: Clock3, label: labels.playtime, value: playtimeLabel(player, locale) },
    { icon: GraduationCap, label: profile.experience, value: profile.names[player.experience] },
    { icon: Swords, label: labels.sharedActivities, value: player.activities.map(activity => profile.names[activity]).join(" · ") },
    { icon: Shield, label: labels.role, value: profile.names[player.role] },
    { icon: Globe2, label: labels.group, value: `${nativeLocaleNames[locale]} · EU` },
  ];
  return <dl className="compatibility-details">{details.map(({ icon: DetailIcon, label, value }) => <div key={label}><dt><DetailIcon size={18} aria-hidden="true" />{label}</dt><dd>{value}</dd></div>)}</dl>;
}

export function ChronicleExperience({ locale }: { locale: Locale }) {
  const text = chronicle[locale];
  const [active, setActive] = useState(0);
  const root = useRef<HTMLDivElement>(null);
  const companion = companions[active];
  const accessHref = `/oauth/login?locale=${locale}`;

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

  return (
    <div className="chronicle" ref={root}>
      <a className="skip-link" href="#discovery">{text.skip}</a>
      <WorldHeader locale={locale} />

      <main>
        <section className="world-hero" aria-labelledby="hero-title">
          <img className="hero-landscape" src="/images/sierra.webp" alt="" fetchPriority="high" />
          <div className="hero-sunlight" aria-hidden="true"><span /><span /></div>
          <div className="hero-shade" />
          <div className="magic-dust" aria-hidden="true">{Array.from({ length: 18 }, (_, index) => <i key={index} style={{ "--index": index, left: `${(index * 37 + 7) % 100}%`, top: `${(index * 19 + 13) % 100}%` } as CSSProperties} />)}</div>
          <div className="hero-copy">
            <p className="eyebrow hero-eyebrow"><span />{text.badge}<span /></p>
            <h1 id="hero-title"><img className="hero-logo" src="/images/soulmate-logo.png" alt="WoW Soulmate" width={559} height={452} /></h1>
            <h2>{text.subtitle}</h2>
            <p className="hero-intro">{text.intro}</p>
            <Button asChild><a href={accessHref}>{profileText[locale].login2}<ArrowRight size={17} /></a></Button>
            {text.heroNote && <p className="hero-note">{text.heroNote}</p>}
          </div>
          <div className="hero-hunter" aria-hidden="true" data-reveal>
            <img src="/images/hunter-profile.png" alt="" width={500} height={500} decoding="async" />
          </div>
          <Countdown dict={getDictionary(locale)} />
        </section>

        <section id="discovery" className="discovery section-space" aria-labelledby="discovery-title">
          <div className="discovery-scene">
            <div className="discovery-companions discovery-horde">
              <div className="companion-art" data-reveal>
                <img src="/images/horde-soulmates.png" alt={text.hordeAlt} width={500} height={500} loading="lazy" decoding="async" />
              </div>
            </div>
            <div className="section-heading" data-reveal><h2 id="discovery-title">{text.discovery}<br /><em>{text.discoveryAccent}</em></h2><p>{text.discoveryBody}</p></div>
            <div className="discovery-companions discovery-alliance">
              <div className="companion-art" data-reveal>
                <img src="/images/alliance-soulmates.png" alt={text.allianceAlt} width={500} height={500} loading="lazy" decoding="async" />
              </div>
            </div>
          </div>
        </section>

        <section id="connections" className="connections section-space">
          <div className="section-heading" data-reveal><h2>{text.networkTitle}<br /><em>{text.networkAccent}</em></h2><p>{text.networkBody}</p></div>
          <div className="connections-layout section-width" data-reveal>
          <div className="constellation">
            <svg className="graph-lines" viewBox="0 0 600 600" preserveAspectRatio="none" aria-hidden="true">{[0, 1, 3].map((index, position) => <path key={index} className={index === active ? "active-line" : ""} d={`M40 300 C150 300 150 ${100 + position * 200} 330 ${100 + position * 200}`} />)}</svg>
            <div className="graph-you"><span className="you-emblem"><Compass size={34} strokeWidth={1.2} /></span><strong>{text.you}</strong></div>
            {[0, 1, 3].map((index) => {
              const player = companions[index];
              return <button key={player.name} className={`graph-player node-${index} ${player.className} ${active === index ? "selected" : ""}`} aria-pressed={active === index} aria-controls="connection-details" onClick={() => setActive(index)}>
                <CompanionAvatar player={player} size={28} />
                <span className="node-text">
                  <strong>{player.name}</strong><small>{text.roles[index]}</small>
                  <span className="node-score"><Heart size={17} aria-hidden="true" /><b>{player.score}%</b><span>{text.compatibility}</span></span>
                  <span className="node-time"><Clock3 size={17} aria-hidden="true" /><span><span className="sr-only">{compatibilityText[locale].playtime}: </span>{playtimeLabel(player, locale)}</span></span>
                  <span className="node-experience"><GraduationCap size={17} aria-hidden="true" /><span><span className="sr-only">{profileText[locale].experience}: </span>{profileText[locale].names[player.experience]}</span></span>
                </span>
              </button>;
            })}
          </div>
          <div id="connection-details" className="connection-details" role="region" aria-labelledby="connection-player-name" aria-live="polite" aria-atomic="true">
            <div className={`connection-identity ${companion.className}`}><CompanionAvatar player={companion} size={30} /><div><h3 id="connection-player-name">{companion.name}</h3><p>{text.roles[active]}</p></div></div>
            <p className="connection-description">{text.profiles[active]}</p>
            <p className="connection-score"><Heart size={20} aria-hidden="true" /><strong>{companion.score}%</strong><span>{text.compatibility}</span></p>
            <CompatibilityDetails player={companion} locale={locale} />
          </div>
          </div>
        </section>

        <section id="journey" className="journey section-space section-width">
          <div className="section-heading" data-reveal><h2>{text.howTitle}<br /><em>{text.howAccent}</em></h2></div>
          <ol className="quest-steps" data-reveal>{text.how.map(([title, description], index) => { const StepIcon = [Compass, Users, Swords][index]; return <li key={title}><span className="step-number">0{index + 1}</span><StepIcon size={29} strokeWidth={1.2} /><h3>{title}</h3><p>{description}</p></li>; })}</ol>
        </section>

        <section id="waitlist" className="waitlist-section section-space" aria-labelledby="waitlist-title">
          <div className="waitlist-layout section-width">
            <WarlockPortal />
            <div className="waitlist-copy">
              <p className="eyebrow waitlist-quest"><span className="quest-marker" aria-hidden="true">!</span>{text.waitChapter}</p>
              <div className="section-heading" data-reveal><h2 id="waitlist-title">{text.waitTitle}<br /><em>{text.waitAccent}</em></h2><p>{text.waitBody}</p></div>
              <div className="waitlist-content"><Button asChild><a href={accessHref}>{profileText[locale].login2}<ArrowRight size={14} /></a></Button></div>
            </div>
          </div>
        </section>

        <section className="faq-section section-width"><h2>{text.faqTitle}</h2><div>{text.faqs.map(([question, answer]) => <details key={question}><summary>{question}<ChevronDown size={18} /></summary><p>{answer}</p></details>)}</div></section>
      </main>
      <WorldFooter locale={locale} homeHref="#hero-title" />
    </div>
  );
}