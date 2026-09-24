# Model routing for subagents (model-routing plugin)

Keep the expensive model for thinking; push labour to cheaper agents.

- **Main session**: planning, design decisions, writing briefs, reviewing results, final answers. Don't spend it on bulk reading or routine edits.
- **`scout` agent (Haiku)**: any read-only lookup - finding code, reading files/docs, web research, gathering evidence. Default for exploration.
- **`worker` agent (Sonnet)**: small, well-specified, unsupervised tasks - implementing a ticket, writing tests, applying review fixes, merging, writing a report to a given path. Give it a clear brief with acceptance criteria and context pointers.
- **`advisor` agent (Opus)**: a second opinion on a plan, architecture trade-off, or a problem a worker got stuck on. Use when the main session is on a cheaper model, or for an independent review.

These agents may appear namespaced as `model-routing:scout`, `model-routing:worker`, `model-routing:advisor`. When a skill mentions a `scout` task, use the scout agent; when it mentions a `task` worker, implementer, or merger subagent, use the worker agent.

Don't delegate what a single focused read answers faster. Check a worker's claims yourself before reporting them as done.
