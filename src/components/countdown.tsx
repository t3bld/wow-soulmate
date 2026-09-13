"use client";

import { useEffect, useState } from "react";
import type { Dictionary } from "@/i18n/get-dictionary";

const TARGET = Date.UTC(2026, 10, 4, 23, 0, 0);

type Remaining = { days: number; hours: number; minutes: number; seconds: number };

function remainingFrom(now: number): Remaining | null {
  const diff = TARGET - now;
  if (diff <= 0) return null;

  return {
    days: Math.floor(diff / 86_400_000),
    hours: Math.floor(diff / 3_600_000) % 24,
    minutes: Math.floor(diff / 60_000) % 60,
    seconds: Math.floor(diff / 1000) % 60,
  };
}

export function Countdown({ dict }: { dict: Dictionary }) {
  const [remaining, setRemaining] = useState<Remaining | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setRemaining(remainingFrom(Date.now()));

    const id = setInterval(() => setRemaining(remainingFrom(Date.now())), 1000);
    return () => clearInterval(id);
  }, []);

  if (!mounted) return <div className="mt-10 h-[5.5rem]" aria-hidden />;

  if (!remaining) {
    return <p className="mt-10 text-sm font-semibold text-soul-200">{dict.countdown.live}</p>;
  }

  const units = [
    { value: remaining.days, label: dict.countdown.days },
    { value: remaining.hours, label: dict.countdown.hours },
    { value: remaining.minutes, label: dict.countdown.minutes },
    { value: remaining.seconds, label: dict.countdown.seconds },
  ];

  return (
    <div className="mt-10">
      <p className="text-[0.65rem] font-semibold tracking-[0.2em] uppercase text-muted/70">
        {dict.countdown.label}
      </p>
      <div className="mt-3 flex gap-2.5">
        {units.map((unit) => (
          <div
            key={unit.label}
            className="soul-card min-w-[4.2rem] rounded-xl px-3 py-2.5 text-center"
          >
            <div className="font-[family-name:var(--font-display)] text-xl font-bold tabular-nums text-ink">
              {String(unit.value).padStart(2, "0")}
            </div>
            <div className="mt-0.5 text-[0.6rem] tracking-[0.1em] uppercase text-muted">
              {unit.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
