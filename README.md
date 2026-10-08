# Claude Code Model Routing

**Spend top-model money on thinking, not on busywork.**

A small [Claude Code](https://claude.com/claude-code) plugin that sends each piece of work to the right model:

- **Opus** plans, decides and reviews.
- **Sonnet** does small, well-defined coding jobs.
- **Haiku** does the reading and searching.

You keep working the same way. You just stop paying Opus prices for jobs like "find where this function is called".

---

## Why

When Claude Code works on a task it often starts **subagents**: helpers that search the codebase, read docs or make a focused change. By default every subagent runs on the **same model as your main session**. If you're on Opus, a simple file search costs the same as an architecture decision.

Most subagent work is routine:

| Kind of work | Needs deep reasoning? | Right model |
|---|---|---|
| Find files, read code, look things up online | No | Haiku (cheapest, fastest) |
| Implement a clearly written ticket, write tests, apply review fixes | A little | Sonnet (mid-cost) |
| Plan the approach, weigh trade-offs, review the result | Yes | Opus (strongest) |

This plugin makes that split the default.

---

## What's inside

### Three agents

| Agent | Model | What it does | Guardrails |
|---|---|---|---|
| **`scout`** | Haiku | Read-only investigation: finds code, reads files and docs, searches the web, and reports back with `file:line` or URL citations. | Cannot edit files. Answers only what it was asked. |
| **`worker`** | Sonnet | Carries out a small, clearly scoped task from a brief: implement a ticket, write tests, fix review comments, merge a branch, write a report. | Stays in scope. **Stops and asks** instead of guessing when the brief is unclear. Must report what it actually ran and saw. |
| **`advisor`** | Opus | A senior second opinion on plans, design trade-offs and diff reviews, or on a problem a worker got stuck on. | Advises only; never edits. |

### A routing rule

At the start of every session the plugin gives Claude a short rule: use `scout` for lookups, `worker` for scoped tasks, keep planning and review in the main session, and double-check a worker's claims before reporting them as done.

---

## How it works in practice

You ask for something as usual, e.g. *"Add CSV export to the reports page."*

```
You ──► Main session (Opus)
          │  plans the change, splits it into steps
          │
          ├──► scout (Haiku)   "Where is the reports page? How is data fetched?"
          │        └── returns findings with file:line citations
          │
          ├──► worker (Sonnet) "Implement the export button per this brief. Run the tests."
          │        └── returns what changed plus actual test output
          │
          └── reviews the result, checks the claims, answers you
```

The expensive model only does the parts that need judgement.

---

## Install

**Requires:** Claude Code (CLI, desktop app or IDE extension).

In Claude Code, run these two commands:

```
/plugin marketplace add jmjmalik22/claude-model-routing
/plugin install model-routing@model-routing-marketplace
```

Then **restart Claude Code** (or start a new session).

### Check it worked

Ask Claude: *"What agents do you have?"* You should see `scout`, `worker` and `advisor` (they may show as `model-routing:scout` and so on).

### Recommended: run the main session on Opus

The plugin works on any main model, but it pays off most when the planner is strong and the labour is cheap. Either:

- pick **Opus** in the model picker, or
- set it as your default in `~/.claude/settings.json`:

  ```json
  { "model": "opus" }
  ```

  (If you already have settings, just add or change the `"model"` line.)

If your main session is on Sonnet, the routing still works, and Claude can call the Opus `advisor` when it needs a stronger opinion.

---

## Cost guardrails

- `worker` is capped at 30 turns and `scout` at 15, with a restricted tool list so they do not inherit every MCP tool and skill. Workers keep a `.worker-progress.md` note so a capped run can resume.
- Optional: set `MODEL_ROUTING_BLOCK_EXPENSIVE=1` in your environment to deny `general-purpose`, `claude` and `fork` subagents (they inherit your main model and all tools). Off by default.

## Update

```
/plugin marketplace update model-routing-marketplace
```

## Uninstall

```
/plugin uninstall model-routing@model-routing-marketplace
```

---

## FAQ

**Will this make answers worse?**
Planning, decisions and final review stay on your main model. Only the legwork moves to cheaper models, and workers are told to stop and ask rather than guess.

**Does it change my existing skills or settings?**
No. It only adds three agents and a session-start rule. Your settings, CLAUDE.md and skills are untouched.

**Can I still force a specific model?**
Yes. Just ask, e.g. *"use Opus for this search"*, or pick the model yourself when you start a subagent.

**My skills mention `scout` or `task` workers. Do they work with this?**
Yes. The agents use those names on purpose, so skills that hand work to a "scout" or a "worker" pick them up.

**Is anything sent anywhere new?**
No. The plugin is plain text instructions and agent definitions. It adds no network calls, telemetry or credentials.

---

## Repository layout

```
.claude-plugin/marketplace.json        # makes this repo installable as a plugin marketplace
plugins/model-routing/
├── .claude-plugin/plugin.json         # plugin manifest
├── agents/
│   ├── scout.md                       # Haiku, read-only
│   ├── worker.md                      # Sonnet, scoped implementation
│   └── advisor.md                     # Opus, advisory
├── hooks/hooks.json                   # loads ROUTING.md at session start; registers the optional block hook
│   └── block-expensive-agents.js      # opt-in: denies general-purpose/claude/fork subagents
└── ROUTING.md                         # the routing rule Claude follows
```

To customise, edit the agent files (for example, change `model: haiku` to `model: sonnet`), commit, and ask users to run the update command.

---

Maintained by Jitendra Singh Malik. Suggestions and issues welcome.
