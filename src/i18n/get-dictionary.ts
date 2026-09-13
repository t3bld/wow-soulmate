import type { Locale } from "./config";
import { en, type Dictionary } from "./dictionaries/en";
import { de } from "./dictionaries/de";

const dictionaries: Record<Locale, Dictionary> = { en, de };

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}

export type { Dictionary };
