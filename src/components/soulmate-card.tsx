import type { Dictionary } from "@/i18n/get-dictionary";

export function SoulmateCard({ dict }: { dict: Dictionary }) {
  const card = dict.card;
  const score = Number(card.score);
  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const dash = (score / 100) * circumference;

  return (
    <div className="relative w-full max-w-sm">
      <div className="absolute -inset-6 rounded-[2rem] bg-soul-500/20 blur-3xl" aria-hidden />

      <article className="soul-card soul-glow relative overflow-hidden rounded-[1.75rem] p-6 animate-float">
        <div className="soul-sweep absolute inset-0" aria-hidden />

        <div className="relative flex items-center justify-between">
          <span className="rounded-full border border-soul-400/30 bg-soul-500/10 px-3 py-1 text-[0.65rem] font-semibold tracking-[0.16em] uppercase text-soul-200">
            {card.eyebrow}
          </span>
          <span className="text-base">💜</span>
        </div>

        <div className="relative mt-6 flex items-center gap-5">
          <div className="relative h-32 w-32 shrink-0">
            <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90">
              <circle
                cx="60"
                cy="60"
                r={radius}
                fill="none"
                stroke="rgba(255,255,255,0.08)"
                strokeWidth="8"
              />
              <circle
                cx="60"
                cy="60"
                r={radius}
                fill="none"
                stroke="url(#soulRing)"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={`${dash} ${circumference}`}
              />
              <defs>
                <linearGradient id="soulRing" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#c9a8ff" />
                  <stop offset="60%" stopColor="#9d5cff" />
                  <stop offset="100%" stopColor="#ff5c8a" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="font-[family-name:var(--font-display)] text-3xl font-bold text-ink">
                {card.score}
                <span className="text-lg">%</span>
              </span>
              <span className="text-[0.6rem] tracking-[0.12em] uppercase text-muted">Match</span>
            </div>
          </div>

          <div className="min-w-0">
            <h3 className="font-[family-name:var(--font-display)] text-2xl font-bold text-ink">
              {card.name}
            </h3>
            <p className="mt-1 text-xs text-muted">{card.realm}</p>
            <p className="mt-4 text-sm font-semibold text-soul-200">{card.verdict}</p>
          </div>
        </div>

        <dl className="relative mt-6 grid grid-cols-3 gap-2 border-t border-white/8 pt-5">
          {card.stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <dt className="sr-only">{stat.label}</dt>
              <dd className="font-[family-name:var(--font-display)] text-xl font-bold text-ink">
                {stat.value}
              </dd>
              <p className="mt-1 text-[0.65rem] leading-tight text-muted">{stat.label}</p>
            </div>
          ))}
        </dl>

        <p className="relative mt-5 text-center text-[0.6rem] tracking-[0.2em] uppercase text-muted/60">
          {card.footer}
        </p>
      </article>
    </div>
  );
}
