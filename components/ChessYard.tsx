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

  const gridCells = Array.from({ length: 64 }, (_, i) => {
    const row = Math.floor(i / 8);
    const col = i % 8;
    const isDark = (row + col) % 2 === 1;
    return <div key={i} className={isDark ? "bg-gold" : ""} />;
  });

  return (
    <section
      ref={sectionRef}
      id="chess-yard"
      className="relative py-24 md:py-32 overflow-hidden"
      style={{ background: "linear-gradient(180deg, #0A0A0A, #141416 200px, #141416)" }}
    >
      <div
        ref={gridRef}
        className="absolute inset-0 grid grid-cols-8 opacity-0 pointer-events-none"
        style={{ gridTemplateRows: "repeat(8, 1fr)" }}
      >
        {gridCells}
      </div>

      <div className="relative max-w-[900px] mx-auto px-6 z-10">
        <div className="cell-door-plate mx-auto mb-16">
          <span className="font-space text-[10px] md:text-xs text-gold tracking-[3px]">
            {chessYardContent.sectionLabel}
          </span>
        </div>

        {chessYardContent.paragraphs.map((text, i) => (
          <p
            key={i}
            ref={(el) => { paragraphsRef.current[i] = el; }}
            className="font-dm text-base md:text-lg text-chalk leading-[1.8] mb-6 opacity-0 max-w-[720px] mx-auto"
          >
            {text}
          </p>
        ))}

        <div ref={quoteRef} className="border-l-[3px] border-gold pl-4 mt-8 mb-12 opacity-0 max-w-[720px] mx-auto">
          <p className="font-caveat text-[22px] md:text-[28px] text-gold leading-[1.4] -rotate-1">
            {chessYardContent.quote}
          </p>
        </div>

        <div className="flex gap-4 justify-center mb-12">
          {chessYardContent.stats.map((stat, i) => (
            <div key={i} className="text-center px-6 py-4 bg-cell rounded">
              <div className="font-anton text-[48px] md:text-[72px] leading-none text-gold">
                {stat.value.toLocaleString()}{stat.suffix}
              </div>
              <div className="font-dm text-xs text-dim mt-1">{stat.label}</div>
            </div>
          ))}
        </div>

        <div className="max-w-[400px] mx-auto">
          <ChessPuzzle />
        </div>

        <div className="absolute bottom-6 right-6 font-space text-lg text-steel">
          {chessYardContent.tallyMarks}
        </div>
      </div>
    </section>
  );
}
