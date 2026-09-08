# Quick Start Guide

> 5-minute guide to using the harness with your AI coding assistant.

## For AI Assistants: Load Order

1. **Always load first** (Priority 0-1):
   - `harness/GUARDRAILS.md` — Who you are, what you can/can't do
   - `harness/CONTEXT.md` — How to assemble context

2. **Load second** (Priority 3):
   - `harness/MEMORY.md` — Project knowledge and conventions

3. **Load on demand**:
   - `harness/SKILLS.md` — When scaffolding or complex setup needed
   - `harness/TOOLS.md` — When running builds, tests, or tooling tasks

4. **Load as needed**:
   - Source files relevant to the task

## For Humans: Setup

### Codex

Already configured. Codex automatically discovers the repository-root
`AGENTS.md`. That file instructs Codex to load the core harness files and to
load `SKILLS.md` or `TOOLS.md` only when the task requires them.

### GitHub Copilot (VS Code)

Already configured! Copilot reads `.github/copilot-instructions.md`, which references this harness.

### Cursor

1. Open Cursor Settings
2. Go to "Cursor Rules" or "Workspace Context"
3. Add: `harness/**/*.md`
4. Save and restart Cursor

### Claude Desktop

When starting a task, tell Claude:

```
Please load the project harness:
- harness/GUARDRAILS.md
- harness/CONTEXT.md
- harness/MEMORY.md

Then help me with [your task].
```

### Other AI Tools

Point your tool to load these files at session start:

- `harness/GUARDRAILS.md`
- `harness/CONTEXT.md`
- `harness/MEMORY.md`

---

## Usage Examples

### Example 1: Simple Bug Fix

**Human**: "Fix the responsive layout bug in Navigation component"

**AI loads**:

- GUARDRAILS (identity)
- CONTEXT (assembly rules)
- MEMORY (project conventions)
- `src/shared/components/Navigation/Navigation.tsx`
- `src/shared/components/Navigation/Navigation.styles.ts`

**Token cost**: ~3,000 tokens

---

### Example 2: Create New Feature

**Human**: "Create a Gallery feature with a page, routing, and responsive grid"

**AI loads**:

- GUARDRAILS
- CONTEXT
- MEMORY
- SKILLS (Feature Module Creation, Responsive Layout)
- `src/app/routes.tsx` (to add route)

**Token cost**: ~6,000 tokens

---

### Example 3: Add 3D Experiment

**Human**: "Add a particle system experiment with Leva controls"

**AI loads**:

- GUARDRAILS
- CONTEXT
- MEMORY
- SKILLS (Three.js Scene Setup, Debug Tools Integration)
- `src/features/home/pages/HomePage.tsx`

**Token cost**: ~5,000 tokens

---

## Token Budget Awareness

| Context Window     | Harness Files | Source Code Budget |
| ------------------ | ------------- | ------------------ |
| 128K               | ~3,700 tokens | ~120K tokens       |
| 32K (older models) | ~3,700 tokens | ~25K tokens        |

**Rule of thumb**: If your task needs >50K tokens of source code, break it into smaller tasks.

---

## Updating the Harness

### When to Update MEMORY.md

- Project structure changes (new directories, major refactors)
- New conventions adopted (new patterns, new tools)
- Architectural decisions made
- Dependencies added/removed that change workflows

### When to Update SKILLS.md

- New scaffolding patterns emerge
- New frameworks/libraries integrated
- Common patterns identified from repeated tasks

### When to Update GUARDRAILS.md

- Permission model changes
- Security requirements added
- New constraints identified

### When to Update TOOLS.md

- Build system changes
- New dev tools added (Storybook, Playwright, etc.)
- Scripts added to package.json

---

## Troubleshooting

### "AI ignoring project conventions"

→ Ensure GUARDRAILS.md and MEMORY.md are loaded  
→ Check that your AI tool reads the harness files  
→ Explicitly mention the harness: "Follow the project harness rules"

### "AI loading too much context"

→ AI should follow CONTEXT.md priority system  
→ Small tasks don't need SKILLS.md or TOOLS.md  
→ Tell AI: "Keep context minimal, only load what's needed"

### "AI hallucinating file paths"

→ Not enough context loaded  
→ Load actual source files, don't rely on memory alone  
→ Use semantic search to find files before editing

### "Context budget exceeded"

→ Task is too large — break into smaller chunks  
→ Compress conversation history (AI should do this automatically)  
→ Remove SKILLS/TOOLS if not needed for current task

---

## Best Practices

### For Humans

1. **Be specific** — "Add a Button to the login form" > "Fix the login page"
2. **Reference files** — "Edit Navigation.tsx" > "Fix the navigation"
3. **One task at a time** — Don't ask for 5 unrelated changes at once
4. **Review changes** — AI makes mistakes, always check the diff

### For AI Assistants

1. **Load selectively** — Don't load SKILLS.md for a typo fix
2. **Ask for clarification** — If task is ambiguous, ask before coding
3. **Checkpoint progress** — For multi-step tasks, summarize after each step
4. **Respect conventions** — MEMORY.md and GUARDRAILS.md are law

---

## Contributing to the Harness

If you find yourself repeating instructions to the AI, add them to the harness:

- **Conventions** → MEMORY.md
- **How-to patterns** → SKILLS.md
- **Tool commands** → TOOLS.md
- **Rules/constraints** → GUARDRAILS.md

**Keep it concise** — harness files are loaded into context, so brevity matters.

---

**Need Help?**

- Read the full [Harness Engineering Guide](https://harness-guide.com/)
- Check [harness/CONTEXT.md](CONTEXT.md) for context assembly rules
- Review [harness/README.md](README.md) for overview

**Last Updated**: 2026-09-08
