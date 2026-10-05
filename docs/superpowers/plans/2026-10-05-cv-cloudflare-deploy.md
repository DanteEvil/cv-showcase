# CV Cloudflare Deploy Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Put `CV-showcase` on Cloudflare Pages via GitHub push-to-deploy, add a LinkedIn paste-kit generator from site `DATA`, rewrite deploy docs, and cut over away from `DanteEvil.github.io`.

**Architecture:** Static root publish on Cloudflare Pages (no build). Content stays in `var DATA` inside `index.html`. A zero-dependency Node script extracts `DATA` plus the print About paragraph and writes `linkedin-paste.md` for manual LinkedIn updates. Custom domain is documented only.

**Tech Stack:** Static HTML/CSS/JS, Node.js (built-in `fs`/`path`/`assert` only), GitHub, Cloudflare Pages.

## Global Constraints

- Host: Cloudflare Pages, Git-connected, production branch `main`, empty build command, output directory repository root.
- LinkedIn: L3 pointer + L1 paste kit only — no LinkedIn API, scrapers, or browser automation.
- Free tier only for hosting workflow.
- Do not extract `DATA` into a separate JSON file in this pass.
- Rename PDF to `ios-cv.pdf`.
- GitHub account default: `DanteEvil` (owner of current Pages user site).
- Spec: `docs/superpowers/specs/2026-10-05-cv-cloudflare-deploy-design.md`.
- User approval file: `draft_plan.md` must be approved before code work starts.
- Commit only when the user explicitly asks, or when a plan step’s commit is executed under an approved implementation run where the user chose execution.

---

## File map

| Path | Action | Responsibility |
|------|--------|----------------|
| `.gitignore` | Create | Ignore OS/editor junk |
| `ios cv.pdf` → `ios-cv.pdf` | Rename | Cleaner public URL |
| `scripts/generate-linkedin-paste.mjs` | Create | CLI: HTML → `linkedin-paste.md` |
| `tests/fixtures/sample-index.html` | Create | Minimal fixture with `DATA` + About |
| `tests/generate-linkedin-paste.test.mjs` | Create | Unit tests for generator |
| `linkedin-paste.md` | Create (generated) | Paste-ready LinkedIn text from live `index.html` |
| `DEPLOY.md` | Rewrite | Cloudflare + cutover + paste kit + domain later |
| `draft_plan.md` | Exists | Human approval gate (do not delete) |
| GitHub `cv-showcase` + Cloudflare project | Manual | Push-to-deploy wiring |
| `DanteEvil.github.io` | Manual later | Unpublish after verification |

---

### Task 1: Repo hygiene — `.gitignore` + PDF rename

**Files:**
- Create: `.gitignore`
- Rename: `ios cv.pdf` → `ios-cv.pdf`
- Modify: none required in HTML if PDF is not linked (verify with search; update any hits)

**Interfaces:**
- Consumes: existing PDF file named `ios cv.pdf`
- Produces: `ios-cv.pdf` at repo root; `.gitignore` patterns listed below

- [ ] **Step 1: Create `.gitignore`**

```gitignore
.DS_Store
.claude/
.cursor/
*.local.json
node_modules/
```

- [ ] **Step 2: Rename the PDF**

```bash
cd "/Users/truonglnq/Documents/works/Freelance/CV-showcase"
mv "ios cv.pdf" ios-cv.pdf
```

- [ ] **Step 3: Search for old PDF references and update**

```bash
rg -n "ios cv\.pdf|ios%20cv\.pdf" .
```

Expected: hits only in old docs until Task 4 rewrites `DEPLOY.md`. If any HTML/JS references exist, change them to `ios-cv.pdf`.

- [ ] **Step 4: Verify rename**

```bash
ls -la ios-cv.pdf
test ! -f "ios cv.pdf"
```

Expected: `ios-cv.pdf` exists; old name gone.

---

### Task 2: LinkedIn paste-kit generator (TDD)

**Files:**
- Create: `tests/fixtures/sample-index.html`
- Create: `tests/generate-linkedin-paste.test.mjs`
- Create: `scripts/generate-linkedin-paste.mjs`
- Create: `linkedin-paste.md` (generated from real `index.html` at end of task)

**Interfaces:**
- Consumes: HTML file path containing `var DATA = { ... };` and a print About `<p>` inside `.print-cv` (or fixture equivalent with `id="about-text"` / first print summary paragraph)
- Produces:
  - `extractDataObject(html: string): object` — parses `DATA` JS object literal
  - `extractAbout(html: string): string` — About/summary text
  - `formatLinkedInPaste({ about, jobs }): string` — markdown/plain paste body
  - `main(argv): void` — CLI writes output file
  - CLI: `node scripts/generate-linkedin-paste.mjs [inputHtml] [outputMd]`  
    Defaults: `index.html`, `linkedin-paste.md`

