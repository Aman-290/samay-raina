# Samay Raina: The Jail Break — Design Spec

**Project:** Brokai Labs Friday Giveback Series — Episode 4
**Author:** Nand Dave, Founder
**Date:** April 9, 2026
**Status:** Approved for Development
**Target Launch:** Friday, April 2026

---

## 1. Overview

Single-page, scroll-driven tribute website mapping Samay Raina's life through a prison break metaphor. The user journey starts confined (dark, narrow, barred) and ends liberated (wide, green, loud). 7 sections, 3 interactive components, 4 easter eggs.

### Success Metrics

- LCP < 2.5s, CLS < 0.1, FID < 100ms
- All 3 interactive components functional on desktop & mobile
- Scroll-driven animations at 60fps on mid-range devices (iPhone 12+)
- OG tags render correctly on LinkedIn, X, Instagram

---

## 2. Architecture

**Approach:** Monolithic single page. All 7 sections rendered in `page.tsx`, each as a separate component. Single continuous scroll context for GSAP ScrollTrigger.

### Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router) |
| Styling | Tailwind CSS + CSS Variables |
| Scroll Engine | GSAP + ScrollTrigger |
| Smooth Scroll | Lenis |
| Chess Puzzle | chess.js + react-chessboard |
| Audio | Howler.js (dynamic import) |
| Number Animation | CountUp.js |
| Fonts | Google Fonts via next/font (Anton, Space Mono, DM Sans, Caveat) |
| Hosting | Vercel |

### Project Structure

```
/app
  page.tsx              ← Single-page layout, renders all sections
  layout.tsx            ← Metadata, OG tags, font loading
  globals.css           ← CSS variables, Tailwind config, textures
/components
  Hero.tsx              ← Cell section, bar-breaking scroll animation
  Kashmir.tsx           ← Displacement origin story
  ChessYard.tsx         ← Chess era + interactive puzzle
  LatentRiot.tsx        ← IGL + Latent Evaluator game
  SolitaryFIR.tsx       ← FIR slider + viewport narrowing
  StillAlive.tsx        ← Comeback + kinetic stats
  Wall.tsx              ← Community tributes + footer
  SurveillanceCam.tsx   ← Persistent top-right timestamp
  SoundToggle.tsx       ← Persistent top-left mute/unmute
  ChessPuzzle.tsx       ← react-chessboard + chess.js (dynamic import)
  LatentEvaluator.tsx   ← YouTube embed + sliders
  FIRSlider.tsx         ← 99% germ filtration slider
  FIRModal.tsx          ← Full-screen FIR legal document modal
  FatherMother.tsx      ← Split-screen comparison
  KineticStats.tsx      ← CountUp stat blocks
  EasterEggs.tsx        ← Konami code, knight cursor, FIR tally
/lib
  gsap-setup.ts         ← GSAP + ScrollTrigger + Lenis integration
  chess-puzzles.ts      ← 3 puzzle positions (FEN + solutions)
  content.ts            ← All text content, quotes, stats
  audio.ts              ← Howler.js wrapper (dynamic import)
/public
  /fonts/               ← Self-hosted font files (fallback)
  /audio/               ← metallic-groan.mp3, clank.mp3, roast-clip.mp3
  /images/              ← samay-hero.webp, og-image.jpg, noise-texture.png
```

### Dynamic Imports

chess.js, react-chessboard, and Howler.js are dynamically imported inside their respective components. They load on user interaction or when scrolled into view, not at page mount. This keeps the initial JS bundle lean while maintaining a single scroll context.

---

## 3. Animation & Motion System

**Priority: Smooth, 60fps animations throughout. Every transition must feel intentional and polished.**

### Core Principles

