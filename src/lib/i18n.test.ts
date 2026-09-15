import assert from "node:assert/strict";
import { test } from "node:test";
import { locales, isLocale, nativeLocaleNames } from "../i18n/config";
import { chronicle, compatibilityText } from "../i18n/chronicle";
import { legalText } from "../i18n/legal";
import { addonText } from "../i18n/addon";
import { conversionText, marketingText, metaCapiPrivacyText, metaPrivacyText, redditCapiPrivacyText } from "../i18n/marketing";
import { securityText, sessionPrivacyText } from "../i18n/security";
import { matchingText, profileOverviewText, profileText, questionnaireText, roleSelectionText } from "../i18n/profile";
import { getDictionary } from "../i18n/get-dictionary";
import { activities, classes, experiences } from "./profile";

function checkShape(reference: unknown, actual: unknown, path: string) {
  if (typeof reference === "string") {
    assert.equal(typeof actual, "string", path);
    if (!path.endsWith(".heroNote")) assert.ok((actual as string).trim(), path);
  } else if (Array.isArray(reference)) {
    assert.ok(Array.isArray(actual), path);
    assert.equal(actual.length, reference.length, path);
    reference.forEach((value, index) => checkShape(value, actual[index], `${path}[${index}]`));
  } else if (reference && typeof reference === "object") {
    assert.ok(actual && typeof actual === "object", path);
    assert.deepEqual(Object.keys(actual).sort(), Object.keys(reference).sort(), path);
    for (const key of Object.keys(reference)) {
      checkShape(reference[key as keyof typeof reference], actual[key as keyof typeof actual], `${path}.${key}`);
    }
  }
}

test("all supported locales have complete active translations", () => {
  assert.deepEqual(locales, ["en", "de", "fr", "es", "it", "pt", "pt-BR", "pl", "ru"]);
  for (const locale of locales) {
    assert.equal(isLocale(locale), true);
    assert.ok(nativeLocaleNames[locale]);
    checkShape(chronicle.en, chronicle[locale], `${locale}.chronicle`);
    checkShape(compatibilityText.en, compatibilityText[locale], `${locale}.compatibility`);
    checkShape(profileText.en, profileText[locale], `${locale}.profile`);
    checkShape(roleSelectionText.en, roleSelectionText[locale], `${locale}.roleSelection`);
    checkShape(profileOverviewText.en, profileOverviewText[locale], `${locale}.profileOverview`);
    checkShape(matchingText.en, matchingText[locale], `${locale}.matching`);
    assert.equal(matchingText[locale].title, "Soulmates");
    checkShape(questionnaireText.en, questionnaireText[locale], `${locale}.questionnaire`);
    checkShape(legalText.en, legalText[locale], `${locale}.legal`);
    checkShape(addonText.en, addonText[locale], `${locale}.addon`);
    checkShape(marketingText.en, marketingText[locale], `${locale}.marketing`);
    checkShape(conversionText.en, conversionText[locale], `${locale}.conversions`);
    checkShape(metaPrivacyText.en, metaPrivacyText[locale], `${locale}.metaPrivacy`);
    assert.ok(legalText[locale].privacy.sections.some(section => section.body.includes(metaPrivacyText[locale].body)));
    checkShape(metaCapiPrivacyText.en, metaCapiPrivacyText[locale], `${locale}.metaCapiPrivacy`);
    assert.ok(legalText[locale].privacy.sections.some(section => section.body.includes(metaCapiPrivacyText[locale])));
    assert.ok(legalText[locale].privacy.sections[5].body.includes(conversionText[locale].privacy));
    checkShape(redditCapiPrivacyText.en, redditCapiPrivacyText[locale], `${locale}.redditCapiPrivacy`);
    assert.ok(legalText[locale].privacy.sections[5].body.includes(redditCapiPrivacyText[locale]));
    checkShape(securityText.en, securityText[locale], `${locale}.security`);
    assert.ok(legalText[locale].privacy.sections[2].body.includes(sessionPrivacyText[locale]));
    checkShape(getDictionary("en").meta, getDictionary(locale).meta, `${locale}.meta`);
    checkShape(getDictionary("en").countdown, getDictionary(locale).countdown, `${locale}.countdown`);
    if (locale !== "en") {
      assert.notEqual(chronicle[locale].subtitle, chronicle.en.subtitle);
      assert.notEqual(profileText[locale].title, profileText.en.title);
      assert.notEqual(getDictionary(locale).meta.title, getDictionary("en").meta.title);
      assert.notEqual(getDictionary(locale).countdown.label, getDictionary("en").countdown.label);
    }
  }
  for (const invalid of ["", "xx", "fr/profile", "EN", "../de"]) assert.equal(isLocale(invalid), false);
});

