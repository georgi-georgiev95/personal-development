---
name: start-ticket
description: "Fetch a PD ticket from GitHub, sync develop, and create the correctly typed feature or bugfix branch. Use when starting work on a ticket such as PD-12."
---

# Start Ticket

Start implementation work for an existing GitHub ticket supplied as `$start-ticket PD-N`.

## Workflow

1. Validate the argument against `^PD-[1-9][0-9]*$`, case-insensitively. Normalize
   it to uppercase (`PD-N`) for GitHub lookup and lowercase (`pd-n`) in the
   branch name. If the argument is missing or invalid, stop and ask for a
   ticket ID.
2. Determine the repository with `gh repo view --json nameWithOwner` and search
   all open and closed issues for the exact title prefix `[PD-N]` (for example,
   with `gh api --paginate --slurp
   'repos/OWNER/REPO/issues?state=all&per_page=100'`). Filter out records with
   a `pull_request` field, then match titles exactly against
   `^\[PD-N\](?:\s|$)` and require exactly one match. Use that issue's
   GitHub number to fetch its complete `number,title,url,labels,state` data.
   The numeric suffix in `PD-N` is a project-ticket sequence and may differ
   from GitHub's issue number. Stop if the ticket does not exist, is not open,
   or the response is not valid and complete.
3. Read the ticket title, URL, and labels. Require exactly one of these
   workflow labels:

   - `enhancement` → `feature/`
   - `bug` → `bugfix/`

   Match labels case-insensitively. If neither label is present, both are
   present, or a different label is intended, stop and report the ambiguity;
   do not create a branch.
4. Build a short, lowercase slug from the ticket title: remove a leading
   `[PD-N]` prefix, convert runs of non-alphanumeric characters to `-`, trim
   leading/trailing hyphens, and cap it at a practical branch-name length. The
   branch must be `<type>/pd-n-<slug>`, for example
   `feature/pd-12-add-dark-mode` or `bugfix/pd-13-fix-login-loop`. If the title
   produces no slug, use `<type>/pd-n-ticket`.
5. Before changing branches, verify the working tree is clean with
   `git status --porcelain`. Stop and report the files if it is dirty.
6. Verify the target branch does not already exist locally or on `origin`.
   Stop instead of overwriting or silently reusing an existing branch.
7. Verify the repository has the `git ch` checkout alias required by this
   workflow. Then run these commands in order:

   ```bash
   git ch develop
   git pull
   git ch -b <type>/pd-n-<slug>
   ```

   Do not replace `git pull` with a rebase or force operation. If any command
   fails, stop and report the command and error without claiming the branch was
   created.
8. Report the ticket title and URL, selected workflow label, and created branch.

Do not commit, push, or open a pull request as part of this skill. Do not
silently infer a branch type when labels are missing or conflicting.
