---
name: github-ticket
description: "Interactively create a GitHub issue with the next sequential [PD-X] title prefix and a goal description. Use when the user asks to create a numbered PD ticket."
---

# GitHub Ticket

Create the issue in the GitHub repository associated with the current working
directory. Its title must be exactly `[PD-X] Ticket name`, where `X` is the
next unused sequence number and `Ticket name` is the user-provided name. Its
body must be:

```text
Goal:
<user-provided description>
```

Use this interactive flow before creating anything:

1. Ask the user for the ticket name. Do not ask them to include `[PD-X]`; add
   that prefix automatically when creating the title.
2. After the user provides the name, ask for the ticket description. Use the
   response as the text on the line after `Goal:` in the issue body.

While awaiting either response, treat the user's next message as that value,
even if it could also be interpreted as a new request. Switch tasks only if
the user explicitly cancels ticket creation.

If the user supplied a name or description in their initial request, still
collect any missing value in this order: name first, then description.

After both values are provided:

1. Require `GH_TOKEN` from the process environment or the repository `.env`
   file. If it is not already set, load only the repository `.env` value for
   `GH_TOKEN` before running GitHub CLI commands; do not print, log, persist, or
   include the token in issue content or command output. Run GitHub CLI commands
   with that environment variable available so `gh` authenticates through the
   token rather than its stored account session. Verify authentication with
   `gh auth status -h github.com`. If `GH_TOKEN` is missing or invalid, stop and
   report the blocker; do not fall back to `gh auth login` or a stored GitHub
   credential.
2. Determine the repository from the current directory with
   `gh repo view --json nameWithOwner`. Retrieve every open and closed issue as
   JSON, for example with `gh api --paginate --slurp
   'repos/OWNER/REPO/issues?state=all&per_page=100'`. Exclude records with a
   `pull_request` field, because that endpoint also returns pull requests.
3. Parse the issue-title JSON inside the agent using its code runtime. Require
   successful retrieval, valid JSON, complete pagination, and string titles.
   Match titles against `^\[PD-([1-9][0-9]*)\] `, parse the captured numbers
   as exact positive integers, and calculate `X = max(matches) + 1`. Use `1`
   only when the complete, valid issue list has no matching titles. GitHub
   issue numbers are unrelated to `X`. Do not use shell text pipelines or
   guess the number from partial or truncated tool output.
4. Immediately before creation, refresh the complete issue-title JSON and
   recalculate inside the agent. Verify that `X` is a positive integer and
   unused. If retrieval, parsing, completeness, or calculation cannot be
   verified, stop without creating anything and report the specific blocker.
   Never substitute `1` or a remembered number after an error.
5. Create the issue with the computed title and required `Goal:` body, using
   an explicit repository. Pass the body through a structured tool argument
   or a temporary UTF-8 file with `--body-file` to preserve literal text and
   newlines. Add labels, assignees, milestone, or project only when the user
   explicitly supplied them.
6. Report the created issue's title and URL.

Do not silently reuse a number, infer a sequence from unrelated issue titles,
or auto-retry a failed `gh issue create` command: first check whether GitHub
created the issue before attempting another creation. If the outcome remains
uncertain, stop and report it rather than risking a duplicate.

Never provide a manual issue-creation command as a fallback. Resolve failures
with available authorized tools, or report the blocker without claiming that
an issue was created.
