# Production verification

Verification for PD-48 was completed on 2026-10-12 before beta access.

## Release

- Application: [georgiev-development.web.app](https://georgiev-development.web.app)
- Planner: `personal-development-planner.g-georgiev9507.workers.dev`
- Active Worker revision after secret configuration:
  `1d154f34-2699-4f78-9d27-47855c50d1b5`
- Firebase project: `personal-development-c52b9`
- Quota database: `personal-development-usage`
- Provider: Groq `qwen/qwen3.8-27b`

## Authenticated UI flow

Using a signed-in production session and the private workspace:

1. Created `AI planner smoke test`.
2. Completed Discovery.
3. Generated a real AI draft through the Worker.
4. Edited the generated objective.
5. Accepted the plan.
6. Reloaded the task and confirmed the accepted plan persisted as Revision 1.

The returned draft contained an objective, ordered steps, acceptance criteria,
and risks. The test task remains in the signed-in workspace for inspection.

## Automated verification

`node --test prototypes/zero-cost-planning/checks.test.mjs` passes all checks,
covering:

- Firebase token validation and rejection of forged, expired, and wrong-project
  tokens;
- workspace ownership and task scoping;
- five requests per user and fifteen shared requests per UTC day;
- provider invalid-response and provider-failure handling;
- provider timeout mapping to a controlled deadline error;
- the `FREE_PLAN_CONFIRMED` off switch;
- CORS preflight and allowed-origin responses;
- request-size validation and response-shape validation.

The live anonymous endpoint checks also returned `401` for `POST /plan` and
`204` for the allowed CORS preflight, confirming the route is reachable and
protected rather than missing with `404`.

No paid fallback is configured and no secret is included in the frontend build.
