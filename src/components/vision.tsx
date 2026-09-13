import type { Dictionary } from "@/i18n/get-dictionary";
import { SectionHeading } from "./reveal";

export function Vision({ dict }: { dict: Dictionary }) {
  return (
    <section id="vision" className="relative mx-auto max-w-6xl scroll-mt-20 px-5 py-24">
      <SectionHeading
        eyebrow={dict.vision.eyebrow}
        title={dict.vision.title}
        body={dict.vision.body}
        align="center"
      />

      <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {dict.vision.items.map((item) => (
          <div
            key={item.name}
            className="soul-card group rounded-2xl p-6 transition hover:border-soul-400/35"
          >
            <div className="flex items-center justify-between gap-3">
              <h3 className="font-[family-name:var(--font-display)] text-lg font-bold text-ink">
                {item.name}
              </h3>
              <span
                className={
                  item.live
                    ? "rounded-full bg-soul-500/20 px-2.5 py-1 text-[0.6rem] font-semibold tracking-[0.1em] uppercase text-soul-200"
                    : "rounded-full bg-white/5 px-2.5 py-1 text-[0.6rem] font-semibold tracking-[0.1em] uppercase text-muted/70"
                }
              >
                {item.live ? dict.vision.liveLabel : dict.vision.soonLabel}
              </span>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-muted">{item.body}</p>
          </div>
        ))}
      </div>

      <p className="mx-auto mt-16 max-w-3xl text-center font-[family-name:var(--font-display)] text-2xl leading-snug font-bold text-ink sm:text-3xl">
        {dict.vision.closing}
      </p>
    </section>
  );
}