1. **GPU-only transforms:** All scroll-linked animations use `transform` (translate, rotate, scale) and `opacity` only. No `width`, `height`, `top`, `left`, `margin`, or `padding` animations that trigger layout.
2. **Exception — viewport narrowing (Section 5):** `max-width` and `padding` animate via GSAP with `scrub: 1`. This is a deliberate layout animation for the suffocation effect. Acceptable because content is simple text at this point and we use `will-change: max-width, padding` to hint the browser.
3. **Easing curves:** `power2.inOut` as default for scroll-scrubbed animations. `power3.out` for triggered reveals. `elastic.out(1, 0.3)` for playful feedback (confetti, stats pulse).
4. **Lenis + GSAP sync:** Lenis handles smooth scroll. Its `raf` callback feeds into `gsap.ticker` so ScrollTrigger gets smooth, interpolated scroll values instead of janky native scroll events.
5. **Frame budget:** Target 16ms per frame. No animation should cause layout thrashing or forced reflow.
6. **Reduced motion:** Respect `prefers-reduced-motion: reduce`. Disable scroll-linked animations, remove parallax, keep fade-ins as instant opacity changes.

### Section-by-Section Animation Specs

#### Hero (The Cell) — Pinned Bar Breaking

| Property | Value |
|----------|-------|
| ScrollTrigger pin | 150vh scroll distance |
| Bar rotation | `rotateY(0deg → 90deg)` per bar |
| Stagger | Center bars first, `distFromCenter * 0.4s` delay for outer bars |
| Portrait | `filter: brightness(0.4) saturate(0.4)` → `brightness(1) saturate(1)` |
| Background | `#0A0A0A` → `#1C1C1E` crossfade via opacity layer |
| Scrub | `scrub: 1` (1:1 scroll-to-animation mapping) |
| Mobile | Reduce 12 bars to 7 |

#### Kashmir (Displacement)

| Property | Value |
|----------|-------|
| Paragraph reveal | `opacity: 0 → 1`, `y: 20px → 0`, stagger 0.2s |
| Fog background | CSS `@keyframes` slow horizontal drift, no GSAP needed |
| Trigger | `start: "top 80%"` per paragraph |
| Easing | `power2.out` |

#### Chess Yard

| Property | Value |
|----------|-------|
| Grid appearance | 8x8 grid fades in at `opacity: 0 → 0.06` over 0.8s |
| Content reveal | Same paragraph stagger as Kashmir |
| Chess puzzle | Fade in on IntersectionObserver, no scroll-link |
| Knight cursor (easter egg) | `requestAnimationFrame` loop, CSS `transform: translate()` follows mouse with 0.1 lerp factor for smoothness |

#### IGL Riot

| Property | Value |
|----------|-------|
| Background hue | `hue-rotate(0deg → 20deg)` cycling CSS animation, 8s duration |
| Noise texture | Static CSS `background-image`, no animation |
| Content reveal | `opacity: 0 → 1`, `y: 30px → 0`, stagger 0.15s |
| Evaluator | No scroll-link — pure interaction-driven |

#### Solitary FIR (Signature UX)

| Property | Value |
|----------|-------|
| Viewport narrowing | `max-width: 900px → 520px`, `padding: 0 20px → 0 40px` |
| Scroll distance | 200vh, `scrub: 1` |
| 99% Slider degradation | CSS classes toggled at thresholds (75%, 50%, 25%, 1%) |
| Glitch effect (75%) | Random `translateX` jitter via CSS `@keyframes`, ±3px |
| Cracks (50%) | SVG overlay fades in, `opacity: 0 → 0.3` |
| Static (25%) | Audio static via Howler, volume ramps `0 → 0.3` |
| FIR modal (1%) | Full-screen flash red (100ms), modal slides in `scale(0.95) → scale(1)` with `power3.out` |
| Father/Mother de-blur | Mother side: `filter: blur(4px → 0px)` scrubbed to scroll |

#### Still Alive (Cathartic Release)

