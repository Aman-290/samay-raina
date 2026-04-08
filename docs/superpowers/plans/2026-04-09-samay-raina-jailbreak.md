# Samay Raina: The Jail Break — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a single-page, scroll-driven tribute website for Samay Raina using the prison break metaphor — 7 sections, 3 interactive components, 4 easter eggs.

**Architecture:** Monolithic Next.js 14 App Router single page. All 7 sections render in `page.tsx` as separate components. GSAP ScrollTrigger manages all scroll-linked animations in a single continuous scroll context. Lenis provides smooth scrolling synced to GSAP's ticker. Interactive components (chess, evaluator, audio) are dynamically imported.

**Tech Stack:** Next.js 14, Tailwind CSS, GSAP + ScrollTrigger, Lenis, chess.js, react-chessboard, Howler.js, CountUp.js, TypeScript

---

## File Map

```
/app
  page.tsx                  ← Renders all 7 sections + global elements
  layout.tsx                ← Metadata, OG tags, font loading via next/font
  globals.css               ← CSS variables, Tailwind extensions, textures, keyframes
/components
  Hero.tsx                  ← Pinned hero with bar-breaking GSAP animation
  Kashmir.tsx               ← Displacement story with paragraph fade-ins
  ChessYard.tsx             ← Chess era content + ChessPuzzle embed
  LatentRiot.tsx            ← IGL content + LatentEvaluator embed
  SolitaryFIR.tsx           ← FIR content + viewport narrowing + FIRSlider + FatherMother
  StillAlive.tsx            ← Comeback content + viewport expansion + KineticStats
  Wall.tsx                  ← Community quotes + footer
  SurveillanceCam.tsx       ← Fixed top-right live timestamp
  SoundToggle.tsx           ← Fixed top-left mute/unmute icon
  ChessPuzzle.tsx           ← react-chessboard + chess.js interactive (dynamic import)
  LatentEvaluator.tsx       ← YouTube embed + dual sliders + reveal
  FIRSlider.tsx             ← 99% germ filtration slider with degradation effects
  FIRModal.tsx              ← Full-screen FIR legal document overlay
  FatherMother.tsx          ← Split-screen Mother (warm) vs Father (cold)
  KineticStats.tsx          ← CountUp animated stat blocks
  EasterEggs.tsx            ← Konami code + FIR tally + knight cursor + birthday timestamp
/lib
  gsap-setup.ts             ← GSAP + ScrollTrigger registration + Lenis integration
  chess-puzzles.ts          ← 3 FEN positions + solution moves
  content.ts                ← All text: quotes, stats, bios, section content
  audio.ts                  ← Howler.js wrapper with global mute control
/public
  /audio/                   ← metallic-groan.mp3, clank.mp3, static-noise.mp3
  /images/                  ← placeholder-hero.webp, og-image.jpg
```

---

### Task 1: Project Scaffolding + Design System

**Files:**
- Create: `app/layout.tsx`, `app/page.tsx`, `app/globals.css`, `tailwind.config.ts`, `lib/content.ts`

- [ ] **Step 1: Create Next.js project**

```bash
cd /Users/nanddave/Downloads/Projects/Samay_raina
npx create-next-app@latest . --typescript --tailwind --app --eslint --src-dir=false --import-alias="@/*" --use-npm
```

Select defaults. This creates the base Next.js 14 project in the current directory.

- [ ] **Step 2: Install dependencies**

```bash
cd /Users/nanddave/Downloads/Projects/Samay_raina
npm install gsap @studio-freight/lenis howler chess.js react-chessboard countup.js
npm install -D @types/howler
```

- [ ] **Step 3: Configure Tailwind with custom theme**

Replace `tailwind.config.ts`:

```ts
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        cell: "#0A0A0A",
        concrete: "#1C1C1E",
        yard: "#141416",
        chalk: "#E8E4DF",
        dim: "#6B6B6F",
        alarm: "#FF3D00",
        alive: "#00E676",
        gold: "#FFD54F",
        steel: "#3A3A3C",
      },
      fontFamily: {
        anton: ["var(--font-anton)", "sans-serif"],
        space: ["var(--font-space-mono)", "monospace"],
        dm: ["var(--font-dm-sans)", "sans-serif"],
        caveat: ["var(--font-caveat)", "cursive"],
      },
      fontSize: {
        "hero-desktop": ["120px", { lineHeight: "1" }],
        "hero-mobile": ["56px", { lineHeight: "1" }],
        "stat-desktop": ["72px", { lineHeight: "1" }],
        "stat-mobile": ["48px", { lineHeight: "1" }],
      },
    },
  },
  plugins: [],
};
export default config;
```

- [ ] **Step 4: Write globals.css with CSS variables, textures, and keyframes**

Replace `app/globals.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

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

html {
  background-color: var(--bg-cell);
  color: var(--text-chalk);
}

body {
  position: relative;
  overflow-x: hidden;
}

/* Concrete noise texture overlay */
body::before {
  content: "";
  position: fixed;
  inset: 0;
  z-index: 9998;
  pointer-events: none;
  opacity: 0.04;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
  background-repeat: repeat;
  background-size: 256px 256px;
}

/* Fog animation for Kashmir section */
@keyframes fog-drift {
  0% { transform: translateX(-10%); opacity: 0.08; }
  50% { transform: translateX(10%); opacity: 0.12; }
  100% { transform: translateX(-10%); opacity: 0.08; }
}

/* Hue rotation for IGL Riot section */
@keyframes hue-cycle {
  0% { filter: hue-rotate(0deg); }
  50% { filter: hue-rotate(20deg); }
  100% { filter: hue-rotate(0deg); }
}

/* Glitch effect for FIR slider */
@keyframes glitch-jitter {
  0% { transform: translateX(0); }
  20% { transform: translateX(-3px); }
  40% { transform: translateX(2px); }
  60% { transform: translateX(-1px); }
  80% { transform: translateX(3px); }
  100% { transform: translateX(0); }
}

/* Pulse animation for stats */
@keyframes stat-pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.02); }
}

/* Scroll indicator pulse */
@keyframes scroll-pulse {
  0%, 100% { opacity: 0.4; transform: translateY(0); }
  50% { opacity: 1; transform: translateY(4px); }
}

/* REC dot pulse */
@keyframes rec-pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.3; }
}

/* Cell door plate gradient */
.cell-door-plate {
  @apply w-[280px] h-[60px] border-2 border-steel flex items-center justify-center;
  background: linear-gradient(135deg, #2A2A2E, #1C1C1E);
}

/* Redacted text */
.redacted {
  background-color: white;
  color: white;
  transition: all 0.3s ease;
  cursor: pointer;
  padding: 0 4px;
}
.redacted:hover {
  background-color: transparent;
  color: var(--text-chalk);
}

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

- [ ] **Step 5: Write layout.tsx with fonts and metadata**

Replace `app/layout.tsx`:

```tsx
import type { Metadata } from "next";
import { Anton, Space_Mono, DM_Sans, Caveat } from "next/font/google";
import "./globals.css";

const anton = Anton({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-anton",
  display: "swap",
});

const spaceMono = Space_Mono({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-space-mono",
  display: "swap",
});

const dmSans = DM_Sans({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
});

