# AI planning endpoint

The isolated [PD-36 zero-cost feasibility spike](zero-cost-ai-planning.md)
evaluates zero-cost providers. Its accepted candidate is still pending owner
approval and does not replace or enable this callable.

PD-33 adds the `generatePlan` Firebase callable in `europe-west1`. It accepts a task ID, selected context-entry IDs, and the context revision. The function verifies Firebase Authentication, checks the workspace owner and task with the Admin SDK, then reads only the selected context entries. The response is an unaccepted draft containing an objective, 2–8 steps, 1–8 acceptance criteria, up to 5 risks, and the server-verified context revision.

The provider is OpenAI `gpt-4.1-mini`, called from the function with [strict Structured Outputs](https://developers.openai.com/api/docs/guides/structured-outputs). The key is a Firebase Secret Manager secret named `OPENAI_API_KEY`; it is never sent to the browser or written to logs. Configure it with `firebase functions:secrets:set OPENAI_API_KEY` when preparing a separately reviewed backend release. No cloud function or secret is provisioned by this change.

At the time of implementation, the model page lists API pricing of $0.40 per million input tokens and $1.60 per million output tokens. Actual cost depends on selected context and generated response size; the per-user daily limit and provider token cap bound individual usage. Check the [current model pricing](https://developers.openai.com/api/docs/models/gpt-4.1-mini) before enabling the provider for users.

Requests are limited to 8 KiB, 5 selected context entries, and 12,000 aggregate context characters. Provider output is limited to 1,200 completion tokens and a 20-second timeout; the callable has a 30-second timeout. Each user can attempt 5 generations per UTC day. Attempts count even if the provider fails, and the counter resets on the next UTC day. The generated draft is validated again by the server before returning it. Provider details and task/context contents are not logged.

Project context is untrusted input. The model receives no tools, and the endpoint cannot execute code, perform external actions, or accept instructions from context that override its planning task. The endpoint only returns a draft; later acceptance remains a separate user action.

## Local verification

The emulator-only provider returns a deterministic draft and is enabled only when both `FUNCTIONS_EMULATOR=true` and `AI_PLANNER_MOCK_PROVIDER=true` are set. It never calls OpenAI. Run the callable and rules integration tests with:

```bash
pnpm test:emulators
```

To run the Auth, Firestore, and Functions emulators for local app work:

```bash
pnpm emulators:start:backend
```

The regular Hosting deployment workflow does not deploy Functions. A backend release and provider secret require a separate review and explicit deployment step.
