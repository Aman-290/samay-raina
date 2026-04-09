"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap-setup";
import { setMuted, playSound } from "@/lib/audio";

const TOTAL_FRAMES = 240;
const PLAYABLE_FRAMES = 180;
const ZOOM_FACTOR = 1.35;
const COVER_ANCHOR_Y = 0.2;
const PARALLAX_X = 28;
const PARALLAX_Y = 20;
const TEXT_BASE_Y = 24;
const FRAME_FOLDER = "/ezgif-7eef6f5b8dfad6ee-jpg";

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function frameUrl(frameNumber: number): string {
  return `${FRAME_FOLDER}/ezgif-frame-${String(frameNumber).padStart(3, "0")}.webp`;
}

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const textBlockRef = useRef<HTMLDivElement>(null);
  const framesRef = useRef<(HTMLImageElement | null)[]>([]);
  const drawRafRef = useRef<number | null>(null);
  const scrollRafRef = useRef<number | null>(null);
  const targetFrameRef = useRef(0);
  const [loadedCount, setLoadedCount] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const [hasEntered, setHasEntered] = useState(false);

  const drawFrame = useCallback((index: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const frameIndex = clamp(index, 0, PLAYABLE_FRAMES - 1);
    const frame = framesRef.current[frameIndex];
    if (!frame || !frame.complete || frame.naturalWidth === 0) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const targetWidth = Math.max(1, Math.floor(viewportWidth * dpr));
    const targetHeight = Math.max(1, Math.floor(viewportHeight * dpr));

    if (canvas.width !== targetWidth || canvas.height !== targetHeight) {
      canvas.width = targetWidth;
      canvas.height = targetHeight;
    }

    const canvasAspect = canvas.width / canvas.height;
    const imageAspect = frame.naturalWidth / frame.naturalHeight;

    let drawWidth = 0;
    let drawHeight = 0;

    if (imageAspect > canvasAspect) {
      drawHeight = canvas.height * ZOOM_FACTOR;
      drawWidth = drawHeight * imageAspect;
    } else {
      drawWidth = canvas.width * ZOOM_FACTOR;
      drawHeight = drawWidth / imageAspect;
    }

    const offsetX = (canvas.width - drawWidth) * 0.5;
    const offsetY = (canvas.height - drawHeight) * COVER_ANCHOR_Y;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(frame, offsetX, offsetY, drawWidth, drawHeight);
  }, []);

  const queueDraw = useCallback(
    (nextFrame: number) => {
      targetFrameRef.current = nextFrame;
      if (drawRafRef.current !== null) return;

      drawRafRef.current = window.requestAnimationFrame(() => {
        drawRafRef.current = null;
        drawFrame(targetFrameRef.current);
      });
    },
    [drawFrame]
  );

  useEffect(() => {
    let isCancelled = false;
    let completed = 0;

    framesRef.current = Array.from({ length: TOTAL_FRAMES }, () => null);

    for (let i = 1; i <= TOTAL_FRAMES; i += 1) {
      const image = new Image();
      image.decoding = "async";
      image.src = frameUrl(i);

      const onAssetDone = () => {
        if (isCancelled) return;
        completed += 1;
        setLoadedCount(completed);
        if (completed === TOTAL_FRAMES) {
          setIsReady(true);
          queueDraw(0);
        }
      };

      image.onload = onAssetDone;
      image.onerror = onAssetDone;
      framesRef.current[i - 1] = image;
    }

    return () => {
      isCancelled = true;
    };
  }, [queueDraw]);

  useEffect(() => {
    if (hasEntered) {
      document.body.style.overflow = "";
    } else {
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [hasEntered]);

  useEffect(() => {
    if (!hasEntered) return;

    const section = sectionRef.current;
    const canvas = canvasRef.current;
    if (!section || !canvas) return;

    const scheduleFromScroll = () => {
      if (scrollRafRef.current !== null) return;

      scrollRafRef.current = window.requestAnimationFrame(() => {
        scrollRafRef.current = null;

        const heroStart = section.offsetTop;
        const heroEnd = section.offsetTop + section.offsetHeight - window.innerHeight;
        const span = Math.max(heroEnd - heroStart, 1);
        const clampedY = clamp(window.scrollY, heroStart, heroEnd);
        const scrollFraction = (clampedY - heroStart) / span;
        const nextFrame = Math.round(scrollFraction * (PLAYABLE_FRAMES - 1));
        const textFade = clamp(1 - scrollFraction * 1.4, 0, 1);
        const textDrop = TEXT_BASE_Y + Math.round(scrollFraction * 42);

        if (textBlockRef.current) {
          textBlockRef.current.style.opacity = String(textFade);
          textBlockRef.current.style.transform = `translate3d(0, ${textDrop}px, 0)`;
        }

        queueDraw(nextFrame);
      });
    };

    const handleResize = () => {
      queueDraw(targetFrameRef.current);
      scheduleFromScroll();
    };

    const handleMouseMove = (event: MouseEvent) => {
      const x = (event.clientX / window.innerWidth - 0.5) * 2;
      const y = (event.clientY / window.innerHeight - 0.5) * 2;

      gsap.to(canvas, {
        x: -x * PARALLAX_X,
        y: -y * PARALLAX_Y,
        scale: 1.05,
        duration: 0.6,
        ease: "power3.out",
        overwrite: true,
      });
    };

    const resetMouseParallax = () => {
      gsap.to(canvas, {
        x: 0,
        y: 0,
        scale: 1.05,
        duration: 0.8,
        ease: "power3.out",
        overwrite: true,
      });
    };

    gsap.set(canvas, {
      scale: 1.05,
      x: 0,
      y: 0,
      transformOrigin: "center center",
      willChange: "transform",
    });

    scheduleFromScroll();

    window.addEventListener("scroll", scheduleFromScroll, { passive: true });
    window.addEventListener("resize", handleResize);
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("mouseleave", resetMouseParallax);

    return () => {
      window.removeEventListener("scroll", scheduleFromScroll);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", resetMouseParallax);

      if (scrollRafRef.current !== null) {
        window.cancelAnimationFrame(scrollRafRef.current);
        scrollRafRef.current = null;
      }
    };
  }, [hasEntered, queueDraw]);

  useEffect(() => {
    return () => {
      if (drawRafRef.current !== null) {
        window.cancelAnimationFrame(drawRafRef.current);
        drawRafRef.current = null;
      }
    };
  }, []);

  const loadingPercent = Math.round((loadedCount / TOTAL_FRAMES) * 100);

  return (
    <section ref={sectionRef} id="hero" className="relative h-[500vh] bg-black">
      <canvas
        ref={canvasRef}
        className="fixed inset-0 z-0 h-full w-full bg-black"
        aria-label="Cinematic image sequence"
      />

      <div className="sticky top-0 z-20 h-screen pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-transparent to-black/65" />

        <div className="absolute inset-x-0 bottom-[2vh] flex justify-center px-5 md:bottom-[4vh] md:px-10">
          <div
            ref={textBlockRef}
            className="w-full max-w-[1100px] text-center will-change-transform"
            style={{ opacity: 1, transform: `translate3d(0, ${TEXT_BASE_Y}px, 0)` }}
          >
            <h1
              className="font-anton text-[clamp(3.75rem,10.5vw,12rem)] leading-[0.9] tracking-[-0.05em] text-[#F4F4F5] uppercase"
              style={{ textShadow: "2px 2px 0px #000" }}
            >
              The Psychosis.
            </h1>
            <p className="mx-auto mt-4 w-[min(84vw,1200px)] max-w-full text-balance font-space text-[clamp(1rem,1.38vw,1.35rem)] leading-[1.5] text-[#B0B0B0] md:mt-5">
              <span className="italic text-[#A8FFB2]">
                &quot;I swear to God I felt like it was a dream, it wasn&apos;t real...&quot;
              </span>{" "}
              A digital manhunt escalated faster than context: FIR loops,
              courtroom noise, and algorithmic drift turning performance into
              prosecution.
            </p>
          </div>
        </div>
      </div>

      <div
        className={`fixed inset-0 z-30 grid place-items-center bg-black transition-opacity duration-700 ${
          hasEntered ? "opacity-0 pointer-events-none" : "opacity-100"
        }`}
        style={{ backgroundColor: "#000" }}
      >
        <div className="text-center px-6">
          {!isReady ? (
            <>
              <p className="font-space text-[10px] md:text-xs tracking-[0.4em] text-white/80 uppercase">
                Loading Reel
              </p>
              <p className="font-anton text-5xl md:text-7xl text-white mt-3">
                {loadingPercent}%
              </p>
              <p className="font-space text-[10px] tracking-[0.18em] text-white/55 mt-2">
                {loadedCount}/{TOTAL_FRAMES} frames buffered
              </p>
            </>
          ) : (
            <button
              type="button"
              className="group relative flex flex-col items-center gap-4 bg-black px-8 py-7"
              onClick={() => {
                setMuted(false);
                playSound("synth-bass", "/audio/synth-bass.mp3", { volume: 0.8 });
                setHasEntered(true);
              }}
            >
              <span className="font-anton text-6xl md:text-8xl text-white tracking-widest uppercase transition-transform group-hover:scale-105 duration-300">
                ENTER
              </span>
              <span className="font-space text-[10px] md:text-xs tracking-[0.3em] text-white/60 group-hover:text-white/90 uppercase transition-colors duration-300">
                Click To Enter Experience
              </span>
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
