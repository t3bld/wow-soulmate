import assert from "node:assert/strict";
import { test } from "node:test";
import { addonFeedbackSchema, deliverAddonFeedback } from "./addon-feedback";

const input = { email: "player@example.com", message: "Please add an in-game friends list." };
const options = { apiKey: "test-key", from: "Soulmate <feedback@example.com>", subject: "test-player", now: 600_000 };

test("addon feedback validates email and bounded, nonblank messages", () => {
  assert.equal(addonFeedbackSchema.safeParse(input).success, true);
  for (const invalid of [{ ...input, email: "bad\r\nBcc: x@example.com" }, { ...input, message: "    " }, { ...input, message: "x".repeat(4001) }]) {
    assert.equal(addonFeedbackSchema.safeParse(invalid).success, false);
  }
});

test("addon mail uses fixed recipient, reply-to and per-account time-bucket idempotency", async () => {
  const keys: string[] = [];
  const request: typeof fetch = async (url, init) => {
    assert.equal(url, "https://api.resend.com/emails");
    const body = JSON.parse(String(init?.body));
    assert.deepEqual(body.to, ["hello@wowsoulmate.com"]);
    assert.equal(body.reply_to, input.email);
    assert.equal(body.from, options.from);
    assert.equal(body.html, undefined);
    assert.ok(body.text.includes(input.message));
    keys.push(new Headers(init?.headers).get("Idempotency-Key")!);
    return Response.json({ id: "email-id" });
  };
  assert.equal(await deliverAddonFeedback(input, options, request), "sent");
  await deliverAddonFeedback(input, { ...options, now: 600_100 }, request);
  await deliverAddonFeedback(input, { ...options, subject: "another-player" }, request);
  await deliverAddonFeedback(input, { ...options, now: 900_000 }, request);
  assert.equal(keys[0], keys[1]);
  assert.notEqual(keys[0], keys[2]);
  assert.notEqual(keys[0], keys[3]);
});

test("addon mail never reports provider failures or missing configuration as success", async () => {
  for (const status of [400, 401, 500]) {
    assert.equal(await deliverAddonFeedback(input, options, async () => new Response(null, { status })), "failed");
  }
  for (const status of [409, 429]) {
    assert.equal(await deliverAddonFeedback(input, options, async () => new Response(null, { status })), "limited");
  }
  assert.equal(await deliverAddonFeedback(input, options, async () => Response.json({})), "failed");
  assert.equal(await deliverAddonFeedback(input, options, async () => { throw new Error("offline"); }), "failed");
  assert.equal(await deliverAddonFeedback(input, { ...options, apiKey: "" }, async () => { assert.fail("must not send"); }), "failed");
});