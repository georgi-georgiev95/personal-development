# Product roadmap

This roadmap reflects the current first-release state. The workflow and
acceptance rules are defined in the [first-release workflow
contract](docs/first-release-workflow.md).

1. ✅ Public deterministic demo of the task-to-handoff journey.
2. ✅ Private personal workspaces with saved tasks, pasted repository context,
   and manual implementation and validation evidence.
3. ✅ AI-assisted planning within the task workflow through the bounded
   zero-cost Worker release.
4. 🔄 Brief-first beta verification and release readiness. Automated regression,
   security, coverage, build, and performance checks pass; live acceptance and
   production deployment still require an explicitly authorized run.

Code execution, GitHub connection, CI-result ingestion, team invitations,
billing, and automated coding remain deferred beyond this release.

Release evidence is recorded in
[production verification](docs/production-verification.md). The former PD-44
tracking item is not an active ticket; the hosting decision, live release, and
real-flow verification are tracked by PD-46, PD-47, and PD-48.
