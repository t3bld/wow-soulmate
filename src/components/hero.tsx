import type { Dictionary } from "@/i18n/get-dictionary";
import { Emphasize } from "./emphasize";
import { SoulmateCard } from "./soulmate-card";
import { Countdown } from "./countdown";

export function Hero({ dict }: { dict: Dictionary }) {
  return (
    <section id="top" className="relative mx-auto max-w-6xl px-5 pt-20 pb-24 md:pt-28">
      <div className="grid items-center gap-14 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="animate-rise">
          <div className="inline-flex items-center gap-2 rounded-full border border-soul-400/25 bg-soul-500/10 px-4 py-1.5 text-xs font-medium text-soul-200">
            <span className="h-1.5 w-1.5 rounded-full bg-soul-400" />
            {dict.hero.badge}
          </div>

          <h1 className="mt-7 font-[family-name:var(--font-display)] text-5xl leading-[1.05] font-bold tracking-tight sm:text-6xl lg:text-7xl">
            {dict.hero.titleLine1}{" "}
            <span className="soul-gradient-text">{dict.hero.titleHighlight}</span>
            {dict.hero.titleLine2}
          </h1>

          <p className="mt-7 max-w-xl text-lg leading-relaxed text-muted">
            <Emphasize text={dict.hero.lead} />
          </p>

          <p className="mt-4 text-xl font-semibold text-ink">{dict.hero.leadStrong}</p>

          <p className="mt-4 max-w-xl text-base leading-relaxed text-muted">{dict.hero.body}</p>

          <div className="mt-9 flex flex-wrap items-center gap-3">
            <a
              href="#waitlist"
              className="rounded-full bg-soul-500 px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-soul-600/30 transition hover:bg-soul-400 hover:shadow-soul-500/40"
            >
              {dict.hero.ctaPrimary}
            </a>
            <a
              href="#how"
              className="rounded-full border border-white/12 px-7 py-3.5 text-sm font-semibold text-ink transition hover:border-soul-400/40 hover:bg-white/5"
            >
              {dict.hero.ctaSecondary}
            </a>
          </div>

          <p className="mt-4 text-xs text-muted/70">{dict.hero.trust}</p>

          <Countdown dict={dict} />
        </div>

        <div className="flex justify-center lg:justify-end">
          <SoulmateCard dict={dict} />
        </div>
      </div>
    </section>
  );
}
