# First-release workflow contract

**Status: Implemented baseline.** This contract records the first-release
scope and vocabulary used by implementation tickets.

## User and outcome

The first user is a solo developer working in a personal workspace. The main
experience turns an outcome into an editable implementation brief that can be
copied, saved, and reopened. The product helps plan and record that work; it
does not perform implementation or run checks.

## Terms

- **Workspace:** a user's personal space for repository context and tasks.
- **Task:** one outcome, with its intent, scope, plan, progress, evidence, and
  handoff.
- **Stage:** an optional task-detail checkpoint retained for delivery history;
  the brief-first path does not require stage completion.
- **Artifact:** task material that can be reviewed, such as intent, plan,
  implementation notes, validation evidence, or handoff summary.
- **Validation result:** a manually recorded check outcome and its evidence
  source; it is not a result produced by this product.
- **Approval:** the workspace owner's recorded decision about the current task
  revision; the owner can record feedback received elsewhere.
- **Revision:** a meaningful change to task intent, scope, plan, implementation
  notes, artifacts, pasted repository context used by the task, required
  checks, or their evidence/results.

## Stages and evidence

Saved task details retain the sequence **Discovery → Planning → Implementation
→ Validation → Review → Handoff** for users who need a delivery record. A
stage advances when its work is recorded; stages do not imply that the product
performed that work. An In progress task can return to the earliest affected
stage; reopening applies to a task already Handed off. None of these checkpoints
is required to generate, edit, copy, save, or reopen a brief.

Implementation is tracking only. The user records work performed elsewhere.
Repository context is pasted by the user. Validation evidence is explicitly
identified as one of:

- **Manual:** entered by the user, including a check they ran elsewhere.
- **CI:** copied or entered by the user from an external CI run; there is no CI
  connection or ingestion.
- **Demo:** simulated example data used only in the public demo.

Demo evidence never represents actual implementation, execution, or test
results and cannot approve a saved task. The product does not execute code in
this release.

## State and editing rules

- A task is **In progress** or **Handed off** and has one current stage. It
  remains In progress until the user records a handoff.
- A check is **Not run**, **Passed**, or **Failed**. Not run has no result or
  evidence; Passed and Failed include an evidence source and optional note/link.
  Required checks need recorded passing evidence before review submission,
  approval, or handoff. Optional checks do not block handoff. A task with no
  required checks must say so explicitly.
- Review is **Not submitted**, **Pending**, **Approved**, **Changes requested**,
  or **Stale**. The owner submits the current revision, then records approval
  or changes requested with a note. Changes requested return to the earliest
  affected stage. No separate reviewer account or role is required.
- Task and review states change through stage, submit, review, handoff, and
  reopen actions; users do not directly edit state labels.
- Handoff requires approval of the current revision, including its handoff
  summary, and passing evidence for every required check. Mark the task handed
  off explicitly.
- Users can edit task intent, scope, plan, implementation notes, artifacts,
  required checks, check results/evidence, review notes, and handoff summary;
  they advance the current stage one step at a time. Workspace name and pasted
  repository context are also editable.
- Changing task intent, scope, plan, implementation notes, artifacts, pasted
  repository context used by the task, required checks, or check results/evidence
  creates a new revision. A change to a **Pending** revision withdraws review
  to **Not submitted**; a change to an **Approved** revision makes approval
  **Stale**. The task returns to In progress at the earliest affected stage.
  When changed work affects a check, its current result becomes Not run; old
  evidence remains historical. A workspace rename alone does not create a task
  revision.
- Reopening a Handed off task returns it to In progress and marks approval
  Stale. Resume at Review if no reviewed content changes, or at the earliest
  affected stage if it does. A new handoff always needs another approval.

## Journeys

**Brief-first:** describe the outcome and optional context, generate and edit a
plan, copy it for repository work, save it privately, and reopen it later. This
path has no mandatory implementation, validation, review, or handoff forms.

**Delivery detail:** when a user wants a full record, they can continue with
the optional stages and evidence below. Each transition reflects user-recorded
work only.

**Missing or failed check:** keep the task in Validation or return it there
from Review; record the check as Not run or Failed. Add or rerun evidence
outside this product, record a passing result, then submit the updated revision.
Neither missing nor failed required checks can be treated as a pass.

**Changes requested, reopen, or stale approval:** record the review note
and resume at the earliest affected stage. If approved work changes later,
mark the approval Stale and repeat affected validation and review before
handoff. Reopening a handed-off task leaves its old handoff historical and
requires a new approval; affected checks are rerun if the work changes.

## First-release boundary

The first release supports a public simulated demo, personal workspaces, pasted
repository context, a brief-first planning path, optional manually recorded
delivery evidence, and AI-assisted planning through the bounded zero-cost
Worker. It does not execute code, connect to GitHub, ingest CI results, provide
team roles or invitations, or bill users. Theme preference is local to the
browser and does not alter workspace data. See the [beta verification
checklist](beta-verification.md) and [production verification
record](production-verification.md) for release status and checks.
