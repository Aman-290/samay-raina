"use client";

let isMuted = true;
const listeners: Set<(muted: boolean) => void> = new Set();

export function getIsMuted(): boolean {
  return isMuted;
}

export function toggleMute(): boolean {
  isMuted = !isMuted;
  listeners.forEach((fn) => fn(isMuted));
  return isMuted;
}

export function onMuteChange(fn: (muted: boolean) => void): () => void {
  listeners.add(fn);
  return () => listeners.delete(fn);
}
