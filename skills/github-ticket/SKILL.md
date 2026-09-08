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

If the user supplied a name or description in their initial request, still
collect any missing value in this order: name first, then description.

After both values are provided:

1. Check authentication with `gh auth status`. If it fails, stop and tell the
   user to run `gh auth login -h github.com`; do not try to create an issue.
2. Determine the repository from the current directory with `gh repo view`.
   List its open and closed issues, inspect titles matching
   `^\[PD-([1-9][0-9]*)\] `, and set `X` to one higher than the largest match.
   If none match, use `1`. GitHub issue numbers are unrelated to `X`.
3. Immediately before creation, refresh that list to reduce the chance of a
   concurrent duplicate. Create the issue with the computed title and the
   required `Goal:` body. Add labels, assignees, milestone, or project only
   when the user explicitly supplied them.
4. Report the created issue's title and URL.

Do not silently reuse a number, infer a sequence from unrelated issue titles,
or auto-retry a failed `gh issue create` command: first check whether GitHub
created the issue before attempting another creation.
