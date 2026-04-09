"use client";

import { useEffect, useState, useRef } from "react";
import { playSound } from "@/lib/audio";

export default function EasterEggs() {
  const [isBakchod, setIsBakchod] = useState(false);
  const [showFIRTally, setShowFIRTally] = useState(false);
  const bufferRef = useRef("");
  const knightRef = useRef<HTMLDivElement>(null);
  const mousePos = useRef({ x: 0, y: 0 });
  const knightPos = useRef({ x: 0, y: 0 });
  const rafRef = useRef<number>(0);
  const isInChessYard = useRef(false);

  // Konami code: type "BAKCHOD"
  useEffect(() => {
    const target = "BAKCHOD";
    const handleKeyDown = (e: KeyboardEvent) => {
      bufferRef.current += e.key.toUpperCase();
      if (bufferRef.current.length > target.length) {
        bufferRef.current = bufferRef.current.slice(-target.length);
      }
      if (bufferRef.current === target) {
        setIsBakchod((prev) => !prev);
        playSound("roast", "/audio/roast-clip.mp3", { volume: 0.5 });
        bufferRef.current = "";
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Apply IGL branding inversion
  useEffect(() => {
    if (isBakchod) {
      document.documentElement.style.filter = "invert(1) hue-rotate(180deg)";
    } else {
      document.documentElement.style.filter = "";
    }
    return () => { document.documentElement.style.filter = ""; };
  }, [isBakchod]);

  // Knight cursor follower (chess yard section only)
  useEffect(() => {
    const updateKnight = () => {
      if (!knightRef.current || !isInChessYard.current) {
        if (knightRef.current) knightRef.current.style.opacity = "0";
        rafRef.current = requestAnimationFrame(updateKnight);
        return;
      }
      const lerp = 0.1;
      knightPos.current.x += (mousePos.current.x - knightPos.current.x) * lerp;
      knightPos.current.y += (mousePos.current.y - knightPos.current.y) * lerp;
      knightRef.current.style.transform = `translate(${knightPos.current.x}px, ${knightPos.current.y}px)`;
      knightRef.current.style.opacity = "1";
      rafRef.current = requestAnimationFrame(updateKnight);
    };

    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX + 15, y: e.clientY + 15 };
      const chessYard = document.getElementById("chess-yard");
      if (chessYard) {
        const rect = chessYard.getBoundingClientRect();
        isInChessYard.current = e.clientY >= rect.top && e.clientY <= rect.bottom;
      }
    };

    const isDesktop = window.matchMedia("(min-width: 768px)").matches;
    if (isDesktop) {
      window.addEventListener("mousemove", handleMouseMove);
      rafRef.current = requestAnimationFrame(updateKnight);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  // FIR tally: days since Feb 8, 2025
  const [daysSinceFIR, setDaysSinceFIR] = useState(0);

  useEffect(() => {
    const firDate = new Date("2025-02-08");
    const diff = Math.floor((Date.now() - firDate.getTime()) / (1000 * 60 * 60 * 24));
    setTimeout(() => {
      setDaysSinceFIR(diff);
    }, 0);
  }, []);

  return (
    <>
      {/* Knight cursor */}
      <div
        ref={knightRef}
        className="fixed top-0 left-0 z-[9989] pointer-events-none opacity-0 hidden md:block"
        style={{ transition: "opacity 0.3s" }}
      >
        <span className="text-2xl">&#9822;</span>
      </div>

      {/* FIR Tally — click to reveal */}
      <div
        className="fixed bottom-4 right-4 z-[9989] cursor-pointer"
        onClick={() => setShowFIRTally((prev) => !prev)}
      >
        {showFIRTally ? (
          <div className="font-space text-[10px] text-alarm bg-cell/90 px-3 py-2 rounded border border-alarm/30">
            Days since last FIR: {daysSinceFIR}
          </div>
        ) : (
          <div className="font-space text-[10px] text-steel hover:text-dim transition-colors">
            &#9432;
          </div>
        )}
      </div>
    </>
  );
}
