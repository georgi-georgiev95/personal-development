---
name: resolving-merge-conflicts
description: 'Resolve Git merge or rebase conflicts by tracing commit history and original intent, then verify the resulting branch.'
---

# Resolving Merge Conflicts

Use this skill when a merge or rebase has conflicts, or when the user asks to
resolve a branch against another branch. Treat the repository history and the
ticket, pull request, or other source of the requested behavior as the primary
sources of truth.

## Workflow

1. Establish the operation and scope before editing. Inspect the current
   branch, `git status --short`, and whether the repository is in a merge,
   rebase, or cherry-pick state. Identify the target branch and preserve any
   unrelated user changes; stop if the operation or ownership of changes is
   unclear.
2. Reconstruct intent from primary sources. Inspect the relevant commits with
   `git log --graph --decorate --oneline`, `git show`, and the merge base. Read
   the linked GitHub issue or pull request when one exists. Prefer the explicit
   ticket/PR requirements and the newer intentional change over assumptions
   based only on the conflict marker layout.
3. Inventory every conflict. Use `git diff --name-only --diff-filter=U`,
   `git diff --cc`, and the three index stages (`git show :1:<path>`, `:2:`,
   `:3:`) to compare the common ancestor, current side, and incoming side.
   Resolve each file deliberately, retaining compatible changes from both
   sides and documenting an intentional removal in the handoff.
4. Edit only the conflicted files needed for the requested result. Remove all
   conflict markers, preserve project conventions, and avoid unrelated cleanup.
   Do not use `git checkout --ours` or `--theirs` for a whole file unless the
   history and requirements show that one side is wholly correct.
5. Verify the resolution before completing the Git operation:
   - `git diff --check` reports no whitespace errors;
   - `git diff --name-only --diff-filter=U` is empty and no conflict markers
     remain in the affected files;
   - the relevant project checks or tests pass;
   - the final diff matches the reconstructed intent and contains no unrelated
     changes.
6. Stage resolved files and complete the in-progress merge, rebase, or
   cherry-pick only when that operation was requested or already underway.
   Never force-push, reset, discard user changes, or create an unrelated commit.
   If completion requires a commit and the user did not authorize one, stop
   after verification and report the exact command still needed.
7. Report the source branches/commits examined, files resolved, intent behind
   non-obvious choices, checks run, and the resulting branch state. Clearly
   call out any unresolved conflict or check that could not run.

## Guardrails

- Never choose a side solely because it is labelled “ours” or “theirs”.
- Do not silently resolve conflicts in generated files; regenerate them using
  the project’s documented command when appropriate.
- Do not claim success while unmerged paths, conflict markers, or failed checks
  remain.
- Keep the operation local unless the user explicitly asks to push or open a
  pull request.
