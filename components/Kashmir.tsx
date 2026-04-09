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

    const section = sectionRef.current;
    
    return () => {
      ScrollTrigger.getAll()
        .filter((t) => section?.contains(t.trigger as Element))
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

      <div className="relative max-w-[1200px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
        {/* Cell door plate */}
        <div className="lg:col-span-2 cell-door-plate mx-auto mb-16">
          <span className="font-space text-[10px] md:text-xs text-dim tracking-[3px]">
            {kashmirContent.sectionLabel}
          </span>
        </div>

        {/* Paragraphs */}
        <div className="flex flex-col gap-6">
          {kashmirContent.paragraphs.map((text, i) => (
            <p
              key={i}
              ref={(el) => { paragraphsRef.current[i] = el; }}
              className="font-dm text-base md:text-xl lg:text-2xl text-chalk leading-[1.8] opacity-0"
            >
              {text}
            </p>
          ))}
        </div>

        {/* Quote */}
        <div ref={quoteRef} className="border-l-[4px] lg:border-l-[8px] border-steel pl-6 lg:pl-12 opacity-0">
          <p className="font-caveat text-[28px] md:text-[36px] lg:text-[48px] text-chalk leading-[1.4] -rotate-2">
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
