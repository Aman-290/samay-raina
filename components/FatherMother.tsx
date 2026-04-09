"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap-setup";
import { solitaryFIRContent } from "@/lib/content";

export default function FatherMother() {
  const motherRef = useRef<HTMLDivElement>(null);
  const fatherRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mRef = motherRef.current;
    const fRef = fatherRef.current;
    
    if (mRef) {
      gsap.fromTo(
        mRef,
        { filter: "blur(4px) sepia(0.3) saturate(1.2)", rotateZ: -10, x: -50, opacity: 0 },
        {
          filter: "blur(0px) sepia(0.3) saturate(1.2)",
          rotateZ: -4,
          x: 0,
          opacity: 1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: mRef,
            start: "top 80%",
            end: "bottom 40%",
            scrub: 1,
          },
        }
      );
    }
    
    if (fRef) {
        gsap.fromTo(
          fRef,
          { filter: "grayscale(1) contrast(1.1)", rotateZ: 10, x: 50, y: 30, opacity: 0 },
          {
            filter: "grayscale(0.8) contrast(1.1)",
            rotateZ: 6,
            x: 0,
            y: 0,
            opacity: 1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: fRef,
              start: "top 80%",
              end: "bottom 40%",
              scrub: 1,
            },
          }
        );
      }

    return () => {
      ScrollTrigger.getAll()
        .filter((t) => mRef === t.trigger || fRef === t.trigger || (mRef?.parentElement?.contains(t.trigger as Element)))
        .forEach((t) => t.kill());
    };
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-20 relative">
      <div
        ref={motherRef}
        className="p-8 bg-[#EFEFEF] rounded-sm shadow-[0_15px_35px_rgba(0,0,0,0.4)] relative mx-auto max-w-[400px] z-10 before:absolute before:content-[''] before:-top-4 before:left-1/2 before:-translate-x-1/2 before:w-24 before:h-8 before:bg-[url('data:image/svg+xml,%3Csvg viewBox=\\'0 0 100 30\\' xmlns=\\'http://www.w3.org/2000/svg\\'%3E%3Crect width=\\'100\\' height=\\'30\\' fill=\\'rgba(255,255,255,0.7)\\' opacity=\\'0.5\\'%3E%3C/rect%3E%3C/svg%3E')] before:shadow-[0_1px_3px_rgba(0,0,0,0.1)] before:-rotate-2"
        style={{ filter: "blur(4px) sepia(0.3) saturate(1.2)" }}
      >
        <div className="font-space text-[12px] text-yard font-bold uppercase tracking-[0.2em] mb-6 opacity-60">
          DOCUMENT / {solitaryFIRContent.motherContent.title}
        </div>
        <p className="font-playfair text-lg text-[#222] leading-relaxed italic">
          "{solitaryFIRContent.motherContent.text}"
        </p>
      </div>

      <div
        ref={fatherRef}
        className="p-8 bg-[#D3CEc4] rounded-sm shadow-[0_20px_40px_rgba(0,0,0,0.5)] relative mx-auto max-w-[400px] z-20 mt-12 md:mt-0 before:absolute before:content-[''] before:-top-3 before:left-1/3 before:-translate-x-1/2 before:w-32 before:h-10 before:bg-[url('data:image/svg+xml,%3Csvg viewBox=\\'0 0 100 30\\' xmlns=\\'http://www.w3.org/2000/svg\\'%3E%3Crect width=\\'100\\' height=\\'30\\' fill=\\'rgba(255,255,255,0.6)\\' opacity=\\'0.4\\'%3E%3C/rect%3E%3C/svg%3E')] before:shadow-[0_1px_3px_rgba(0,0,0,0.1)] before:rotate-3"
        style={{ filter: "grayscale(1) contrast(1.1)" }}
      >
        <div className="font-space text-[12px] text-yard font-bold uppercase tracking-[0.2em] mb-6 opacity-60 flex justify-between border-b border-yard/20 pb-2">
            <span>{solitaryFIRContent.fatherContent.title}</span>
            <span>INT-4X</span>
        </div>
        <p className="font-space text-sm text-[#111] leading-[1.8]">
          {solitaryFIRContent.fatherContent.text}
        </p>
      </div>
    </div>
  );
}
