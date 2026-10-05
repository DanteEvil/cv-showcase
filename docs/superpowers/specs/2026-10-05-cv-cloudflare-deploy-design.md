# CV Showcase — Cloudflare Deploy & LinkedIn Pointer Design

**Date:** 2026-10-05  
**Status:** Approved in discussion; awaiting user review of this written spec  
**Project:** `CV-showcase` (Le Ngo Quang Truong personal CV single-page site)

## 1. Goal

Publish the static CV showcase from its own GitHub repository to **Cloudflare Pages** so that editing the repo and pushing to `main` deploys the live page. Keep LinkedIn current via a **pointer to the live site** plus a **paste kit** generated from the same content source. Prefer free services. After cutover, unpublish the existing GitHub Pages user site.

## 2. Decisions

| Topic | Choice |
|-------|--------|
| Host | Cloudflare Pages (Git-connected, no build) |
| Live URL (initial) | `*.pages.dev` |
| Custom domain | Not now; document easy attach later (prefer Cloudflare Registrar) |
| LinkedIn | Repo is source of truth; L3 pointer + L1 paste kit (no API sync) |
| Old site | Unpublish/delete `DanteEvil.github.io` after Cloudflare is verified |
| Approach | Direct Git → Cloudflare Pages (Approach 1) |

## 3. Current state

- `CV-showcase` is a static site: `index.html` (showcase + print view), `le-ngo-quang-truong-cv.html`, `ios cv.pdf`. Content lives in a `DATA` object inside `index.html`.
- Folder is **not** yet a git repository.
- Live CV currently sits in `/Users/truonglnq/Documents/works/Freelance/DanteEvil.github.io` → `https://danteevil.github.io` (separate older `index.html`).
- Existing `DEPLOY.md` documents GitHub Pages only.

## 4. Architecture

```
Local edit (CV-showcase)
    → git push origin main
    → Cloudflare Pages (Git integration, no build, root publish)
    → https://<project>.pages.dev

Same DATA ──► site (automatic on deploy)
           └──► linkedin-paste.md / script output (manual paste into LinkedIn)
```

- **Source of truth:** `cv-showcase` repo content (`DATA` in `index.html`).
- **No build step.** Cloudflare serves the repository root as static files.
- **LinkedIn profile sections** are not written by automation. LinkedIn Website/Featured points at the live URL; Experience/About are updated by pasting generated text when needed.

## 5. Repository setup

- Initialize git in `CV-showcase`.
- Create a public GitHub repository (suggested name: `cv-showcase`).
- `.gitignore` must include at least: `.DS_Store`, `.claude/`, `.cursor/`, `*.local.json`.
- First push includes site assets and updated deploy documentation.
- Rename `ios cv.pdf` → `ios-cv.pdf` and update any in-repo references for cleaner URLs.
- GitHub account: the same account that owns `DanteEvil.github.io` (DanteEvil), unless the user chooses otherwise at create time.

### Published paths

| Path | Role |
|------|------|
| `/` (`index.html`) | Main showcase |
| `/le-ngo-quang-truong-cv.html` | Alternate printable CV page |
| `/ios-cv.pdf` | Downloadable PDF |

Design docs (`DESIGN.md`, `design-brief.md`, this spec) may live in the repo; they are not required for the live site.

## 6. Cloudflare Pages configuration

- Connect the GitHub repo in Cloudflare Pages.
- Production branch: `main`.
- Build command: empty / none.
- Output directory: `/` (repository root).
- Preview deployments on pull requests: optional, free, recommended but not required.

## 7. LinkedIn strategy (L3 + L1)

### L3 — Profile as pointer (one-time after go-live)

- Set LinkedIn **Website** and/or **Featured** to the Cloudflare Pages URL.
- Keep Headline/About concise; direct readers to the live CV for the full current story.
- Site continues to link out to `https://www.linkedin.com/in/truong-le-ngo-quang-47aa6580/`.

### L1 — Paste kit

