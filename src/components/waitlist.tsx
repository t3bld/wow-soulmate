"use client";

import { useState } from "react";
import type { Dictionary } from "@/i18n/get-dictionary";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function Waitlist({ dict }: { dict: Dictionary }) {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "done">("idle");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmed = email.trim();
    if (!EMAIL_PATTERN.test(trimmed)) {
      setError(dict.waitlist.error);
      return;
    }

    setError(null);
    setStatus("loading");

    // Demo mode: no backend yet. Swap this for a real signup endpoint.
    await new Promise((resolve) => setTimeout(resolve, 700));
    setStatus("done");
  }

  return (
    <section id="waitlist" className="relative mx-auto max-w-6xl scroll-mt-20 px-5 py-24">
      <div className="soul-card soul-glow relative overflow-hidden rounded-[2rem] px-7 py-14 text-center sm:px-14">
        <div
          className="absolute -top-32 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-soul-500/25 blur-3xl"
          aria-hidden
        />

        <div className="relative mx-auto max-w-xl">
          <p className="text-xs font-semibold tracking-[0.22em] uppercase text-soul-400">
            {dict.waitlist.eyebrow}
          </p>
          <h2 className="mt-4 font-[family-name:var(--font-display)] text-3xl leading-tight font-bold sm:text-4xl">
            {dict.waitlist.title}
          </h2>
          <p className="mt-5 text-base leading-relaxed text-muted">{dict.waitlist.body}</p>

          {status === "done" ? (
            <div className="mt-10 rounded-2xl border border-soul-400/30 bg-soul-500/10 px-6 py-8">
              <p className="font-[family-name:var(--font-display)] text-2xl font-bold text-ink">
                {dict.waitlist.success}
              </p>
              <p className="mt-2 text-sm text-muted">{dict.waitlist.successBody}</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-10" noValidate>
              <label className="sr-only" htmlFor="waitlist-email">
                {dict.waitlist.placeholder}
              </label>
              <div className="flex flex-col gap-3 sm:flex-row">
                <input
                  id="waitlist-email"
                  type="email"
                  name="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder={dict.waitlist.placeholder}
                  aria-invalid={error ? "true" : undefined}
                  className="flex-1 rounded-full border border-white/12 bg-white/5 px-6 py-3.5 text-sm text-ink placeholder:text-muted/60 outline-none transition focus:border-soul-400/60 focus:bg-white/8"
                />
                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="rounded-full bg-soul-500 px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-soul-600/30 transition hover:bg-soul-400 disabled:opacity-60"
                >
                  {status === "loading" ? dict.waitlist.buttonLoading : dict.waitlist.button}
                </button>
              </div>

              {/* Honeypot: hidden from users, catches naive bots. */}
              <input
                type="text"
                name="company"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden
                className="absolute left-[-9999px] h-0 w-0 opacity-0"
              />

              {error ? <p className="mt-3 text-sm text-ember">{error}</p> : null}

              <fieldset className="mt-8">
                <legend className="text-xs font-semibold tracking-[0.16em] uppercase text-muted/70">
                  {dict.waitlist.roleQuestion}
                </legend>
                <div className="mt-4 flex flex-wrap justify-center gap-2">
                  {dict.waitlist.roles.map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => setRole(role === option ? null : option)}
                      aria-pressed={role === option}
                      className={
                        role === option
                          ? "rounded-full border border-soul-400/60 bg-soul-500/20 px-4 py-2 text-xs font-semibold text-soul-100"
                          : "rounded-full border border-white/10 px-4 py-2 text-xs font-semibold text-muted transition hover:border-soul-400/30 hover:text-ink"
                      }
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </fieldset>

              <p className="mt-7 text-xs text-muted/70">{dict.waitlist.trust}</p>
              <p className="mt-2 text-[0.65rem] text-muted/50">{dict.waitlist.demoNote}</p>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
