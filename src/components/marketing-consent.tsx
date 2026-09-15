"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Settings2, X } from "lucide-react";
import { Button } from "./ui/button";
import type { Locale } from "@/i18n/config";
import { marketingText } from "@/i18n/marketing";
import { marketingConsentKey, marketingConsentLifetime, readMarketingConsent, redditPixelId, writeMarketingConsent } from "@/lib/marketing-consent";
import { conversionCommand, cookieValue, metaConversionCommand, metaPixelId, redditEventCookie, redditEvents, redditEventSignal, type MetaCommand, type RedditCommand } from "@/lib/reddit-events";
import "./marketing-consent.css";

type RedditPixel = ((...args: RedditCommand) => void) & { callQueue: RedditCommand[]; sendEvent?: (...args: RedditCommand) => void };
type MetaPixel = ((...args: MetaCommand) => void) & { queue: MetaCommand[]; callMethod?: (...args: MetaCommand) => void; push?: MetaPixel; loaded: boolean; version: string };
declare global { interface Window { rdt?: RedditPixel; fbq?: MetaPixel; _fbq?: MetaPixel } }

function storedConsent() {
  if (document.cookie.split(";").some(cookie => cookie.trim() === "soulmate-marketing-disabled=1")) return false;
  try { return readMarketingConsent(localStorage.getItem(marketingConsentKey)); } catch { return null; }
}

function removeMarketingCookies() {
  const domains = window.location.hostname.split(".");
  for (const cookie of document.cookie.split(";")) {
    const name = cookie.split("=")[0].trim();
    if (!name.startsWith("_rdt") && name !== "_fbp" && name !== "_fbc") continue;
    document.cookie = `${name}=; Max-Age=0; Path=/`;
    for (let index = 0; index < domains.length - 1; index++) {
      document.cookie = `${name}=; Max-Age=0; Path=/; Domain=${domains.slice(index).join(".")}`;
    }
  }
}

function clearPendingEvents() {
  for (const event of redditEvents) document.cookie = `${redditEventCookie(event)}=; Max-Age=0; Path=/`;
}

function syncConsentCookie() {
  try {
    const raw = localStorage.getItem(marketingConsentKey);
    if (storedConsent() === true && raw) {
      document.cookie = `${marketingConsentKey}=${encodeURIComponent(raw)}; Max-Age=${marketingConsentLifetime / 1000}; Path=/; SameSite=Lax${location.protocol === "https:" ? "; Secure" : ""}`;
      return;
    }
  } catch {}
  document.cookie = `${marketingConsentKey}=; Max-Age=0; Path=/`;
  clearPendingEvents();
}

export function CookieSettings({ locale }: { locale: Locale }) {
  return <Button className="secondary-button" type="button" onClick={() => window.dispatchEvent(new Event("soulmate-cookie-settings"))}><Settings2 size={18} aria-hidden="true" />{marketingText[locale].settings}</Button>;
}

