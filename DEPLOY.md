# Deploy CV Showcase to GitHub Pages (Free)

This guide walks you through publishing your static CV site online using **GitHub Pages** — free hosting with HTTPS, no build step required.

Your site is a single `index.html` file with inline CSS and JavaScript. GitHub Pages serves it as-is.

---

## What you will get

| Item | Example |
|------|---------|
| Live URL (project site) | `https://YOUR_USERNAME.github.io/cv-showcase/` |
| Cost | Free |
| HTTPS | Automatic |
| Updates | Push to GitHub → site refreshes in ~1 minute |

> **Tip:** If you name the repo `YOUR_USERNAME.github.io` instead of `cv-showcase`, your site lives at `https://YOUR_USERNAME.github.io/` (no subpath). Steps below work for both; only the URL differs.

---

## Prerequisites

- A [GitHub account](https://github.com/signup) (free)
- [Git](https://git-scm.com/downloads) installed on your Mac
- Terminal access

Verify Git is installed:

```bash
git --version
```

---

## Step 1 — Prepare your project folder

Open Terminal and go to your project:

```bash
cd "/Users/neo-truonglnq/Documents/Works/Freelance/CV-showcase"
```

### Files to publish

| File | Purpose |
|------|---------|
| `index.html` | Main CV showcase (required) |
| `le-ngo-quang-truong-cv.html` | Printable CV page (optional) |
| `ios cv.pdf` | PDF download (optional) |

Design docs (`DESIGN.md`, `design-brief.md`) are optional — include them only if you want them in the repo.

### Optional: ignore local/editor files

Create a `.gitignore` so you do not commit editor or OS junk:

```bash
cat > .gitignore << 'EOF'
.DS_Store
.claude/
*.local.json
EOF
```

---

## Step 2 — Initialize Git and make the first commit

Still in the project folder:

```bash
git init
git add index.html le-ngo-quang-truong-cv.html "ios cv.pdf" .gitignore
git commit -m "Add CV showcase site"
```

Add other files if you want them in the repo:

```bash
git add DESIGN.md design-brief.md
git commit -m "Add design docs"
```

---

## Step 3 — Create a GitHub repository

1. Go to [github.com/new](https://github.com/new)
2. **Repository name:** `cv-showcase` (or `YOUR_USERNAME.github.io` for a root URL)
3. **Visibility:** Public (required for free GitHub Pages on personal accounts)
4. **Do not** check “Add a README” — you already have files locally
5. Click **Create repository**

GitHub shows push instructions. Use these (replace `YOUR_USERNAME`):

```bash
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/cv-showcase.git
git push -u origin main
```

When prompted, sign in to GitHub (browser or personal access token).

---

## Step 4 — Enable GitHub Pages

1. Open your repo on GitHub
2. Go to **Settings** → **Pages** (left sidebar)
3. Under **Build and deployment**:
   - **Source:** Deploy from a branch
   - **Branch:** `main` → folder **`/ (root)`**
4. Click **Save**

GitHub builds and deploys your site. Wait 1–3 minutes.

---

## Step 5 — Open your live site

Your site URL:

```
https://YOUR_USERNAME.github.io/cv-showcase/
```

Find the exact link under **Settings → Pages** (“Your site is live at …”).

### Quick checks

- [ ] Homepage loads with animations and styling
- [ ] Nav links (Skills, Experience, Work) scroll correctly
- [ ] **Get CV** print/download works
- [ ] **Contact** mailto link opens your email client
- [ ] LinkedIn link opens in a new tab
- [ ] Site looks good on mobile (resize browser or use phone)

---

## Step 6 — Update the site later

After editing `index.html` (or other files):

```bash
cd "/Users/neo-truonglnq/Documents/Works/Freelance/CV-showcase"
git add .
git commit -m "Update CV content"
git push
```

Changes appear on the live site within about 1 minute. Hard-refresh the browser (`Cmd + Shift + R`) if you still see the old version.

---

## Optional — Custom domain

To use a domain like `truong.dev` instead of `github.io`:

1. Buy a domain (Namecheap, Cloudflare, Google Domains, etc.)
2. In repo **Settings → Pages → Custom domain**, enter your domain (e.g. `www.truong.dev`)
3. At your domain registrar, add DNS records GitHub shows you, typically:
   - **A records** → `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
   - Or **CNAME** → `YOUR_USERNAME.github.io`
4. Enable **Enforce HTTPS** once DNS propagates (can take up to 24 hours)

---

## Optional — Root URL (`username.github.io`)

If you want `https://YOUR_USERNAME.github.io/` with no `/cv-showcase/` path:

1. Create a repo named exactly **`YOUR_USERNAME.github.io`**
2. Push the same files to that repo
3. Enable Pages on `main` / root (same as Step 4)
4. Site is live at `https://YOUR_USERNAME.github.io/`

---

## Troubleshooting

### 404 Page not found

- Confirm Pages is enabled: **Settings → Pages** shows “Your site is live at …”
- Wait 2–5 minutes after the first deploy
- Repo must be **Public** (for free Pages on personal accounts)
- URL must match repo name: `.../cv-showcase/` if the repo is `cv-showcase`

### Site looks unstyled or broken

- Open browser DevTools (F12) → **Console** for errors
- Google Fonts need internet; they load from `fonts.googleapis.com`
- Ensure you pushed `index.html` to the **root** of the repo, not inside a subfolder

### `git push` asks for password and fails

GitHub no longer accepts account passwords for Git over HTTPS. Use either:

- **GitHub CLI:** `brew install gh` then `gh auth login`
- **Personal Access Token:** [GitHub → Settings → Developer settings → Personal access tokens](https://github.com/settings/tokens) — use the token as your password when Git prompts

### PDF or file with spaces in the name

Your file `ios cv.pdf` has a space. Links must use `%20` or quotes:

```
https://YOUR_USERNAME.github.io/cv-showcase/ios%20cv.pdf
```

Consider renaming to `ios-cv.pdf` locally and updating any links for cleaner URLs.

---

## Share your CV

Once live, add the link to:

- LinkedIn **Featured** or **Website** field
- Email signature
- Resume PDF header/footer
- Job applications

Example:

```
Portfolio: https://YOUR_USERNAME.github.io/cv-showcase/
```

---

## Summary checklist

- [ ] Git initialized and first commit created
- [ ] GitHub repo created (public)
- [ ] Code pushed to `main`
- [ ] GitHub Pages enabled (`main` / root)
- [ ] Live URL tested on desktop and mobile
- [ ] Link added to LinkedIn / CV

You are done. Your CV showcase is online for free on GitHub Pages.
