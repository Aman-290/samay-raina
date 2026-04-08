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
