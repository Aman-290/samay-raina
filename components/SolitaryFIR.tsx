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
        <div className="cell-door-plate mx-auto mb-16 border-alarm">
          <span className="font-space text-[10px] md:text-xs text-alarm tracking-[3px]">
            {solitaryFIRContent.sectionLabel}
          </span>
        </div>

        {solitaryFIRContent.paragraphs.map((text, i) => (
          <p
            key={i}
            ref={(el) => { paragraphsRef.current[i] = el; }}
            className="font-dm text-base md:text-lg text-chalk leading-[1.8] mb-6 opacity-0"
          >
            {text}
          </p>
        ))}

        <div className="my-12">
          <FIRSlider />
        </div>

        <FatherMother />

        <div className="text-right font-space text-lg text-steel mt-8">
          {solitaryFIRContent.tallyMarks}
        </div>
      </div>
    </section>
  );
}
