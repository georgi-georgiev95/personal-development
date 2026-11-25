# Zero-cost AI planning

Daywise uses a Cloudflare Worker to send text planning requests to Groq.
Visitors can generate, edit, and copy a draft as guests. A Firebase account
lets users save a plan and reopen it in their private workspace.

Both generation routes require a Turnstile challenge and share a six-request
per-IP, per-minute burst limit and a hard cap of 100 inference attempts per UTC
day. The Worker checks the challenge action and hostname and records a hash of
each admitted token in D1 to prevent a concurrent replay from using the quota
twice. Signed-in requests for stored tasks still verify ownership in Firestore.

## Local verification

Run these from the repo root with Node 22+ and Java 21 available.

```bash
pnpm emulators:start
```

In separate terminals, run the local planner and Vite.

```bash
node scripts/daywise-planner-emulator.mjs
pnpm dev:emulators --host 127.0.0.1 --port 5175 --strictPort
```

The loopback-only planner runs the Worker handler with local Auth and Firestore,
an in-memory SQLite quota, and deterministic Turnstile and Groq fixtures. The
fixtures consume no production quota. Only emulator-mode Vite development
builds use the fixture challenge.

Create or restore the reusable account in the Auth emulator.

```bash
node scripts/prepare-daywise-test-account.mjs
```

The script keeps the generated credentials in the ignored, owner-only
`daywise-test-account.local` file and restores the same account after emulator
resets. Use the credentials only at the local Vite URL. Generate, edit, and copy
a plan as a guest. Use **Sign in to save**, save the returned draft, then reopen
it from **My space**. Sign out to return to guest mode.

```bash
node --test prototypes/zero-cost-planning/checks.test.mjs
pnpm test:run -- src/entities/delivery-task/planService.test.ts
```

## Release configuration

1. Create a free Turnstile managed widget for the app hostname.
2. Set the widget site key in the GitHub Actions variable
   `VITE_TURNSTILE_SITE_KEY`. The Worker requires the matching hostname in
   `TURNSTILE_HOSTNAME` and the frontend origin in `CORS_ORIGINS`.
3. Apply the D1 schema and configure Worker secrets before deploying the Worker
   and corresponding frontend build.

```bash
pnpm dlx wrangler d1 execute personal-development-usage --remote --file prototypes/zero-cost-planning/quota.sql
pnpm dlx wrangler secret put TURNSTILE_SECRET_KEY --name personal-development-planner
pnpm dlx wrangler secret put GROQ_API_KEY --name personal-development-planner
pnpm dlx wrangler deploy --config prototypes/zero-cost-planning/wrangler.example.json
```

Leave `FREE_PLAN_CONFIRMED` enabled only while the provider account is on the
free plan. Firebase stays on Spark. The D1 schema adds a separate table, so the
previous Worker schema can remain in place during rollout.
