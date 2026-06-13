# SiegeIQ — Safe Edit & Deploy Workflow

This is the routine that keeps the site from breaking. Follow the one rule and the
rest takes care of itself.

## The one rule
**Edit in ONE place only: this local folder (through Claude).**
Never use "Add files via upload" or the edit pencil on github.com again. That second
editing spot is what caused the merge conflict that broke the live site. One editor =
no conflicts.

## Who does what
- **You:** tell Claude what to change. Review the preview. Click two buttons to publish.
- **Claude:** makes the actual edits to `index.html`, saves a dated backup first,
  shows you a preview, and tells you exactly when to publish.

## The loop for every change
1. You describe the change to Claude.
2. Claude saves a timestamped backup to `backups/` (local only, never deployed).
3. Claude edits `index.html` in this folder.
4. **Preview:** Claude shows you the result before anything goes live.
   - Quick visual changes → Claude renders it and shows you here.
   - Changes touching the backend/API → use the staging URL (see below).
5. You approve.
6. **Publish (2 clicks):** open GitHub Desktop → type a short summary →
   **Commit to main** → **Push origin**. Railway auto-deploys to siegeiq.gg.

## Backups (two layers)
- **Visible copies:** every change first writes `backups/index_<date>.html` you can
  open or restore by hand. These stay on your machine (git-ignored, not deployed).
- **Git history:** every push is a restore point. To roll back, just tell Claude
  "revert the site to <date/yesterday/the last version>" and it's handled.

## If something breaks
- Tell Claude to revert — it restores the last good version and you re-publish (2 clicks).
- Worst case, copy a file out of `backups/` over `index.html` and publish.

## Staging / preview (optional, for backend-affecting changes)
The `Dev` branch is for testing backend/API-affecting changes on a Railway staging
URL before they hit `main` (production).

**Keep `Dev` a true mirror of `main`.** It once drifted badly (it was built via
github.com web uploads and fell dozens of commits behind `main`), which made staging
useless and risked a messy merge. The safe routine:
1. Always publish finished work to `main` first (the 2-click loop above).
2. Branch a *new* change off an up-to-date `Dev`, push it, test on staging.
3. Merge `Dev` → `main` only when `Dev` is current with `main`.

**To reset `Dev` so it mirrors `main`** (do this whenever they've diverged):
1. Publish/Push the latest `main` first.
2. On github.com → **Branches** page, delete `Dev` (trash icon), then **New branch**
   named `Dev` from source `main`. (This is branch management, NOT the forbidden
   file-edit pencil / "Add files via upload" — it never touches `index.html`.)
3. In GitHub Desktop, **Fetch origin**. If your local `Dev` looks stale next time you
   use it, ask Claude to swap it for the fresh remote copy.

**Note (June 2026):** email-first first-clip flow + Stripe portal wiring were applied
to `main` behind an off-by-default flag (`window.SIEGEIQ_EMAIL_FIRST` / `?emailfirst=1`).
The old stale `Dev` staging commit was abandoned; reset `Dev` from `main` per above.

## Never do these
- Don't edit index.html on github.com.
- Don't edit it in two places between pushes.
- Don't delete anything inside the `.git` folder unless Claude tells you which file.