| Property | Value |
|----------|-------|
| Viewport expansion | `max-width: 520px → 1200px`, reverse of Section 5 |
| Background green | Radial gradient `opacity: 0 → 0.85` from center outward |
| Broken bars | Static positioned divs at random rotations, no animation |
| Stats CountUp | Triggered by IntersectionObserver, duration 2.5s, `power2.out` easing |
| Stats pulse | CSS `@keyframes` scale 1.0 → 1.02 → 1.0, 2s infinite, `ease-in-out` |
| Quote fade | `opacity: 0 → 1`, 2s, `power2.inOut` |

#### The Wall

| Property | Value |
|----------|-------|
| Card entrance | Stagger `opacity: 0 → 1`, `y: 40px → 0`, `rotation` to final angle, 0.3s stagger |
| Trigger | `start: "top 70%"` |
| Footer | Simple `opacity: 0 → 1`, 1s delay after cards |

### Transition Between Sections

Sections flow via natural scroll. Color transitions between sections use overlapping gradient layers (not abrupt cuts):

- Hero → Kashmir: `#0A0A0A` stays (same dark)
- Kashmir → Chess Yard: `#0A0A0A` → `#141416` (subtle shift via 200px gradient overlap)
- Chess Yard → IGL Riot: `#141416` stays, hue-rotate kicks in
- IGL Riot → Solitary FIR: Background snaps to pure `#0A0A0A`, viewport starts narrowing
- Solitary FIR → Still Alive: `#0A0A0A` → radial `#00E676` bloom, viewport expands (most dramatic)
- Still Alive → The Wall: Green fades, returns to `#0A0A0A`

---

## 4. Design System

### Colors

```css
:root {
  --bg-cell: #0A0A0A;
  --bg-concrete: #1C1C1E;
  --bg-yard: #141416;
  --text-chalk: #E8E4DF;
  --text-dim: #6B6B6F;
  --accent-alarm: #FF3D00;
  --accent-alive: #00E676;
  --accent-gold: #FFD54F;
  --bar-steel: #3A3A3C;
  --scratch-white: #FFFFFF;
}
```

### Typography

| Element | Font | Desktop | Mobile | Weight |
|---------|------|---------|--------|--------|
| Hero name | Anton | 120px | 56px | 400 |
| Section headers | Space Mono | 14px | 12px | 700 |
| Body text | DM Sans | 18px | 16px | 400 |
| Quotes | Caveat | 28px | 22px | 400 |
| Stats/numbers | Anton | 72px | 48px | 400 |

### Visual Motifs

- **Steel bars:** 6px wide divs, 100vh tall, CSS Grid with 60px gaps
- **Tally marks:** `|||||` as section counters (Space Mono)
- **Concrete texture:** SVG `feTurbulence` overlay at 3-5% opacity
- **Surveillance timestamp:** Fixed top-right, Space Mono 10px, `CAM 04 — REC ● — [live time]`
- **Redacted text:** `background: white; color: white;` on hover reveals text
- **Cell door plates:** 280x60px, 2px border with steel gradient background

### Responsive

- Breakpoint: 768px (mobile/desktop)
- Hero bars: 12 → 7 on mobile
- Latent Evaluator: 2-column → stacked on mobile
- Father/Mother: 50/50 grid → stacked on mobile
- Stats: 2x2 grid → single column on mobile
- Min font size: 16px on mobile (no zoom issues)

---

## 5. Section Specifications

### Section 1: The Cell (Hero)

Full viewport, pinned. 12 vertical steel bars over a desaturated Samay portrait. "SAMAY RAINA" in Anton 120px. Subtitle: "Comedian. Chess Evangelist. Controversy Survivor. Still Alive." in Space Mono. Scroll indicator pulsing at bottom.

On scroll (150vh pinned): bars rotateY with center-first stagger, portrait brightens/saturates, background crossfades. Optional metallic groan audio (looping, 0.15 volume) when scroll begins, sharp clank when last bar clears.

Sound muted by default. Speaker icon toggle top-left.

### Section 2: Prisoner #1 — The Displacement

