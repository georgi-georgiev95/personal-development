# Context Engineering Rules

> How AI agents should assemble and manage context for this project. Based on [Context Engineering](https://harness-guide.com/guide/context-engineering/) principles.

## Context Assembly Priority

When loading context for a task, follow this priority order. Lower numbers = higher priority.

### Priority 0: Identity & Constraints (ALWAYS LOAD)

- `harness/GUARDRAILS.md` (~300 tokens)
- Defines who the agent is and what it must/must not do

### Priority 1: Assembly Rules (ALWAYS LOAD)

- This file (`harness/CONTEXT.md`) (~500 tokens)
- Defines how to build context for subsequent operations

### Priority 2: Current Task (ALWAYS LOAD)

- User's current request
- Any pinned goals or multi-turn objectives
- Estimated: 200-1,000 tokens

### Priority 3: Project Memory (ALWAYS LOAD)

- `harness/MEMORY.md` (~1,500 tokens)
- Core project knowledge, conventions, architecture
- This is the project's "long-term memory"

### Priority 4: Active Skills (LOAD ON DEMAND)

- `harness/SKILLS.md` (~800 tokens)
- Only load when task requires capabilities beyond basic coding
- Examples: scaffolding, 3D setup, Firebase integration

### Priority 5: Tool Patterns (LOAD ON DEMAND)

- `harness/TOOLS.md` (~600 tokens)
- Load when task involves build tools, testing, or deployment
- Not needed for simple code edits

### Priority 6: Source Files (AS NEEDED)

- Relevant source code files
- Variable tokens (100-10,000+ depending on task)
- **Be selective** — don't load entire codebase

### Priority 7: Conversation History (SLIDING WINDOW)

- Recent turns of the current session
- Keep last 10-20 turns verbatim
- Compress older history into summaries

## Context Budget Guidelines

Different tasks need different amounts of context. Estimate token usage and load accordingly.

### Small Tasks (< 5K tokens total)

**Examples**: Bug fixes, single file edits, simple questions

**Load**:

- Priority 0-3 only (~2,300 tokens)
- Relevant source file(s) (~1,000-2,000 tokens)

**Skip**:

- SKILLS.md, TOOLS.md (not needed for simple edits)

### Medium Tasks (5K - 15K tokens)

**Examples**: Multi-file features, refactoring, component creation

**Load**:

- Priority 0-5 (~3,700 tokens)
- Multiple related source files (~5,000-10,000 tokens)
- Relevant tests and styles

**Skip**:

- Unrelated features
- Old conversation history (compress if needed)

### Large Tasks (15K+ tokens)

**Examples**: Architecture changes, new feature modules, complex debugging

**Load**:

- Full harness (Priority 0-6)
- All relevant source files
- Related documentation (README, CODING_GUIDELINES)
- Dependency manifests if relevant (package.json, tsconfig.json)

**Strategy**:

- Aggressively compress conversation history
- Use multi-turn planning: load overview first, drill into specifics second

## File Injection Patterns

### Session Startup Injection

Load at the beginning of every session:

```
1. GUARDRAILS.md
2. CONTEXT.md
3. MEMORY.md
```

### On-Demand Injection

Load only when task requires:

```
- SKILLS.md → When scaffolding, creating new modules
- TOOLS.md → When running builds, tests, deployments
- package.json → When adding dependencies
- tsconfig.json → When TypeScript config issues arise
```

### Source File Injection Strategy

**Don't guess** — ask the user which files to include, or use semantic search to find relevant files.

**When to load a file**:

- ✅ Directly referenced in task
- ✅ Semantically related (e.g., editing Login → load AuthContext)
- ✅ Debugging errors (load file showing the error)

**When NOT to load**:

- ❌ "Might be related" speculation
- ❌ Entire feature directories without specific need
- ❌ Generated files (coverage, build output)

## Context Compression Strategies

### Sliding Window (Recommended)

Keep last 15-20 conversation turns verbatim. Older turns get summarized.

```
[GUARDRAILS + CONTEXT + MEMORY]  ← Always present
[Summary of turns 1-30]           ← Compressed
[Turns 31-50 verbatim]            ← Recent history
[Current turn]                    ← User request
```

### Threshold Compression

When total context exceeds 70% of model's window, compress oldest messages.

### Active Summarization

For extremely long sessions (50+ turns), periodically create checkpoint summaries:

```
Summarize: decisions made, files modified, tests run, current plan.
Store in session log.
Clear old conversation history.
```

## Token Budgeting

### Estimations (for planning)

- 1 token ≈ 0.75 words (English)
- 1 line of code ≈ 3-5 tokens
- 100 lines of TypeScript ≈ 400-600 tokens

### Reserved Budgets

Assuming 128K token context window:

```
Total:                  128,000 tokens
Response reserve:        -4,096 tokens (model needs room to reply)
Harness files (P0-P5):   -3,700 tokens
─────────────────────────────────────
Available for code:     120,300 tokens
```

**Practical limit**: After 30-40 turns with tool results, you'll hit ~60K tokens. Compress at that point.

## File Reading Strategy

### Read in Batches

If you need context from multiple files, read them in parallel, not sequentially.

### Read Appropriate Ranges

- For small files (<200 lines): Read entire file
- For large files (>200 lines): Read relevant sections only
- For huge files (>1000 lines): Search first, then read specific ranges

### Use Semantic Search

When you don't know exactly which files to read:

1. Semantic search for relevant code
2. Review search results
3. Read only the most relevant files

## Common Pitfalls (AVOID THESE)

### ❌ Loading Everything at Session Start

Don't load SKILLS.md, TOOLS.md, and all source files upfront. Load on demand.

### ❌ Treating All Context as Equal Priority

System prompt and MEMORY.md must survive. Old conversation turns can be compressed.

### ❌ Compressing Too Aggressively

Keep recent tool results verbatim. If you compress a file path the model needs later, it will hallucinate.

### ❌ Ignoring Token Counting

"This seems short enough" is wrong. Count tokens with actual estimation:

```
lines_of_code * 4 = rough_token_count
```

### ❌ One-Shot Context Assembly

Reassemble context **every turn**. After tool execution, new context is available.

## Context Refresh Triggers

Re-evaluate and rebuild context when:

- User changes topic mid-session
- Error occurs (may need additional diagnostic files)
- Tool execution reveals new relevant files
- Total token count exceeds 70% of budget
- User explicitly asks to "start fresh" or "focus on X"

---

**Last Updated**: 2026-06-29  
**Version**: 1.0.0
