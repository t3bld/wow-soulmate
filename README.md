# WoW Soulmate

A new world awaits you. Do you really want to play alone? Make friends in WoW again, like in the old days. Share adventures at your own pace, instead of playing alone or always rushing to keep up.

## Reddit Conversions API

The browser Pixel and server Conversions API share the same random conversion ID.
`SignUp` maps to CAPI `SIGN_UP` after the first successful profile save.
`BnetLoginCompleted` (first login of a new account) and
`AddonFeedbackSubmitted` (feedback accepted by the mail provider) use `CUSTOM`.
Do not add duplicate button-click rules in Reddit's Event Setup Tool.

1. Set `REDDIT_CONVERSION_API_SECRET` privately in your local environment and Vercel.
	Never use a `NEXT_PUBLIC_` prefix or commit the token. Without it, CAPI is disabled.
2. For a controlled test, set `REDDIT_CAPI_TEST_ID` to the ID shown by Reddit
	Events Testing, then restart or redeploy. Leave it empty for normal delivery.
3. Accept the renewed marketing consent (v4), use a new account and save its
	profile once. Verify the browser and server events and their deduplication
	in Reddit Events Manager. Existing profiles do not emit another SignUp on edit.
4. Remove `REDDIT_CAPI_TEST_ID` and restart or redeploy after testing.

Consent is checked for each action; earlier events are never backfilled.
The server sends the event type, original timestamp, WEBSITE source and
`metadata.conversion_id`, plus existing `_rdt_cid` and `_rdt_uuid` values when
available. No user IP, user agent, full URL, email, Battle.net ID, profile answers
or feedback text are forwarded. Without Reddit matching cookies, attribution
may be limited; delivery does not guarantee attribution to an ad.

Delivery uses Next.js `after()`, with a four-second timeout per attempt and at
most one immediate retry on network errors or HTTP 5xx. Retries preserve the
body, event timestamp and conversion ID. HTTP 4xx, including 429, is not retried.
There is no durable queue or guaranteed delivery after a process interruption.
Failures log only a generic message and event name, not tokens or Reddit bodies,
and do not block the user's action. Consent withdrawal cannot recall requests
already dispatched. Meta remains browser-only.

Official schema: https://ads-api.reddit.com/api/v3/openapi.json
API documentation: https://ads-api.reddit.com/docs/v3/api/reddit-advertising-api