test("Classic questionnaire labels are complete with the requested optional about label", () => {
  for (const locale of locales) {
    const text = profileText[locale];
    const questionnaire = questionnaireText[locale];
    for (const activity of activities) assert.ok(text.names[activity], `${locale}.${activity}`);
    for (const experience of experiences) assert.ok(text.names[experience], `${locale}.${experience}`);
    for (const playerClass of classes) assert.ok(questionnaire.classesNames[playerClass], `${locale}.${playerClass}`);
    assert.match(text.about, / \([^()]+\)$/);
    for (const label of [text.ageGroup, questionnaire.classes, questionnaire.factions, questionnaire.goals, questionnaire.preferredClasses]) {
      assert.doesNotMatch(label, /\([^)]*\)/, `${locale}.${label}`);
    }
    assert.equal(new Set([text.names.exploration, text.names.questing, text.names.story]).size, 3);
  }
  assert.equal(profileText.en.about, "About you and what you are looking for (optional)");
  assert.equal(profileText.de.about, "Über dich und deine Wünsche (optional)");
  assert.equal(profileText.de.ageGroup, "Altersgruppe");
  assert.equal(profileText.de.names.original, "Seit WoW-Release dabei");
  assert.equal(roleSelectionText.de.label, "Deine Rollen");
  assert.equal(profileText.de.discoverable, "Ich möchte am Matching teilnehmen. Angemeldete Teilnehmer mit sichtbarem Profil sehen meinen Alias, Rolle, Erfahrung, gemeinsame Aktivitäten, überschneidende Stunden und weitere relevante Informationen.");
  assert.deepEqual([profileText.de.names.relaxation, profileText.de.names.professions], ["Entspannung", "Berufe"]);
  assert.deepEqual([profileText.de.names.exploration, profileText.de.names.questing, profileText.de.names.story], ["Erkundung", "Quests", "Story"]);
});

test("profile wording follows the German and English baseline in every locale", () => {
  const expected = {
    en: ["Your profile", "Public alias", "optional", "Your Soulmates"],
    de: ["Dein Profil", "Benutzername", "optional", "Deine Soulmates"],
    fr: ["Ton profil", "Pseudonyme public", "facultatif", "Tes Soulmates"],
    es: ["Tu perfil", "Alias público", "opcional", "Tus Soulmates"],
    it: ["Il tuo profilo", "Alias pubblico", "facoltativo", "I tuoi Soulmates"],
    pt: ["O teu perfil", "Nome público", "opcional", "Os teus Soulmates"],
    "pt-BR": ["Seu perfil", "Nome público", "opcional", "Seus Soulmates"],
    pl: ["Twój profil", "Publiczny pseudonim", "opcjonalnie", "Twoi Soulmates"],
    ru: ["Твой профиль", "Публичный псевдоним", "необязательно", "Твои Soulmates"],
  };
  for (const locale of locales) {
    const [title, alias, optional, heading] = expected[locale];
    assert.equal(profileText[locale].title, title, `${locale}.title`);
    assert.equal(profileText[locale].alias, alias, `${locale}.alias`);
    assert.ok(profileText[locale].about.endsWith(` (${optional})`), `${locale}.about`);
    assert.equal(matchingText[locale].heading, heading, `${locale}.heading`);
  }
});

test("Brazilian Portuguese and Polish have distinct locale identifiers", () => {
  for (const locale of ["pt-BR", "pl"]) {
    assert.ok(isLocale(locale));
    assert.equal(getDictionary(locale).countdown.locale, locale);
  }
});

test("new locales translate landing, feedback and consent completely", () => {
  for (const locale of ["pt-BR", "pl"] as const) {
    for (const copy of [chronicle, compatibilityText, addonText, marketingText, profileText, questionnaireText]) {
      checkShape(copy.en, copy[locale], locale);
    }
    assert.notEqual(chronicle[locale].subtitle, chronicle.en.subtitle);
    assert.notEqual(marketingText[locale].accept, marketingText.en.accept);
  }
});