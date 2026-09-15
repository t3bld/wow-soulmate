import assert from "node:assert/strict";
import { test } from "node:test";
import { parseBnetAccount } from "./bnet-account";

test("Battle.net identity stores only explicitly allowed account fields", () => {
  assert.deepEqual(parseBnetAccount({ sub: "123", battletag: "Player#1234", email: "player@example.com", email_verified: true, access_token: "discard", password: "discard" }, "123"), {
    battleTag: "Player#1234", email: "player@example.com", emailVerified: true,
  });
});

test("Battle.net email is optional and verification is never inferred", () => {
  assert.deepEqual(parseBnetAccount({ sub: "123", battletag: "Player#1234" }, "123"), { battleTag: "Player#1234", email: null, emailVerified: null });
  assert.equal(parseBnetAccount({ sub: "123", email: "player@example.com" }, "123").emailVerified, null);
  assert.equal(parseBnetAccount({ sub: "123", email: "player@example.com", email_verified: false }, "123").emailVerified, false);
  assert.deepEqual(parseBnetAccount({ sub: "123", battletag: {}, email: "invalid", email_verified: true }, "123"), { battleTag: null, email: null, emailVerified: null });
});

test("Battle.net identity must match the validated login subject", () => {
  assert.throws(() => parseBnetAccount({ sub: "other" }, "123"));
  assert.throws(() => parseBnetAccount({}, "123"));
});