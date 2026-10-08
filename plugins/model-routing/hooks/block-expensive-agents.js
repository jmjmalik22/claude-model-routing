// PreToolUse(Agent): deny subagent types that inherit Opus + every tool (high cache cost).
// Missing subagent_type defaults to general-purpose, so it is denied too.
if (process.env.MODEL_ROUTING_BLOCK_EXPENSIVE !== '1') process.exit(0); // opt-in
const BLOCKED = new Set(['general-purpose', 'claude', 'fork']);
let s = '';
process.stdin.on('data', d => (s += d)).on('end', () => {
  const t = (JSON.parse(s || '{}').tool_input || {}).subagent_type || 'general-purpose';
  if (!BLOCKED.has(t)) return;
  process.stdout.write(JSON.stringify({
    hookSpecificOutput: {
      hookEventName: 'PreToolUse',
      permissionDecision: 'deny',
      permissionDecisionReason: `Subagent type '${t}' is blocked (inherits Opus + all tools, burns cache). ` +
        `Use scout (haiku, read-only lookups), worker (sonnet, bounded edits) or advisor (opus, judgment), ` +
        `or do the work in the main session.`,
    },
  }));
});