- [ ] **Step 1: Write the fixture**

Create `tests/fixtures/sample-index.html`:

```html
<!DOCTYPE html>
<html lang="en">
<body>
  <div class="print-cv">
    <p id="print-about">Senior engineer summary for LinkedIn about section.</p>
  </div>
  <script>
  (function () {
    var DATA = {
      jobs: [
        {
          org: 'Acme',
          title: 'Engineer',
          date: '2020 — Present',
          points: ['Shipped feature A.', 'Led team of 3.']
        },
        {
          org: 'Beta Co',
          title: 'Developer',
          date: '2018 — 2020',
          points: ['Built iOS app.']
        }
      ],
      projects: [],
      other: [],
      skills: []
    };
  })();
  </script>
</body>
</html>
```

- [ ] **Step 2: Write the failing test**

Create `tests/generate-linkedin-paste.test.mjs`:

```js
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  extractAbout,
  extractDataObject,
  formatLinkedInPaste,
  writePasteFile,
} from '../scripts/generate-linkedin-paste.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const fixture = fs.readFileSync(
  path.join(__dirname, 'fixtures', 'sample-index.html'),
  'utf8',
);

const data = extractDataObject(fixture);
assert.equal(data.jobs.length, 2);
assert.equal(data.jobs[0].org, 'Acme');

const about = extractAbout(fixture);
assert.match(about, /Senior engineer summary/);

const body = formatLinkedInPaste({ about, jobs: data.jobs });
assert.match(body, /## About/);
assert.match(body, /### Engineer @ Acme/);
assert.match(body, /2020 — Present/);
assert.match(body, /Shipped feature A/);
assert.match(body, /### Developer @ Beta Co/);

const tmp = path.join(os.tmpdir(), `linkedin-paste-${process.pid}.md`);
writePasteFile(tmp, body);
assert.ok(fs.existsSync(tmp));
assert.match(fs.readFileSync(tmp, 'utf8'), /## About/);
fs.unlinkSync(tmp);

console.log('ok - generate-linkedin-paste');
```

- [ ] **Step 3: Run test to verify it fails**

```bash
cd "/Users/truonglnq/Documents/works/Freelance/CV-showcase"
node tests/generate-linkedin-paste.test.mjs
```

Expected: FAIL with module-not-found or export-not-found for `../scripts/generate-linkedin-paste.mjs`.

- [ ] **Step 4: Implement `scripts/generate-linkedin-paste.mjs`**

```js
/**
 * Generates LinkedIn paste-ready markdown from the CV showcase HTML.
 * Extracts `var DATA = {...}` and the print About paragraph.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

/**
 * Locates and evaluates the DATA object literal from HTML source.
 * @param {string} html
 * @returns {object}
 */
export function extractDataObject(html) {
  const marker = 'var DATA = ';
  const start = html.indexOf(marker);
  if (start === -1) {
    throw new Error('DATA object not found in HTML');
  }
  let i = start + marker.length;
  while (i < html.length && /\s/.test(html[i])) i++;
  if (html[i] !== '{') {
    throw new Error('DATA object does not start with {');
  }
  let depth = 0;
  let inString = false;
  let quote = '';
  let escaped = false;
  const from = i;
  for (; i < html.length; i++) {
    const ch = html[i];
    if (inString) {
      if (escaped) {
        escaped = false;
        continue;
      }
      if (ch === '\\') {
        escaped = true;
        continue;
      }
      if (ch === quote) inString = false;
      continue;
    }
    if (ch === '"' || ch === "'" || ch === '`') {
      inString = true;
      quote = ch;
      continue;
    }
    if (ch === '{') depth++;
    else if (ch === '}') {
      depth--;
      if (depth === 0) {
        const literal = html.slice(from, i + 1);
        // eslint-disable-next-line no-new-func
        return Function(`"use strict"; return (${literal});`)();
      }
    }
  }
  throw new Error('Unclosed DATA object');
}

/**
 * Extracts About/summary text from print CV markup.
 * Prefers #print-about, else first <p> inside .print-cv.
 * @param {string} html
 * @returns {string}
 */
