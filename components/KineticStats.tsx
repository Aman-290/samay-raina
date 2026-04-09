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
          className="text-center py-6 px-4 bg-black/50 rounded border border-alive/25 flex flex-col items-center justify-center overflow-hidden"
          style={{ animation: hasAnimated ? "stat-pulse 2s ease-in-out infinite" : undefined }}
        >
          <div
            ref={(el) => { statRefs.current[i] = el; }}
            className="font-anton text-4xl md:text-5xl lg:text-6xl leading-none text-alive break-all mx-auto max-w-full"
          >
            0
          </div>
          <div className="font-dm text-xs md:text-sm text-dim mt-2 break-words text-center">
            {stat.label}
          </div>
        </div>
      ))}
    </div>
  );
}