Full width, max-width 720px centered. Cell door plate header. Content: Kashmir displacement, refugee camps, bullying, chess discovery. Paragraphs fade in one-by-one on scroll. Slow fog/smoke CSS animation in background. Mother quote in Caveat at -1deg rotation.

### Section 3: The Yard — Chess Era

Isometric 8x8 chessboard grid at 6% opacity behind content. Gold accent (`#FFD54F`) for headers and quotes. Content: COVID lockdown, first stream, J&K Gambit, collaborators, chess stats.

**Interactive: Chess Puzzle.** react-chessboard 320x320px + chess.js. 3 sequential puzzles (mate-in-1, 2-move, 3-move). Well-known positions. Correct move → confetti + "Samay would be proud." Wrong move → Samay roast audio + "Bhai, phir se try kar." On mobile, react-chessboard supports touch drag natively. Board scales to container width (max 320px). If touch drag proves unreliable on testing, fallback to static board image with multiple-choice move buttons.

### Section 4: The Riot — India's Got Latent

Background hue-rotates subtly, noise texture at 8%, max-width 900px. Alarm red accent. Content: IGL launch, self-rating mechanic, viewership stats, IMDb, app stores, revenue.

**Interactive: The Latent Evaluator.** Two-column layout (stacked mobile). Left: YouTube embed of 15-second IGL audition clip (loops). Right: Two vertical sliders styled as industrial gauges (1–10 each) — "Your score" and "Judges' score." Reveal button shows variance (Δ). Δ=0 → confetti + "You'd win ₹1,00,000!" Δ=1 → "So close." Δ>2 → Samay roast audio + "Zero self-awareness."

### Section 5: Solitary — The FIR (Emotional Climax)

Pure `#0A0A0A`. Content max-width shrinks 900px → 520px over 200vh scroll. Padding increases. Text feels cramped, suffocating.

Content: Bonus Episode 6, clips escape paywall, FIRs across states, BNS sections, NCW summons, Parliament, death threats, editor arrested.

**Interactive 1: 99% Germ Slider.** Horizontal slider: "CONTENT FILTRATION: 100% → 0%." Progressive degradation: 75% glitch text, 50% SVG cracks, 25% audio static, 1% full-screen red flash + FIR modal. Modal is monospace legal formatting, un-closable except via "DISMISS FIR" button (z-index: 9999). Quote: "I had killed 99% of the germs..."

**Interactive 2: Father vs Mother Split-Screen.** CSS Grid 50/50 (stacked mobile). Left (Mother): warm sepia tones, blurred, de-blurs on scroll. Right (Father): cold B&W, always sharp. Visual thesis: internet trauma is violent but temporary; generational trauma is permanent but quiet.

### Section 6: The Break — Still Alive

Viewport expands 520px → 1200px. Background transitions `#0A0A0A` → `#00E676` radial from center. Broken steel bars as floor texture (bent, 10% opacity) at top.

Content: August 15 comeback, ticket sales, Still Alive tour, MSG, YouTube special.

**Kinetic Stats:** CountUp.js + IntersectionObserver. Anton 72px (48px mobile), green. 300,000+ tickets, 11M views in 24hrs, 28 years at MSG, 40K tickets in first hour. Pulse animation on each stat block.

Closing quote: "Hum Kashmiri crossfire mein hi marte hain." Caveat 32px, centered, 2s fade-in.

### Section 7: The Wall — Community & Credits

Scattered layout (not grid). 10-15 fan/community quote cards at random angles (-3deg to 4deg), 200-300px wide. Caveat font. Cards stagger in on scroll.

Final tribute in Caveat 28px, alarm red: "Samay — you showed us that the bars are temporary. The bakchod is permanent."

Brokai Labs credit. Optional "Who should Episode 5 be? →" link.

---

## 6. Easter Eggs

