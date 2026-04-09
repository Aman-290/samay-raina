"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap-setup";
import { heroContent } from "@/lib/content";
import { playSound, stopSound } from "@/lib/audio";

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

        return () => {
          stopSound("metallic-groan");
          stopSound("clank");
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
        background: "linear-gradient(180deg, #3A3A3C, #2A2A2E, #3A3A3C)",
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

      {/* Portrait */}
      <div
        ref={portraitRef}
        className="absolute inset-0 flex items-center justify-center"
        style={{
          filter: "brightness(0.4) saturate(0.4)",
        }}
      >
        <img
          src="/images/samay-portrait.png"
          alt="Samay Raina"
          className="w-[300px] h-[400px] md:w-[400px] md:h-[520px] object-cover rounded"
        />
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
        <span className="block text-dim mt-2" style={{ animation: "scroll-pulse 2s infinite" }}>
          ▼
        </span>
      </div>
    </section>
  );
}
