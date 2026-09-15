# WoW Soulmate

Bilingual (EN/DE) landing page for the WoW Soulmate chronicle experience, built with Next.js 16, React 19 and Tailwind CSS 4.

## Local development

```bash
npm install
npm run dev
```

The app is served at http://localhost:3000 and redirects to the default locale (`/en`). Supported locales: `en`, `de`.

## Production build

```bash
npm run build
npm start
```

## Deployment (Vercel)

The project is zero-config on Vercel; [vercel.json](vercel.json) pins the framework preset and the `fra1` region.

1. Import `t3bld/wow-soulmate` at https://vercel.com/new.
2. Keep the detected settings (build: `next build`, install: `npm install`).
3. Set `APP_URL` to the production origin (for example `https://www.wowsoulmate.com`). It is the redirect target for the Battle.net login and the base for absolute Open Graph URLs; without it the Vercel-provided production URL is used for metadata and the login stays disabled.

Pushes to `main` deploy to production, every other branch gets a preview deployment.

## Addon feedback

Signed-in users can open `/{locale}/addon` from the profile navigation. The addon
is a concept, not a downloadable release. The page collects feedback with a reply
email address and a 10-4,000 character message, in all seven supported languages.
Both the page and the sending action require a valid Battle.net session.

Configure these server-only variables in `.env.local` locally and in Vercel for
each deployed environment, then restart/redeploy:

- `RESEND_API_KEY`: an API key with email sending permission from Resend.
- `FEEDBACK_FROM_EMAIL`: a sender on a domain verified in Resend, for example
	`WoW Soulmate <feedback@your-verified-domain.example>`.

Never use a `NEXT_PUBLIC_` prefix or commit credentials. Setup documentation:
https://resend.com/docs/dashboard/domains/introduction and
https://resend.com/docs/api-reference/emails/send-email.

Messages go only to `hello@wowsoulmate.com` (the configured operator address), with
the entered address as Reply-To. No Battle.net data is emailed. Plain-text messages
are sent through Resend and are not saved in the application database. Resend and
the recipient mailbox process the message and reply address; review the privacy
notice and provider arrangements before enabling production delivery.

Missing configuration disables form delivery and displays a direct email link.
Provider acceptance is reported as success; it does not guarantee inbox delivery.
Check the first real message and delivery status in Resend after setup.
Requests time out after 10 seconds. Resend idempotency keys are scoped to the
authenticated account and fixed five-minute windows: identical retries deduplicate,
different messages in the same window conflict. This is not a rolling rate limit;
requests on either side of a window boundary can both be accepted.

## Questionnaire storage

`soulmate_profiles` stores roles and activities as nonempty arrays, own classes
and factions as optional selections, and search preferences as typed columns.
Retired goals and priorities no longer participate in storage or matching.
There is no legacy scalar role or questionnaire JSON column.

`soulmate_profile_playtimes` contains 1-14 ordered time blocks per profile. Each
block groups weekdays (Monday=1, Sunday=7) and whole-hour local start/end times;
24 means midnight at the end of that day. The IANA timezone stays on the profile.
Matching still resolves actual instants with DST and merges overlapping blocks.
Saving replaces the blocks atomically; profile deletion cascades to them.

PostgreSQL constraints enforce allowed selections, nonempty roles/activities,
valid hours and weekdays, adult confirmation, and selections for must criteria.
A deferred constraint trigger requires at least one time block at transaction
end, allowing atomic replacement. These SQL constraints/functions live in the
migration and must be retained; Prisma schema validation alone cannot recreate
them. Keep allowed values in the migration history and application validation
aligned through new migrations when questionnaire options change.

The normalization migration backfills existing multi-window JSON or legacy
single-window data before dropping the old columns. Deploy it together with the
updated application during a maintenance window: old application versions cannot
write the new schema. No database reset is needed.

```bash
npx prisma migrate deploy --config prisma7.config.ts
npx prisma generate --config prisma7.config.ts
```

## Private Battle.net account data

The OAuth callback fetches UserInfo using the existing `openid` scope and checks
its subject against the validated ID token. Only BattleTag, optional email and
email-verification status, and a server-generated last-login timestamp are kept.
Email is not guaranteed by Battle.net; missing values remain `NULL`. No extra
email scope is requested. Access/refresh tokens and raw claims are not stored.