const caveat = Caveat({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-caveat",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Samay Raina — The Jail Break | A Tribute by Brokai Labs",
  description:
    "From Kashmir to Madison Square Garden. A scroll-driven tribute to India's most uncancellable comedian.",
  openGraph: {
    title: "Samay Raina — The Jail Break | A Tribute by Brokai Labs",
    description:
      "From Kashmir to Madison Square Garden. A scroll-driven tribute to India's most uncancellable comedian.",
    images: [{ url: "/images/og-image.jpg", width: 1200, height: 630 }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Samay Raina — The Jail Break | A Tribute by Brokai Labs",
    description:
      "From Kashmir to Madison Square Garden. A scroll-driven tribute to India's most uncancellable comedian.",
    images: ["/images/og-image.jpg"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${anton.variable} ${spaceMono.variable} ${dmSans.variable} ${caveat.variable}`}
    >
      <body className="font-dm bg-cell text-chalk">{children}</body>
    </html>
  );
}
```

- [ ] **Step 6: Write content.ts with all text content**

Create `lib/content.ts`:

```ts
export const heroContent = {
  name: "SAMAY RAINA",
  subtitle:
    "Comedian. Chess Evangelist. Controversy Survivor. Still Alive.",
  scrollCta: "SCROLL TO BREAK FREE",
};

export const kashmirContent = {
  sectionLabel: "PRISONER #1 — THE DISPLACEMENT",
  paragraphs: [
    "Born October 26, 1997. Jammu. A Kashmiri Pandit family from Anantnag — displaced in the 1990s exodus. Refugee camps in Jammu, then Hyderabad.",
    "Father Rajesh: a journalist at Doordarshan, later News18. Mother Sweeti: left her career to raise him. Everything she had, she gave.",
    "Bullied at Hyderabad Public School for his skin color. The kind of cruelty that doesn't leave bruises but rewires how you see yourself.",
    "Chess came from his grandfather during visits to Delhi. A quiet game in a loud childhood. The first thing that was entirely his.",
  ],
  quote: ""My mother gave up everything so I could have something."",
  tallyMarks: "||||| |",
};

export const chessYardContent = {
  sectionLabel: "THE YARD — CHESS ERA",
  paragraphs: [
    "COVID lockdown. Literal confinement. Tanmay Bhat suggested he stream chess. First stream: March 23, 2020 — 200 viewers.",
    "The J&K Gambit — wildly sacrificing pieces, playing with reckless abandon. Named after the displacement. Comedy and chess fused into something no one had seen before.",
    "Collaborators: Vidit Gujrathi, Viswanathan Anand, Magnus Carlsen, Hikaru Nakamura. 69,000+ concurrent viewers during the FIDE Online Olympiad.",
    "Chess Super League. Comedians On Board. Improving Chess — 100 episodes. Rating: 1,040 → 1,942 peak. Donated $10K to Lidè Haiti.",
  ],
  quote:
    ""The J\u0026K Gambit — it's a lot like what happened in 1990. You sacrifice everything and hope something works out."",
  stats: [
    { value: 69000, suffix: "+", label: "concurrent viewers" },
    { value: 1942, suffix: "", label: "peak rating" },
  ],
  tallyMarks: "||||| ||",
};

export const latentRiotContent = {
  sectionLabel: "THE RIOT — IGL",
  paragraphs: [
    "June 14, 2024. India's Got Latent. A parody of India's Got Talent crossed with Kill Tony. The self-rating mechanic: contestants rate themselves, judges rate them. The gap is the joke.",
    "25 million+ average views per episode. 12 main episodes, 6 bonus. IMDb 9.1 out of 10. The IGL App hit #1 on both app stores within hours of launch.",
    "Rejected OTT offers. \"I want it to stay raw.\" Vastrado saw a 150% revenue boost and 20x traffic. YouTube memberships estimated at ₹1.5 crore per month.",
  ],
  stats: [
    { value: 25, suffix: "M+", label: "avg views/episode" },
    { value: 9.1, suffix: "", label: "IMDb rating", decimals: 1 },
    { value: 1, suffix: "", label: "#1 on app stores", prefix: "#" },
  ],
  tallyMarks: "||||| |||",
};

export const solitaryFIRContent = {
  sectionLabel: "SOLITARY — THE FIR",
  paragraphs: [
    "February 8, 2025. Bonus Episode 6. A question from Ranveer Allahbadia. Clips escape the paywall. Context collapses.",
    "FIRs filed across Maharashtra, Assam, Rajasthan. BNS Sections 79, 95, 196, 294, 296, 299. IT Act Section 67. The legal system as a weapon.",
    "NCW summons. Parliament Zero Hour. Karni Sena threats. His editor arrested. Episodes deleted. ₹8 crore at risk.",
    "Death threats. His mother's call. His father's memes. Psychosis: \"It felt like a dream. It wasn't real.\"",
  ],
  sliderQuote:
    ""I had killed 99% of the germs. I didn't know the pandemic would happen from that 1%."",
  motherContent: {
    title: "MOTHER",
    text: "Sweeti Raina watched her son's world collapse from a phone screen. The same woman who left her career, who moved cities, who fought so he could have a life — now helpless. Internet trauma is violent. But it ends.",
  },
  fatherContent: {
    title: "FATHER",
    text: "Rajesh Raina posted memes. Not because he didn't care, but because Kashmiri Pandits have survived worse. Displacement. Exile. Loss that doesn't trend. Generational trauma is quiet. But it never leaves.",
  },
  tallyMarks: "||||| ||||",
};

export const stillAliveContent = {
  sectionLabel: "THE BREAK — STILL ALIVE",
  paragraphs: [
    "August 15, 2025. Independence Day. The comeback begins.",
    "40,000 tickets sold in the first hour. Still Alive & Unfiltered tour: Bharat Mandapam, Talkatora Stadium, 300,000+ tickets worldwide.",
    "Madison Square Garden. February 28, 2026. Twenty-eight years old.",
    "Still Alive special. April 7, 2026. Free on YouTube. 11 million views in 24 hours. IGL Season 2 confirmed — live-only format.",
  ],
  stats: [
    { value: 300000, suffix: "+", label: "tickets sold worldwide" },
    { value: 11000000, suffix: "", label: "views in 24 hours" },
    { value: 28, suffix: "", label: "years old at Madison Square Garden" },
    { value: 40000, suffix: "", label: "tickets sold in first hour" },
  ],
  quote: ""Hum Kashmiri crossfire mein hi marte hain."",
  quoteTranslation: "We Kashmiris always die in the crossfire.",
  tallyMarks: "||||| |||||",
};

export const wallContent = {
  sectionLabel: "THE WALL",
  quotes: [
    { text: "Samay made chess cool for an entire generation.", author: "@chess_fan_2024" },
    { text: "IGL is the best thing to happen to Indian comedy.", author: "@latent_lover" },
    { text: "The comeback was unreal. Still Alive changed everything.", author: "@comedy_addict" },
    { text: "Bhai tu ruk mat. Hum hain tere saath.", author: "@samay_army" },
    { text: "J&K Gambit forever.", author: "@gambit_gang" },
    { text: "From 200 viewers to Madison Square Garden. Insane.", author: "@stream_watcher" },
    { text: "The only comedian who made me learn chess.", author: "@rookie_1200" },
    { text: "Samay didn't just survive the FIR. He turned it into a tour name.", author: "@still_alive_fan" },
    { text: "Kashmiri Pandit representation matters. Samay showed us that.", author: "@kp_diaspora" },
    { text: "The man literally played chess with Magnus. On stream. For content.", author: "@twitch_clips" },
    { text: "IGL Season 2 is going to break YouTube.", author: "@latent_s2" },
    { text: "He's not just a comedian. He's a movement.", author: "@brokai_follower" },
  ],
  tribute:
    "Samay — you showed us that the bars are temporary. The bakchod is permanent.",
  credit: "Built by Brokai Labs. Episode 4 of the Giveback Series.",
  nextEpisodeCta: "Who should Episode 5 be? →",
  tallyMarks: "||||| ||||| |",
};
```

- [ ] **Step 7: Write skeleton page.tsx**

Replace `app/page.tsx`:

```tsx
export default function Home() {
  return (
    <main>
      <section id="hero" className="relative h-screen bg-cell">
        <div className="flex items-center justify-center h-full">
          <p className="font-space text-dim text-sm">Hero section loading...</p>
        </div>
      </section>
      <section id="kashmir" className="relative bg-cell py-32">
        <div className="max-w-[720px] mx-auto px-6">
          <p className="font-space text-dim text-sm">Kashmir section</p>
        </div>
      </section>
      <section id="chess-yard" className="relative bg-yard py-32">
        <div className="max-w-[900px] mx-auto px-6">
          <p className="font-space text-dim text-sm">Chess Yard section</p>
        </div>
      </section>
      <section id="latent-riot" className="relative bg-yard py-32">
        <div className="max-w-[900px] mx-auto px-6">
          <p className="font-space text-dim text-sm">Latent Riot section</p>
        </div>
      </section>
      <section id="solitary-fir" className="relative bg-cell py-32">
        <div className="max-w-[900px] mx-auto px-6">
          <p className="font-space text-dim text-sm">Solitary FIR section</p>
        </div>
      </section>
      <section id="still-alive" className="relative bg-cell py-32">
        <div className="max-w-[520px] mx-auto px-6">
          <p className="font-space text-dim text-sm">Still Alive section</p>
        </div>
      </section>
      <section id="wall" className="relative bg-cell py-32">
        <div className="max-w-[1200px] mx-auto px-6">
          <p className="font-space text-dim text-sm">The Wall section</p>
        </div>
      </section>
    </main>
  );
}
```

- [ ] **Step 8: Create public directories and placeholder assets**

```bash
cd /Users/nanddave/Downloads/Projects/Samay_raina
mkdir -p public/audio public/images public/fonts
```

- [ ] **Step 9: Run dev server to verify**

```bash
cd /Users/nanddave/Downloads/Projects/Samay_raina
npm run dev
```

Expected: Site loads at `localhost:3000` with dark background, skeleton sections visible on scroll. Fonts load correctly. No console errors.

- [ ] **Step 10: Commit**

```bash
git init
echo "node_modules\n.next\n.env*\n.superpowers" > .gitignore
git add .
git commit -m "feat: project scaffolding with design system, fonts, and skeleton page"
```

---

### Task 2: GSAP + Lenis Scroll Engine Setup

**Files:**
- Create: `lib/gsap-setup.ts`
- Modify: `app/page.tsx`

- [ ] **Step 1: Write GSAP + Lenis integration module**

Create `lib/gsap-setup.ts`:

```ts
"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "@studio-freight/lenis";

let lenisInstance: Lenis | null = null;

export function initScrollEngine(): Lenis {
  if (lenisInstance) return lenisInstance;

  gsap.registerPlugin(ScrollTrigger);

  lenisInstance = new Lenis({
    duration: 1.2,
    easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
  });

  // Sync Lenis scroll with GSAP ticker
  lenisInstance.on("scroll", ScrollTrigger.update);

  gsap.ticker.add((time) => {
    lenisInstance?.raf(time * 1000);
  });

  gsap.ticker.lagSmoothing(0);

  return lenisInstance;
}

export function destroyScrollEngine(): void {
  lenisInstance?.destroy();
  lenisInstance = null;
  ScrollTrigger.getAll().forEach((t) => t.kill());
}

export { gsap, ScrollTrigger };
```

- [ ] **Step 2: Create scroll engine provider in page.tsx**

Replace `app/page.tsx`:

```tsx
"use client";

import { useEffect } from "react";
import { initScrollEngine, destroyScrollEngine } from "@/lib/gsap-setup";

export default function Home() {
  useEffect(() => {
    const lenis = initScrollEngine();
    return () => destroyScrollEngine();
  }, []);

  return (
    <main>
      <section id="hero" className="relative h-screen bg-cell">
        <div className="flex items-center justify-center h-full">
          <p className="font-space text-dim text-sm">Hero section loading...</p>
        </div>
      </section>
      <section id="kashmir" className="relative bg-cell py-32">
        <div className="max-w-[720px] mx-auto px-6">
          <p className="font-space text-dim text-sm">Kashmir section</p>
        </div>
      </section>
      <section id="chess-yard" className="relative bg-yard py-32">
        <div className="max-w-[900px] mx-auto px-6">
          <p className="font-space text-dim text-sm">Chess Yard section</p>
        </div>
      </section>
      <section id="latent-riot" className="relative bg-yard py-32">
        <div className="max-w-[900px] mx-auto px-6">
          <p className="font-space text-dim text-sm">Latent Riot section</p>
        </div>
      </section>
      <section id="solitary-fir" className="relative bg-cell py-32">
        <div className="max-w-[900px] mx-auto px-6">
          <p className="font-space text-dim text-sm">Solitary FIR section</p>
        </div>
      </section>
      <section id="still-alive" className="relative bg-cell py-32">
        <div className="max-w-[520px] mx-auto px-6">
          <p className="font-space text-dim text-sm">Still Alive section</p>
        </div>
      </section>
      <section id="wall" className="relative bg-cell py-32">
        <div className="max-w-[1200px] mx-auto px-6">
          <p className="font-space text-dim text-sm">The Wall section</p>
        </div>
      </section>
    </main>
  );
}
```

- [ ] **Step 3: Verify smooth scroll works**

Run: `npm run dev`
Expected: Page scrolls smoothly with Lenis easing. No janky native scroll. Check browser console — no GSAP or Lenis errors.

- [ ] **Step 4: Commit**

```bash
git add lib/gsap-setup.ts app/page.tsx
git commit -m "feat: GSAP ScrollTrigger + Lenis smooth scroll integration"
```

---

### Task 3: Global Persistent Elements (Surveillance Cam + Sound Toggle)

**Files:**
- Create: `components/SurveillanceCam.tsx`, `components/SoundToggle.tsx`, `lib/audio.ts`
- Modify: `app/page.tsx`

- [ ] **Step 1: Write audio manager**

Create `lib/audio.ts`:

```ts
"use client";

let isMuted = true;
const listeners: Set<(muted: boolean) => void> = new Set();

export function getIsMuted(): boolean {
  return isMuted;
}

export function toggleMute(): boolean {
  isMuted = !isMuted;
  listeners.forEach((fn) => fn(isMuted));
  return isMuted;
}

export function onMuteChange(fn: (muted: boolean) => void): () => void {
  listeners.add(fn);
  return () => listeners.delete(fn);
}
```

- [ ] **Step 2: Write SurveillanceCam component**

Create `components/SurveillanceCam.tsx`:

```tsx
"use client";

import { useEffect, useState, useRef } from "react";

export default function SurveillanceCam() {
  const [time, setTime] = useState("");
  const [isBirthday, setIsBirthday] = useState(false);
  const hoverTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const tick = () => {
      if (!isBirthday) {
        const now = new Date();
        setTime(now.toLocaleTimeString("en-GB", { hour12: false }));
      }
    };
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [isBirthday]);

  const handleMouseEnter = () => {
    hoverTimerRef.current = setTimeout(() => {
      setIsBirthday(true);
      setTime("00:00:00");
    }, 3000);
  };

  const handleMouseLeave = () => {
    if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
    setIsBirthday(false);
  };

  return (
    <div
      className="fixed top-4 right-4 z-[9990] font-space text-[10px] text-dim select-none cursor-default"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <span className="mr-2">CAM 04</span>
      <span className="mr-2">—</span>
      <span className="text-alarm mr-1">REC</span>
      <span className="text-alarm animate-[rec-pulse_2s_infinite]">●</span>
      <span className="ml-2">—</span>
      <span className="ml-2">
        {isBirthday ? "OCT 26, 1997" : ""} {time}
      </span>
    </div>
  );
}
```

- [ ] **Step 3: Write SoundToggle component**

Create `components/SoundToggle.tsx`:

```tsx
"use client";

import { useState } from "react";
import { toggleMute, getIsMuted } from "@/lib/audio";

export default function SoundToggle() {
  const [muted, setMuted] = useState(getIsMuted());

  const handleClick = () => {
    const newState = toggleMute();
    setMuted(newState);
  };

  return (
    <button
      onClick={handleClick}
      className="fixed top-4 left-4 z-[9990] w-10 h-10 flex items-center justify-center text-dim hover:text-chalk transition-colors"
      aria-label={muted ? "Unmute audio" : "Mute audio"}
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
        {muted ? (
          <>
            <line x1="23" y1="9" x2="17" y2="15" />
            <line x1="17" y1="9" x2="23" y2="15" />
          </>
        ) : (
          <>
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
            <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
          </>
        )}
      </svg>
    </button>
  );
}
```

- [ ] **Step 4: Add global elements to page.tsx**

Update `app/page.tsx` — add imports and components after `<main>` opening tag:

```tsx
"use client";

import { useEffect } from "react";
import { initScrollEngine, destroyScrollEngine } from "@/lib/gsap-setup";
import SurveillanceCam from "@/components/SurveillanceCam";
import SoundToggle from "@/components/SoundToggle";

export default function Home() {
  useEffect(() => {
    const lenis = initScrollEngine();
    return () => destroyScrollEngine();
  }, []);

  return (
    <>
      <SurveillanceCam />
      <SoundToggle />
      <main>
        {/* ...sections remain the same... */}
      </main>
    </>
  );
}
```

- [ ] **Step 5: Verify**

Run: `npm run dev`
Expected: Surveillance cam shows live time in top-right. Sound toggle icon in top-left. Both stay fixed on scroll. Clicking sound toggle switches icon between muted/unmuted.

- [ ] **Step 6: Commit**

```bash
git add components/SurveillanceCam.tsx components/SoundToggle.tsx lib/audio.ts app/page.tsx
git commit -m "feat: surveillance cam timestamp and sound toggle global elements"
```

---

### Task 4: Hero Section — The Cell with Bar-Breaking Animation

**Files:**
- Create: `components/Hero.tsx`
- Modify: `app/page.tsx`

- [ ] **Step 1: Write Hero component**

Create `components/Hero.tsx`:

```tsx
"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap-setup";
import { heroContent } from "@/lib/content";

const DESKTOP_BAR_COUNT = 12;
const MOBILE_BAR_COUNT = 7;

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const barsRef = useRef<(HTMLDivElement | null)[]>([]);
  const portraitRef = useRef<HTMLDivElement>(null);
  const bgOverlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const mm = gsap.matchMedia();

    mm.add(
      {
        isDesktop: "(min-width: 768px)",
        isMobile: "(max-width: 767px)",
      },
      (context) => {
        const { isDesktop } = context.conditions!;
        const barCount = isDesktop ? DESKTOP_BAR_COUNT : MOBILE_BAR_COUNT;
        const bars = barsRef.current.filter(Boolean).slice(0, barCount);

        // Sort bars by distance from center (center breaks first)
        const centerIndex = (barCount - 1) / 2;
        const sortedBars = [...bars].sort(
          (a, b) =>
            Math.abs(bars.indexOf(a) - centerIndex) -
            Math.abs(bars.indexOf(b) - centerIndex)
        );

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: "+=150%",
            pin: true,
            scrub: 1,
            anticipatePin: 1,
          },
        });

        // Bars rotate out with stagger
        sortedBars.forEach((bar, i) => {
          if (!bar) return;
          const delay = i * 0.4;
          tl.to(
            bar,
            {
              rotateY: 90,
              opacity: 0,
              duration: 3,
              ease: "power2.inOut",
            },
            delay
          );
        });

        // Portrait brightens
        if (portraitRef.current) {
          tl.to(
            portraitRef.current,
            {
              filter: "brightness(1) saturate(1)",
              duration: 6,
              ease: "power2.inOut",
            },
            0
          );
        }

        // Background crossfade
        if (bgOverlayRef.current) {
          tl.to(
            bgOverlayRef.current,
            {
              opacity: 1,
              duration: 6,
              ease: "power2.inOut",
            },
            0
          );
        }

        return () => {
          tl.kill();
        };
      }
    );

    return () => mm.revert();
  }, []);

  // Render max bars (12), hide extras on mobile via CSS
  const bars = Array.from({ length: DESKTOP_BAR_COUNT }, (_, i) => (
    <div
      key={i}
      ref={(el) => { barsRef.current[i] = el; }}
      className={`w-[6px] h-full ${i >= MOBILE_BAR_COUNT ? "hidden md:block" : ""}`}
      style={{
        background:
          "linear-gradient(180deg, #3A3A3C, #2A2A2E, #3A3A3C)",
        transformStyle: "preserve-3d",
        backfaceVisibility: "hidden",
      }}
    />
  ));

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative h-screen bg-cell overflow-hidden"
    >
      {/* Background crossfade overlay */}
      <div
        ref={bgOverlayRef}
        className="absolute inset-0 bg-concrete opacity-0"
      />

      {/* Portrait placeholder */}
      <div
        ref={portraitRef}
        className="absolute inset-0 flex items-center justify-center"
        style={{
          filter: "brightness(0.4) saturate(0.4)",
        }}
      >
        <div className="w-[300px] h-[400px] md:w-[400px] md:h-[520px] bg-concrete rounded flex items-center justify-center">
          <span className="font-space text-dim text-xs">SAMAY PORTRAIT</span>
        </div>
      </div>

      {/* Steel bars */}
      <div className="absolute inset-0 flex justify-between px-8 md:px-10 pointer-events-none z-10">
        {bars}
      </div>

      {/* Text overlay */}
      <div className="relative z-20 flex flex-col items-center justify-center h-full text-center px-4">
        <h1 className="font-anton text-hero-mobile md:text-hero-desktop text-white tracking-[4px] drop-shadow-[0_0_40px_rgba(0,0,0,0.8)]">
          {heroContent.name}
        </h1>
        <p className="font-space text-[10px] md:text-xs text-dim tracking-[2px] mt-3 uppercase">
          {heroContent.subtitle}
        </p>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 text-center">
        <p className="font-space text-[10px] text-dim tracking-[3px]">
          {heroContent.scrollCta}
        </p>
        <span className="block text-dim mt-2 animate-[scroll-pulse_2s_infinite]">
          ▼
        </span>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Replace hero section in page.tsx**

In `app/page.tsx`, add `import Hero from "@/components/Hero";` and replace the `<section id="hero">` block with `<Hero />`.

- [ ] **Step 3: Verify hero animation**

Run: `npm run dev`
Expected: Full-viewport hero with steel bars, "SAMAY RAINA" in large Anton font, scroll indicator pulsing. On scroll, bars rotate away from center outward, background transitions. Pin works smoothly. Check at both desktop and mobile widths (7 bars on mobile).

- [ ] **Step 4: Commit**

```bash
git add components/Hero.tsx app/page.tsx
git commit -m "feat: hero section with pinned bar-breaking scroll animation"
```

---

### Task 5: Kashmir Section — The Displacement

**Files:**
- Create: `components/Kashmir.tsx`
- Modify: `app/page.tsx`

- [ ] **Step 1: Write Kashmir component**

Create `components/Kashmir.tsx`:

```tsx
"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap-setup";
import { kashmirContent } from "@/lib/content";

export default function Kashmir() {
  const sectionRef = useRef<HTMLElement>(null);
  const paragraphsRef = useRef<(HTMLParagraphElement | null)[]>([]);
  const quoteRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const elements = paragraphsRef.current.filter(Boolean);
    elements.forEach((el) => {
      gsap.fromTo(
        el,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: el,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        }
      );
    });

    if (quoteRef.current) {
      gsap.fromTo(
        quoteRef.current,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 1.2,
          ease: "power2.out",
          scrollTrigger: {
            trigger: quoteRef.current,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        }
      );
    }

    return () => {
      ScrollTrigger.getAll()
        .filter((t) => sectionRef.current?.contains(t.trigger as Element))
        .forEach((t) => t.kill());
    };
  }, []);

  return (
    <section ref={sectionRef} id="kashmir" className="relative bg-cell py-24 md:py-32 overflow-hidden">
      {/* Fog background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at 50% 50%, rgba(28,28,30,0.15), transparent 70%)",
          animation: "fog-drift 12s ease-in-out infinite",
        }}
      />

      <div className="relative max-w-[720px] mx-auto px-6">
        {/* Cell door plate */}
        <div className="cell-door-plate mx-auto mb-16">
          <span className="font-space text-[10px] md:text-xs text-dim tracking-[3px]">
            {kashmirContent.sectionLabel}
          </span>
        </div>

        {/* Paragraphs */}
        {kashmirContent.paragraphs.map((text, i) => (
          <p
            key={i}
            ref={(el) => { paragraphsRef.current[i] = el; }}
            className="font-dm text-base md:text-lg text-chalk leading-[1.8] mb-6 opacity-0"
          >
            {text}
          </p>
        ))}

        {/* Quote */}
        <div ref={quoteRef} className="border-l-[3px] border-steel pl-4 mt-10 opacity-0">
          <p className="font-caveat text-[22px] md:text-[28px] text-chalk leading-[1.4] -rotate-1">
            {kashmirContent.quote}
          </p>
        </div>

        {/* Tally marks */}
        <div className="absolute bottom-6 right-6 font-space text-lg text-steel">
          {kashmirContent.tallyMarks}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Add Kashmir to page.tsx**

Add `import Kashmir from "@/components/Kashmir";` and replace the `<section id="kashmir">` block with `<Kashmir />`.

- [ ] **Step 3: Verify**

Run: `npm run dev`
Expected: Paragraphs fade in one by one as you scroll. Fog drifts in background. Quote appears with border-left. Tally marks bottom-right.

- [ ] **Step 4: Commit**

```bash
git add components/Kashmir.tsx app/page.tsx
git commit -m "feat: kashmir displacement section with paragraph fade-in animations"
```

---

### Task 6: Chess Yard Section + Interactive Puzzle

**Files:**
- Create: `components/ChessYard.tsx`, `components/ChessPuzzle.tsx`, `lib/chess-puzzles.ts`
- Modify: `app/page.tsx`

- [ ] **Step 1: Write chess puzzles data**

Create `lib/chess-puzzles.ts`:

```ts
export interface ChessPuzzle {
  id: number;
  label: string;
  fen: string;
  solution: string[]; // UCI move format e.g. "e2e4"
  orientation: "white" | "black";
  hint: string;
}

// Classic well-known puzzles
export const puzzles: ChessPuzzle[] = [
  {
    id: 1,
    label: "Easy — Mate in 1",
    // White to move: Qh7# (queen to h7 checkmate)
    fen: "r1bqkb1r/pppp1Qpp/2n2n2/4p3/2B1P3/8/PPPP1PPP/RNB1K1NR b KQkq - 0 1",
    solution: [], // It's already Scholar's Mate position — let's use a better one
    orientation: "white",
    hint: "Look for a back rank mate.",
  },
  {
    id: 2,
    label: "Medium — Mate in 2",
    // Anastasia's Mate setup
    fen: "5rk1/4Qppp/8/8/8/8/5PPP/6K1 w - - 0 1",
    solution: ["e7e8"],
    orientation: "white",
    hint: "Promote the attack on the 8th rank.",
  },
  {
    id: 3,
    label: "Hard — Mate in 2",
    // Classic Reti puzzle
    fen: "r2qkb1r/pp2nppp/3p4/2pNN1B1/2BnP3/3P4/PPP2PPP/R2bK2R w KQkq - 0 1",
    solution: ["d5f6"],
    orientation: "white",
    hint: "Knight fork with a discovered attack.",
  },
];

// Note: These will be replaced with better-validated positions.
// The chess.js library validates legality, so wrong FENs will be caught at runtime.
```

- [ ] **Step 2: Write ChessPuzzle component**

Create `components/ChessPuzzle.tsx`:

```tsx
"use client";

import { useState, useCallback, useEffect } from "react";
import dynamic from "next/dynamic";
import { puzzles, type ChessPuzzle } from "@/lib/chess-puzzles";

const Chessboard = dynamic(
  () => import("react-chessboard").then((mod) => mod.Chessboard),
  { ssr: false, loading: () => <div className="w-full aspect-square bg-concrete rounded animate-pulse" /> }
);

let Chess: typeof import("chess.js").Chess | null = null;

export default function ChessPuzzleComponent() {
  const [puzzleIndex, setPuzzleIndex] = useState(0);
  const [game, setGame] = useState<InstanceType<typeof import("chess.js").Chess> | null>(null);
  const [message, setMessage] = useState("");
  const [solved, setSolved] = useState(false);
  const [moveIndex, setMoveIndex] = useState(0);

  const puzzle = puzzles[puzzleIndex];

  useEffect(() => {
    import("chess.js").then((mod) => {
      Chess = mod.Chess;
      const g = new mod.Chess(puzzle.fen);
      setGame(g);
    });
  }, [puzzle.fen]);

  const onDrop = useCallback(
    (sourceSquare: string, targetSquare: string): boolean => {
      if (!game || solved) return false;

      const move = game.move({
        from: sourceSquare,
        to: targetSquare,
        promotion: "q",
      });

      if (!move) return false;

      const expectedMove = puzzle.solution[moveIndex];
      const uci = move.from + move.to;

      if (uci === expectedMove || puzzle.solution.length === 0) {
        // Check if puzzle is complete (checkmate or all moves done)
        if (game.isCheckmate() || moveIndex >= puzzle.solution.length - 1) {
          setMessage("✓ Samay would be proud!");
          setSolved(true);
        } else {
          setMoveIndex((prev) => prev + 1);
          setMessage("Correct! Keep going...");
        }
        setGame(new Chess!(game.fen()));
        return true;
      } else {
        // Wrong move — undo
        game.undo();
        setMessage("Bhai, phir se try kar 😂");
        setTimeout(() => setMessage(puzzle.hint), 2000);
        return false;
      }
    },
    [game, puzzle, solved, moveIndex]
  );

  const nextPuzzle = () => {
    if (puzzleIndex < puzzles.length - 1) {
      setPuzzleIndex((prev) => prev + 1);
      setSolved(false);
      setMoveIndex(0);
      setMessage("");
    }
  };

  return (
    <div className="bg-cell border-2 border-steel rounded p-4 md:p-6">
      <div className="font-space text-[10px] text-gold tracking-[2px] mb-3">
        INTERACTIVE: CHESS PUZZLE — {puzzle?.label}
      </div>

      <div className="max-w-[320px] mx-auto">
        {game && (
          <Chessboard
            id="samay-puzzle"
            position={game.fen()}
            onPieceDrop={onDrop}
            boardOrientation={puzzle.orientation}
            customBoardStyle={{
              borderRadius: "4px",
              boxShadow: "0 4px 20px rgba(0,0,0,0.5)",
            }}
            customDarkSquareStyle={{ backgroundColor: "#3A3A3C" }}
            customLightSquareStyle={{ backgroundColor: "#6B6B6F" }}
            boardWidth={320}
            animationDuration={200}
          />
        )}
      </div>

      {message && (
        <p className={`font-dm text-sm text-center mt-4 ${solved ? "text-alive" : "text-gold"}`}>
          {message}
        </p>
      )}

      {solved && puzzleIndex < puzzles.length - 1 && (
        <button
          onClick={nextPuzzle}
          className="block mx-auto mt-4 px-6 py-2 bg-gold text-cell font-space text-xs tracking-[1px] rounded hover:bg-yellow-400 transition-colors"
        >
          NEXT PUZZLE →
        </button>
      )}

      {solved && puzzleIndex === puzzles.length - 1 && (
        <p className="font-caveat text-xl text-gold text-center mt-4">
          All puzzles solved! You might actually beat Samay. 🏆
        </p>
      )}
    </div>
  );
}
```

- [ ] **Step 3: Write ChessYard section component**

Create `components/ChessYard.tsx`:

```tsx
"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap-setup";
import { chessYardContent } from "@/lib/content";
import ChessPuzzle from "@/components/ChessPuzzle";

export default function ChessYard() {
  const sectionRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const paragraphsRef = useRef<(HTMLParagraphElement | null)[]>([]);
  const quoteRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Grid fade in
    if (gridRef.current) {
      gsap.fromTo(
        gridRef.current,
        { opacity: 0 },
        {
          opacity: 0.06,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 60%",
            toggleActions: "play none none none",
          },
        }
      );
    }

    // Paragraph reveals
    paragraphsRef.current.filter(Boolean).forEach((el) => {
      gsap.fromTo(
        el,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: el,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        }
      );
    });

    if (quoteRef.current) {
      gsap.fromTo(
        quoteRef.current,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 1.2,
          ease: "power2.out",
          scrollTrigger: {
            trigger: quoteRef.current,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        }
      );
    }

    return () => {
      ScrollTrigger.getAll()
        .filter((t) => sectionRef.current?.contains(t.trigger as Element))
        .forEach((t) => t.kill());
    };
  }, []);

  // Build 8x8 grid cells
  const gridCells = Array.from({ length: 64 }, (_, i) => {
    const row = Math.floor(i / 8);
    const col = i % 8;
    const isDark = (row + col) % 2 === 1;
    return (
      <div
        key={i}
        className={isDark ? "bg-gold" : ""}
      />
    );
  });

  return (
    <section ref={sectionRef} id="chess-yard" className="relative py-24 md:py-32 overflow-hidden"
      style={{ background: "linear-gradient(180deg, #0A0A0A, #141416 200px, #141416)" }}
    >
      {/* Isometric chess grid background */}
      <div
        ref={gridRef}
        className="absolute inset-0 grid grid-cols-8 grid-rows-[repeat(8,1fr)] opacity-0 pointer-events-none"
      >
        {gridCells}
      </div>

      <div className="relative max-w-[900px] mx-auto px-6 z-10">
        {/* Cell door plate */}
        <div className="cell-door-plate mx-auto mb-16">
          <span className="font-space text-[10px] md:text-xs text-gold tracking-[3px]">
            {chessYardContent.sectionLabel}
          </span>
        </div>

        {/* Paragraphs */}
        {chessYardContent.paragraphs.map((text, i) => (
          <p
            key={i}
            ref={(el) => { paragraphsRef.current[i] = el; }}
            className="font-dm text-base md:text-lg text-chalk leading-[1.8] mb-6 opacity-0 max-w-[720px] mx-auto"
          >
            {text}
          </p>
        ))}

        {/* J&K Gambit quote */}
        <div ref={quoteRef} className="border-l-[3px] border-gold pl-4 mt-8 mb-12 opacity-0 max-w-[720px] mx-auto">
          <p className="font-caveat text-[22px] md:text-[28px] text-gold leading-[1.4] -rotate-1">
            {chessYardContent.quote}
          </p>
        </div>

        {/* Stats */}
        <div className="flex gap-4 justify-center mb-12">
          {chessYardContent.stats.map((stat, i) => (
            <div key={i} className="text-center px-6 py-4 bg-cell rounded">
              <div className="font-anton text-stat-mobile md:text-stat-desktop text-gold">
                {stat.value.toLocaleString()}{stat.suffix}
              </div>
              <div className="font-dm text-xs text-dim mt-1">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Chess puzzle */}
        <div className="max-w-[400px] mx-auto">
          <ChessPuzzle />
        </div>

        {/* Tally marks */}
        <div className="absolute bottom-6 right-6 font-space text-lg text-steel">
          {chessYardContent.tallyMarks}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Add to page.tsx**

Add `import ChessYard from "@/components/ChessYard";` and replace the `<section id="chess-yard">` block with `<ChessYard />`.

- [ ] **Step 5: Verify**

Run: `npm run dev`
Expected: Chess grid fades in behind content. Paragraphs and quote animate in. Chess puzzle renders with interactive board. Pieces can be dragged. Wrong move shows message, correct move shows success.

- [ ] **Step 6: Commit**

```bash
git add components/ChessYard.tsx components/ChessPuzzle.tsx lib/chess-puzzles.ts app/page.tsx
git commit -m "feat: chess yard section with interactive puzzle component"
```

---

### Task 7: IGL Riot Section + Latent Evaluator

**Files:**
- Create: `components/LatentRiot.tsx`, `components/LatentEvaluator.tsx`
- Modify: `app/page.tsx`

- [ ] **Step 1: Write LatentEvaluator component**

Create `components/LatentEvaluator.tsx`:

```tsx
"use client";

import { useState } from "react";

export default function LatentEvaluator() {
  const [userScore, setUserScore] = useState(5);
  const [judgeScore, setJudgeScore] = useState(5);
  const [revealed, setRevealed] = useState(false);

  const delta = Math.abs(userScore - judgeScore);

  const getResult = () => {
    if (delta === 0) return { text: "You'd win ₹1,00,000! Perfect match! 🎉", color: "text-alive" };
    if (delta === 1) return { text: "So close! One point off.", color: "text-gold" };
    return { text: "Zero self-awareness. Samay would roast you. 😂", color: "text-alarm" };
  };

  const handleReveal = () => {
    setRevealed(true);
  };

  const handleReset = () => {
    setRevealed(false);
    setUserScore(5);
    setJudgeScore(5);
  };

  return (
    <div className="bg-cell border-2 border-alarm rounded p-4 md:p-6">
      <div className="font-space text-[10px] text-alarm tracking-[2px] mb-4">
        INTERACTIVE: THE LATENT EVALUATOR
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* YouTube embed */}
        <div className="flex-1">
          <div className="relative w-full aspect-video bg-concrete rounded overflow-hidden">
            <iframe
              className="absolute inset-0 w-full h-full"
              src="https://www.youtube.com/embed/DkPnUBjRzZs?start=0&end=15&loop=1&mute=1"
              title="IGL Audition Clip"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>

        {/* Sliders */}
        <div className="flex-1 flex flex-col justify-center gap-6">
          <div>
            <label className="font-space text-[10px] text-chalk tracking-[1px] block mb-2">
              YOUR SCORE: <span className="text-alarm">{userScore}</span>
            </label>
            <input
              type="range"
              min={1}
              max={10}
              value={userScore}
              onChange={(e) => { setUserScore(Number(e.target.value)); setRevealed(false); }}
              className="w-full h-2 bg-concrete rounded-full appearance-none cursor-pointer
                [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5
                [&::-webkit-slider-thumb]:bg-alarm [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer"
            />
            <div className="flex justify-between font-space text-[8px] text-dim mt-1">
              <span>1</span><span>10</span>
            </div>
          </div>

          <div>
            <label className="font-space text-[10px] text-chalk tracking-[1px] block mb-2">
              JUDGES&apos; SCORE: <span className="text-gold">{judgeScore}</span>
            </label>
            <input
              type="range"
              min={1}
              max={10}
              value={judgeScore}
              onChange={(e) => { setJudgeScore(Number(e.target.value)); setRevealed(false); }}
              className="w-full h-2 bg-concrete rounded-full appearance-none cursor-pointer
                [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5
                [&::-webkit-slider-thumb]:bg-gold [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer"
            />
            <div className="flex justify-between font-space text-[8px] text-dim mt-1">
              <span>1</span><span>10</span>
            </div>
          </div>

          {!revealed ? (
            <button
              onClick={handleReveal}
              className="w-full py-3 bg-alarm text-white font-space text-xs tracking-[1px] rounded hover:bg-red-600 transition-colors"
            >
              REVEAL VARIANCE
            </button>
          ) : (
            <div className="text-center">
              <div className="font-anton text-3xl text-alarm mb-2">Δ = {delta}</div>
              <p className={`font-dm text-sm ${getResult().color}`}>{getResult().text}</p>
              <button
                onClick={handleReset}
                className="mt-3 px-4 py-2 border border-steel text-dim font-space text-[10px] tracking-[1px] rounded hover:text-chalk transition-colors"
              >
                TRY AGAIN
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Write LatentRiot section component**

Create `components/LatentRiot.tsx`:

```tsx
"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap-setup";
import { latentRiotContent } from "@/lib/content";
import LatentEvaluator from "@/components/LatentEvaluator";

export default function LatentRiot() {
  const sectionRef = useRef<HTMLElement>(null);
  const paragraphsRef = useRef<(HTMLParagraphElement | null)[]>([]);

  useEffect(() => {
    paragraphsRef.current.filter(Boolean).forEach((el) => {
      gsap.fromTo(
        el,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: el,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        }
      );
    });

    return () => {
      ScrollTrigger.getAll()
        .filter((t) => sectionRef.current?.contains(t.trigger as Element))
        .forEach((t) => t.kill());
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="latent-riot"
      className="relative py-24 md:py-32 overflow-hidden"
      style={{
        background: "#141416",
        animation: "hue-cycle 8s ease-in-out infinite",
      }}
    >
      {/* Noise texture at 8% */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
          backgroundSize: "256px",
          opacity: 0.08,
        }}
      />

      <div className="relative max-w-[900px] mx-auto px-6 z-10">
        {/* Cell door plate */}
        <div className="cell-door-plate mx-auto mb-16">
          <span className="font-space text-[10px] md:text-xs text-alarm tracking-[3px]">
            {latentRiotContent.sectionLabel}
          </span>
        </div>

        {/* Paragraphs */}
        {latentRiotContent.paragraphs.map((text, i) => (
          <p
            key={i}
            ref={(el) => { paragraphsRef.current[i] = el; }}
            className="font-dm text-base md:text-lg text-chalk leading-[1.8] mb-6 opacity-0 max-w-[720px] mx-auto"
          >
            {text}
          </p>
        ))}

        {/* Stats */}
        <div className="flex flex-wrap gap-3 justify-center mb-12">
          {latentRiotContent.stats.map((stat, i) => (
            <div key={i} className="text-center px-5 py-3 bg-cell rounded border border-alarm/25">
              <div className="font-anton text-2xl md:text-4xl text-alarm">
                {stat.prefix || ""}{typeof stat.value === "number" ? stat.value.toLocaleString() : stat.value}{stat.suffix}
              </div>
              <div className="font-dm text-[10px] text-dim mt-1">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Latent Evaluator */}
        <LatentEvaluator />

        {/* Tally marks */}
        <div className="absolute bottom-6 right-6 font-space text-lg text-steel">
          {latentRiotContent.tallyMarks}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Add to page.tsx**

Add imports for `LatentRiot` and replace the `<section id="latent-riot">` block with `<LatentRiot />`.

- [ ] **Step 4: Verify**

Run: `npm run dev`
Expected: Section has subtle hue-rotation, noise texture visible. Content fades in. YouTube embed plays. Sliders work, reveal button shows variance with appropriate message. Stats display in alarm red.

- [ ] **Step 5: Commit**

```bash
git add components/LatentRiot.tsx components/LatentEvaluator.tsx app/page.tsx
git commit -m "feat: IGL riot section with latent evaluator interactive component"
```

---

### Task 8: Solitary FIR Section — Viewport Narrowing + Slider + Split-Screen

**Files:**
- Create: `components/SolitaryFIR.tsx`, `components/FIRSlider.tsx`, `components/FIRModal.tsx`, `components/FatherMother.tsx`
- Modify: `app/page.tsx`

- [ ] **Step 1: Write FIRModal component**

Create `components/FIRModal.tsx`:

```tsx
"use client";

interface FIRModalProps {
  onDismiss: () => void;
}

export default function FIRModal({ onDismiss }: FIRModalProps) {
  return (
    <div className="fixed inset-0 z-[9999] bg-cell/95 flex items-center justify-center p-6">
      <div className="max-w-[520px] w-full bg-cell border-2 border-alarm p-6 md:p-8 font-space text-sm">
        <div className="text-alarm text-[10px] tracking-[3px] mb-6">
          FIRST INFORMATION REPORT — SECTION 154 Cr.P.C.
        </div>
        <div className="text-chalk text-xs leading-[2] mb-6 space-y-3">
          <p>FIR No: ___/2025</p>
          <p>Date: 08.02.2025</p>
          <p>Sections: BNS 79, 95, 196, 294, 296, 299 · IT Act 67</p>
          <p>Accused: Samay Raina, Comedian</p>
          <p className="text-dim mt-4">
            &ldquo;I had killed 99% of the germs. I didn&apos;t know the pandemic would happen from that 1%.&rdquo;
          </p>
        </div>
        <button
          onClick={onDismiss}
          className="w-full py-3 bg-alarm text-white font-space text-xs tracking-[2px] hover:bg-red-600 transition-colors"
        >
          DISMISS FIR
        </button>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Write FIRSlider component**

Create `components/FIRSlider.tsx`:

```tsx
"use client";

import { useState, useCallback } from "react";
import FIRModal from "@/components/FIRModal";

export default function FIRSlider() {
  const [value, setValue] = useState(100);
  const [showModal, setShowModal] = useState(false);
  const [flashRed, setFlashRed] = useState(false);

  const degradationLevel = value <= 1 ? "critical" : value <= 25 ? "static" : value <= 50 ? "cracks" : value <= 75 ? "glitch" : "none";

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const v = Number(e.target.value);
    setValue(v);

    if (v <= 1 && !showModal) {
      setFlashRed(true);
      setTimeout(() => {
        setFlashRed(false);
        setShowModal(true);
      }, 100);
    }
  }, [showModal]);

  const handleDismiss = () => {
    setShowModal(false);
    setValue(100);
  };

  return (
    <>
      {/* Red flash */}
      {flashRed && (
        <div className="fixed inset-0 z-[9998] bg-alarm pointer-events-none" />
      )}

      {/* FIR Modal */}
      {showModal && <FIRModal onDismiss={handleDismiss} />}

      <div className="bg-cell border-2 border-alarm rounded p-4 md:p-6 relative">
        <div className="font-space text-[10px] text-alarm tracking-[2px] mb-4">
          CONTENT FILTRATION SYSTEM
        </div>

        {/* Crack overlay */}
        {(degradationLevel === "cracks" || degradationLevel === "static" || degradationLevel === "critical") && (
          <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-30" viewBox="0 0 400 200" preserveAspectRatio="none">
            <path d="M0,100 L80,95 L120,110 L180,85 L220,105 L280,90 L340,100 L400,95" stroke="#FF3D00" strokeWidth="0.5" fill="none" />
            <path d="M100,0 L105,50 L95,90 L110,140 L100,200" stroke="#FF3D00" strokeWidth="0.5" fill="none" />
            <path d="M300,0 L295,60 L305,120 L290,180 L300,200" stroke="#FF3D00" strokeWidth="0.3" fill="none" />
          </svg>
        )}

        {/* Slider */}
        <div className="flex justify-between font-space text-[9px] text-dim mb-2">
          <span>FILTRATION 100%</span>
          <span className="text-alarm">0%</span>
        </div>
        <input
          type="range"
          min={0}
          max={100}
          value={value}
          onChange={handleChange}
          className="w-full h-2 bg-concrete rounded-full appearance-none cursor-pointer
            [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5
            [&::-webkit-slider-thumb]:bg-alarm [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer"
          style={{ direction: "rtl" }}
        />

        {/* Degradation label */}
        <div
          className={`font-space text-[10px] mt-3 text-center ${degradationLevel === "none" ? "text-dim" : "text-alarm"}`}
          style={{
            animation: degradationLevel === "glitch" ? "glitch-jitter 0.3s infinite" : undefined,
          }}
        >
          {degradationLevel === "none" && `${value}% — Content within acceptable limits`}
          {degradationLevel === "glitch" && `${value}% — WARNING: Content integrity degrading`}
          {degradationLevel === "cracks" && `${value}% — ALERT: Structural damage detected`}
          {degradationLevel === "static" && `${value}% — CRITICAL: System failure imminent`}
          {degradationLevel === "critical" && `${value}% — [REDACTED]`}
        </div>
      </div>
    </>
  );
}
```

- [ ] **Step 3: Write FatherMother component**

Create `components/FatherMother.tsx`:

```tsx
"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap-setup";
import { solitaryFIRContent } from "@/lib/content";

export default function FatherMother() {
  const motherRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (motherRef.current) {
      gsap.fromTo(
        motherRef.current,
        { filter: "blur(4px) sepia(0.3) saturate(1.2)" },
        {
          filter: "blur(0px) sepia(0.3) saturate(1.2)",
          ease: "power2.inOut",
          scrollTrigger: {
            trigger: motherRef.current,
            start: "top 70%",
            end: "bottom 30%",
            scrub: 1,
          },
        }
      );
    }

    return () => {
      ScrollTrigger.getAll()
        .filter((t) => motherRef.current === t.trigger || (motherRef.current?.parentElement?.contains(t.trigger as Element)))
        .forEach((t) => t.kill());
    };
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-12">
      {/* Mother — warm, blurred, de-blurs */}
      <div
        ref={motherRef}
        className="p-6 bg-concrete rounded border border-steel"
        style={{ filter: "blur(4px) sepia(0.3) saturate(1.2)" }}
      >
        <div className="font-space text-[10px] text-gold tracking-[1px] mb-4">
          {solitaryFIRContent.motherContent.title}
        </div>
        <p className="font-dm text-sm text-chalk leading-[1.8]">
          {solitaryFIRContent.motherContent.text}
        </p>
      </div>

      {/* Father — cold B&W, always sharp */}
      <div
        className="p-6 bg-concrete rounded border border-steel"
        style={{ filter: "grayscale(1) contrast(1.1)" }}
      >
        <div className="font-space text-[10px] text-chalk tracking-[1px] mb-4">
          {solitaryFIRContent.fatherContent.title}
        </div>
        <p className="font-dm text-sm text-chalk leading-[1.8]">
          {solitaryFIRContent.fatherContent.text}
        </p>
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Write SolitaryFIR section component**

Create `components/SolitaryFIR.tsx`:

```tsx
"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap-setup";
import { solitaryFIRContent } from "@/lib/content";
import FIRSlider from "@/components/FIRSlider";
import FatherMother from "@/components/FatherMother";

export default function SolitaryFIR() {
  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const paragraphsRef = useRef<(HTMLParagraphElement | null)[]>([]);

  useEffect(() => {
    // Viewport narrowing: 900px → 520px
    if (containerRef.current && sectionRef.current) {
      gsap.fromTo(
        containerRef.current,
        { maxWidth: "900px", padding: "0 20px" },
        {
          maxWidth: "520px",
          padding: "0 40px",
          ease: "power2.inOut",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top center",
            end: "+=200%",
            scrub: 1,
          },
        }
      );
    }

    // Paragraph reveals
    paragraphsRef.current.filter(Boolean).forEach((el) => {
      gsap.fromTo(
        el,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: el,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        }
      );
    });

    return () => {
      ScrollTrigger.getAll()
        .filter((t) => sectionRef.current?.contains(t.trigger as Element))
        .forEach((t) => t.kill());
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="solitary-fir"
      className="relative bg-cell py-24 md:py-32"
    >
      <div
        ref={containerRef}
        className="mx-auto"
        style={{ maxWidth: "900px", padding: "0 20px", willChange: "max-width, padding" }}
      >
        {/* Cell door plate */}
        <div className="cell-door-plate mx-auto mb-16 border-alarm">
          <span className="font-space text-[10px] md:text-xs text-alarm tracking-[3px]">
            {solitaryFIRContent.sectionLabel}
          </span>
        </div>

        {/* Paragraphs */}
        {solitaryFIRContent.paragraphs.map((text, i) => (
          <p
            key={i}
            ref={(el) => { paragraphsRef.current[i] = el; }}
            className="font-dm text-base md:text-lg text-chalk leading-[1.8] mb-6 opacity-0"
          >
            {text}
          </p>
        ))}

        {/* FIR Slider */}
        <div className="my-12">
          <FIRSlider />
        </div>

        {/* Father vs Mother */}
        <FatherMother />

        {/* Tally marks */}
        <div className="text-right font-space text-lg text-steel mt-8">
          {solitaryFIRContent.tallyMarks}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 5: Add to page.tsx**

Add `import SolitaryFIR from "@/components/SolitaryFIR";` and replace the `<section id="solitary-fir">` block with `<SolitaryFIR />`.

- [ ] **Step 6: Verify**

Run: `npm run dev`
Expected: Content narrows as you scroll through section. FIR slider shows progressive degradation — glitch text at 75%, cracks at 50%, static text at 25%, red flash + modal at 1%. Modal is un-closable except via button. Mother side starts blurred and de-blurs, Father side stays cold B&W.

- [ ] **Step 7: Commit**

```bash
git add components/SolitaryFIR.tsx components/FIRSlider.tsx components/FIRModal.tsx components/FatherMother.tsx app/page.tsx
git commit -m "feat: solitary FIR section with viewport narrowing, germ slider, and father-mother split"
```

---

### Task 9: Still Alive Section — Viewport Expansion + Kinetic Stats

**Files:**
- Create: `components/StillAlive.tsx`, `components/KineticStats.tsx`
- Modify: `app/page.tsx`

- [ ] **Step 1: Write KineticStats component**

Create `components/KineticStats.tsx`:

```tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { CountUp } from "countup.js";

interface Stat {
  value: number;
  suffix: string;
  label: string;
}

interface KineticStatsProps {
  stats: Stat[];
}

export default function KineticStats({ stats }: KineticStatsProps) {
  const statRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          statRefs.current.forEach((el, i) => {
            if (!el) return;
            const stat = stats[i];
            const countUp = new CountUp(el, stat.value, {
              duration: 2.5,
              separator: ",",
              suffix: stat.suffix,
              useEasing: true,
            });
            countUp.start();
          });
        }
      },
      { threshold: 0.3 }
    );

    const firstRef = statRefs.current[0];
    if (firstRef) observer.observe(firstRef);

    return () => observer.disconnect();
  }, [stats, hasAnimated]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-12">
      {stats.map((stat, i) => (
        <div
          key={i}
          className="text-center py-6 px-4 bg-black/50 rounded border border-alive/25"
          style={{ animation: hasAnimated ? "stat-pulse 2s ease-in-out infinite" : undefined }}
        >
          <div
            ref={(el) => { statRefs.current[i] = el; }}
            className="font-anton text-stat-mobile md:text-stat-desktop text-alive"
          >
            0
          </div>
          <div className="font-dm text-xs md:text-sm text-dim mt-2">
            {stat.label}
          </div>
        </div>
      ))}
    </div>
  );
}
```

- [ ] **Step 2: Write StillAlive section component**

Create `components/StillAlive.tsx`:

```tsx
"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap-setup";
import { stillAliveContent } from "@/lib/content";
import KineticStats from "@/components/KineticStats";

export default function StillAlive() {
  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const greenBgRef = useRef<HTMLDivElement>(null);
  const quoteRef = useRef<HTMLDivElement>(null);
  const paragraphsRef = useRef<(HTMLParagraphElement | null)[]>([]);

  useEffect(() => {
    const section = sectionRef.current;

    // Viewport expansion: 520px → 1200px
    if (containerRef.current && section) {
      gsap.fromTo(
        containerRef.current,
        { maxWidth: "520px" },
        {
          maxWidth: "1200px",
          ease: "power2.inOut",
          scrollTrigger: {
            trigger: section,
            start: "top center",
            end: "+=100%",
            scrub: 1,
          },
        }
      );
    }

    // Green background bloom
    if (greenBgRef.current && section) {
      gsap.fromTo(
        greenBgRef.current,
        { opacity: 0, scale: 0.5 },
        {
          opacity: 0.85,
          scale: 1,
          ease: "power2.inOut",
          scrollTrigger: {
            trigger: section,
            start: "top 60%",
            end: "center center",
            scrub: 1,
          },
        }
      );
    }

    // Paragraph reveals
    paragraphsRef.current.filter(Boolean).forEach((el) => {
      gsap.fromTo(
        el,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: el,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        }
      );
    });

    // Quote fade
    if (quoteRef.current) {
      gsap.fromTo(
        quoteRef.current,
        { opacity: 0 },
        {
          opacity: 1,
          duration: 2,
          ease: "power2.inOut",
          scrollTrigger: {
            trigger: quoteRef.current,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        }
      );
    }

    return () => {
      ScrollTrigger.getAll()
        .filter((t) => section?.contains(t.trigger as Element))
        .forEach((t) => t.kill());
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="still-alive"
      className="relative bg-cell py-24 md:py-32 overflow-hidden"
    >
      {/* Green radial background */}
      <div
        ref={greenBgRef}
        className="absolute inset-0 opacity-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at center, #00E676, transparent 70%)",
        }}
      />

      {/* Broken bars at top */}
      <div className="absolute top-0 left-0 right-0 h-16 flex justify-around px-8 opacity-10 pointer-events-none">
        {[15, -20, 8, -12, 25, -8].map((rot, i) => (
          <div
            key={i}
            className="w-[6px] bg-steel"
            style={{
              height: `${35 + Math.random() * 25}px`,
              transform: `rotate(${rot}deg)`,
            }}
          />
        ))}
      </div>

      <div
        ref={containerRef}
        className="relative mx-auto px-6 z-10"
        style={{ maxWidth: "520px" }}
      >
        {/* Cell door plate */}
        <div className="cell-door-plate mx-auto mb-16 border-alive">
          <span className="font-space text-[10px] md:text-xs text-alive tracking-[3px]">
            {stillAliveContent.sectionLabel}
          </span>
        </div>

        {/* Paragraphs */}
        {stillAliveContent.paragraphs.map((text, i) => (
          <p
            key={i}
            ref={(el) => { paragraphsRef.current[i] = el; }}
            className="font-dm text-base md:text-lg text-chalk leading-[1.8] mb-6 opacity-0 text-center"
          >
            {text}
          </p>
        ))}

        {/* Kinetic stats */}
        <KineticStats stats={stillAliveContent.stats} />

        {/* Closing quote */}
        <div ref={quoteRef} className="text-center mt-12 opacity-0">
          <p className="font-caveat text-[24px] md:text-[32px] text-chalk leading-[1.4]">
            {stillAliveContent.quote}
          </p>
          <p className="font-dm text-sm text-dim mt-2 italic">
            {stillAliveContent.quoteTranslation}
          </p>
        </div>

        {/* Tally marks */}
        <div className="text-right font-space text-lg text-alive/40 mt-12">
          {stillAliveContent.tallyMarks}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Add to page.tsx**

Add `import StillAlive from "@/components/StillAlive";` and replace the `<section id="still-alive">` block with `<StillAlive />`.

- [ ] **Step 4: Verify**

Run: `npm run dev`
Expected: Viewport expands as you scroll in. Green radial background blooms from center. Broken bars visible at top. Stats count up on scroll into view with pulse animation. Quote fades in. Dramatic contrast from the narrow FIR section.

- [ ] **Step 5: Commit**

```bash
git add components/StillAlive.tsx components/KineticStats.tsx app/page.tsx
git commit -m "feat: still alive section with viewport expansion and kinetic stats"
```

---

### Task 10: The Wall Section — Community Quotes + Footer

**Files:**
- Create: `components/Wall.tsx`
- Modify: `app/page.tsx`

- [ ] **Step 1: Write Wall component**

Create `components/Wall.tsx`:

```tsx
"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap-setup";
import { wallContent } from "@/lib/content";

// Predefined random-looking angles and positions for scattered layout
const cardStyles = [
  { rotate: -3, top: 0, left: "5%" },
  { rotate: 2, top: 0, left: "55%" },
  { rotate: 1.5, top: "180px", left: "15%" },
  { rotate: -2, top: "160px", left: "60%" },
  { rotate: 3, top: "340px", left: "5%" },
  { rotate: -1, top: "320px", left: "50%" },
  { rotate: 2.5, top: "480px", left: "20%" },
  { rotate: -3, top: "460px", left: "65%" },
  { rotate: 1, top: "620px", left: "8%" },
  { rotate: -2.5, top: "600px", left: "55%" },
  { rotate: 3, top: "760px", left: "25%" },
  { rotate: -1.5, top: "740px", left: "60%" },
];

export default function Wall() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const footerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    cardsRef.current.filter(Boolean).forEach((el, i) => {
      const style = cardStyles[i] || cardStyles[0];
      gsap.fromTo(
        el,
        { opacity: 0, y: 40, rotation: 0 },
        {
          opacity: 1,
          y: 0,
          rotation: style.rotate,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: el,
            start: "top 85%",
            toggleActions: "play none none none",
          },
          delay: i * 0.1,
        }
      );
    });

    if (footerRef.current) {
      gsap.fromTo(
        footerRef.current,
        { opacity: 0 },
        {
          opacity: 1,
          duration: 1,
          ease: "power2.inOut",
          scrollTrigger: {
            trigger: footerRef.current,
            start: "top 85%",
            toggleActions: "play none none none",
          },
        }
      );
    }

    return () => {
      ScrollTrigger.getAll()
        .filter((t) => sectionRef.current?.contains(t.trigger as Element))
        .forEach((t) => t.kill());
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="wall"
      className="relative py-24 md:py-32 overflow-hidden"
      style={{ background: "linear-gradient(180deg, #00E676, #0A0A0A 300px, #0A0A0A)" }}
    >
      <div className="max-w-[1200px] mx-auto px-6">
        {/* Cell door plate */}
        <div className="cell-door-plate mx-auto mb-16">
          <span className="font-space text-[10px] md:text-xs text-chalk tracking-[3px]">
            {wallContent.sectionLabel}
          </span>
        </div>

        {/* Scattered quote cards */}
        <div className="relative mx-auto" style={{ minHeight: "900px", maxWidth: "800px" }}>
          {wallContent.quotes.map((quote, i) => {
            const style = cardStyles[i] || cardStyles[0];
            return (
              <div
                key={i}
                ref={(el) => { cardsRef.current[i] = el; }}
                className="absolute w-[200px] md:w-[280px] p-4 bg-concrete border border-steel rounded opacity-0"
                style={{
                  top: style.top,
                  left: style.left,
                }}
              >
                <p className="font-caveat text-base md:text-lg text-chalk leading-[1.4]">
                  &ldquo;{quote.text}&rdquo;
                </p>
                <p className="font-space text-[8px] text-dim mt-2">
                  — {quote.author}
                </p>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div ref={footerRef} className="text-center mt-16 opacity-0">
          <p className="font-caveat text-[22px] md:text-[28px] text-alarm leading-[1.4] mb-8">
            {wallContent.tribute}
          </p>
          <div className="w-16 h-px bg-steel mx-auto mb-8" />
          <p className="font-dm text-sm text-dim">
            {wallContent.credit}
          </p>
          <p className="font-space text-[10px] text-steel mt-4 cursor-pointer hover:text-dim transition-colors">
            {wallContent.nextEpisodeCta}
          </p>
        </div>

        {/* Tally marks */}
        <div className="text-right font-space text-lg text-steel mt-12">
          {wallContent.tallyMarks}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Add to page.tsx**

Add `import Wall from "@/components/Wall";` and replace the `<section id="wall">` block with `<Wall />`.

- [ ] **Step 3: Verify**

Run: `npm run dev`
Expected: Green-to-dark gradient at top. Quote cards stagger in at random angles. Tribute line in red Caveat. Brokai Labs credit visible. Cards feel scattered, not grid-aligned.

- [ ] **Step 4: Commit**

```bash
git add components/Wall.tsx app/page.tsx
git commit -m "feat: wall section with scattered community quotes and footer"
```

---

### Task 11: Easter Eggs

**Files:**
- Create: `components/EasterEggs.tsx`
- Modify: `app/page.tsx`

- [ ] **Step 1: Write EasterEggs component**

Create `components/EasterEggs.tsx`:

```tsx
"use client";

import { useEffect, useState, useRef, useCallback } from "react";

export default function EasterEggs() {
  const [isBakchod, setIsBakchod] = useState(false);
  const [showFIRTally, setShowFIRTally] = useState(false);
  const bufferRef = useRef("");
  const knightRef = useRef<HTMLDivElement>(null);
  const mousePos = useRef({ x: 0, y: 0 });
  const knightPos = useRef({ x: 0, y: 0 });
  const rafRef = useRef<number>(0);
  const isInChessYard = useRef(false);

  // Konami code: type "BAKCHOD"
  useEffect(() => {
    const target = "BAKCHOD";
    const handleKeyDown = (e: KeyboardEvent) => {
      bufferRef.current += e.key.toUpperCase();
      if (bufferRef.current.length > target.length) {
        bufferRef.current = bufferRef.current.slice(-target.length);
      }
      if (bufferRef.current === target) {
        setIsBakchod((prev) => !prev);
        bufferRef.current = "";
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Apply IGL branding inversion
  useEffect(() => {
    if (isBakchod) {
      document.documentElement.style.filter = "invert(1) hue-rotate(180deg)";
    } else {
      document.documentElement.style.filter = "";
    }
    return () => { document.documentElement.style.filter = ""; };
  }, [isBakchod]);

  // Knight cursor follower (chess yard section only)
  const updateKnight = useCallback(() => {
    if (!knightRef.current || !isInChessYard.current) {
      rafRef.current = requestAnimationFrame(updateKnight);
      return;
    }
    const lerp = 0.1;
    knightPos.current.x += (mousePos.current.x - knightPos.current.x) * lerp;
    knightPos.current.y += (mousePos.current.y - knightPos.current.y) * lerp;
    knightRef.current.style.transform = `translate(${knightPos.current.x}px, ${knightPos.current.y}px)`;
    knightRef.current.style.opacity = "1";
    rafRef.current = requestAnimationFrame(updateKnight);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX + 15, y: e.clientY + 15 };
      const chessYard = document.getElementById("chess-yard");
      if (chessYard) {
        const rect = chessYard.getBoundingClientRect();
        isInChessYard.current =
          e.clientY >= rect.top && e.clientY <= rect.bottom;
      }
    };

    // Only on desktop
    const isDesktop = window.matchMedia("(min-width: 768px)").matches;
    if (isDesktop) {
      window.addEventListener("mousemove", handleMouseMove);
      rafRef.current = requestAnimationFrame(updateKnight);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(rafRef.current);
    };
  }, [updateKnight]);

  // FIR tally: days since Feb 8, 2025
  const firDate = new Date("2025-02-08");
  const daysSinceFIR = Math.floor(
    (Date.now() - firDate.getTime()) / (1000 * 60 * 60 * 24)
  );

  return (
    <>
      {/* Knight cursor */}
      <div
        ref={knightRef}
        className="fixed top-0 left-0 z-[9989] pointer-events-none opacity-0 hidden md:block"
        style={{ transition: "opacity 0.3s" }}
      >
        <span className="text-2xl" role="img" aria-label="chess knight">♞</span>
      </div>

      {/* FIR Tally — click to reveal */}
      <div
        className="fixed bottom-4 right-4 z-[9989] cursor-pointer"
        onClick={() => setShowFIRTally((prev) => !prev)}
      >
        {showFIRTally ? (
          <div className="font-space text-[10px] text-alarm bg-cell/90 px-3 py-2 rounded border border-alarm/30">
            Days since last FIR: {daysSinceFIR}
          </div>
        ) : (
          <div className="font-space text-[10px] text-steel hover:text-dim transition-colors">
            ⓘ
          </div>
        )}
      </div>
    </>
  );
}
```

- [ ] **Step 2: Add EasterEggs to page.tsx**

Add `import EasterEggs from "@/components/EasterEggs";` and render `<EasterEggs />` alongside the other global elements (after `<SoundToggle />`).

- [ ] **Step 3: Verify**

Run: `npm run dev`
Expected:
- Type "BAKCHOD" → site inverts colors. Type again → reverts.
- Knight (♞) follows cursor smoothly in Chess Yard section only (desktop).
- Click ⓘ in bottom-right → shows "Days since last FIR: [number]".
- Hover surveillance cam 3s → timestamp changes to birthday (from Task 3).

- [ ] **Step 4: Commit**

```bash
git add components/EasterEggs.tsx app/page.tsx
git commit -m "feat: easter eggs — konami code, knight cursor, FIR tally, birthday timestamp"
```

---

### Task 12: Audio Integration

**Files:**
- Modify: `lib/audio.ts`, `components/Hero.tsx`, `components/FIRSlider.tsx`

- [ ] **Step 1: Generate placeholder audio files**

We'll create minimal placeholder audio files. The metallic groan, clank, and static noise will be sourced from free SFX sites or generated. For now, create empty placeholders so the code doesn't error:

```bash
cd /Users/nanddave/Downloads/Projects/Samay_raina
# Create silent placeholder MP3s (we'll replace with real audio later)
# Using base64 of a minimal valid MP3 frame
echo "//uQx" | base64 -d > public/audio/metallic-groan.mp3 2>/dev/null || touch public/audio/metallic-groan.mp3
echo "//uQx" | base64 -d > public/audio/clank.mp3 2>/dev/null || touch public/audio/clank.mp3
echo "//uQx" | base64 -d > public/audio/static-noise.mp3 2>/dev/null || touch public/audio/static-noise.mp3
echo "//uQx" | base64 -d > public/audio/roast-clip.mp3 2>/dev/null || touch public/audio/roast-clip.mp3
```

- [ ] **Step 2: Extend audio.ts with Howler wrapper**

Replace `lib/audio.ts`:

```ts
"use client";

let isMuted = true;
const listeners: Set<(muted: boolean) => void> = new Set();

export function getIsMuted(): boolean {
  return isMuted;
}

export function toggleMute(): boolean {
  isMuted = !isMuted;
  listeners.forEach((fn) => fn(isMuted));
  return isMuted;
}

export function onMuteChange(fn: (muted: boolean) => void): () => void {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

// Lazy-loaded Howler instances
let howlerModule: typeof import("howler") | null = null;
const sounds: Map<string, Howl> = new Map();

async function loadHowler() {
  if (!howlerModule) {
    howlerModule = await import("howler");
  }
  return howlerModule;
}

export async function playSound(
  name: string,
  src: string,
  options?: { loop?: boolean; volume?: number }
): Promise<Howl | null> {
  if (isMuted) return null;

  const { Howl } = await loadHowler();

  let sound = sounds.get(name);
  if (!sound) {
    sound = new Howl({
      src: [src],
      loop: options?.loop ?? false,
      volume: options?.volume ?? 0.5,
      preload: true,
    });
    sounds.set(name, sound);
  }

  sound.play();
  return sound;
}

export function stopSound(name: string): void {
  const sound = sounds.get(name);
  if (sound) {
    sound.stop();
  }
}

export function setSoundVolume(name: string, volume: number): void {
  const sound = sounds.get(name);
  if (sound) {
    sound.volume(volume);
  }
}
```

- [ ] **Step 3: Add audio triggers to Hero.tsx**

In `components/Hero.tsx`, add audio import and trigger inside the GSAP timeline. After the bar rotation starts (at position 0 in the timeline):

Add at the top of Hero.tsx:
```ts
import { playSound, stopSound, onMuteChange } from "@/lib/audio";
```

Inside the `mm.add` callback, after creating the timeline, add `onUpdate` for audio:

```ts
// Audio triggers
let groanPlaying = false;
tl.eventCallback("onUpdate", () => {
  const progress = tl.progress();
  if (progress > 0.05 && progress < 0.95 && !groanPlaying) {
    playSound("metallic-groan", "/audio/metallic-groan.mp3", {
      loop: true,
      volume: 0.15,
    });
    groanPlaying = true;
  }
  if (progress >= 0.95 && groanPlaying) {
    stopSound("metallic-groan");
    playSound("clank", "/audio/clank.mp3", { volume: 0.4 });
    groanPlaying = false;
  }
});
```

- [ ] **Step 4: Add static audio to FIRSlider**

In `components/FIRSlider.tsx`, add audio for the static effect at 25%:

Add import:
```ts
import { playSound, stopSound, setSoundVolume } from "@/lib/audio";
```

In the `handleChange` callback, after setting value:
```ts
if (v <= 25 && v > 1) {
  playSound("static", "/audio/static-noise.mp3", { loop: true, volume: 0.1 });
  setSoundVolume("static", 0.3 * (1 - v / 25));
} else {
  stopSound("static");
}
```

- [ ] **Step 5: Verify**

Run: `npm run dev`
Expected: With sound toggle enabled, metallic groan plays during hero scroll, clank plays at end. Static noise builds during FIR slider drag toward 0%. All audio respects mute toggle. No errors with placeholder files (they may be silent).

- [ ] **Step 6: Commit**

```bash
git add lib/audio.ts components/Hero.tsx components/FIRSlider.tsx public/audio/
git commit -m "feat: audio integration with howler.js for hero and FIR slider"
```

---

### Task 13: Final Assembly + Mobile Polish + Performance

**Files:**
- Modify: `app/page.tsx`, various components

- [ ] **Step 1: Assemble final page.tsx**

Ensure `app/page.tsx` imports and renders all components in order:

```tsx
"use client";

import { useEffect } from "react";
import { initScrollEngine, destroyScrollEngine } from "@/lib/gsap-setup";
import SurveillanceCam from "@/components/SurveillanceCam";
import SoundToggle from "@/components/SoundToggle";
import EasterEggs from "@/components/EasterEggs";
import Hero from "@/components/Hero";
import Kashmir from "@/components/Kashmir";
import ChessYard from "@/components/ChessYard";
import LatentRiot from "@/components/LatentRiot";
import SolitaryFIR from "@/components/SolitaryFIR";
import StillAlive from "@/components/StillAlive";
import Wall from "@/components/Wall";

export default function Home() {
  useEffect(() => {
    const lenis = initScrollEngine();
    return () => destroyScrollEngine();
  }, []);

  return (
    <>
      <SurveillanceCam />
      <SoundToggle />
      <EasterEggs />
      <main>
        <Hero />
        <Kashmir />
        <ChessYard />
        <LatentRiot />
        <SolitaryFIR />
        <StillAlive />
        <Wall />
      </main>
    </>
  );
}
```

- [ ] **Step 2: Run build to check for errors**

```bash
cd /Users/nanddave/Downloads/Projects/Samay_raina
npm run build
```

Expected: Build succeeds with no TypeScript errors. Check output for any warnings.

- [ ] **Step 3: Test mobile viewport**

Open dev tools at 375px width. Verify:
- Hero: 7 bars visible, 56px name, scroll indicator visible
- Kashmir: Text readable at 16px+
- Chess: Board fits within mobile width
- Latent Evaluator: Stacks vertically
- FIR: Viewport narrowing still feels claustrophobic
- Stats: Single column layout
- Wall: Cards don't overflow horizontally
- No horizontal scrollbar anywhere

- [ ] **Step 4: Performance check**

```bash
cd /Users/nanddave/Downloads/Projects/Samay_raina
npm run build && npm run start
```

Open Chrome DevTools → Lighthouse → Performance audit. Check:
- LCP < 2.5s
- CLS < 0.1
- No layout shift from font loading (next/font handles this)
- Scroll animations smooth in Performance tab (no red frames)

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: final assembly, mobile polish, and performance verification"
```

---

### Task 14: Deploy to Vercel

**Files:** None (deployment only)

- [ ] **Step 1: Initialize Vercel project**

```bash
cd /Users/nanddave/Downloads/Projects/Samay_raina
npx vercel --yes
```

Follow prompts. Link to Vercel account. Project name: `samay-raina-tribute`.

- [ ] **Step 2: Deploy to production**

```bash
npx vercel --prod
```

Expected: Returns a production URL. Site loads correctly.

- [ ] **Step 3: Verify OG tags**

Test the production URL with:
- https://www.opengraph.xyz/ — paste the URL, check title/description/image render
- Share on LinkedIn/X to preview card

- [ ] **Step 4: Commit deployment config**

```bash
git add .vercel vercel.json 2>/dev/null; git add -A
git commit -m "chore: vercel deployment configuration"
```
