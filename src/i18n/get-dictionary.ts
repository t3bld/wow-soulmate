import type { Locale } from "./config";
import { en, type Dictionary } from "./dictionaries/en";
import { de } from "./dictionaries/de";

const dictionaries: Record<Locale, Dictionary> = {
  en,
  de,
  fr: {
    ...en,
    meta: { title: "WoW Soulmate | Trouve les joueurs qui te correspondent", description: "Trouve des compagnons de WoW qui partagent tes centres d’intérêt et tes horaires. Vivez Azeroth ensemble." },
    countdown: { locale: "fr", announcement: "Sortie le {date} !", label: "WoW: Forever arrive dans", days: "jours", hours: "h", minutes: "min", seconds: "s", live: "C’est parti !" },
  },
  es: {
    ...en,
    meta: { title: "WoW Soulmate | Encuentra a los jugadores que encajan contigo", description: "Encuentra compañeros de WoW con intereses y horarios compatibles. Vivid Azeroth juntos." },
    countdown: { locale: "es", announcement: "¡Lanzamiento el {date}!", label: "WoW: Forever llega en", days: "días", hours: "h", minutes: "min", seconds: "s", live: "¡Ya está aquí!" },
  },
  it: {
    ...en,
    meta: { title: "WoW Soulmate | Trova i giocatori in sintonia con te", description: "Trova compagni di WoW con interessi e orari compatibili. Vivete Azeroth insieme." },
    countdown: { locale: "it", announcement: "In arrivo il {date}!", label: "WoW: Forever arriva tra", days: "giorni", hours: "ore", minutes: "min", seconds: "sec", live: "È arrivato. Si parte!" },
  },
  pt: {
    ...en,
    meta: { title: "WoW Soulmate | Encontra os jogadores que combinam contigo", description: "Encontra companheiros de WoW com interesses e horários compatíveis. Vivam Azeroth juntos." },
    countdown: { locale: "pt", announcement: "Chega a {date}!", label: "WoW: Forever chega em", days: "dias", hours: "h", minutes: "min", seconds: "s", live: "Já chegou. Vamos a isso!" },
  },
  "pt-BR": {
    ...en,
    meta: { title: "WoW Soulmate | Encontre jogadores que combinam com você", description: "Encontre companheiros de WoW com interesses e horários compatíveis. Vivam Azeroth juntos." },
    countdown: { locale: "pt-BR", announcement: "Lançamento em {date}!", label: "WoW: Forever chega em", days: "dias", hours: "h", minutes: "min", seconds: "s", live: "Já chegou. Vamos jogar!" },
  },
  pl: {
    ...en,
    meta: { title: "WoW Soulmate | Znajdź graczy, z którymi się dogadasz", description: "Znajdź towarzyszy w WoW o podobnych zainteresowaniach i pasujących godzinach gry. Odkrywajcie Azeroth razem." },
    countdown: { locale: "pl", announcement: "Premiera {date}!", label: "Do premiery WoW: Forever", days: "dni", hours: "godz.", minutes: "min", seconds: "sek.", live: "Już dostępne. Zaczynamy!" },
  },
  ru: {
    ...en,
    meta: { title: "WoW Soulmate | Найди игроков на одной волне с тобой", description: "Найди товарищей по WoW с общими интересами и подходящим расписанием. Откройте Азерот вместе." },
    countdown: { locale: "ru", announcement: "Выход {date}!", label: "До выхода WoW: Forever", days: "дн.", hours: "ч", minutes: "мин", seconds: "сек", live: "Уже доступно. Вперёд!" },
  },
};

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}

export type { Dictionary };
