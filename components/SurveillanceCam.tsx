"use client";

import { useEffect, useState, useRef } from "react";

export default function SurveillanceCam() {
  const [time, setTime] = useState("");
  const [isBirthday, setIsBirthday] = useState(false);
  const hoverTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const tick = () => {
      if (!isBirthday) {
        const now = new Date();
        setTime(now.toLocaleTimeString("en-GB", { hour12: false }));
      }
    };
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [isBirthday]);

  const handleMouseEnter = () => {
    hoverTimerRef.current = setTimeout(() => {
      setIsBirthday(true);
      setTime("00:00:00");
    }, 3000);
  };

  const handleMouseLeave = () => {
    if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
    setIsBirthday(false);
  };

  return (
    <div
      className="fixed top-4 right-4 z-[9990] font-space text-[10px] text-dim select-none cursor-default"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <span className="mr-2">CAM 04</span>
      <span className="mr-2">&mdash;</span>
      <span className="text-alarm mr-1">REC</span>
      <span
        className="text-alarm"
        style={{ animation: "rec-pulse 2s infinite" }}
      >
        &#9679;
      </span>
      <span className="ml-2">&mdash;</span>
      <span className="ml-2">
        {isBirthday ? "OCT 26, 1997" : ""} {time}
      </span>
    </div>
  );
}
