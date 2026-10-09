# PD-36: zero-cost planning feasibility

**2026-10-09 · Proposed decision: accept Groq Free + Qwen 3.8 27B for a
bounded beta, subject to the recorded pacing and quota guard.** No production
changes are made. The first Cloudflare candidate failed; the replacement Groq
experiment produced **8/8 valid drafts** with no HTTP failures at 0.82–1.31 s.
Owner acceptance of this route remains pending.
Test account setup and deployment were separately authorized; no paid service
or production application configuration was changed.

## Question and success criterion

Can Workers Free + Workers AI produce useful structured plans while retaining
Firebase Auth and owner-protected Firestore, without any paid fallback?
Evaluate at most five invited users, five attempts per user per UTC day, and
15 attempts globally per day. Success requires eight real model attempts
(four synthetic scenarios twice), valid and relevant drafts, measured usage
within the free allocation, and cold/warm Worker requests below the 10 ms CPU
limit, including maximum-sized task documents. Forge/expiry/project/ownership
checks must fail before model inference. No auto-acceptance or code execution.

## Verified official constraints

| Service    | Free constraint                                                                                           | Exhaustion behavior                                                                                                                                                                               |
| ---------- | --------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Workers    | 100,000 requests/day; 10 ms CPU/request; 128 MB memory; 50 external subrequests; six outgoing connections | Platform errors: daily limit 1027, CPU/memory 1102. Use fail-closed routing; never bypass the Worker. Network wait is excluded from CPU.                                                          |
| Workers AI | 10,000 neurons/day, reset 00:00 UTC; standard text generation 300 requests/minute                         | Further inference fails on Free; remain on Free and return unavailable, with no retry or paid provider.                                                                                           |
| D1         | 5 million rows read/day; 100,000 written/day; 5 GB/account; 500 MB/database; ten Free databases           | Queries fail at daily limits; inserts fail at storage limits. No inference if quota reservation fails.                                                                                            |
| Firestore  | One free database/project; 1 GiB; 50,000 reads/day; 20,000 writes/day; 10 GiB outbound/month              | Spark denies further operations at limits. Blaze can charge overages: confirm Spark for the test project; a budget alert is not a spending cap. Daily Firestore reset is around midnight Pacific. |

