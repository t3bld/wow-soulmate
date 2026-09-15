import Link from "next/link";
import { Download, Handshake, LogOut, UserRound } from "lucide-react";
import type { Locale } from "@/i18n/config";
import { matchingText, profileText } from "@/i18n/profile";
import { addonText } from "@/i18n/addon";
import { logout } from "@/app/[locale]/profile/actions";
import { LocaleSwitcher } from "./locale-switcher";
import { Button } from "./ui/button";

export function ProfileHeader({ locale, active, hasProfile = true }: { locale: Locale; active: "soulmates" | "profile" | "addon"; hasProfile?: boolean }) {
  const links = [
    { page: "soulmates", label: matchingText[locale].title, icon: Handshake },
    { page: "addon", label: addonText[locale].navigation, icon: Download },
    { page: "profile", label: matchingText[locale].profile, icon: UserRound },
  ];
  return <header className="profile-header section-width">
    <Link className="wordmark" href={`/${locale}`} aria-label="WoW Soulmate">
      <img className="nav-logo" src="https://blz-contentstack-images.akamaized.net/v3/assets/blt9c12f249ac15c7ec/bltee571c6de7ccbaf6/6a95adbf1deff31d75439029/camelot-icon.png" alt="" width={928} height={1039} />
      <span className="nav-logo-word">Soulmate</span>
    </Link>
    <LocaleSwitcher current={locale} />
    <nav className="profile-nav">
      {links.filter(link => hasProfile || link.page !== "soulmates").map(({ page, label, icon: Icon }) => <Button key={page} asChild className={active === page ? undefined : "secondary-button"}>
        <Link href={`/${locale}/${page}`} aria-current={active === page ? "page" : undefined}><Icon size={16} aria-hidden="true" />{label}</Link>
      </Button>)}
      {!hasProfile && <form action={logout.bind(null, locale)}><Button type="submit" className="secondary-button"><LogOut size={16} aria-hidden="true" />{profileText[locale].logout}</Button></form>}
    </nav>
  </header>;
}