import type { Dictionary } from "@/i18n/get-dictionary";
import { SectionHeading } from "./reveal";

export function HowItWorks({ dict }: { dict: Dictionary }) {
  return (
    <section id="how" className="relative mx-auto max-w-6xl scroll-mt-20 px-5 py-24">
      <SectionHeading eyebrow={dict.how.eyebrow} title={dict.how.title} align="center" />

      <ol className="mt-14 grid gap-6 md:grid-cols-3">
        {dict.how.steps.map((step) => (
          <li key={step.step} className="soul-card relative rounded-2xl p-7">
            <span className="font-[family-name:var(--font-display)] text-4xl font-bold text-soul-500/40">
              {step.step}
            </span>
            <h3 className="mt-4 text-lg font-semibold text-ink">{step.title}</h3>
            <p className="mt-2.5 text-sm leading-relaxed text-muted">{step.body}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
