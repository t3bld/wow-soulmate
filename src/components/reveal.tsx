import type { Dictionary } from "@/i18n/get-dictionary";

export function SectionHeading({
  eyebrow,
  title,
  body,
  align = "left",
}: {
  eyebrow: string;
  title: string;
  body?: string;
  align?: "left" | "center";
}) {
  return (
    <div className={align === "center" ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
      <p className="text-xs font-semibold tracking-[0.22em] uppercase text-soul-400">{eyebrow}</p>
      <h2 className="mt-4 font-[family-name:var(--font-display)] text-3xl leading-tight font-bold sm:text-4xl lg:text-5xl">
        {title}
      </h2>
      {body ? <p className="mt-5 text-base leading-relaxed text-muted">{body}</p> : null}
    </div>
  );
}

export function Reveal({ dict }: { dict: Dictionary }) {
  return (
    <section id="reveal" className="relative mx-auto max-w-6xl scroll-mt-20 px-5 py-24">
      <div className="soul-card relative overflow-hidden rounded-[2rem] p-8 sm:p-12">
        <div
          className="absolute -top-24 -right-16 h-64 w-64 rounded-full bg-ember/15 blur-3xl"
          aria-hidden
        />

        <SectionHeading
          eyebrow={dict.reveal.eyebrow}
          title={dict.reveal.title}
          body={dict.reveal.body}
        />

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {dict.reveal.points.map((point, i) => (
            <div
              key={point.title}
              className="rounded-2xl border border-white/8 bg-white/[0.03] p-6 transition hover:border-soul-400/30 hover:bg-white/[0.06]"
            >
              <span className="font-[family-name:var(--font-display)] text-sm font-bold text-soul-400">
                0{i + 1}
              </span>
              <h3 className="mt-3 text-base font-semibold text-ink">{point.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{point.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
