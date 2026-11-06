# Review of the `claude-youtube` skill pack

[← Docs index](../README.md) · [Open items](../open-work/OPEN-ITEMS-2026-11-06.md) · [Owner tasks](../open-work/OWNER-TASKS.md)

Reviewed 6 Nov 2026 by reading the source of [AgriciDaniel/claude-youtube](https://github.com/AgriciDaniel/claude-youtube) (main branch) before installing. Nothing was installed or run.

## Verdict: safe to install, with the notes below

| Check | Finding |
|---|---|
| Licence | MIT |
| Install | `install.sh` / `install.ps1` only `git clone --depth 1` the repo and copy `skills/claude-youtube/*` into `~/.claude/skills/youtube`. No curl-pipe-bash, no pip install, no registry or settings edits. |
| Hooks / auto-run | None. `plugin.json` has name, version and licence only. Commands run only when you type `/youtube ...`. |
| Python scripts (6) | Read-only calls to the YouTube Data API v3 and Analytics API; one optional `yt-dlp` call for transcripts, run with a list of arguments (no shell) and a 30 s timeout. No eval, no exec, no outbound calls to other servers. |
| Credentials | All optional: `YOUTUBE_API_KEY` for public data; OAuth with **read-only** scopes (`yt-analytics.readonly`, `youtube.readonly`) for your own channel analytics; token and quota files are written under the skill's own folder. |
| Optional paid extras | DataForSEO MCP (about $0.002 to $0.04 per command) and NanoBanana (Gemini key). **Skip both**: zero budget; web search is the built-in fallback. |
| Instruction files (14 sub-skills, 9 guides) | Plain marketing/strategy text. No instructions to run shell commands, disable permissions, send data out, or ignore rules. |
| Maturity | Beta (v0.1.0), small community (about 11 stars on a mirror). Treat advice as a draft, not truth. |

## Useful for us
`/youtube audit` (channel), `seo` (title, description, tags, chapters), `thumbnail`, `calendar` (monthly plan), `shorts`, `hook`, `script`, `competitor`. All of these work without any key using web search.

## Rules if installed
- Do not connect OAuth until the channel has real videos; use read-only scopes only.
- Never let it upload or edit; the pack cannot, and uploads stay manual (YouTube API upload needs a Google audit anyway).
- Do not install the paid MCP add-ons.
- Uninstall: delete the `.claude/skills/youtube` folder.
