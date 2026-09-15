import { conversionCommand, createRedditReceipt, hasMarketingConsent, metaConversionCommand, metaPixelId } from "./reddit-events";
test("Reddit conversions require prior consent and bounded anonymous receipts", () => {
  const now = Date.now();
  const consent = `soulmate-marketing-consent-v3=${encodeURIComponent(JSON.stringify({ allowed: true, savedAt: now }))}`;
  assert.equal(hasMarketingConsent(consent), true);
  assert.equal(hasMarketingConsent(""), false);
  assert.equal(hasMarketingConsent(consent.replace("-v3", "-v1")), false);
  assert.equal(hasMarketingConsent(consent.replace("-v3", "-v2")), false);
  assert.equal(createRedditReceipt(""), null);
  assert.equal(createRedditReceipt(`${consent}; soulmate-marketing-disabled=1`), null);
  const firstReceipt = createRedditReceipt(consent)!;
  assert.deepEqual(Object.keys(JSON.parse(firstReceipt)).sort(), ["conversionId", "createdAt"]);
  assert.notEqual(JSON.parse(firstReceipt).conversionId, JSON.parse(createRedditReceipt(consent)!).conversionId);
  assert.equal(hasMarketingConsent(`${consent}; soulmate-marketing-disabled=1`), false);
  const conversionId = "aabbccdd-1122-3344-5566-778899aabbcc";
  const receipt = JSON.stringify({ conversionId, createdAt: now, email: "must-not-leak@example.com" });
  assert.deepEqual(conversionCommand("SignUp", receipt, now), ["track", "SignUp", { conversionId }]);
  assert.equal(metaPixelId, "1104846879163162");
  assert.deepEqual(metaConversionCommand("SignUp", receipt, now), ["track", "CompleteRegistration", {}, { eventID: conversionId }]);
  for (const event of ["BnetLoginCompleted", "AddonFeedbackSubmitted"] as const) {
    assert.deepEqual(metaConversionCommand(event, receipt, now), ["trackCustom", event, {}, { eventID: conversionId }]);
    assert.deepEqual(conversionCommand(event, receipt, now), ["track", "Custom", { customEventName: event, conversionId }]);
  }
  assert.equal(conversionCommand("SignUp", receipt, now + 300000), null);
  assert.equal(conversionCommand("SignUp", receipt, now - 1), null);
  assert.equal(conversionCommand("SignUp", "invalid", now), null);
  assert.equal(metaConversionCommand("SignUp", receipt, now + 300000), null);
  assert.equal(metaConversionCommand("SignUp", null, now), null);
});
import assert from "node:assert/strict";
import { test } from "node:test";
import { marketingConsentLifetime, readMarketingConsent, writeMarketingConsent } from "./marketing-consent";

test("marketing tracking requires explicit, unexpired consent", () => {
  assert.equal(readMarketingConsent(writeMarketingConsent(true, 1000), 1001), true);
  assert.equal(readMarketingConsent(writeMarketingConsent(false, 1000), 1001), false);
  for (const raw of [null, "", "true", "null", "{}", "broken", '{"allowed":"true","savedAt":1000}', writeMarketingConsent(true, 2000), writeMarketingConsent(true, 1000 - marketingConsentLifetime)]) {
    assert.equal(readMarketingConsent(raw, 1000), null);
  }
});