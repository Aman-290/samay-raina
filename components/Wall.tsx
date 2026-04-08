"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap-setup";
import { wallContent } from "@/lib/content";

const cardStyles = [
  { rotate: -3, top: "0px", left: "5%" },
  { rotate: 2, top: "0px", left: "55%" },
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
        <div className="cell-door-plate mx-auto mb-16">
          <span className="font-space text-[10px] md:text-xs text-chalk tracking-[3px]">
            {wallContent.sectionLabel}
          </span>
        </div>

        <div className="relative mx-auto" style={{ minHeight: "900px", maxWidth: "800px" }}>
          {wallContent.quotes.map((quote, i) => {
            const style = cardStyles[i] || cardStyles[0];
            return (
              <div
                key={i}
                ref={(el) => { cardsRef.current[i] = el; }}
                className="absolute w-[200px] md:w-[280px] p-4 bg-concrete border border-steel rounded opacity-0"
                style={{ top: style.top, left: style.left }}
              >
                <p className="font-caveat text-base md:text-lg text-chalk leading-[1.4]">
                  &ldquo;{quote.text}&rdquo;
                </p>
                <p className="font-space text-[8px] text-dim mt-2">— {quote.author}</p>
              </div>
            );
          })}
        </div>

        <div ref={footerRef} className="text-center mt-16 opacity-0">
          <p className="font-caveat text-[22px] md:text-[28px] text-alarm leading-[1.4] mb-8">
            {wallContent.tribute}
          </p>
          <div className="w-16 h-px bg-steel mx-auto mb-8" />
          <p className="font-dm text-sm text-dim">{wallContent.credit}</p>
          <p className="font-space text-[10px] text-steel mt-4 cursor-pointer hover:text-dim transition-colors">
            {wallContent.nextEpisodeCta}
          </p>
        </div>

        <div className="text-right font-space text-lg text-steel mt-12">
          {wallContent.tallyMarks}
        </div>
      </div>
    </section>
  );
}
