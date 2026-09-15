import { conversionCommand, createRedditReceipt, hasMarketingConsent, metaConversionCommand, metaPixelId } from "./reddit-events";
test("Reddit conversions require prior consent and bounded anonymous receipts", () => {
  const now = Date.now();
  const consent = `${marketingConsentKey}=${encodeURIComponent(JSON.stringify({ allowed: true, savedAt: now }))}`;
  assert.equal(hasMarketingConsent(consent), true);
  assert.equal(hasMarketingConsent(""), false);
  for (const version of ["v1", "v2", "v3"]) assert.equal(hasMarketingConsent(consent.replace("-v4", `-${version}`)), false);
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
import { marketingConsentKey, marketingConsentLifetime, readMarketingConsent, writeMarketingConsent } from "./marketing-consent";
import { redditConversionPayload, sendRedditConversion } from "./reddit-conversions";

test("Reddit CAPI shares pixel IDs, requires consent and only forwards allowlisted data", () => {
  const now = Date.now();
  const consent = `${marketingConsentKey}=${encodeURIComponent(writeMarketingConsent(true, now))}`;
  const receipt = createRedditReceipt(consent)!;
  const { conversionId, createdAt } = JSON.parse(receipt);
  const uuid = "1684189007728.7c73f2ae-a433-4d7b-9838-f467da98f48e";
  const payload = redditConversionPayload("SignUp", receipt, `${consent}; _rdt_cid=3184742045291813272; _rdt_uuid=${uuid}; email=private@example.com`, now)!;
  assert.deepEqual(payload.data.events[0], {
    event_at: createdAt, action_source: "WEBSITE", type: { tracking_type: "SIGN_UP" },
    metadata: { conversion_id: conversionId }, click_id: "3184742045291813272", user: { uuid },
  });
  assert.equal(conversionCommand("SignUp", receipt, now)?.[2]?.conversionId, conversionId);
  for (const event of ["BnetLoginCompleted", "AddonFeedbackSubmitted"] as const) {
    assert.deepEqual(redditConversionPayload(event, receipt, consent, now)?.data.events[0].type, { tracking_type: "CUSTOM", custom_event_name: event });
  }
  assert.equal(redditConversionPayload("SignUp", receipt, "", now), null);
  assert.equal(redditConversionPayload("SignUp", receipt, `${consent}; soulmate-marketing-disabled=1`, now), null);
  assert.equal(redditConversionPayload("SignUp", receipt, consent, now + 300000), null);
  assert.equal(redditConversionPayload("SignUp", "bad", consent, now), null);
  const minimal = redditConversionPayload("SignUp", receipt, `${consent}; _rdt_cid=bad%0Avalue; _rdt_uuid=private@example.com`, now)!.data.events[0];
  assert.equal("user" in minimal, false);
  assert.equal("click_id" in minimal, false);
});

test("Reddit CAPI bounds retries, preserves IDs and never throws transport failures", async () => {
  const consent = `${marketingConsentKey}=${encodeURIComponent(writeMarketingConsent(true))}`;
  const receipt = createRedditReceipt(consent)!;
  const calls: RequestInit[] = [];
  const request: typeof fetch = async (url, options) => {
    assert.equal(url, "https://ads-api.reddit.com/api/v3/pixels/a2_joskcj21ome3/conversion_events");
    calls.push(options!);
    return calls.length === 1 ? new Response(null, { status: 503 }) : Response.json({ data: { message: "Successfully processed 1 conversion events." } });
  };
  assert.equal(await sendRedditConversion("SignUp", receipt, consent, undefined, undefined, request), "disabled");
  assert.equal(await sendRedditConversion("SignUp", receipt, "", "test-token", undefined, request), "skipped");
  assert.equal(calls.length, 0);
  assert.equal(await sendRedditConversion("SignUp", receipt, consent, "test-token", "test-id", request), "accepted");
  assert.equal(calls.length, 2);
  assert.equal(calls[0].body, calls[1].body);
  assert.equal(calls[0].redirect, "error");
  assert.equal(calls[0].cache, "no-store");
  assert.ok(calls[0].signal);
  assert.deepEqual(calls[0].headers, { Authorization: "Bearer test-token", "Content-Type": "application/json" });
  assert.equal(JSON.parse(calls[0].body as string).data.test_id, "test-id");
  for (const status of [400, 401, 403, 429]) {
    let attempts = 0;
    assert.equal(await sendRedditConversion("SignUp", receipt, consent, "test-token", undefined, async () => { attempts++; return new Response(null, { status }); }), "failed");
    assert.equal(attempts, 1);
  }
  let failures = 0;
  assert.equal(await sendRedditConversion("SignUp", receipt, consent, "test-token", undefined, async () => { failures++; throw new Error("private transport error"); }), "failed");
  assert.equal(failures, 2);
  assert.equal(await sendRedditConversion("SignUp", receipt, consent, "test-token", undefined, async () => Response.json({ unexpected: true })), "failed");
});

test("marketing tracking requires explicit, unexpired consent", () => {
  assert.equal(readMarketingConsent(writeMarketingConsent(true, 1000), 1001), true);
  assert.equal(readMarketingConsent(writeMarketingConsent(false, 1000), 1001), false);
  for (const raw of [null, "", "true", "null", "{}", "broken", '{"allowed":"true","savedAt":1000}', writeMarketingConsent(true, 2000), writeMarketingConsent(true, 1000 - marketingConsentLifetime)]) {
    assert.equal(readMarketingConsent(raw, 1000), null);
  }
});