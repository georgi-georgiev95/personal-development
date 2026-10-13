# Architecture and hosting

AI Delivery Lab is a portfolio application. Its infrastructure is intentionally
small, split into a static web application, Firebase's free application
services, and a free-eligible AI planning edge service.

## At a glance

```text
Browser
  │
  ├─ Firebase Hosting ── serves the React/Vite application
  ├─ Firebase Authentication ── signs users in and issues ID tokens
  └─ Cloudflare Worker /plan
       ├─ verifies the Firebase ID token
       ├─ reads the user's task/context from Firestore
       ├─ enforces the D1 quota
       └─ calls Groq's free-eligible model
```

The browser does not call Groq directly. The Worker is the small trusted
backend boundary between the public frontend, Firebase data, and the AI
provider.

## Frontend

The frontend uses:

- React 19 for the UI and component model;
- TypeScript for typed application code;
- Vite for development, bundling, and code splitting;
- React Router for client-side navigation;
- Linaria for the project's typed, build-time CSS;
- Firebase Web SDK for Authentication and Firestore access.

The browser is responsible for rendering the brief-first product experience,
authenticating the user, applying the local light/dark preference, and sending
an authenticated planning request. It is not a safe place for provider API
keys, quota enforcement, or privileged database access because everything
shipped to the browser can be inspected and modified by the user.

The frontend calls the Worker through `VITE_AI_PLANNER_URL`. In local emulator
mode it uses `http://127.0.0.1:8787/plan`; in the deployed application it uses:

`https://personal-development-planner.g-georgiev9507.workers.dev/plan`

## Firebase

The Firebase project is `personal-development-c52b9` and remains on the Spark
no-cost plan.

### Firebase Hosting

Hosting serves the compiled `dist/` directory at
[georgiev-development.web.app](https://georgiev-development.web.app).

It is used because the application is a static Vite build and Firebase already
provides a free HTTPS deployment and the SPA rewrite to `index.html`.

Without Hosting, the built frontend would have no public deployment target.
The Worker cannot replace it: a Worker is the backend endpoint, not the
application's static asset hosting and SPA delivery layer.

### Firebase Authentication

Authentication handles registration, login, session state, and Firebase ID
tokens. The frontend sends the current user's ID token to the Worker as a
Bearer token.

Without Authentication, the application could still show a public demo, but
it could not reliably associate planning requests with a user or prove to the
Worker which Firestore data the requester is allowed to access.

### Cloud Firestore

Firestore stores user profiles and the user's task/context data. The Worker
uses the Firebase REST API with a verified user token and only reads the task
and context requested by that user.

Without Firestore, the application would lose its persistent user data and the
planner would have no shared source of truth for task context. The Worker
could accept the entire context from the browser, but that would be less
trustworthy and would not provide the application's existing persistence model.

### What we deliberately do not use

Firebase Functions are removed. They require the Firebase Blaze billing plan,
which conflicts with the portfolio requirement that the project remain free.
Firebase is therefore used for Hosting, Authentication, and Firestore only.

## Cloudflare

### Cloudflare Worker

The Worker in `prototypes/zero-cost-planning/worker.mjs` is the AI planning
backend. It:

1. validates the request and CORS origin;
2. verifies the Firebase ID token;
3. checks the optional beta allowlist;
4. reads only authorized task/context data from Firestore;
5. applies per-user and global daily limits;
6. calls Groq;
7. validates the AI response before returning it.

It is deployed at
`personal-development-planner.g-georgiev9507.workers.dev`.

We need this backend because the browser cannot safely hold `GROQ_API_KEY`,
cannot enforce a quota against a malicious client, and should not perform
privileged cross-service coordination. The Worker also gives the frontend one
stable API boundary if the AI provider changes later.

### Cloudflare D1

D1 is the Worker's small SQLite-compatible quota store. The deployed database
is named `personal-development-usage`. It stores the current UTC day and
request count per user, allowing the Worker to enforce hard limits without
another paid database.

Without D1, the quota would either disappear on each request, rely on mutable
client state, or require another persistent backend. In-memory Worker state is
not a reliable daily quota because Worker instances are distributed and
ephemeral.

## Groq

Groq supplies the AI completion used by the Worker through its OpenAI-compatible
API. The current model is `qwen/qwen3.8-27b`. The API key is stored only as the
Cloudflare secret `GROQ_API_KEY`; it is never included in the frontend build.

The provider is selected because it offers a free-eligible model suitable for a
portfolio-scale demo and a simple API that can be called from the Worker.
Provider usage is bounded by the Worker quotas. There is no paid fallback: if
the provider or the free quota is unavailable, the Worker fails closed instead
of silently creating a bill.

Without an AI provider, the planner could only return a deterministic or
hard-coded result. That would not demonstrate the end-to-end AI workflow this
portfolio application is meant to showcase.

## Why the architecture is split this way

Each service has one job:

| Service           | Responsibility             | Why it is needed                                  |
| ----------------- | -------------------------- | ------------------------------------------------- |
| React/Vite        | UI and browser application | Product experience and static build               |
| Firebase Hosting  | Static deployment          | Public HTTPS delivery for the SPA                 |
| Firebase Auth     | Identity                   | User sessions and verifiable ID tokens            |
| Firestore         | Application data           | Persistent tasks, context, and profiles           |
| Cloudflare Worker | Backend boundary           | Secrets, authorization, orchestration, and quotas |
| Cloudflare D1     | Quota persistence          | Reliable distributed daily limits                 |
| Groq              | AI inference               | Generates the planning draft                      |

This is the smallest practical split that keeps the demo public, authenticated,
persistent, and AI-powered while avoiding Firebase Blaze and avoiding a paid
provider fallback.

## Cost guardrails

- Firebase stays on Spark; no Firebase Functions are configured.
- Cloudflare stays on the free Worker/D1 usage limits.
- `FREE_PLAN_CONFIRMED=true` is required by the Worker configuration.
- The Worker enforces five attempts per user and fifteen attempts globally per
  UTC day.
- `GROQ_API_KEY` is a server-side secret and is never committed.
- No payment method or paid fallback is required for the portfolio demo.

See [zero-cost AI planning](zero-cost-ai-planning.md) for deployment details.
