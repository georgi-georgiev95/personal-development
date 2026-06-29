# Harness Manifest

> **Auto-generated index** of harness files for AI tools. Last updated: 2026-06-29

## Load Priority Map

AI assistants should load files in this order based on task requirements:

```
┌─────────────────────────────────────────────────────────┐
│                    LOAD PRIORITY                        │
├─────────────────────────────────────────────────────────┤
│ P0 (ALWAYS)        │ GUARDRAILS.md      │ ~300 tokens  │
│ P1 (ALWAYS)        │ CONTEXT.md         │ ~500 tokens  │
│ P2 (ALWAYS)        │ [User request]     │ varies       │
│ P3 (ALWAYS)        │ MEMORY.md          │ ~1,500 tkn   │
│ P4 (ON DEMAND)     │ SKILLS.md          │ ~800 tokens  │
│ P5 (ON DEMAND)     │ TOOLS.md           │ ~600 tokens  │
│ P6 (AS NEEDED)     │ Source files       │ varies       │
│ P7 (SLIDING)       │ Conversation hist. │ varies       │
└─────────────────────────────────────────────────────────┘
```

## File Descriptions

### Core Files (Load Every Session)

| File              | Purpose                                       | When to Load             |
| ----------------- | --------------------------------------------- | ------------------------ |
| **GUARDRAILS.md** | Agent identity, permissions, constraints      | Always first             |
| **CONTEXT.md**    | Context assembly rules, token budgeting       | Always second            |
| **MEMORY.md**     | Project conventions, architecture, tech stack | Always (session startup) |

### On-Demand Files (Load When Relevant)

| File              | Purpose                            | When to Load                             |
| ----------------- | ---------------------------------- | ---------------------------------------- |
| **SKILLS.md**     | Scaffolding patterns, setup guides | Creating features, components, 3D scenes |
| **TOOLS.md**      | Build tools, testing, deployment   | Running builds, tests, installs          |
| **QUICKSTART.md** | Human guide, examples              | When user asks "how to use harness"      |

### Session Files (Optional)

| Directory | Purpose            | When to Load                             |
| --------- | ------------------ | ---------------------------------------- |
| **logs/** | Daily session logs | Resume previous session, context refresh |

## Quick Context Recipes

### Recipe: Simple Edit (~3K tokens)

```
✅ GUARDRAILS.md
✅ CONTEXT.md
✅ MEMORY.md
✅ Target source file(s)
❌ Skip SKILLS.md, TOOLS.md
```

### Recipe: New Feature (~6K tokens)

```
✅ GUARDRAILS.md
✅ CONTEXT.md
✅ MEMORY.md
✅ SKILLS.md (Feature Module Creation, Responsive Layout)
✅ Related source files (routes, similar features)
❌ Skip TOOLS.md unless build changes needed
```

### Recipe: Build/Test Task (~5K tokens)

```
✅ GUARDRAILS.md
✅ CONTEXT.md
✅ MEMORY.md
✅ TOOLS.md (Package Management, Testing)
✅ Config files (package.json, vite.config.ts if relevant)
❌ Skip SKILLS.md (not code creation)
```

### Recipe: 3D Experiment (~5K tokens)

```
✅ GUARDRAILS.md
✅ CONTEXT.md
✅ MEMORY.md
✅ SKILLS.md (Three.js Scene Setup, Debug Tools)
✅ HomePage.tsx or relevant scene file
❌ Skip TOOLS.md
```

## Token Estimates

| File              | Approx Tokens | Compress After                      |
| ----------------- | ------------- | ----------------------------------- |
| GUARDRAILS.md     | 300           | Never (P0)                          |
| CONTEXT.md        | 500           | Never (P1)                          |
| MEMORY.md         | 1,500         | Never (P3)                          |
| SKILLS.md         | 800           | If not needed                       |
| TOOLS.md          | 600           | If not needed                       |
| QUICKSTART.md     | 700           | Only load if user asks              |
| README.md         | 400           | Only load if user asks              |
| **Total Harness** | ~4,800        | Selective loading reduces to ~2,300 |

## Validation Checklist

Before starting a task, AI should verify:

- [ ] GUARDRAILS.md loaded (identity confirmed)
- [ ] CONTEXT.md loaded (assembly rules known)
- [ ] MEMORY.md loaded (conventions understood)
- [ ] Task-specific files loaded (SKILLS/TOOLS if needed)
- [ ] Source files relevant to task loaded
- [ ] Total tokens < 70% of model's context window
- [ ] Conversation history compressed if session is long

## File Relationships

```
README.md ─────┬──> Overview, philosophy
               │
GUARDRAILS.md ─┼──> Identity, constraints (P0)
               │
CONTEXT.md ────┼──> Load rules, budgeting (P1)
               │
MEMORY.md ─────┼──> Project facts (P3)
               │
SKILLS.md ─────┼──> How-to patterns (P4)
               │
TOOLS.md ──────┼──> Build/test workflows (P5)
               │
QUICKSTART.md ─┴──> Human guide, examples

logs/ ──────────> Session-specific state (optional)
```

## AI Tool Integration Paths

### GitHub Copilot

Reads: `.github/copilot-instructions.md` → references `harness/`  
Auto-loads: GUARDRAILS, CONTEXT, MEMORY via Copilot instructions

### Cursor

Manual setup: Add `harness/**/*.md` to workspace context  
Loads: Based on user's @-mentions or auto-context

### Claude Desktop

Manual load: User provides file paths at session start  
Loads: Files explicitly mentioned by user

### Custom Agents

Programmatic: Read harness manifest, load P0-P3 at startup  
Loads: Via file system tools or API

---

**Version**: 1.0.0  
**Last Updated**: 2026-06-29  
**Spec**: [Harness Engineering Guide](https://harness-guide.com/)
