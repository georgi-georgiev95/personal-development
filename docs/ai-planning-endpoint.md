# AI planning endpoint

The isolated [PD-36 zero-cost feasibility spike](zero-cost-ai-planning.md)
evaluates zero-cost providers. Its accepted candidate is still pending owner
approval and does not replace or enable this callable.

PD-33 adds the `generatePlan` Firebase callable in `europe-west1`. It accepts a task ID, selected context-entry IDs, and the context revision. The function verifies Firebase Authentication, checks the workspace owner and task with the Admin SDK, then reads only the selected context entries. The response is an unaccepted draft containing an objective, 2–8 steps, 1–8 acceptance criteria, up to 5 risks, and the server-verified context revision.

The provider is Groq's free-eligible `qwen/qwen3.8-27b`, called from the function with strict JSON Schema output. The key is a Firebase Secret Manager secret named `GROQ_API_KEY`; it is never sent to the browser or written to logs. Configure it with `firebase functions:secrets:set GROQ_API_KEY` when preparing a separately reviewed backend release. No paid fallback is configured.

The provider's free limits and availability are account-level and can change. The fixed model, 400-token output cap, 20-second timeout, and PD-42 quota gate bound usage; check Groq's current limits before enabling the provider for users.

Requests are limited to 8 KiB, 5 selected context entries, and 12,000 aggregate context characters. Provider output is limited to 400 tokens and a 20-second timeout; the callable has a 30-second timeout. Each user can attempt 5 generations per UTC day, with a shared server-side cap of 15 attempts per UTC day. Attempts count even if the provider fails, and the counters reset on the next UTC day. Operators can fail closed by setting the server-only `AI_PLANNER_DISABLED=true` flag; this prevents provider calls without changing the user's work. The generated draft is validated again by the server before returning it. Provider details and task/context contents are not logged.

Project context is untrusted input. The model receives no tools, and the endpoint cannot execute code, perform external actions, or accept instructions from context that override its planning task. The endpoint only returns a draft; later acceptance remains a separate user action.

## Local verification

The emulator-only provider returns a deterministic draft and is enabled only when both `FUNCTIONS_EMULATOR=true` and `AI_PLANNER_MOCK_PROVIDER=true` are set. It never calls Groq. Run the callable and rules integration tests with:

```bash
pnpm test:emulators
```

To run the Auth, Firestore, and Functions emulators for local app work:

```bash
pnpm emulators:start:backend
```

The regular Hosting deployment workflow does not deploy Functions. A backend release and provider secret require a separate review and explicit deployment step.
