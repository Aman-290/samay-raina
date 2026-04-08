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

// Lazy-loaded Howler instances
let Howl: any = null;
const sounds: Map<string, any> = new Map();

async function loadHowler() {
  if (!Howl) {
    const mod = await import("howler");
    Howl = mod.Howl;
  }
  return Howl;
}

export async function playSound(
  name: string,
  src: string,
  options?: { loop?: boolean; volume?: number }
): Promise<any> {
  if (isMuted) return null;

  try {
    const HowlClass = await loadHowler();

    let sound = sounds.get(name);
    if (!sound) {
      sound = new HowlClass({
        src: [src],
        loop: options?.loop ?? false,
        volume: options?.volume ?? 0.5,
        preload: true,
        onloaderror: () => {
          // Gracefully handle missing/empty audio files
          sounds.delete(name);
        },
      });
      sounds.set(name, sound);
    }

    sound.play();
    return sound;
  } catch {
    // Gracefully handle any errors (e.g. empty placeholder files)
    return null;
  }
}

export function stopSound(name: string): void {
  const sound = sounds.get(name);
  if (sound) {
    try {
      sound.stop();
    } catch {
      // ignore
    }
  }
}

export function setSoundVolume(name: string, volume: number): void {
  const sound = sounds.get(name);
  if (sound) {
    try {
      sound.volume(volume);
    } catch {
      // ignore
    }
  }
}
