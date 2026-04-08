"use client";

import { useState } from "react";
import { toggleMute, getIsMuted } from "@/lib/audio";

export default function SoundToggle() {
  const [muted, setMuted] = useState(getIsMuted());

  const handleClick = () => {
    const newState = toggleMute();
    setMuted(newState);
  };

  return (
    <button
      onClick={handleClick}
      className="fixed top-4 left-4 z-[9990] w-10 h-10 flex items-center justify-center text-dim hover:text-chalk transition-colors"
      aria-label={muted ? "Unmute audio" : "Mute audio"}
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
        {muted ? (
          <>
            <line x1="23" y1="9" x2="17" y2="15" />
            <line x1="17" y1="9" x2="23" y2="15" />
          </>
        ) : (
          <>
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
            <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
          </>
        )}
      </svg>
    </button>
  );
}
