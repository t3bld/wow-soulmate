import type { Dictionary } from "@/i18n/get-dictionary";
import { SectionHeading } from "./reveal";

export function Share({ dict }: { dict: Dictionary }) {
  return (
    <section className="relative mx-auto max-w-6xl px-5 py-24">
      <div className="grid items-center gap-14 lg:grid-cols-2">
        <SectionHeading
          eyebrow={dict.share.eyebrow}
          title={dict.share.title}
          body={dict.share.body}
        />

        <div className="flex justify-center lg:justify-end">
          <div className="relative w-full max-w-sm">
            <div
              className="absolute -inset-8 rounded-[2.5rem] bg-ember/15 blur-3xl"
              aria-hidden
            />
            <figure className="soul-card soul-glow relative overflow-hidden rounded-[1.75rem] px-8 py-12 text-center">
              <blockquote className="font-[family-name:var(--font-display)] text-2xl leading-snug font-bold text-ink">
                {dict.share.quote}
              </blockquote>
              <p className="mt-5 soul-gradient-text font-[family-name:var(--font-display)] text-5xl font-bold">
                {dict.share.quoteSub}
              </p>
              <figcaption className="mt-6 text-lg font-semibold text-soul-200">
                {dict.share.quoteCta}
              </figcaption>
              <p className="mt-8 text-[0.6rem] tracking-[0.2em] uppercase text-muted/60">
                wowsoulmate.gg
              </p>
            </figure>
          </div>
        </div>
      </div>
    </section>
  );
}
