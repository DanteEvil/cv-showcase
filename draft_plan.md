# Feature Plan

## Overview

Deploy the static CV showcase from a dedicated GitHub repo to **Cloudflare Pages** (push `main` → live `*.pages.dev`), with docs for attaching a custom domain later. Keep LinkedIn aligned via a **Website/Featured pointer** to the live URL plus a **paste-kit generator** from the site `DATA` object (no LinkedIn API). After go-live, unpublish `DanteEvil.github.io`. Rename `ios cv.pdf` → `ios-cv.pdf`.

**Why this approach:** Matches free hosting, zero build step, and LinkedIn’s real API limits (profile Experience/About cannot be auto-edited on free self-serve APIs).

**Approved design:** `docs/superpowers/specs/2026-10-05-cv-cloudflare-deploy-design.md`  
**Detailed agent plan:** `docs/superpowers/plans/2026-10-05-cv-cloudflare-deploy.md`

## State Management

Not applicable — static HTML/CSS/JS site. Content source of truth remains the `DATA` object in `index.html`. No Riverpod/GetX.

## Folder Structure

```
CV-showcase/
├── index.html                          # Main showcase (modify only if PDF links added)
├── le-ngo-quang-truong-cv.html         # Printable CV page (unchanged unless PDF refs)
├── ios-cv.pdf                          # Renamed from "ios cv.pdf"
├── linkedin-paste.md                   # Generated LinkedIn paste kit
├── .gitignore                          # New
├── DEPLOY.md                           # Rewrite for Cloudflare Pages
├── draft_plan.md                       # This approval plan
├── scripts/
│   └── generate-linkedin-paste.mjs     # New — extract DATA → linkedin-paste.md
├── tests/
│   ├── fixtures/
│   │   └── sample-index.html           # Minimal DATA fixture for generator tests
│   └── generate-linkedin-paste.test.mjs
└── docs/superpowers/
    ├── specs/2026-10-05-cv-cloudflare-deploy-design.md
    └── plans/2026-10-05-cv-cloudflare-deploy.md
```

## Classes and Widgets

Not applicable (no Flutter/UI framework). Deliverables instead:

| Unit | Responsibility |
|------|----------------|
| `scripts/generate-linkedin-paste.mjs` | Parse `DATA` + About text from HTML; write `linkedin-paste.md` |
| `DEPLOY.md` | Cloudflare setup, day-to-day push, domain later, cutover, paste kit |
| `.gitignore` | Ignore editor/OS junk |
| GitHub + Cloudflare | Repo + Pages project (manual UI steps guided in docs) |

## Testing Strategy

- **Unit:** Node test for the paste-kit generator against `tests/fixtures/sample-index.html` (jobs, about, output file shape).
- **Manual / deploy verification:** First Cloudflare deploy — HTTPS, anchors, print CV, PDF, LinkedIn outbound link, mobile width.
- **Cutover checklist:** LinkedIn Website/Featured updated → then unpublish `DanteEvil.github.io`.
- **Widget tests:** N/A (no Flutter).

## Approval gate

Do **not** implement until this plan is approved. Reply **approve** (or request changes) to proceed with the detailed plan in `docs/superpowers/plans/2026-10-05-cv-cloudflare-deploy.md`.
