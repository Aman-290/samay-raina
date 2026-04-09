"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap-setup";
import { kashmirContent } from "@/lib/content";

export default function Kashmir() {
  const sectionRef = useRef<HTMLElement>(null);
  const paragraphsRef = useRef<(HTMLParagraphElement | null)[]>([]);
  const quoteRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const elements = paragraphsRef.current.filter(Boolean);
    elements.forEach((el, index) => {
      gsap.fromTo(
        el,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 1.2,
          ease: "power2.out",
          scrollTrigger: {
            trigger: el,
            start: "top 85%",
            toggleActions: "play none none none",
          },
        }
      );
    });

    if (quoteRef.current) {
      gsap.fromTo(
        quoteRef.current,
        { opacity: 0, x: -40, rotate: -2 },
        {
          opacity: 1,
          x: 0,
          rotate: 0,
          duration: 1.4,
          ease: "power3.out",
          scrollTrigger: {
            trigger: quoteRef.current,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        }
      );
    }
    
    if (lineRef.current) {
        gsap.fromTo(
            lineRef.current,
            { height: 0 },
            {
                height: "100%",
                duration: 1.5,
                ease: "power3.inOut",
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top 60%",
                    toggleActions: "play none none none"
                }
            }
        )
    }

    const section = sectionRef.current;
    
    return () => {
      ScrollTrigger.getAll()
        .filter((t) => section?.contains(t.trigger as Element))
        .forEach((t) => t.kill());
    };
  }, []);

  return (
    <section ref={sectionRef} id="kashmir" className="relative bg-cell py-32 md:py-48 overflow-hidden">
      {/* Distressed Texture overlay */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
      />
      
      {/* Fog background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(circle at 30% 50%, rgba(28,28,30,0.25), transparent 60%)",
          animation: "fog-drift 15s ease-in-out infinite",
        }}
      />

      <div className="relative max-w-[1300px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
        
        {/* Left Editorial Column */}
        <div className="lg:col-span-5 flex flex-col justify-center relative">
          <div className="cell-door-plate mb-12 self-start transform -rotate-1">
            <span className="font-space text-[10px] md:text-xs text-dim tracking-[0.3em]">
              {kashmirContent.sectionLabel}
            </span>
          </div>

          <div ref={quoteRef} className="relative z-10 opacity-0">
            <div className="absolute -left-6 -top-6 text-alarm opacity-10 font-playfair text-[120px] leading-none">"</div>
            <p className="font-playfair font-bold text-[40px] md:text-[56px] lg:text-[68px] text-chalk leading-[1.1] tracking-tight mb-8">
              {kashmirContent.quote}
            </p>
            <div className="w-16 h-1 bg-alarm/80"></div>
          </div>
        </div>

        {/* Divider Line */}
        <div className="hidden lg:block lg:col-span-1 relative flex justify-center">
            <div ref={lineRef} className="w-[1px] bg-gradient-to-b from-transparent via-steel to-transparent h-0"></div>
        </div>

        {/* Right Content Column */}
        <div className="lg:col-span-6 flex flex-col justify-center gap-8 pt-8 lg:pt-0">
          <div className="p-8 md:p-12 border border-steel/30 bg-[#121214]/60 backdrop-blur-sm relative shadow-2xl">
            {/* Corner Accents */}
            <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-dim"></div>
            <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-dim"></div>
            <div className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-dim"></div>
            <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-dim"></div>

            {kashmirContent.paragraphs.map((text, i) => (
              <p
                key={i}
                ref={(el) => { paragraphsRef.current[i] = el; }}
                className={`font-dm text-lg md:text-xl text-chalk leading-[1.8] opacity-0 ${i !== kashmirContent.paragraphs.length - 1 ? 'mb-8' : ''}`}
                style={{ fontWeight: i === 0 ? 500 : 400 }}
              >
                {i === 0 && <span className="float-left text-5xl font-playfair pr-3 pt-2 text-dim leading-none">{text.charAt(0)}</span>}
                {i === 0 ? text.substring(1) : text}
              </p>
            ))}
          </div>
        </div>

        {/* Tally marks */}
        <div className="absolute bottom-0 lg:bottom-12 right-6 font-space text-opacity-40 text-4xl lg:text-6xl text-steel -rotate-90 origin-bottom-right">
          {kashmirContent.tallyMarks}
        </div>
      </div>
    </section>
  );
}
