import assert from "node:assert/strict";
import { test } from "node:test";
import { addonFeedbackSchema, deliverAddonFeedback } from "./addon-feedback";

const input = { message: "Please add an in-game friends list." };
const options = { apiKey: "test-key", from: "Soulmate <feedback@example.com>", subject: "test-player", claimSlot: async () => true, now: 600_000 };

test("addon feedback requires only a bounded, nonblank message and strips email", () => {
  assert.equal(addonFeedbackSchema.safeParse(input).success, true);
  assert.deepEqual(addonFeedbackSchema.parse({ ...input, email: "private@example.com" }), input);
  for (const invalid of [{ message: "short" }, { ...input, message: "    " }, { ...input, message: "x".repeat(4001) }]) {
    assert.equal(addonFeedbackSchema.safeParse(invalid).success, false);
  }
});

test("addon mail uses fixed recipient, no user email and per-account time-bucket idempotency", async () => {
  const keys: string[] = [];
  const request: typeof fetch = async (url, init) => {
    assert.equal(url, "https://api.resend.com/emails");
    const body = JSON.parse(String(init?.body));
    assert.deepEqual(body.to, ["hello@wowsoulmate.com"]);
    assert.equal(body.reply_to, undefined);
    assert.equal(body.from, options.from);
    assert.equal(body.html, undefined);
    assert.equal(body.text, input.message);
    keys.push(new Headers(init?.headers).get("Idempotency-Key")!);
    return Response.json({ id: "email-id" });
  };
  const legacyInput = { ...input, email: "private@example.com" };
  assert.equal(await deliverAddonFeedback(legacyInput, options, request), "sent");
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

test("addon mail fails closed on denied or unavailable rate limit storage", async () => {
  const request: typeof fetch = async () => { assert.fail("must not send"); };
  assert.equal(await deliverAddonFeedback(input, { ...options, claimSlot: async () => false }, request), "limited");
  assert.equal(await deliverAddonFeedback(input, { ...options, claimSlot: async () => { throw new Error("database unavailable"); } }, request), "failed");
  const invalid = { ...input, message: "" };
  assert.equal(await deliverAddonFeedback(invalid, { ...options, claimSlot: async () => { assert.fail("invalid input must not touch storage"); } }, request), "failed");
});

test("rate limit keys are stable across time windows, per account and keyed by a secret", async () => {
  const keys: string[] = [];
  const claimSlot = async (key: string) => { keys.push(key); return false; };
  await deliverAddonFeedback(input, { ...options, claimSlot });
  await deliverAddonFeedback(input, { ...options, claimSlot, now: 900_000 });
  await deliverAddonFeedback(input, { ...options, claimSlot, subject: "another-player" });
  await deliverAddonFeedback(input, { ...options, claimSlot, apiKey: "different-secret" });
  assert.match(keys[0], /^[a-f0-9]{64}$/);
  assert.equal(keys[0], keys[1]);
  assert.notEqual(keys[0], keys[2]);
  assert.notEqual(keys[0], keys[3]);
});