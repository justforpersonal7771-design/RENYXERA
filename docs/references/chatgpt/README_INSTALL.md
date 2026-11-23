# RENYXERA Claude project pack

This pack contains project-local instructions, reusable skills and specialist subagents for Claude Code.

## Contents
- `CLAUDE.md` - always-on RENYXERA guardrails and workflow.
- `RENYXERA_Battles_Claude_Handoff.md` - full product and engineering handoff.
- `.claude/skills/*/SKILL.md` - task-specific skill playbooks.
- `.claude/agents/*.md` - focused read-only or specialist reviewer agents.

## How to use
1. Extract the ZIP into the root of the RENYXERA repository (merge the `.claude` folder; do not overwrite existing project files without reviewing differences).
2. Place `RENYXERA_Battles_Claude_Handoff.md` in the repository root or update the path in `CLAUDE.md` if you store it elsewhere.
3. Open the project with Claude Code.
4. Run `/skills` and `/agents` to verify discovery.
5. Start with the Phase 0 audit prompt in Section 20.6 of the handoff. Do not tell Claude to immediately implement the entire specification.
6. Review all suggested changes, SQL migrations, permission settings and deployment migrations before approving them.

## Skills included
- `renyxera-product-guardian`
- `competitive-game-design`
- `game-ui-ux`
- `nextjs-react-architecture`
- `supabase-realtime-engineering`
- `supabase-rls-security`
- `competitive-integrity-economy`
- `pwa-mobile-performance`
- `accessibility-audit`
- `quality-release-gate`
- `cloudflare-deployment-compatibility`

## Specialist agents included
- `product-auditor`
- `frontend-game-architect`
- `realtime-backend-engineer`
- `security-reviewer`
- `qa-performance-engineer`
- `game-economy-analyst`

## Optional official Cloudflare skill
Cloudflare's current Next.js-on-Workers guide documents a vinext Agent Skill workflow. If and only if the project needs a vinext compatibility/migration investigation, review the upstream source and then consider:

```bash
npx skills add cloudflare/vinext
```

Do not automatically migrate a working deployment. Run compatibility checks, inspect generated changes and obtain approval before deployment changes.

## Security note
Skills are instructions that influence an agent and may include scripts or tool guidance. Review third-party skill source and requested permissions before installing. Never put API keys, secrets or private data in this pack.
