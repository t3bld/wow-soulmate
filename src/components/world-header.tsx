"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Menu, X } from "lucide-react";
import type { Locale } from "@/i18n/config";
import { chronicle } from "@/i18n/chronicle";
import { profileText } from "@/i18n/profile";
import { LocaleSwitcher } from "./locale-switcher";
import { Button } from "./ui/button";

export function WorldHeader({ locale }: { locale: Locale }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const text = chronicle[locale];
  const accessHref = `/oauth/login?locale=${locale}`;
  const accessLabel = profileText[locale].login;

  return <header className="world-header">
    <Link className="wordmark" href={`/${locale}`} aria-label="WoW Soulmate">
      <img className="nav-logo" src="https://blz-contentstack-images.akamaized.net/v3/assets/blt9c12f249ac15c7ec/bltee571c6de7ccbaf6/6a95adbf1deff31d75439029/camelot-icon.png" alt="" width={928} height={1039} />
      <span className="nav-logo-word">Soulmate</span>
    </Link>
    <div className="header-actions">
      <LocaleSwitcher current={locale} />
      <Button asChild className="header-cta"><a href={accessHref}>{accessLabel}<ArrowRight size={14} /></a></Button>
      <button type="button" className="mobile-menu icon-button" aria-label={menuOpen ? text.closeMenu : text.openMenu} aria-expanded={menuOpen} aria-controls="mobile-navigation" onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X /> : <Menu />}</button>
    </div>
    {menuOpen && <nav id="mobile-navigation" className="mobile-navigation"><a href={accessHref}>{accessLabel}</a></nav>}
  </header>;
}