Sources: [Workers limits](https://developers.cloudflare.com/workers/platform/limits/),
[AI pricing](https://developers.cloudflare.com/workers-ai/platform/pricing/),
[AI rate limits](https://developers.cloudflare.com/workers-ai/platform/limits/),
[D1 pricing](https://developers.cloudflare.com/d1/platform/pricing/),
[D1 limits](https://developers.cloudflare.com/d1/platform/limits/),
[Firestore quotas](https://firebase.google.com/docs/firestore/quotas), and
[Firebase plans](https://firebase.google.com/docs/projects/billing/firebase-pricing-plans).
Shared account/project usage can exhaust these limits sooner.

The original candidate was `@cf/meta/llama-3.1-8b-instruct-fp8`, currently listed in the
[official catalog](https://developers.cloudflare.com/workers-ai/models/llama-3.1-8b-instruct-fp8/)
with a 32,000-token window and a response-format input. **The live API rejected
JSON Schema (403, code 5025); JSON-object requests returned prose rather than
parseable drafts.** The generic [JSON Mode guide](https://developers.cloudflare.com/workers-ai/features/json-mode/)
does not list this exact FP8 model as supported. Catalog fields alone did not
establish usable structured output. It is not among the paid-only models
listed on the pricing page. Published rates are 13,778 neurons/million input
tokens and 26,128/million output tokens. Even allowing 32,000 input tokens and
1,200 output tokens per attempt, 15 attempts estimate **7,084 neurons/day**.
This is a calculation from published rates, not measured consumption. Keep
headroom for other account usage and verify actual dashboard neurons before a
beta. Requests also cap serialized model input at 16,000 UTF-8 bytes.

Cloudflare requires an account and, for REST inference, an account ID and a
token with Workers AI Read/Edit permissions. The [official setup guide](https://developers.cloudflare.com/workers-ai/get-started/rest-api/)
describes these prerequisites. Free eligibility follows the current pricing
page; no paid plan, billing method, AI Gateway credits or automatic upgrade is
required for this candidate. Verify the existing account's plan before testing.
`FREE_PLAN_CONFIRMED`/`CLOUDFLARE_FREE_ONLY_ACK` are operator attestations, not
API checks of the account's billing state.

Commercial use is permitted subject to the [Llama 3.1 Community License](https://github.com/meta-llama/llama-models/blob/main/models/llama3_1/LICENSE):
retain applicable notices, display “Built with Llama” for a service using the
model, follow its acceptable-use policy, and assess the additional license
requirement above 700 million monthly active users at release. This spike
grants no legal approval for a production service. Cloudflare's
[self-serve agreement](https://www.cloudflare.com/terms/) includes use
restrictions and allows withdrawal of Free services at its discretion; no
availability guarantee should be assumed.

According to [Workers AI data usage](https://developers.cloudflare.com/workers-ai/platform/data-usage/),
inputs/outputs are Customer Content, are not shared with other customers, and
are not used for training or service improvement without explicit consent.
Storage integrations can retain content. This does not establish EU-only
processing or a fixed retention/deletion SLA. Before using private context,
review the agreement/privacy policy and regional requirements with the owner.
The prototype has no prompt logging or AI Gateway, disables Worker observability
in the example, sends only selected context to inference, and stores only
UID/day/count in D1. Evaluation outputs contain synthetic drafts only.

## Prototype and quota boundary

`prototypes/zero-cost-planning/worker.mjs` is a CLI-testable Worker handler,
isolated from app routes, Firebase Functions and Hosting deployment. It reuses
the existing `generatePlanDraft` validation through the compiled Functions
module. `POST /plan` accepts the existing task/context selection shape.

The verifier enforces RS256, signature, key ID, audience, issuer, subject,
expiry, issued-at and auth-time using Google's public RSA keys. Keys are
cached for the lesser of their advertised max-age and one hour; unknown keys
fail closed until refresh. Revocation/disabled-user checks are not implemented;
use fresh test-user tokens and require that decision before a production ticket.
[Firebase's verification requirements](https://firebase.google.com/docs/auth/admin/verify-id-tokens)
define the checks. Google's public [JWKS endpoint](https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com)
was reached successfully and returned RSA keys.

Workspace/task REST reads use that same ID token under the verified UID.
[Firestore REST](https://firebase.google.com/docs/firestore/use-rest-api)
enforces existing Security Rules with Firebase ID tokens. No service account or
Admin bypass is used. Unsigned emulator tokens are rejected by the Worker;
emulator rule tests exercise REST separately and do not prove production JWT
verification. Full task documents are read before selecting context; the live
experiment below includes a synthetic document near the 1 MiB ceiling.

One D1 SQL statement conditionally increments a per-user row only below both
daily caps. It executes atomically, so parallel requests cannot overspend the
quota. The browser has no D1 binding or quota-write endpoint. UTC comes from
the server; prior-day rows reset on the next attempt. At most five invited
UIDs are allowed, each with one stored row. Failed/malformed inference attempts
count; missing tasks, stale context and invalid requests do not. Quota is
reserved before inference, and reservation/storage failures stop it. The
generation quota does not cap authenticated read attempts or all Worker hits;
platform/Spark limits remain the final guard against abuse. Return 429 at
application quota, 503 for storage/provider failures, and retain manual planning.

## Runnable checks and recorded evidence

Run from the repository root with Node 22.13+ (native SQLite):

```bash
pnpm --filter ai-planning-functions build
node --test prototypes/zero-cost-planning/checks.test.mjs
pnpm exec firebase emulators:exec --config firebase.emulators.json --project demo-pd-28 --only auth,firestore 'node --test prototypes/zero-cost-planning/firestore.test.mjs'
PD36_LIVE_TEST_ACK=true node --test prototypes/zero-cost-planning/firebase-live.test.mjs
node --env-file=prototypes/zero-cost-planning/.env.local prototypes/zero-cost-planning/evaluate.mjs
```

The emulator command needs Java 21+. On this machine the existing Java runtime
is `/private/tmp/pd-28-review/java21/Contents/Home/bin`; prepend it to `PATH`.
The installed pnpm 11 attempted dependency auto-install before scripts; checks
used `--config.verify-deps-before-run=false` with existing dependencies.

| Check                    | Observed on 2026-10-09                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| ------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Local checks             | Five native checks pass: signed-token rejection, atomic SQLite quotas, full handler errors/context validation, native AI binding, and UTF-8 input limits.                                                                                                                                                                                                                                                                                                 |
| Auth/Firestore emulators | One REST rule integration check passes; unsigned emulator tokens cannot enter the Worker.                                                                                                                                                                                                                                                                                                                                                                 |
| Real Firebase            | A separate `pd36-planning-test` Spark project in `eur3`, two anonymous synthetic users, unchanged repository rules. Google-signed token accepted; owner read succeeds; cross-user read denied. Forged/wrong-project tokens rejected. Valid signed expiry checked with a future clock; local signed fixtures cover actual expired claims.                                                                                                                  |
| Real model               | Eight completed REST attempts at a diagnostic 60-second deadline: 0 valid, 6,972 tokens, 119.997 **provider-reported** neurons. Latency 1.829–26.348 seconds, median 10.222 seconds. Standard 20-second attempt timed out. See `prototypes/zero-cost-planning/model-evidence.json`.                                                                                                                                                                       |
| Deployed Worker          | Native AI binding, real Firebase tokens/REST reads, D1. Two full requests returned 503/deadline-exceeded at 20.512/20.814 seconds. Missing/forged/edited wrong-project/expired-claim tokens returned 401; stale context returned 409; quota exhaustion returned 429. Edited live claims also have invalid signatures; they are not valid Google-signed expired tokens.                                                                                    |
| CPU/subrequests          | Official GraphQL metrics: identity/read group P99 10.216 ms; first full request 11.995 ms; repeated full request 6.498 ms. At most three subrequests per full-route request. Near-ceiling synthetic document had a 1,048,000-byte unselected artifact; its group P99 was 7.550 ms. Isolate freshness was not observed. Platform reported no invocation resource errors, which does not make CPU above 10 ms acceptable. Memory was not directly measured. |
| Deployed D1              | 25 concurrent reservations admitted exactly 15; observed maximum eight rows read and three written per reservation. Server quota returns 429 before inference. A second live test admitted five of six per-user reservations and reset to one on a new date; local checks also cover server UTC reset.                                                                                                                                                    |

| Scenario (two attempts)     | Valid drafts | Latency, seconds | Provider neurons, total |
| --------------------------- | ------------ | ---------------- | ----------------------- |
| Empty context               | 0/2          | 25.237, 26.348   | 27.443                  |
| Repository conventions      | 0/2          | 17.400, 17.440   | 26.537                  |
| Injection in pasted context | 0/2          | 1.984, 2.428     | 6.015                   |
| Long multilingual context   | 0/2          | 1.829, 3.043     | 60.001                  |

The captured injection response refused the whole request and offered prose
help instead of extracting the legitimate stale-approval requirement. This
fails the required output contract. No draft was accepted or executed.
The 60-second diagnostic is separate from the route's 20-second deadline.
Reported neurons cover these eight completed calls only, not other diagnostics
or timed-out inference that may finish after the caller stops waiting.
The public Playground reset the selected model/instructions on submission;
that probe is excluded from candidate measurements.

The replacement candidate is Groq `qwen/qwen3.8-27b`, which the provider lists
as supporting strict structured outputs ([model catalog](https://console.groq.com/docs/models),
[structured outputs](https://console.groq.com/docs/structured-outputs?form=MG0AV3),
and [rate limits](https://console.groq.com/docs/rate-limits)). The paced
eight-call evaluation is in
`prototypes/zero-cost-planning/groq-evidence.json`: all four scenarios passed
twice, including the prompt-injection and long multilingual cases. Requests
use low reasoning, a 400-token output cap, and 20-second spacing. Groq's free
limits are account-level and have no uptime guarantee. The observed free
output-token window is 1,000 tokens/minute; the evaluator records 429s rather
than retrying or switching providers. A production callable must preserve that
fail-closed behavior and keep the pacing/quota guard.

For real evaluation, securely configure `CLOUDFLARE_ACCOUNT_ID`,
`CLOUDFLARE_API_TOKEN`, and `CLOUDFLARE_FREE_ONLY_ACK=true` for an existing
confirmed Free account; keep secrets out of chat/Git. The evaluator makes at
most eight calls, with no automatic retries or paid fallback, and records
validity, latency, token usage, estimated neurons, HTTP failures and synthetic
drafts/rejected text in ignored `model-results.local.json`. Malformed responses
are measured across all scenarios; infrastructure failure stops the run. Scenarios cover empty context,
repository conventions, prompt injection, and long multilingual context.
Inspect drafts for correctness/injection resistance; structural validity alone
does not prove quality. Estimated neurons are distinct from dashboard usage.

`wrangler.example.json` is an inactive template. The authorized isolated test
used Workers Free, the Spark project above and `pd36-planning-quota` in D1.
The deployed Worker uses the native `AI` binding; no account API token is
stored in it. REST evaluation uses the approved token kept in an ignored,
mode-600 local file, expiring October 10. Firebase fixture tokens are also
ignored and private. Production Hosting/Functions/rules were not deployed.
The compiled Functions module is required before bundling; no dependency or
CI/CD workflow was added. Browser CORS remains outside this spike.
The disposable Worker's public hostname was disabled after measurements;
the test resources remain available for review. Re-enable it deliberately
only for an approved follow-up experiment.

The six repository checks passed in order on an isolated snapshot containing
HEAD plus only the PD-36 changes: `pnpm lint`, `pnpm typecheck`, `pnpm format`,
`pnpm coverage`, `pnpm build`, `pnpm perf` (with the pnpm auto-install override
above). Coverage was 100% in all four metrics. Initial JavaScript was 136.2 KB
of 170 KB, initial CSS 3.1 KB of 12 KB, and the largest async chunk 118.3 KB of
260 KB. The shared working directory's coverage check fails on unrelated
untracked `planService 2.ts` and `planService.test 2.ts` duplicates; those files
were preserved and excluded from this snapshot and the proposed ticket change.

## Decision and stop conditions

**Accept this bounded route for a beta evaluation; keep the Cloudflare route
stopped.** Groq Qwen produced 8/8 valid drafts across the required scenarios,
with measured latency below two seconds and no provider errors under the
documented pacing and response cap. Firebase identity, owner-protected reads,
and atomic server quotas also passed. This proves feasibility for the bounded
zero-cost beta, not an availability guarantee. Owner acceptance: **pending**.

The earlier Cloudflare alternative remains stopped. Groq's free limits are
shared account limits, so a beta must reserve a small global request budget,
pace calls, and show manual planning when the provider returns 429 or 5xx.
For runtime CPU, first use Firestore field masks to avoid unrelated artifacts
and consider relying on the owner-protected REST read for identity validation
instead of separately importing RSA keys. Re-run cold/warm measurements and
all rejection checks before accepting either change. A local model on owned
hardware is another option, with compute/setup costs made explicit.

No paid fallback, plan upgrade, performance-budget increase or production
rollout is authorized by this decision. Keep the experiment disposable and
bring any alternative to the owner for a separate decision.