export function MarketingConsent({ locale, nonce }: { locale: Locale; nonce?: string }) {
  const text = marketingText[locale];
  const pathname = usePathname();
  const [allowed, setAllowed] = useState<boolean | null>(null);
  const [open, setOpen] = useState(false);
  const pixelLoaded = useRef(false);
  const lastVisit = useRef<string | null>(null);
  const panel = useRef<HTMLElement>(null);
  const returnFocus = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const choice = storedConsent();
    syncConsentCookie();
    setAllowed(choice);
    setOpen(choice === null);
    const show = () => {
      returnFocus.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
      setOpen(true);
      requestAnimationFrame(() => panel.current?.focus());
    };
    const sync = (event: StorageEvent) => {
      if (event.key !== marketingConsentKey && event.key !== null) return;
      if (pixelLoaded.current) { window.location.reload(); return; }
      const value = storedConsent();
      syncConsentCookie();
      setAllowed(value);
      setOpen(value === null);
    };
    window.addEventListener("soulmate-cookie-settings", show);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("soulmate-cookie-settings", show);
      window.removeEventListener("storage", sync);
    };
  }, []);

  useEffect(() => {
    if (allowed !== true) return;
    const expire = () => {
      if (storedConsent() !== true) window.location.reload();
    };
    const interval = window.setInterval(expire, 60_000);
    window.addEventListener("focus", expire);
    return () => { window.clearInterval(interval); window.removeEventListener("focus", expire); };
  }, [allowed]);

  useEffect(() => {
    if (allowed !== true || storedConsent() !== true) return;
    if (!window.rdt) {
      const pixel: RedditPixel = Object.assign((...args: RedditCommand) => {
        if (pixel.sendEvent) pixel.sendEvent(...args);
        else pixel.callQueue.push(args);
      }, { callQueue: [] as RedditCommand[] });
      window.rdt = pixel;
      pixel("init", redditPixelId);
      const script = document.createElement("script");
      script.src = `https://www.redditstatic.com/ads/pixel.js?pixel_id=${redditPixelId}`;
      script.async = true;
      script.id = "reddit-pixel";
      if (nonce) script.nonce = nonce;
      document.head.appendChild(script);
    }
    if (!window.fbq) {
      const pixel: MetaPixel = Object.assign((...args: MetaCommand) => {
        if (pixel.callMethod) pixel.callMethod(...args);
        else pixel.queue.push(args);
      }, { queue: [] as MetaCommand[], loaded: true, version: "2.0" });
      pixel.push = pixel;
      window.fbq = pixel;
      window._fbq = pixel;
      pixel("consent", "grant");
      pixel("set", "autoConfig", false, metaPixelId);
      pixel("init", metaPixelId);
      const script = document.createElement("script");
      script.src = "https://connect.facebook.net/en_US/fbevents.js";
      script.async = true;
      script.id = "meta-pixel";
      if (nonce) script.nonce = nonce;
      document.head.appendChild(script);
    }
    pixelLoaded.current = true;
    if (lastVisit.current !== pathname) {
      try { window.rdt("track", "PageVisit"); } catch {}
      try { window.fbq("track", "PageView"); } catch {}
      lastVisit.current = pathname;
    }
    const flush = () => {
      if (storedConsent() !== true) { clearPendingEvents(); return; }
      for (const event of redditEvents) {
        const name = redditEventCookie(event);
        const receipt = cookieValue(document.cookie, name);
        const command = conversionCommand(event, receipt);
        const metaCommand = metaConversionCommand(event, receipt);
        document.cookie = `${name}=; Max-Age=0; Path=/`;
        if (command) {
          try { window.rdt?.(...command); } catch {}
        }
        if (metaCommand) {
          try { window.fbq?.(...metaCommand); } catch {}
        }
      }
    };
    flush();
    window.addEventListener(redditEventSignal, flush);
    return () => window.removeEventListener(redditEventSignal, flush);
  }, [allowed, pathname, nonce]);

  function choose(value: boolean) {
    document.cookie = `soulmate-marketing-disabled=${value ? "" : "1"}; Max-Age=${value ? 0 : marketingConsentLifetime / 1000}; Path=/; SameSite=Lax${location.protocol === "https:" ? "; Secure" : ""}`;
    if (!value) {
      try { window.fbq?.("consent", "revoke"); } catch {}
      removeMarketingCookies();
      clearPendingEvents();
    }
    try { localStorage.setItem(marketingConsentKey, writeMarketingConsent(value)); } catch {
      document.cookie = `${marketingConsentKey}=; Max-Age=0; Path=/`;
      if (pixelLoaded.current && !value) { window.location.reload(); return; }
      setAllowed(false);
      setOpen(false);
      return;
    }
    syncConsentCookie();
    if (!value && pixelLoaded.current) {
      window.rdt = Object.assign(() => {}, { callQueue: [] });
      removeMarketingCookies();
      window.location.reload();
      return;
    }
    setAllowed(value);
    setOpen(false);
    returnFocus.current?.focus();
  }

  if (!open) return null;
  return <section className="marketing-consent" aria-labelledby="marketing-consent-title" tabIndex={-1} ref={panel}>
    <div className="marketing-consent-heading">
      <h2 id="marketing-consent-title">{text.title}</h2>
      {allowed !== null && <button type="button" className="consent-close" aria-label={text.close} title={text.close} onClick={() => { setOpen(false); returnFocus.current?.focus(); }}><X size={18} /></button>}
    </div>
    <p>{text.body} <Link href={`/${locale}/privacy`}>{text.privacy}</Link></p>
    <div className="marketing-consent-actions">
      <button type="button" onClick={() => choose(false)}>{text.reject}</button>
      <button type="button" onClick={() => choose(true)}>{text.accept}</button>
    </div>
  </section>;
}