- Add `scripts/generate-linkedin-paste.mjs` (Node, no npm deps) that extracts the `DATA` object from `index.html` and writes `linkedin-paste.md` at the repo root.
- Output sections (plain text, LinkedIn-friendly):
  - About / summary blurb (from the site profile/print summary copy)
  - Per-job: title, organization, date range, bullets
- `linkedin-paste.md` is generated; commit it when content changes so the paste file is available without running Node, or regenerate before pasting. Document both in `DEPLOY.md`.
- Workflow: edit `DATA` → push (site updates) → run paste script (or use committed `linkedin-paste.md`) → paste into LinkedIn Experience/About if those sections should match.
- Explicitly **out of scope:** LinkedIn Profile Edit API, Share-on-LinkedIn auto-posts, scrapers, browser automation (ToS/ban risk). Do not extract `DATA` into a separate JSON file in this pass (keeps Approach 1 minimal).

**Rationale:** LinkedIn self-serve APIs do not allow updating personal Experience/About/Skills. Official free access covers Sign-In and Share (posts) only. True profile auto-edit is not available on a free DIY path.

## 8. Custom domain (later)

When ready:

1. Buy a domain (prefer **Cloudflare Registrar** so DNS and Pages stay in one account; Namecheap/Porkbun also fine).
2. Pages → Custom domains → add apex and/or `www`.
3. Apply the DNS records Cloudflare shows; HTTPS is automatic.
4. No application code change required.

Suggested names to check later: `truong.dev`, `lnqt.dev`, `quangtruong.dev` (availability not verified in this design).

## 9. Cutover plan

1. Init git, add `.gitignore`, commit site + docs.
2. Create GitHub `cv-showcase` and push `main`.
3. Create Cloudflare Pages project from that repo; wait for first deploy.
4. Verify: hero/nav, skills/experience/work, print/Get CV, PDF if present, LinkedIn outbound link, mobile layout.
5. Update LinkedIn Website/Featured to the new URL; generate paste kit if profile text should match latest `DATA`.
6. Unpublish or delete `DanteEvil.github.io` so there is a single public CV URL.
7. Update any other shared links (email signature, applications) that still point at `danteevil.github.io`.

**Cutover risk:** After the user site is removed, old `github.io` URLs return 404. Update LinkedIn and other links **before** unpublishing.

## 10. Day-to-day operations

| Change | Action |
|--------|--------|
| Copy, jobs, skills, projects | Edit `DATA` (and related HTML if needed) → commit → push |
| Visual/CSS/JS | Edit `index.html` → push |
| LinkedIn Experience/About | Run paste kit → paste manually |
| Domain | Cloudflare UI + DNS only |

## 11. Documentation deliverables

- Rewrite `DEPLOY.md` for Cloudflare Pages (setup, push-to-deploy, domain later, cutover, paste kit).
- Retire GitHub Pages as the primary deploy path in docs (historical note optional).

## 12. In scope / out of scope

**In scope**

- Git + GitHub + Cloudflare Pages wiring (guided + docs)
- `.gitignore`, deploy doc rewrite, cutover checklist
- LinkedIn paste-kit script (`scripts/generate-linkedin-paste.mjs`) + generated `linkedin-paste.md` + usage docs
- PDF rename to `ios-cv.pdf`

**Out of scope**

- Automatic LinkedIn profile section updates
- Design redesign or framework migration
- Purchasing/configuring a real domain in this implementation pass
- Keeping `DanteEvil.github.io` as a redirect (delete/unpublish instead)

## 13. Testing / verification

- First Cloudflare deploy loads over HTTPS on `*.pages.dev`.
- Anchors (Skills, Experience, Work, Contact) work.
- Get CV / print path works.
- PDF download works if published.
- LinkedIn outbound link opens the correct profile.
- Mobile viewport check (narrow width).
- Paste kit output matches current `DATA` jobs and summary intent.
- After cutover, `danteevil.github.io` is no longer serving the old CV.

## 14. Success criteria

- Editing `CV-showcase` and pushing to `main` updates the live Cloudflare site without manual file copy.
- One canonical public CV URL on Cloudflare.
- LinkedIn points at that URL; paste kit exists for keeping Experience/About aligned when content changes.
- Free tier only for hosting and the described workflow.
