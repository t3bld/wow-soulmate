import type { Dictionary } from "@/i18n/get-dictionary";
import { SectionHeading } from "./reveal";

export function Faq({ dict }: { dict: Dictionary }) {
  return (
    <section id="faq" className="relative mx-auto max-w-4xl scroll-mt-20 px-5 py-24">
      <SectionHeading eyebrow={dict.faq.eyebrow} title={dict.faq.title} align="center" />

      <div className="mt-12 divide-y divide-white/8 border-y border-white/8">
        {dict.faq.items.map((item) => (
          <details key={item.q} className="group py-5">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-left text-base font-semibold text-ink marker:hidden">
              {item.q}
              <span className="shrink-0 text-soul-400 transition group-open:rotate-45">+</span>
            </summary>
            <p className="mt-3 pr-10 text-sm leading-relaxed text-muted">{item.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
