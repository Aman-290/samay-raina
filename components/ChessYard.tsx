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

      <div className="relative max-w-[1400px] mx-auto px-6 z-10">
        <div className="cell-door-plate mx-auto mb-16 lg:mb-24">
          <span className="font-space text-[10px] md:text-xs text-gold tracking-[3px]">
            {chessYardContent.sectionLabel}
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 items-center">
          <div className="lg:col-span-7 flex flex-col gap-6">
            {chessYardContent.paragraphs.map((text, i) => (
              <p
                key={i}
                ref={(el) => { paragraphsRef.current[i] = el; }}
                className="font-dm text-base md:text-xl lg:text-2xl text-chalk leading-[1.8] opacity-0"
              >
                {text}
              </p>
            ))}

            <div ref={quoteRef} className="border-l-[4px] lg:border-l-[8px] border-gold pl-6 lg:pl-10 mt-8 opacity-0">
              <p className="font-caveat text-[28px] md:text-[36px] lg:text-[44px] text-gold leading-[1.4] -rotate-1">
                {chessYardContent.quote}
              </p>
            </div>

            <div className="flex flex-wrap gap-4 mt-12 justify-center lg:justify-start">
              {chessYardContent.stats.map((stat, i) => (
                <div key={i} className="text-center px-8 py-6 bg-cell rounded shadow-xl border border-steel/20">
                  <div className="font-anton text-[56px] md:text-[84px] leading-none text-gold">
                    {stat.value.toLocaleString()}{stat.suffix}
                  </div>
                  <div className="font-dm text-[11px] md:text-xs text-dim mt-2 tracking-widest uppercase">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="w-full max-w-[500px] mx-auto shadow-2xl rounded-sm overflow-hidden bg-cell p-4 border border-gold/10">
              <ChessPuzzle />
            </div>
          </div>
        </div>

        <div className="absolute bottom-6 right-6 font-space text-lg text-steel">
          {chessYardContent.tallyMarks}
        </div>
      </div>
    </section>
  );
}
