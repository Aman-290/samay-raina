"use client";

import { useEffect, useRef, useState } from "react";
import { CountUp } from "countup.js";

interface Stat {
  value: number;
  suffix: string;
  label: string;
}

interface KineticStatsProps {
  stats: Stat[];
}

export default function KineticStats({ stats }: KineticStatsProps) {
  const statRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          statRefs.current.forEach((el, i) => {
            if (!el) return;
            const stat = stats[i];
            const countUp = new CountUp(el, stat.value, {
              duration: 2.5,
              separator: ",",
              suffix: stat.suffix,
              useEasing: true,
            });
            countUp.start();
          });
        }
      },
      { threshold: 0.3 }
    );

    const firstRef = statRefs.current[0];
    if (firstRef) observer.observe(firstRef);

    return () => observer.disconnect();
  }, [stats, hasAnimated]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-12">
      {stats.map((stat, i) => (
        <div
          key={i}
          className="text-center py-10 px-6 bg-black/20 backdrop-blur-sm rounded-lg border border-steel/20 flex flex-col items-center justify-center overflow-hidden hover:bg-black/40 transition-colors duration-500"
          style={{ animation: hasAnimated ? "pulse-glow 4s ease-in-out infinite" : undefined }}
        >
          <div
            ref={(el) => { statRefs.current[i] = el; }}
            className="font-playfair text-5xl md:text-6xl lg:text-[80px] leading-none text-chalk font-black break-all mx-auto max-w-full drop-shadow-[0_10px_20px_rgba(255,255,255,0.1)]"
          >
            0
          </div>
          <div className="font-space text-[10px] md:text-xs text-dim mt-6 tracking-widest uppercase font-bold break-words text-center">
            {stat.label}
          </div>
        </div>
      ))}
    </div>
  );
}
