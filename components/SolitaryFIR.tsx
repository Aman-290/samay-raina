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
    if (containerRef.current && sectionRef.current) {
      gsap.fromTo(
        containerRef.current,
        { maxWidth: "1000px", padding: "0 20px" },
        {
          maxWidth: "700px",
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

    paragraphsRef.current.filter(Boolean).forEach((el, index) => {
      gsap.fromTo(
        el,
        { opacity: 0, x: 20 },
        {
          opacity: 1,
          x: 0,
          duration: 1,
          delay: index * 0.15,
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
      className="relative py-32 md:py-48 bg-[#0a0a09]"
    >
        {/* Subtle grid background */}
        <div className="absolute inset-0 pointer-events-none opacity-10" style={{ backgroundImage: "linear-gradient(#3a3a3c 1px, transparent 1px), linear-gradient(90deg, #3a3a3c 1px, transparent 1px)", backgroundSize: "40px 40px" }}></div>

      <div
        ref={containerRef}
        className="mx-auto"
        style={{ maxWidth: "1000px", padding: "0 20px", willChange: "max-width, padding" }}
      >
        <div className="flex justify-between items-center mb-16 border-b border-steel/40 pb-4">
            <div className="font-space text-xs text-dim tracking-widest uppercase">FILE REF: SR/FIR-01</div>
            <div className="border border-alarm text-alarm font-space text-[10px] uppercase font-bold px-3 py-1 bg-alarm/5 rotate-[5deg] tracking-widest shadow-[0_0_10px_rgba(255,61,0,0.2)]">Classified</div>
        </div>

        <div className="mb-16">
            <h2 className="font-anton text-4xl md:text-6xl text-chalk uppercase mb-4 tracking-wide">{solitaryFIRContent.sectionLabel}</h2>
            <div className="w-12 h-1 bg-alarm"></div>
        </div>

        <div className="bg-[#111111] border border-steel/30 p-6 md:p-10 shadow-2xl relative">
            {/* Top left corner bracket */}
            <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-chalk/40"></div>
            <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-chalk/40"></div>

            {solitaryFIRContent.paragraphs.map((text, i) => (
            <p
                key={i}
                ref={(el) => { paragraphsRef.current[i] = el; }}
                className="font-space text-sm md:text-base text-chalk/90 leading-[1.9] mb-6 opacity-0 selection:bg-alarm selection:text-yard"
            >
                <span className="text-alarm mr-3 opacity-50">&gt;</span>{text}
            </p>
            ))}
        </div>

        <div className="my-16 md:my-24 bg-cell border border-steel p-2 shadow-2xl skew-x-[-1deg]">
          <FIRSlider />
        </div>

        <FatherMother />

        <div className="flex justify-between items-center mt-16 pt-8 border-t border-steel/30">
            <div className="font-space text-xs text-dim uppercase">END OF FILE</div>
            <div className="text-right font-space text-3xl text-steel opacity-30 -rotate-[15deg]">
            {solitaryFIRContent.tallyMarks}
            </div>
        </div>
      </div>
    </section>
  );
}
