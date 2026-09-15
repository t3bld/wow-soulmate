export const locales = ["en", "de", "fr", "es", "it", "pt", "pt-BR", "pl", "ru"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";

export const localeNames: Record<Locale, string> = {
  en: "EN",
  de: "DE",
  fr: "FR",
  es: "ES",
  it: "IT",
  pt: "PT",
  "pt-BR": "PT-BR",
  pl: "PL",
  ru: "RU",
};

export const nativeLocaleNames: Record<Locale, string> = {
  en: "English",
  de: "Deutsch",
  fr: "Français",
  es: "Español",
  it: "Italiano",
  pt: "Português (Portugal)",
  "pt-BR": "Português (Brasil)",
  pl: "Polski",
  ru: "Русский",
};

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}
