# AI providers and keys: what we use, what to set up

*Owner guide, 29 Oct 2026. Written for Adil. Everything here is free. Never paste a key into chat, email or a commit. Keys go only into the places listed below.*

## 1. How the app picks a model

Every AI call from the live app goes through one function (`lib/ai/llm.ts`):

```
request -> OpenRouter free models (picked automatically per task, keys rotated across your accounts)
        -> if all fail or the limit is hit -> Gemini (Google free tier, already working)
```
- **hints and shortcuts** use a small fast model; **explanations, Mentor chat, practice sets** use a stronger one; **Forge generation and its blind re-solve** use the strongest reasoning model available. The choice is made by `lib/ai/model-picker.ts`, which reads OpenRouter's public list of free models every 6 hours, drops ones that do not support JSON, ranks the rest, and benches a model for 30 minutes if it errors. You never choose models by hand. (Optional override: `OPENROUTER_MODELS_FAST`, `_SMART`, `_FORGE`.)
- Without any OpenRouter key the app uses Gemini exactly as before, so nothing breaks while you set things up.

## 2. Providers

| Provider | Cost | What it gives | Status in the code | Needed? |
|---|---|---|---|---|
| **Google Gemini** (AI Studio) | Free tier | Our fallback and today's main model | Built in (`GEMINI_API_KEY`, already set on the Worker) | Yes, already done |
| **OpenRouter** (your 2 accounts) | Free models (names end in `:free`) | Many models behind one key; the main route | Built in (`OPENROUTER_API_KEYS`) | Recommended |
| **Groq** | Free tier | Very fast open models | Not wired yet (ask and I add it) | Optional |
| **Cerebras** | Free tier | Very fast open models | Not wired yet | Optional |
| **Cloudflare Workers AI** | Free daily allowance on your existing account | Small models, no external key | Not wired yet | Optional |
| **OmniRoute** (your local gateway) | Free | Combines many providers on your PC | Built in for the Forge generator only (`OMNIROUTE_*`); the live site cannot reach your PC | Optional, local only |

Free limits are small and change often (OpenRouter free models are limited per minute and per day per account; extra credit raises them). That is why we rotate two accounts and keep Gemini behind them. Check each provider's current limits on its own site before relying on a number.

## 3. Get the OpenRouter keys (do this twice, once per account)

1. Open **openrouter.ai** and sign in (or sign up) with account 1.
2. Click your **profile picture** (top right) and choose **Keys**.
3. Click **Create Key**. Name it `renyxera-1`. Leave the credit limit empty. Click **Create**.
4. Click **Copy**. The key is shown only once, so paste it straight into the place in section 4 before closing the page.
5. Sign out, sign in as account 2, and repeat with the name `renyxera-2`.
6. You now have two keys. In every place below they are written as one value, separated by a comma with no spaces: `key1,key2`.

If you ever paste a key somewhere by mistake: on the Keys page click the key's **delete** (bin) icon, create a new one, and replace it everywhere.

## 4. Where the keys go

You add the same secret name in three places. The name is always `OPENROUTER_API_KEYS`.

**A. The live app (Cloudflare)**
1. Open **dash.cloudflare.com** and sign in.
2. Left menu: **Workers & Pages**. Click the app's Worker.
3. Click **Settings**, then **Variables and Secrets**, then **Add**.
4. Type: **Secret**. Variable name: `OPENROUTER_API_KEYS`. Value: `key1,key2`.
5. Click **Deploy**. The app picks it up on the next request.

**B. The nightly Forge job (GitHub)**
1. Open the repository on github.com, then **Settings**.
2. Left menu: **Secrets and variables**, then **Actions**.
3. Click **New repository secret**. Name: `OPENROUTER_API_KEYS`. Value: `key1,key2`. Click **Add secret**.
4. Add a second secret named `GEMINI_API_KEY` with your Gemini key if it is not there yet (the job uses it as the fallback).
5. To run the job now: **Actions** tab, **Forge nightly generation**, **Run workflow**. It then runs every night at 02:00 IST and pushes a batch to the branch `forge-auto` for review. It never seeds the database.

**C. Your own PC (only when you run the Forge generator by hand)**
1. Open `D:\0-UI\r2ma-stable` in VS Code. Press **Ctrl+P**, type `.env.local`, press Enter.
2. Press **Ctrl+End**, then **Enter** for a new line, and add:
   ```
   OPENROUTER_API_KEYS=key1,key2
   ```
3. Press **Ctrl+S**.

## 5. Optional providers (to add more free capacity later)

For each one: create the key, then tell me "add <provider>" and I wire it into the same chain. Do not paste the key in chat.
- **Groq:** console.groq.com, sign in, **API Keys**, **Create API Key**.
- **Cerebras:** cloud.cerebras.ai, sign in, **API Keys**, **Generate**.
- **Cloudflare Workers AI:** no key. In the Worker's Settings, Bindings, add **Workers AI** (name `AI`). I then call it from the Worker.

## 6. OmniRoute (local only)

OmniRoute runs on your PC at `http://localhost:20128`, so only things running on your PC can use it. Use it for the Forge generator when you run it yourself:
```
OMNIROUTE_URL=http://localhost:20128/v1
OMNIROUTE_KEY=<your OmniRoute API key>
OMNIROUTE_MODEL=renyxera-dev
```
in `.env.local` (steps as in 4C). OmniRoute must be running at the time. Its sorter script only reorders the combo; keep using it as you do now.

## 7. Check that it works

1. After step 4A, open the live AI Mentor, ask a short question in "Quick question". An answer, not an error, means a model replied.
2. For the Forge job, after a run open the **Actions** tab: green means a batch was pushed; look at `data/forge/CS/rejects/` on branch `forge-auto` to see why drafts were rejected.
3. If answers are slow or fail for a while, free models are probably busy or out of quota: the app falls back to Gemini by itself.

## 8. Safety rules for keys

- Keys live only in Cloudflare secrets, GitHub secrets and your local `.env.local` (which is not committed).
- Never put a key in a file that is committed, a screenshot, chat or email.
- One leaked key: delete it at the provider, make a new one, replace it in the three places.
- Free models can be wrong. Forge questions are checked by a blind re-solve and a computed answer before they can be seeded, and Mentor numbers are checked against your own data.