1. **Konami Code:** Type 'BAKCHOD' anywhere → site colors invert to IGL branding. Key listener on `document`.
2. **FIR Tally:** Hidden element (hover or click to reveal): "Days since last FIR: [days calculated from Feb 8, 2025]."
3. **Knight Cursor:** Chess knight SVG follows cursor on desktop in Chess Yard section only. `requestAnimationFrame` + lerp for smooth following.
4. **Birthday Timestamp:** Hover surveillance camera 3s → timestamp rewinds to `OCT 26, 1997 — 00:00:00`. Returns to live time on mouse leave.

---

## 7. Global Persistent Elements

- **Surveillance Cam:** Fixed top-right. Space Mono 10px. `CAM 04 — REC ● — [HH:MM:SS]`. Updates every second. Red dot pulses.
- **Sound Toggle:** Fixed top-left. Speaker icon. Muted by default. Controls all Howler.js audio globally.
- **Concrete Texture:** SVG feTurbulence overlay across entire page, 3-5% opacity. Applied via `::before` pseudo-element on body.

---

## 8. Audio Design

All audio muted by default. User must click sound toggle to enable.

| Sound | Trigger | Duration | Volume | Source |
|-------|---------|----------|--------|--------|
| Metallic groan | Hero scroll begins | 2s loop | 0.15 | Find/generate — low metallic creak |
| Clank | Last hero bar clears | 0.3s | 0.4 | Find/generate — sharp metal hit |
| Roast clip | Wrong chess move / high Δ evaluator | ~3s | 0.5 | Find Samay roast audio or generate placeholder |
| Audio static | FIR slider at 25% | Loop | 0→0.3 ramp | Generate — white noise |

Audio files will be sourced from free SFX libraries or generated. All < 500KB total.

---

## 9. Metadata & SEO

```
title: "Samay Raina — The Jail Break | A Tribute by Brokai Labs"
description: "From Kashmir to Madison Square Garden. A scroll-driven tribute to India's most uncancellable comedian."
og:image: /images/og-image.jpg (1200x630px)
og:type: website
twitter:card: summary_large_image
```

Domain to be configured after development.

---

## 10. Performance Targets

| Metric | Target | Strategy |
|--------|--------|----------|
| LCP | < 2.5s | Preload hero image, self-host fonts via next/font |
| CLS | < 0.1 | Explicit dimensions on all media, font-display: swap |
| FID | < 100ms | Defer GSAP init to after hydration, dynamic import chess/howler |
| Total JS | < 200KB gzipped | Tree-shake GSAP, code-split interactive components |
| Hero animation | 60fps | GPU transforms only, no layout properties |

---

## 11. Assets Required

| Asset | Status | Action |
|-------|--------|--------|
| Samay portrait photo | Pending from Nand | Required before hero section |
| Domain name | Post-development | Nand configures after build |
| Audio (metallic groan, clank) | To be sourced | Find from free SFX libraries |
| Audio (roast clip) | To be sourced | Find Samay clip or generate placeholder |
| Audio (static noise) | To be generated | White noise generator |
| Chess puzzle FENs | Use well-known positions | 3 classic puzzles (easy/medium/hard) |
| Community quotes | Placeholder for now | Search web or use placeholders |
| IGL audition clip | YouTube embed | Find suitable public IGL clip |
| OG image | To be created | Design 1200x630 card after site is built |

---

## 12. Development Timeline

| Phase | Tasks | Duration |
|-------|-------|----------|
| Day 1 | Project setup, fonts, CSS vars, Lenis + GSAP, hero bar animation, deploy skeleton | Full day |
| Day 2 | Sections 2–4: Kashmir, Chess Yard (puzzle), IGL Riot (Latent Evaluator) | Full day |
| Day 3 | Section 5: FIR (viewport narrowing, slider, split-screen), Section 6: Stats | Full day |
| Day 4 | Section 7, OG tags, mobile testing, performance audit, audio, Easter eggs | Half day + QA |
| Launch | Prod deploy, OG image test, share preview testing | Friday morning |