export function extractAbout(html) {
  const idMatch = html.match(
    /id=["']print-about["'][^>]*>([\s\S]*?)<\/p>/i,
  );
  if (idMatch) return decodeBasicEntities(stripTags(idMatch[1]).trim());

  const blockMatch = html.match(
    /class=["'][^"']*print-cv[^"']*["'][\s\S]*?<p[^>]*>([\s\S]*?)<\/p>/i,
  );
  if (blockMatch) return decodeBasicEntities(stripTags(blockMatch[1]).trim());

  throw new Error('About paragraph not found');
}

function stripTags(s) {
  return s.replace(/<[^>]+>/g, '');
}

function decodeBasicEntities(s) {
  return s
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ');
}

/**
 * Formats LinkedIn-ready markdown.
 * @param {{ about: string, jobs: Array<{org:string,title:string,date:string,points:string[]}> }} input
 * @returns {string}
 */
export function formatLinkedInPaste({ about, jobs }) {
  const lines = [
    '# LinkedIn paste kit',
    '',
    '_Generated from CV-showcase. Paste sections into LinkedIn manually. Repo is source of truth._',
    '',
    '## About',
    '',
    about,
    '',
    '## Experience',
    '',
  ];
  for (const job of jobs) {
    lines.push(`### ${job.title} @ ${job.org}`);
    lines.push('');
    lines.push(job.date);
    lines.push('');
    for (const point of job.points || []) {
      lines.push(`- ${point}`);
    }
    lines.push('');
  }
  lines.push('## Checklist');
  lines.push('');
  lines.push('- [ ] Update LinkedIn About if summary changed');
  lines.push('- [ ] Update each Experience role that changed');
  lines.push('- [ ] Confirm Website / Featured points at the live Cloudflare URL');
  lines.push('');
  return lines.join('\n');
}

/**
 * Writes paste markdown to disk.
 * @param {string} outPath
 * @param {string} body
 */
export function writePasteFile(outPath, body) {
  fs.mkdirSync(path.dirname(path.resolve(outPath)), { recursive: true });
  fs.writeFileSync(outPath, body, 'utf8');
}

/**
 * CLI entry when run directly.
 * @param {string[]} argv
 */
export function main(argv = process.argv.slice(2)) {
  const input = argv[0] || 'index.html';
  const output = argv[1] || 'linkedin-paste.md';
  const html = fs.readFileSync(input, 'utf8');
  const data = extractDataObject(html);
  const about = extractAbout(html);
  const body = formatLinkedInPaste({ about, jobs: data.jobs || [] });
  writePasteFile(output, body);
  console.log(`Wrote ${output}`);
}

const isMain =
  process.argv[1] &&
  path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);

if (isMain) {
  main();
}
```

- [ ] **Step 5: Add `id="print-about"` to the real print About `<p>` in `index.html`**

Find the print summary paragraph (the long `<p>` under the print header contact line) and add `id="print-about"` so extraction is stable:

```html
<p id="print-about" style="margin:0 0 16px;color:#33404a">Senior iOS developer and team lead with over a decade building reliable, user-centric mobile products — owning architecture, code quality, and the developers who ship them. Since July 2026 a freelance full-stack engineer building XPOS, a multi-tenant POS platform on NestJS, PostgreSQL, Flutter and Nuxt, delivered through agentic AI workflows in Claude Code.</p>
```

- [ ] **Step 6: Run tests to verify they pass**

```bash
node tests/generate-linkedin-paste.test.mjs
```

Expected: `ok - generate-linkedin-paste`

- [ ] **Step 7: Generate real paste file**

```bash
node scripts/generate-linkedin-paste.mjs index.html linkedin-paste.md
head -n 40 linkedin-paste.md
```

Expected: file contains About text and job headings matching `DATA.jobs` (XPOS, Neo Consulting, Ekino, Global CyberSoft).

---

### Task 3: Rewrite `DEPLOY.md`

**Files:**
- Modify: `DEPLOY.md` (full rewrite)

**Interfaces:**
- Consumes: decisions from the design spec
- Produces: operator-facing guide covering GitHub, Cloudflare Pages, paste kit, domain later, cutover

- [ ] **Step 1: Replace `DEPLOY.md` contents** with a Cloudflare-first guide that includes:

  1. Prerequisites: GitHub account, Cloudflare account (free), Node (for paste kit only), `gh` optional  
  2. Files published: `index.html`, `le-ngo-quang-truong-cv.html`, `ios-cv.pdf`  
  3. Init git + `.gitignore` + first commit commands (paths for this machine)  
  4. Create public repo `cv-showcase` under `DanteEvil` (or chosen account) and push `main`  
  5. Cloudflare Pages: Create project → Connect GitHub → select repo → Framework preset None → Build command empty → Output directory `/` → Production branch `main`  
  6. Verify checklist (anchors, print CV, PDF, LinkedIn link, mobile)  
  7. Day-to-day: edit → commit → push → live in ~1–2 minutes  
  8. LinkedIn: set Website/Featured to Pages URL; run `node scripts/generate-linkedin-paste.mjs` and paste when Experience/About change  
  9. Custom domain later: Cloudflare Registrar preferred; Pages → Custom domains; no code change  
  10. Cutover: update LinkedIn + other links **then** unpublish/delete `DanteEvil.github.io`  
  11. Note that GitHub Pages is no longer the primary path  

- [ ] **Step 2: Skim for leftover `github.io/cv-showcase` as primary instructions**

```bash
rg -n "GitHub Pages|github\.io/cv-showcase" DEPLOY.md
```

Expected: only historical/cutover mentions, not primary setup.

---

### Task 4: GitHub repo + Cloudflare Pages (manual guided)

**Files:**
- None in tree beyond git metadata

**Interfaces:**
- Consumes: local files ready to publish
- Produces: remote `https://github.com/DanteEvil/cv-showcase` (or confirmed name) and a Cloudflare Pages project URL `https://<name>.pages.dev`

- [ ] **Step 1: Init git if missing**

```bash
cd "/Users/truonglnq/Documents/works/Freelance/CV-showcase"
git init
git branch -M main
```

- [ ] **Step 2: Stage and commit** (only when user has approved committing / execution)

```bash
git add .gitignore ios-cv.pdf index.html le-ngo-quang-truong-cv.html \
  scripts/generate-linkedin-paste.mjs tests linkedin-paste.md DEPLOY.md \
  draft_plan.md docs DESIGN.md design-brief.md
git status
git commit -m "$(cat <<'EOF'
Add CV showcase with Cloudflare deploy docs and LinkedIn paste kit.

EOF
)"
```

- [ ] **Step 3: Create GitHub repo and push**

```bash
gh repo create DanteEvil/cv-showcase --public --source=. --remote=origin --push
```

If `gh` is unavailable, create via github.com/new and:

```bash
git remote add origin https://github.com/DanteEvil/cv-showcase.git
git push -u origin main
```

- [ ] **Step 4: Create Cloudflare Pages project (UI)**

  - dash.cloudflare.com → Workers & Pages → Create → Pages → Connect to Git  
  - Repository: `cv-showcase`  
  - Framework preset: None  
  - Build command: *(empty)*  
  - Build output directory: `/`  
  - Root directory: `/`  
  - Production branch: `main`  
  - Save and deploy  

- [ ] **Step 5: Record live URL** in the session notes / tell the user the `*.pages.dev` URL from the Cloudflare dashboard.

- [ ] **Step 6: Smoke-test live site**

  - [ ] HTTPS loads  
  - [ ] Skills / Experience / Work / Contact anchors  
  - [ ] Get CV / print  
  - [ ] `/ios-cv.pdf` downloads  
  - [ ] LinkedIn outbound link  
  - [ ] Narrow viewport  

---

### Task 5: Cutover from `DanteEvil.github.io`

**Files:**
- External: LinkedIn profile settings; `DanteEvil.github.io` GitHub repo Pages settings

**Interfaces:**
- Consumes: verified Cloudflare URL from Task 4  
- Produces: single canonical CV URL; old user site unpublished

- [ ] **Step 1: Update LinkedIn**

  - Website and/or Featured → Cloudflare Pages URL  
  - Paste About/Experience from `linkedin-paste.md` where needed  

- [ ] **Step 2: Search personal uses of old URL** (email signature, README, applications) and update.

- [ ] **Step 3: Unpublish GitHub Pages on `DanteEvil.github.io`**

  - Repo Settings → Pages → Remove / Disable pages  
  - Or delete the repository if the user confirms deletion  

- [ ] **Step 4: Confirm old URL no longer serves the CV**

```bash
curl -sI https://danteevil.github.io | head -n 5
```

Expected: non-200 for the old site content (404 or disabled), while Cloudflare URL still 200.

---

## Self-review vs spec

| Spec requirement | Task |
|------------------|------|
| Cloudflare Pages Git deploy, no build | Task 4 |
| `*.pages.dev` first; domain later docs | Tasks 3–4 |
| LinkedIn L3 + L1 paste kit | Tasks 2, 5 |
| No LinkedIn API/automation | Global + Task 2 out of scope |
| `.gitignore` | Task 1 |
| Rewrite `DEPLOY.md` | Task 3 |
| PDF rename `ios-cv.pdf` | Task 1 |
| Unpublish `DanteEvil.github.io` after verify | Task 5 |
| Keep `DATA` in `index.html` | Task 2 (extract only) |

Placeholder scan: none intentional.  
Type consistency: `extractDataObject`, `extractAbout`, `formatLinkedInPaste`, `writePasteFile`, `main` used consistently in tests and implementation steps.
