# Project Harness

> **Universal AI Agent Context** — Tool-agnostic harness for Cursor, Copilot, Claude, and other AI coding assistants.

## What is This?

This harness provides structured context that turns any AI coding assistant into an effective agent for this codebase. It follows the [Harness Engineering Guide](https://harness-guide.com/) principles for context engineering, memory management, and agent orchestration.

## Philosophy

The harness is **tool-agnostic**. Whether you're using GitHub Copilot, Cursor, Claude Desktop, or any other AI assistant, these files provide:

1. **Persistent Memory** — What the agent should remember across sessions
2. **Context Priority** — What information matters most
3. **Skills & Capabilities** — What the agent can do in this project
4. **Guardrails** — What the agent should and shouldn't do

## File Structure

```
harness/
├── README.md           # This file — harness overview
├── MEMORY.md           # Persistent cross-session memory
├── CONTEXT.md          # Context assembly and priority rules
├── SKILLS.md           # Available skills and capabilities
├── TOOLS.md            # Tool usage patterns
├── GUARDRAILS.md       # Safety constraints and permissions
└── logs/               # Session logs (optional, per-session state)
```

## How AI Tools Should Use This

### Priority-Based Context Loading

Not all files are equal. Load in this order:

| Priority    | File                      | Tokens | When to Load                    |
| ----------- | ------------------------- | ------ | ------------------------------- |
| 0 (highest) | GUARDRAILS.md             | ~300   | Always (identity & constraints) |
| 1           | CONTEXT.md                | ~500   | Always (assembly rules)         |
| 2           | Current task/user request | varies | Always                          |
| 3           | MEMORY.md                 | ~1,500 | Always (project knowledge)      |
| 4           | SKILLS.md                 | ~800   | On demand (when relevant)       |
| 5           | TOOLS.md                  | ~600   | On demand (when needed)         |
| 6           | Source files              | varies | As needed for task              |

### Context Budget

- **Small task** (bug fix, single file): GUARDRAILS + CONTEXT + MEMORY (~2,300 tokens)
- **Medium task** (feature, multi-file): Add SKILLS + relevant source (~5,000 tokens)
- **Large task** (refactor, architecture): Full harness + all relevant sources (~10,000+ tokens)

## For Human Developers

If you're configuring an AI tool:

1. **Cursor**: Add `harness/**` to your workspace context settings
2. **Copilot**: Reference harness files in `.github/copilot-instructions.md`
3. **Claude Desktop**: Include harness directory in your project context
4. **Custom agents**: Load harness files at session startup

## Maintenance

- Update `MEMORY.md` when project structure or conventions change
- Add new skills to `SKILLS.md` as capabilities evolve
- Document new tools in `TOOLS.md`
- Review `GUARDRAILS.md` before production releases

---

**Last Updated**: 2026-06-29  
**Harness Version**: 1.0.0
