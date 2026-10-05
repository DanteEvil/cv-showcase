# Design Brief — CV Showcase Website

**Client:** Le Ngo Quang Truong — Senior iOS Developer / iOS Team Lead
**Project:** Personal CV & portfolio showcase site
**Date:** June 18, 2026
**Prepared by:** Cowork

---

## 1. Objective

Build a single-page personal showcase site that makes a senior iOS engineer and team lead look unmistakably world-class within the first five seconds. The site must feel like a polished product, not a résumé — smooth, intentional motion, zero clutter, and a clear sense of craft. The "wow" comes from restraint plus precision: every animation has a purpose, nothing is gratuitous, and the whole thing runs at a buttery 60fps.

## 2. Audience & Goals

The site serves two audiences at once. **Hiring managers and recruiters** need to assess credibility and scan experience fast — they skim, they're on mobile half the time, and they decide quickly. **Freelance clients** need to see proof of outcomes and an easy way to make contact. The design satisfies both by leading with a confident hero and a credibility strip, keeping content scannable, and placing a persistent, low-friction contact path throughout.

Success looks like: a visitor lands, is impressed within seconds, scrolls the whole page because the motion invites it, and leaves having either noted the experience or clicked to contact.

## 3. Visual Direction — "Sleek Dark / Tech"

The aesthetic is dark, modern, and developer-forward without tipping into gamer-RGB territory. Think the polish of a premium SaaS landing page crossed with a developer's attention to detail.

**Mood:** confident, precise, quietly premium. Deep near-black canvas, a single cool accent, generous negative space, and crisp typography do the heavy lifting. Color is used sparingly so that when it appears — on a hover, an active link, a key metric — it lands.

**Color palette (proposed):**

| Role | Value | Use |
|---|---|---|
| Canvas | `#0B0F14` | Page background |
| Surface | `#141A22` | Cards, panels |
| Accent | `#38BDF8` → `#818CF8` gradient | CTAs, highlights, active states |
| Text primary | `#E8EDF2` | Headlines, body |
| Text muted | `#8A97A6` | Secondary text, labels |
| Hairline | `rgba(255,255,255,.08)` | Borders, dividers |

A subtle accent gradient (sky-blue into indigo) appears only on interactive and emphasis elements — never as large filled blocks. Optional soft glow behind the hero name and key cards adds depth without noise.

**Typography:** a clean geometric sans for everything (e.g., Inter or General Sans) with a tight, large display weight for the hero. A monospace face (e.g., JetBrains Mono) for small accents — section labels, the tech-stack chips, metrics — to reinforce the engineering identity. Strong hierarchy: an oversized hero headline, clear section labels in mono uppercase with letter-spacing, comfortable body measure.

**Texture & depth:** a faint dot-grid or noise overlay on the canvas, soft layered shadows on surfaces, and thin gradient hairlines. Glassmorphism used lightly on the floating nav and a few key cards — blur plus a 1px translucent border — for a tactile, layered feel.

## 4. Page Structure

A long-scroll single page with anchored navigation. Sections in order:

**Hero** — Name in oversized display type with a gradient sweep, role and one-line positioning statement beneath, and two CTAs (View Work / Contact). A subtle animated background — drifting particles, a slow gradient mesh, or an animated grid — sits behind, low-contrast so text stays crisp. The hero sets the entire tone, so it gets the most motion budget.

**Credibility strip** — A thin band of animated metrics that count up on entry: years of experience (10+), apps shipped, team size led, markets delivered to. This is the five-second proof for recruiters.

**About / Profile** — The rewritten profile paragraph, set in a comfortable measure, with the AI-augmented-development line given subtle emphasis.

**Experience** — A vertical timeline (Neo Consulting → Ekino → Global CyberSoft) where each entry reveals on scroll. The active node and connecting line animate as the user passes.

**Featured Projects** — A responsive grid of project cards (NEO Core, Fitness Companion, Henner, Spacetime Capsule, Healthcare-Locator SDK, Goo). Cards have a tasteful hover state — lift, glow, accent border — and link out where a live link exists. This section carries the freelance-client weight.

**Skills** — Grouped chips (languages, frameworks, tools, AI-augmented development, additional) that stagger in. Optional subtle proficiency indicator.

**Other Projects** — A compact, scannable grid for breadth.

**Contact / CTA** — A bold closing section with email, LinkedIn, and a clear call to action. The persistent contact path resolves here.

A floating glass nav stays accessible while scrolling, highlighting the current section.

## 5. Motion & Animation Spec

Motion is the centerpiece, but the guiding rule is **purposeful, not decorative**. Every animation either guides attention, communicates structure, or rewards interaction. Timing is quick and confident — most transitions land in 200–600ms with eased curves (`cubic-bezier(.22,1,.36,1)` for entrances). Nothing bounces excessively; the feel is refined, not springy-cartoonish.

**Entrance choreography.** As the page loads, the hero elements stagger in — headline, then subtitle, then CTAs — over roughly 800ms total. This single sequence is what creates the first "wow."

**Scroll-triggered reveals.** Sections and cards fade and translate up subtly (16–24px) as they enter the viewport, using an IntersectionObserver. Staggered children (timeline entries, skill chips, project cards) cascade with ~60–80ms offsets so groups feel alive rather than popping in at once. Everything animates only once on first reveal.

**Hero background.** A continuous, low-intensity ambient animation — drifting particles, an animated gradient mesh, or a parallax grid that responds gently to cursor movement. Kept subtle so it never competes with text.

**Micro-interactions.** Buttons and links have smooth hover/focus states with accent glow and slight scale. Project cards lift and reveal an accent border on hover. The metrics count up when scrolled into view. The nav indicator slides smoothly between sections. Cursor-aware tilt on project cards is optional and should be kept very subtle.

**Performance & polish.** Animate only `transform` and `opacity` for 60fps; avoid layout-triggering properties. Respect `prefers-reduced-motion` — disable non-essential motion for accessibility. The site must feel just as smooth on a mid-range phone as on desktop.

## 6. Responsiveness & Accessibility

Mobile-first and fully responsive — the timeline collapses to a single column, the project grid reflows, type scales fluidly with `clamp()`, and touch targets stay comfortable. Maintain WCAG AA contrast (the muted text and accent values above are chosen with this in mind), provide keyboard-navigable focus states, honor reduced-motion preferences, and keep all imagery and icons labeled. Target sub-second first paint by keeping the build lean and self-contained.

## 7. Technical Approach

**Single self-contained HTML file** — vanilla JavaScript plus CSS for all animation, no build step, trivially hostable (GitHub Pages, Netlify drop, or any static host) and easy to hand off. CSS transitions and keyframes handle most motion; IntersectionObserver drives scroll reveals; `requestAnimationFrame` powers the counters and any ambient background. Fonts loaded from a CDN (Google Fonts / Fontshare). No external animation library required, keeping the file light and fast — though a single small library (e.g., a tiny scroll-reveal or GSAP via CDN) can be added if richer choreography is wanted later.

## 8. Deliverable & Success Criteria

A single `index.html` file, production-ready, containing all markup, styles, scripts, and content. It is considered successful when it loads in under a second, runs all motion at a smooth 60fps on mobile and desktop, reads cleanly with reduced motion enabled, communicates seniority and credibility within five seconds, and gives both recruiters and prospective clients an obvious, frictionless way to make contact.

---

*Next step: on approval of this direction, build the `index.html` from the existing CV content.*
