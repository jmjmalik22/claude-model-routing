# Claude Code model routing

A Claude Code plugin that keeps the expensive model for thinking and hands routine work to cheaper models.

| Agent | Model | Used for |
|---|---|---|
| `scout` | Haiku | Read-only lookups: finding code, reading docs, web research. Cannot edit. |
| `worker` | Sonnet | Small, well-scoped tasks: implement a ticket, write tests, apply review fixes, merge. Stops and asks if the brief is unclear. |
| `advisor` | Opus | Planning, design trade-offs, reviews, and problems a worker got stuck on. Advises only. |

At the start of each session the plugin also loads a short routing rule telling Claude when to use each agent.

## Install

In Claude Code, run:

```
/plugin marketplace add jmjmalik22/claude-model-routing
/plugin install model-routing@model-routing-marketplace
```

Then restart Claude Code.

For the full benefit, run the main session on Opus (set `"model": "opus"` in `~/.claude/settings.json`, or pick Opus in the model picker) so the planner is strong and the labour is cheap.

## Update

```
/plugin marketplace update model-routing-marketplace
```

## Uninstall

```
/plugin uninstall model-routing@model-routing-marketplace
```
