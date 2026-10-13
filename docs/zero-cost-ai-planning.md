# Zero-cost AI planning

The public portfolio app keeps Firebase Hosting, Auth, and Firestore on the
Spark plan. AI planning runs through the Cloudflare Worker in
`prototypes/zero-cost-planning/worker.mjs`; Firebase Functions are not used.

The Worker verifies Firebase ID tokens, reads only the signed-in user's task
through Firestore REST, enforces five attempts per user
and fifteen attempts globally per UTC day, calls Groq's free-eligible model,
and validates the returned draft. It fails closed when the provider or a free
quota is unavailable. No paid fallback is configured.

Supporting context input, document uploads, and repository connections are
currently deferred. The UI sends no context entries. The backend retains
bounded context support for compatibility with stored task data; the 12,000
character limit remains in place for that legacy capability.

## Local app setup

Set `VITE_AI_PLANNER_URL=/api/plan` in `.env.development.local` and restart the Vite server.
The development-only proxy forwards authenticated requests to the deployed
planner, avoiding cross-origin browser requests from localhost. This uses the
real planner and its existing quotas; it does not provide simulated results.
Emulator mode continues to use the local Worker at port 8787. Production builds
must use the deployed HTTPS planner URL, as configured in the hosting workflow.

## Local checks

```bash
pnpm test:run -- src/entities/delivery-task/planService.test.ts
node --test prototypes/zero-cost-planning/checks.test.mjs
```

## Worker deployment

Install Wrangler locally, then deploy from the repository root:

```bash
pnpm dlx wrangler d1 create personal-development-usage
pnpm dlx wrangler d1 execute personal-development-usage --remote --file prototypes/zero-cost-planning/quota.sql
pnpm dlx wrangler secret put GROQ_API_KEY --name personal-development-planner
pnpm dlx wrangler deploy --config prototypes/zero-cost-planning/wrangler.example.json
```

Set `FREE_PLAN_CONFIRMED=true` and the deployed Worker URL as
`VITE_AI_PLANNER_URL` in the Hosting build environment. Optionally set
`BETA_UIDS` to a comma-separated allowlist for a private beta; leave it empty
for the public portfolio demo. The
Worker requires a D1 database bound as `QUOTA`; create it before deployment and
apply `quota.sql`.

Do not add a payment method, enable a paid Cloudflare plan, enable Firebase
Blaze billing, or configure a paid provider fallback.
