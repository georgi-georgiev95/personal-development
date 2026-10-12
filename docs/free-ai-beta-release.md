# Free AI beta release

PD-45 makes the free planner backend available through a bounded, opt-in
release. The existing Hosting and Firestore deployment workflow remains
unchanged; this workflow deploys Firebase Functions only.

## Release gate

Before starting a release, run the repository gate in this order:

```bash
pnpm lint
pnpm typecheck
pnpm format
pnpm coverage
pnpm build
pnpm perf
pnpm test:emulators
```

The GitHub Actions workflow is named **Firebase Functions Release**. Start it
manually, set `confirm_production` to `true`, and approve the `production`
environment. The workflow checks the backend against the emulator, verifies
that the Firebase Secret Manager metadata for `GROQ_API_KEY` exists, and then
deploys only Functions.

This workflow is an execution path, not production authorization. A release
must be explicitly approved before it is started.

## Required configuration

- GitHub Actions needs `FIREBASE_TOKEN` as an environment secret.
- Firebase Secret Manager needs `GROQ_API_KEY`; the key is never committed,
  copied into GitHub logs, or sent to the browser.
- `AI_PLANNER_DISABLED=true` is the server-only emergency off switch.
- No paid provider fallback is configured.

## Live beta verification

Record the release commit, Firebase project, Functions revision, and UTC
timestamp with the verification result. Confirm all of the following before
inviting testers:

- the deployed model is the approved free-eligible model and the current free
  limits are still acceptable;
- a user can only read and write their own workspace data;
- the per-user and shared daily quotas reject the next attempt with a safe
  error;
- provider failure, timeout, quota exhaustion, and the off switch fail closed;
- the production UI can generate a draft, edit it, accept it, and reload the
  persisted result;
- no provider key, context contents, or paid fallback appears in client code,
  responses, or logs.

Do not invite beta testers until this evidence is recorded and the live checks
for the current revision pass.