Before profile creation, the account data lives only in the encrypted 24-hour
session. Creating a profile persists it; subsequent logins refresh it. Existing
sessions require a new login to populate these fields. Editing a profile cannot
overwrite account data or replace a newer login with an older session's data.
Profile deletion removes the account fields as part of the same row. These
fields are omitted from ordinary Prisma reads and excluded by the public profile
schema; they are not shown in the questionnaire, sent to matches, or used for marketing.

Apply the additive migration before deploying the new callback:

```bash
npx prisma migrate deploy --config prisma7.config.ts
npx prisma generate --config prisma7.config.ts
```

The translated privacy notices describe this storage. Have the legal basis and
any future contact, billing or marketing purposes reviewed before launch.
Marketing consent remains a separate future feature.

## Private WoW character imports

Login now requests `openid wow.profile`. Existing users must sign out and sign in
again to grant WoW account access. No imported fields are added to the questionnaire
or public matches. The existing matching score is unchanged.

After the OAuth response, Next.js `after()` imports account-owned characters from
all returned WoW licenses in EU, US, KR and TW, separately for Retail, Classic Era,
Classic Progression and Classic Anniversary. China requires a separate integration.
The import uses official account lists, not arbitrary public character searches.
Each version/region has its own namespace, request status and character list.

Stored fields include character and realm IDs/names, license ID, race, faction,
class, level, spec, equipment/item levels, achievement points and achievements,
combat/achievement statistics, PvP summary and 2v2/3v3/RBG ratings. Retail additionally
requests professions, dungeon/raid progress, current Mythic+ profile, completed
quests and reputations. Classic endpoint availability varies. We do not recursively
crawl API links, guild rosters, cosmetic collections or older Mythic+ season links.
Protected `total_time_played` is retained only when returned (including nested
`protected_stats`, normalized into the protected detail fields); missing playtime is
unknown, never inferred from last login or achievements. A complete `/played`
history and every possible WoW metadata field are not guaranteed by this import.

`soulmate_wow_imports` stores a single private JSON snapshot per Battle.net subject,
including endpoint availability, start/completion times and completeness. The
profile relation is attached on first save and never included in normal profile
reads. Before profile creation, the database import expires after 24 hours and
sign-out deletes it. Linked imports expire 29 days after import start. A new login
replaces the snapshot; transient API failures may leave a partial new snapshot.
There is no historical archive. Profile deletion cascades to the import. Run IDs
prevent an older or deleted background run from recreating or overwriting data.

The importer validates character status before details: a 404, invalid status or
changed character ID removes the character. Network requests use fixed Blizzard
hosts, bearer headers, no redirect following or fetch caching, four concurrent
requests, an 8-second request timeout and a 220-second total work budget. Rosters
are collected before details, with checkpoints after each detail category. Missing
scopes, unavailable endpoints, rate limits and budget exhaustion are explicit
statuses, not empty-account success. A platform interruption leaves the last
checkpoint with `status: running` and `completedAt: null`. A later login retries;
this is not a durable queue and cannot guarantee complete imports for large accounts.
No OAuth tokens are persisted, so there is no scheduled offline refresh.

### Deployment requirements

- Apply the migration and generate Prisma using the commands above.
- Configure `CRON_SECRET` in Vercel (a long random secret, never public).
- The daily Vercel cron calls `/api/cron/wow-imports` with the bearer secret and
	deletes expired snapshots. Login also purges expired snapshots. Monitor failed
	cron executions; outside Vercel, schedule the same authenticated endpoint daily.
- Without the scheduled cleanup, automatic time-based physical deletion is not
	guaranteed. Expired snapshots must never be used by future matching code.
- The OAuth route requires a hosting plan/runtime supporting `maxDuration = 300`
	and Next.js `after()`. The callback returns before character network work begins.
- Verify real Retail and Classic payloads with a newly authorized account before
	relying on these fields for scoring. Unit tests use simulated API responses.

Focused database lifecycle test (uses and removes only its own random test subject):

```bash
WOW_IMPORT_DB_TEST=1 NODE_OPTIONS=--conditions=react-server npx tsx --import dotenv/config --test src/lib/wow-import.test.ts
```

Official references:
- [Retail Profile APIs](https://community.developer.battle.net/documentation/world-of-warcraft/profile-apis)
- [Classic Profile APIs](https://community.developer.battle.net/documentation/world-of-warcraft-classic/profile-apis)
- [Classic namespaces](https://community.developer.battle.net/documentation/world-of-warcraft-classic/guides/namespaces)
- [Classic known issues](https://community.developer.battle.net/documentation/world-of-warcraft-classic/guides/known-issues)
