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

  const units = [
    { value: remaining?.days, label: dict.countdown.days },
    { value: remaining?.hours, label: dict.countdown.hours },
    { value: remaining?.minutes, label: dict.countdown.minutes },
    { value: remaining?.seconds, label: dict.countdown.seconds },
  ];

  return (
    <section className="launch-countdown" aria-label={dict.countdown.label}>
      <div className="launch-countdown-inner">
      <div className="launch-countdown-heading">
        <img src="https://blz-contentstack-images.akamaized.net/v3/assets/blt9c12f249ac15c7ec/bltee571c6de7ccbaf6/6a95adbf1deff31d75439029/camelot-icon.png" alt="" width={48} height={54} />
        <h2 aria-live="polite">{mounted && !remaining ? dict.countdown.live : dict.countdown.announcement}</h2>
      </div>
      <div className="launch-countdown-units" role="timer" aria-live="off" aria-label={dict.countdown.label}>
        {units.map((unit) => (
          <div key={unit.label} className="launch-countdown-unit">
            <span className="launch-countdown-value">{mounted ? String(unit.value ?? 0).padStart(2, "0") : "--"}</span>
            <span className="launch-countdown-label">{unit.label}</span>
          </div>
        ))}
      </div>
      </div>
    </section>
  );
}
