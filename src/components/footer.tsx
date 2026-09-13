import type { Dictionary } from "@/i18n/get-dictionary";

export function Footer({ dict }: { dict: Dictionary }) {
  return (
    <footer className="border-t border-white/8 px-5 py-12">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-5 text-center">
        <div className="flex items-center gap-2">
          <span>💜</span>
          <span className="font-[family-name:var(--font-display)] text-sm font-bold tracking-[0.18em] uppercase">
            WoW Soulmate
          </span>
        </div>
        <p className="text-sm text-muted">{dict.footer.tagline}</p>
        <div className="flex gap-6 text-xs text-muted/70">
          <a href="#" className="transition hover:text-ink">
            {dict.footer.imprint}
          </a>
          <a href="#" className="transition hover:text-ink">
            {dict.footer.privacy}
          </a>
        </div>
        <p className="max-w-lg text-[0.7rem] leading-relaxed text-muted/50">
          {dict.footer.rights} © {new Date().getFullYear()} WoW Soulmate.
        </p>
      </div>
    </footer>
  );
}
