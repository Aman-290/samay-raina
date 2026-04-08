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
