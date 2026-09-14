import assert from "node:assert/strict";
import { test } from "node:test";
import { locales, isLocale, nativeLocaleNames } from "../i18n/config";
import { chronicle, compatibilityText } from "../i18n/chronicle";
import { legalText } from "../i18n/legal";
import { profileText, questionnaireText } from "../i18n/profile";
import { getDictionary } from "../i18n/get-dictionary";

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

test("all European locales have complete active translations", () => {
  assert.deepEqual(locales, ["en", "de", "fr", "es", "it", "pt", "ru"]);
  for (const locale of locales) {
    assert.equal(isLocale(locale), true);
    assert.ok(nativeLocaleNames[locale]);
    checkShape(chronicle.en, chronicle[locale], `${locale}.chronicle`);
    checkShape(compatibilityText.en, compatibilityText[locale], `${locale}.compatibility`);
    checkShape(profileText.en, profileText[locale], `${locale}.profile`);
    checkShape(questionnaireText.en, questionnaireText[locale], `${locale}.questionnaire`);
    checkShape(legalText.en, legalText[locale], `${locale}.legal`);
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