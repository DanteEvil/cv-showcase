# Deploy CV Showcase to Cloudflare Pages (Free)

This guide publishes the static CV site from GitHub to **Cloudflare Pages** — free hosting with HTTPS, no build step. Push to `main` and Cloudflare serves the repository root as static files.

**GitHub Pages is no longer the primary deploy path.** This repo is meant to go live on `*.pages.dev` (or a custom domain later). If you still have the old user site at `https://danteevil.github.io`, see [Cutover from GitHub Pages](#cutover-from-github-pages) after the new site is verified.

---

## What you will get

| Item | Example |
|------|---------|
| Live URL (initial) | `https://cv-showcase.pages.dev` (exact subdomain depends on your Cloudflare project name) |
| Cost | Free (Cloudflare Pages + GitHub public repo) |
| HTTPS | Automatic |
| Updates | Push to `main` → live in about **1–2 minutes** |

---

## Prerequisites

- A [GitHub account](https://github.com/signup) (free)
- A [Cloudflare account](https://dash.cloudflare.com/sign-up) (free)
- [Git](https://git-scm.com/downloads) installed on your Mac
- **Node.js** — only for the LinkedIn paste kit script (`node scripts/generate-linkedin-paste.mjs`); not required for hosting
- **[GitHub CLI (`gh`)](https://cli.github.com/)** — optional (handy for auth and creating repos from Terminal)

Verify Git (and optionally Node):

```bash
git --version
node --version   # optional, for paste kit
```

---

## Files published

These paths are served at the site root after deploy:

| Path | Purpose |
|------|---------|
| `index.html` | Main CV showcase (required) |
| `le-ngo-quang-truong-cv.html` | Alternate printable CV page |
| `ios-cv.pdf` | Downloadable PDF |

Design docs (`DESIGN.md`, `design-brief.md`, specs under `docs/`) are optional in the repo; they are not required for the live site.

---

## Step 1 — Prepare the project folder

Open Terminal and go to the project:

```bash
cd "/Users/truonglnq/Documents/works/Freelance/CV-showcase"
```

### `.gitignore`

Ensure local and editor files are not committed. This repo should include at least:

```
.DS_Store
.claude/
.cursor/
*.local.json
```

(Add `node_modules/`, `.worktrees/`, `.superpowers/` if you use those locally.)

---

## Step 2 — Initialize Git and first commit

If the folder is not yet a git repository:

```bash
git init
git add index.html le-ngo-quang-truong-cv.html ios-cv.pdf .gitignore \
  scripts/generate-linkedin-paste.mjs linkedin-paste.md DEPLOY.md
git add DESIGN.md design-brief.md docs/   # optional
git commit -m "Add CV showcase site and Cloudflare deploy docs"
git branch -M main
```

---

## Step 3 — Create GitHub repo and push

1. Go to [github.com/new](https://github.com/new)
2. **Repository name:** `cv-showcase` (suggested; use your account, e.g. **`DanteEvil`**, unless you choose another)
3. **Visibility:** Public
4. **Do not** add a README, `.gitignore`, or license — you already have files locally
5. Click **Create repository**

Connect and push (replace `DanteEvil` if you use a different username):

```bash
git remote add origin https://github.com/DanteEvil/cv-showcase.git
git push -u origin main
```

Sign in when prompted ([`gh auth login`](https://cli.github.com/manual/gh_auth_login) or a personal access token if HTTPS asks for credentials).

Optional with `gh`:

```bash
gh repo create DanteEvil/cv-showcase --public --source=. --remote=origin --push
```

---

## Step 4 — Cloudflare Pages setup

1. Log in to the [Cloudflare dashboard](https://dash.cloudflare.com/)
2. Go to **Workers & Pages** → **Create** → **Pages** → **Connect to Git**
3. Authorize GitHub and select the **`cv-showcase`** repository
4. Configure the project:

   | Setting | Value |
   |---------|--------|
   | **Framework preset** | None |
   | **Build command** | *(leave empty)* |
   | **Build output directory** | `/` (repository root) |
   | **Production branch** | `main` |

5. Save and deploy. Wait for the first deployment to finish.

Your live URL appears on the project overview (typically `https://<project-name>.pages.dev`).

Preview deployments on pull requests are optional, free, and useful for reviewing changes before merge — not required for go-live.

---

## Step 5 — Verify the live site

Open your `*.pages.dev` URL and check:

- [ ] Homepage loads with styling and animations
- [ ] Nav anchors (**Skills**, **Experience**, **Work**, **Contact**) scroll correctly
- [ ] **Get CV** / print path works
- [ ] **`/ios-cv.pdf`** downloads (if you published the PDF)
- [ ] LinkedIn outbound link opens [your profile](https://www.linkedin.com/in/truong-le-ngo-quang-47aa6580/)
- [ ] Layout looks good on mobile (narrow browser or phone)

Hard-refresh (`Cmd + Shift + R`) if you still see an old version after a push.

---

## Day-to-day updates

| What changed | What to do |
|--------------|------------|
| Copy, jobs, skills, projects | Edit `DATA` in `index.html` (and related HTML if needed) → commit → push |
| Visual/CSS/JS | Edit `index.html` → commit → push |
| LinkedIn Experience/About text | Run paste kit (below) → paste manually into LinkedIn |
| Custom domain | Cloudflare dashboard + DNS only — no code change |

Typical workflow:

```bash
cd "/Users/truonglnq/Documents/works/Freelance/CV-showcase"
git add .
git commit -m "Update CV content"
git push
```

Changes go live in about **1–2 minutes**.

---

## LinkedIn (pointer + paste kit)

### Profile pointer (L3) — set after go-live

- Set LinkedIn **Website** and/or **Featured** to your **Cloudflare Pages URL** (not the old `github.io` link).
- Keep Headline/About concise; the live CV is the full, current story.
- The site continues to link to your LinkedIn profile.

### Paste kit (L1) — when Experience/About should match the site

Content lives in the `DATA` object in `index.html`. LinkedIn does not offer a free API to auto-update profile sections, so use the generator:

```bash
node scripts/generate-linkedin-paste.mjs
```

By default this reads `index.html` and writes `linkedin-paste.md` at the repo root (About blurb plus per-job title, organization, dates, bullets).

**Workflow:** edit `DATA` → push (site updates automatically) → run the script **or** open committed `linkedin-paste.md` → paste into LinkedIn Experience/About when those sections should match.

You may commit `linkedin-paste.md` after content changes so the file is available without running Node on every machine.

---

## Custom domain (later)

When you want a domain instead of `*.pages.dev`:

1. Register a domain (prefer **[Cloudflare Registrar](https://www.cloudflare.com/products/registrar/)** so DNS and Pages stay in one account; Namecheap or Porkbun also work).
2. In Cloudflare: **Pages** → your project → **Custom domains** → add apex and/or `www`.
3. Apply the DNS records Cloudflare shows; HTTPS is automatic.
4. No application code change is required.

Names to consider later: `truong.dev`, `lnqt.dev`, `quangtruong.dev` (check availability when you buy).

---

## Cutover from GitHub Pages

If the CV previously lived on **`https://danteevil.github.io`** (repo `DanteEvil.github.io`):

1. Complete Steps 1–5 above and confirm the Cloudflare site works.
2. Update **LinkedIn Website/Featured** and any other links (email signature, applications) to the new URL.
3. Run the paste kit if profile text should match the latest `DATA`.
4. **Only then** unpublish or delete the `DanteEvil.github.io` repository (or disable GitHub Pages on it).

**Risk:** After the old user site is removed, `danteevil.github.io` URLs return 404. Update LinkedIn and other links **before** unpublishing.

This project does **not** use `https://YOUR_USERNAME.github.io/cv-showcase/` as the primary hosting path anymore.

---

## Troubleshooting

### Deploy failed or site is empty

- Confirm **Build command** is empty and **Output directory** is `/`.
- Ensure `index.html` is at the **root** of the repo, not in a subfolder.
- Check the failed deploy log in Cloudflare Pages.

### `git push` authentication fails

- Use `gh auth login` or a [personal access token](https://github.com/settings/tokens) instead of a GitHub account password over HTTPS.

### Paste kit errors

- Run from the repo root; ensure `index.html` still contains `var DATA = { ... }`.
- Node 18+ recommended (script uses native ESM, no npm install).

### Stale content in the browser

- Hard-refresh or wait a minute after push; Cloudflare caches can briefly show an older asset.

---

## Summary checklist

- [ ] Git initialized; `.gitignore` in place; first commit on `main`
- [ ] Public GitHub repo `cv-showcase` created and pushed
- [ ] Cloudflare Pages project connected (preset **None**, no build, output **`/`**, branch **`main`**)
- [ ] Live `*.pages.dev` URL verified (anchors, print, PDF, LinkedIn link, mobile)
- [ ] LinkedIn Website/Featured points at the Cloudflare URL
- [ ] Paste kit documented workflow understood for profile text updates
- [ ] After cutover: old `DanteEvil.github.io` unpublish/delete **after** links are updated

You are done. Edits pushed to `main` update the live CV on Cloudflare Pages.
