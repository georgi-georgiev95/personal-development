---
name: add-new-skill
description: 'Create a project-specific Codex skill under .agents/skills and register it in README.md. Use when the user asks to add, import, or scaffold a new custom agent skill for this repository.'
---

# Add New Skill

Create a reusable project skill and keep the repository skill catalog in sync.

## Inputs

Use the skill name and the supplied instructions as the source of truth. The
source may be inline content, a local file, or a URL. If the name or source is
missing, ask only for the missing value before editing files.

## Workflow

1. Normalize the requested name to lowercase letters, digits, and hyphens. Use
   the exact requested name when it already follows that format.
2. Read any supplied source completely. Preserve the user's intent, but adapt
   paths and repository-specific details to this project when needed.
3. Create `.agents/skills/<skill-name>/SKILL.md` with valid YAML frontmatter
   containing `name` and a concise, discriminating `description`.
4. Add optional `agents/openai.yaml` only when UI metadata or invocation policy
   is requested or clearly useful. Keep implicit invocation enabled unless the
   user explicitly asks for explicit-only invocation.
5. Update the `## Custom Agent Skills` table in `README.md` with one row for the
   new skill. Include its `$skill-name`, purpose, and when to use it. Do not
   duplicate an existing row.
6. Validate that the directory, `SKILL.md`, frontmatter, and README entry all
   exist. If the skill includes scripts, run the relevant checks.

## Safety and scope

- Do not overwrite an existing skill without explicit user approval.
- Do not modify unrelated skills or README sections.
- Do not add placeholder files or extra resources unless the skill needs them.
- Keep instructions focused on decisions that improve the skill's target work;
  avoid generic agent advice.

## Completion report

Report the created skill path, the README update, and any validation performed.
