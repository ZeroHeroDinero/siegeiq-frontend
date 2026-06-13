# CLAUDE.md — SiegeIQ project memory (read this first, every time)

This file is the standing operating procedure for this repo. Follow it on every task
in this folder. It exists because a botched merge once committed Git conflict markers
straight into the live site. Don't let that happen again.

## Project facts
- **Repo:** ZeroHeroDinero/siegeiq-frontend (`main` = production, `Dev` = staging branch).
- **Site:** the whole front end is a single file, `index.html`. Static.
- **Hosting:** Railway auto-deploys `main` → https://siegeiq.gg on every push.
- **Owner is non-technical** and does NOT want to type/paste code. Claude does all edits.
  Per-change effort for the owner must stay near-zero (review a preview + 2 clicks).

## THE ONE RULE (non-negotiable)
**`index.html` is edited in exactly ONE place: this local folder, through Claude.**
Never tell the owner to use github.com's "Add files via upload" or the edit pencil.
That second editing surface is what caused the conflict. One editor = no conflicts.

## The edit → publish loop (do this for every change)
1. **Back up first.** Copy current `index.html` to
   `backups/index_<YYYY-MM-DD>[_label].html` before editing. (`backups/` is
   git-ignored — local-only, never deployed.)
2. **Edit** `index.html` directly with Read/Write/Edit.
3. **Preview before live.** Show the owner the result first.
   - Visual/content change → render/screenshot and show it here.
   - Backend/API-affecting change → use the `Dev` staging branch + Railway staging URL.
4. **Owner approves.**
5. **Publish = owner does 2 clicks in GitHub Desktop:** type a summary →
   *Commit to main* → *Push origin*. Railway deploys automatically.

## Publishing — important
- **Do NOT rely on automated git push from the sandbox.** This repo is a Windows-mounted
  folder; sandbox git hit lock-file/permission failures (`index.lock` "Operation not
  permitted", "could not read Username for github.com"). Pushing must go through
  **GitHub Desktop** on the owner's machine, where their GitHub credentials live.
- Reading the repo and editing files from the sandbox is fine; pushing is not.
- If a `.git/*.lock` file ever blocks GitHub Desktop: close GitHub Desktop, delete the
  specific lock file (e.g. `index.lock` / `HEAD.lock`), reopen, commit, push.

## Backups & revert (two layers)
- **Visible dated copies** in `backups/` (git-ignored, local only).
- **Git history** — every push is a restore point.
- Revert on request: restore the relevant version into `index.html`, then owner
  re-publishes with the 2 clicks. Never tell the owner to hand-edit `.git` internals
  except deleting a named lock file.

## Verifying a clean `index.html` (run before publishing)
- Zero conflict markers: `grep -c '^<<<<<<<\|^=======\|^>>>>>>>' index.html` → must be 0.
- Exactly one each of `<!DOCTYPE`, `<html>/<\/html>`, `<head>/<\/head>`, `<body>/<\/body>`.
- Balanced `<script>`/`<style>` open/close counts.
- After deploy, fetch siegeiq.gg and confirm no markers + the expected change is live
  (use a `?v=` cache-buster).

## Backend API contract (frontend must match)
- `POST /tricks/ask` body: `{ operator, map, query }` — the param is **`query`**, NOT
  `question`. (This was a real bug; don't reintroduce it.)
- `POST /settings/advise` body: `{ platform, input, rank, dpi, sens, fov, ctrlsens,
  deadzone, issues }`.
- Auth token (when present) sent as `Authorization: Bearer <token>` via `window.siegeAuth`.

## Never do
- Never edit `index.html` on github.com.
- Never edit it in two places between pushes.
- Never commit Git conflict markers — resolve, verify markers = 0, then commit.
- Never delete `.git` contents except a named lock file you've identified.
