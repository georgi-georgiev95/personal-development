# 🎯 Harness Setup Complete

Your **tool-agnostic AI agent harness** has been successfully created following the [Harness Engineering Guide](https://harness-guide.com/) principles.

## ✅ What Was Created

```
harness/
├── README.md          # Harness overview & philosophy
├── MANIFEST.md        # File index & load recipes for AI tools
├── QUICKSTART.md      # 5-minute guide with examples
├── GUARDRAILS.md      # Agent identity & constraints (P0 - ALWAYS LOAD)
├── CONTEXT.md         # Context assembly rules (P1 - ALWAYS LOAD)
├── MEMORY.md          # Project knowledge & conventions (P3 - ALWAYS LOAD)
├── SKILLS.md          # Scaffolding patterns (P4 - LOAD ON DEMAND)
├── TOOLS.md           # Build/test workflows (P5 - LOAD ON DEMAND)
└── logs/
    ├── .gitignore     # Keeps logs local (not in git)
    └── TEMPLATE.md    # Daily log template
```

**Total**: 8 core files + 2 supporting files  
**Size**: ~12KB of markdown  
**Token cost**: ~4,800 tokens (full harness), ~2,300 tokens (minimal load)

---

## 🚀 Quick Start

### For GitHub Copilot (Current Setup)

**Already integrated!** Your `.github/copilot-instructions.md` now references the harness.

Copilot will automatically load:

1. GUARDRAILS.md (identity & rules)
2. CONTEXT.md (how to assemble context)
3. MEMORY.md (project conventions)

Just start coding — Copilot knows about the harness.

### For Cursor

1. Open Cursor Settings
2. Add to workspace context: `harness/**/*.md`
3. Save and restart
4. Cursor will auto-load harness files

### For Claude Desktop

When starting a new chat:

```
Load my project harness:
- harness/GUARDRAILS.md
- harness/CONTEXT.md
- harness/MEMORY.md

Then help me with [task].
```

### For Other AI Tools

Point your tool to load these 3 files at session start:

- `harness/GUARDRAILS.md`
- `harness/CONTEXT.md`
- `harness/MEMORY.md`

---

## 📚 File Purposes

### Core Context (Always Load)

**GUARDRAILS.md** (300 tokens)

- Who the agent is
- What it can/cannot do
- Permission model
- Code quality standards

**CONTEXT.md** (500 tokens)

- How to assemble context
- Priority-based loading
- Token budgeting
- Compression strategies

**MEMORY.md** (1,500 tokens)

- Project tech stack
- Architecture patterns
- Naming conventions
- Common gotchas

### On-Demand Context

**SKILLS.md** (800 tokens)

- Component scaffolding
- Three.js setup
- Feature module creation
- Testing patterns
- When: Creating new code, complex setups

**TOOLS.md** (600 tokens)

- pnpm commands
- Vite dev server
- Testing with Vitest
- Build & deployment
- When: Running builds, tests, installs

### Documentation

**README.md**

- Harness philosophy
- File structure overview
- Usage for different AI tools

**QUICKSTART.md**

- 5-minute guide
- Usage examples
- Troubleshooting
- Best practices

**MANIFEST.md**

- File index
- Load priority map
- Context recipes
- Token estimates

---

## 🎨 Usage Examples

### Example 1: Fix a Bug

**You**: "Fix the responsive layout in Navigation component"

**AI loads**:

- ✅ GUARDRAILS.md (300 tokens)
- ✅ CONTEXT.md (500 tokens)
- ✅ MEMORY.md (1,500 tokens)
- ✅ Navigation.tsx + Navigation.styles.ts (1,000 tokens)

**Total**: ~3,300 tokens

---

### Example 2: Create New Feature

**You**: "Add a Gallery feature with routing and grid layout"

**AI loads**:

- ✅ GUARDRAILS.md (300 tokens)
- ✅ CONTEXT.md (500 tokens)
- ✅ MEMORY.md (1,500 tokens)
- ✅ SKILLS.md → Feature Module, Responsive Layout (800 tokens)
- ✅ routes.tsx (500 tokens)

**Total**: ~3,600 tokens

---

### Example 3: Add 3D Experiment

**You**: "Create a particle system with Leva controls"

**AI loads**:

- ✅ GUARDRAILS.md (300 tokens)
- ✅ CONTEXT.md (500 tokens)
- ✅ MEMORY.md (1,500 tokens)
- ✅ SKILLS.md → Three.js Setup, Debug Tools (800 tokens)
- ✅ HomePage.tsx (1,200 tokens)

**Total**: ~4,300 tokens

---

## 🧠 Context Engineering

The harness follows **priority-based context assembly**:

| Priority | What          | Tokens | When           |
| -------- | ------------- | ------ | -------------- |
| P0       | GUARDRAILS.md | ~300   | ALWAYS         |
| P1       | CONTEXT.md    | ~500   | ALWAYS         |
| P2       | User request  | varies | ALWAYS         |
| P3       | MEMORY.md     | ~1,500 | ALWAYS         |
| P4       | SKILLS.md     | ~800   | On demand      |
| P5       | TOOLS.md      | ~600   | On demand      |
| P6       | Source files  | varies | As needed      |
| P7       | History       | varies | Sliding window |

**Token Budget** (128K context window):

- Harness files (P0-P3): ~2,300 tokens
- Available for source code: ~120K tokens
- Response reserve: 4,096 tokens

**Rule**: If task needs <5K tokens → load P0-P3 only  
**Rule**: If task needs 5-15K tokens → add P4 or P5  
**Rule**: If task needs >15K tokens → consider breaking into subtasks

---

## 🛠️ Maintenance

### Update MEMORY.md when:

- Project structure changes
- New conventions adopted
- Technology stack updated
- Architectural decisions made

### Update SKILLS.md when:

- New scaffolding patterns emerge
- New frameworks integrated
- Repeated patterns identified

### Update TOOLS.md when:

- Build tools change
- New scripts added
- Deployment process updated

### Update GUARDRAILS.md when:

- Permission model changes
- Security requirements added
- New constraints needed

---

## 📊 Session Logging (Optional)

Use `harness/logs/` for daily session logs:

```bash
# Copy template for today
cp harness/logs/TEMPLATE.md harness/logs/2026-06-29.md

# Edit to track:
# - Goals
# - Work completed
# - Decisions made
# - Errors & solutions
# - Next steps
```

**Note**: Logs are `.gitignore`d — they're personal and ephemeral.

---

## ✨ Benefits

### For You (Human)

- ✅ Consistent AI behavior across tools (Copilot, Cursor, Claude)
- ✅ Less repetition — conventions are documented once
- ✅ Faster onboarding — new AI tools understand the project immediately
- ✅ Better results — AI has structured context, not guesswork

### For AI Assistants

- ✅ Clear identity and constraints (GUARDRAILS)
- ✅ Efficient context assembly (CONTEXT)
- ✅ Project knowledge without trial-and-error (MEMORY)
- ✅ Reusable patterns (SKILLS)
- ✅ Correct tool usage (TOOLS)

---

## 🎓 Learn More

- **Harness Guide**: https://harness-guide.com/
- **Your QUICKSTART**: [harness/QUICKSTART.md](harness/QUICKSTART.md)
- **Context Engineering**: https://harness-guide.com/guide/context-engineering/
- **Agentic Loop**: https://harness-guide.com/guide/agentic-loop/

---

## 🧪 Test It

Try asking your AI assistant:

**Test 1**: "What are the responsive breakpoints for this project?"  
Expected: AI cites MEMORY.md → 1024px (desktop), 768px (tablet), <768px (mobile)

**Test 2**: "Create a new Button component in the UI kit"  
Expected: AI loads SKILLS.md, follows component scaffolding pattern

**Test 3**: "Run the tests"  
Expected: AI loads TOOLS.md, runs `pnpm test`

---

## 🎉 You're Ready!

Your harness is **tool-agnostic** and ready for:

- ✅ GitHub Copilot (already configured)
- ✅ Cursor (add to workspace context)
- ✅ Claude Desktop (load files at session start)
- ✅ Any future AI coding tools

**Next steps**:

1. Try a simple task with your AI assistant
2. Verify it follows project conventions (no inline styles, uses `@/` imports, etc.)
3. Update harness files as the project evolves

**Questions?** Check [harness/QUICKSTART.md](harness/QUICKSTART.md) for examples and troubleshooting.

---

**Created**: 2026-06-29  
**Harness Version**: 1.0.0  
**Spec**: [Harness Engineering Guide](https://harness-guide.com/)
