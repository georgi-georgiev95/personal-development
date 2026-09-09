---
name: pr-to-main
description: 'Safely create a pull request from the current Git branch to main after running the repository’s complete pre-PR validation gate.'
---

# PR to Main

Use this skill when the user asks to open a pull request for the current branch
against `main` in the repository’s GitHub remote.

## Workflow

1. Inspect the current branch, upstream, working tree, and commits relative to
   `main`. Stop if the current branch is `main`, detached, or contains changes
   that are not ready to include. Never commit or discard user changes as part
   of this workflow.
2. Confirm the GitHub repository and that the current branch is pushed or can
   be pushed to `origin`. Fetch `origin/main` when needed for an accurate
   comparison; do not rewrite history.
3. Review the branch diff and derive a concise PR title and summary from the
   actual changes. If the title or intent cannot be determined safely, ask the
   user before creating the PR.
4. Run the mandatory checks in this exact order, stopping on the first failure:

   ```bash
   pnpm lint
   pnpm typecheck
   pnpm format
   pnpm coverage
   pnpm build
   pnpm perf
   ```

   Confirm every command exits successfully. If a check fails, fix it only
   when that work is within the user’s request, then rerun the complete
   sequence from the beginning. Never increase a performance budget to make
   `pnpm perf` pass without explicit user approval.
5. Push the current branch to `origin` with its upstream configured if needed.
   Do not force-push.
6. Create one PR with `gh pr create --base main --head <current-branch>` and a
   body that briefly states the summary and validation results. Do not add
   labels, reviewers, assignees, milestones, or projects unless requested.
7. Report the PR URL, source and target branches, the final check results, and
   any relevant limitation. Do not claim success if creation or a check was
   ambiguous.

## Guardrails

- Creating a PR is an external GitHub mutation; perform it only when the user
  explicitly requests this skill.
- Do not create commits, amend commits, merge branches, delete branches, or
  change repository settings.
- Do not create a duplicate PR if `gh pr create` fails ambiguously; inspect
  existing PRs for the current branch first.
- Keep the PR focused on the current branch’s changes and preserve unrelated
  work in the working tree.
