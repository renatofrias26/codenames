"use client";

import { useEffect, useRef, useState } from "react";
import type { PublicTimer } from "@/lib/game/types";

function format(ms: number): string {
  const total = Math.max(0, Math.round(ms / 1000));
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

/**
 * Renders a smoothly ticking countdown. The server snapshot (`remainingMs` +
 * `running`) is the source of truth; this component interpolates between polls.
 */
export function TimerDisplay({
  timer,
  size = "compact",
}: {
  timer: PublicTimer;
  size?: "board" | "compact";
}) {
  const [displayMs, setDisplayMs] = useState(timer.remainingMs);
  const endsAtRef = useRef<number | null>(null);

  useEffect(() => {
    if (timer.running) {
      endsAtRef.current = Date.now() + timer.remainingMs;
    } else {
      endsAtRef.current = null;
      setDisplayMs(timer.remainingMs);
    }
  }, [timer.running, timer.remainingMs]);

  useEffect(() => {
    if (!timer.running) return;
    const tick = () => {
      if (endsAtRef.current !== null) {
        setDisplayMs(Math.max(0, endsAtRef.current - Date.now()));
      }
    };
    tick();
    const id = window.setInterval(tick, 250);
    return () => window.clearInterval(id);
  }, [timer.running]);

  const isLow = displayMs <= 10_000 && timer.running;
  const isExpired = displayMs <= 0;

  return (
    <span
      className={[
        "inline-flex items-center justify-center rounded-full font-mono font-bold tabular-nums tracking-tight ring-1 transition-colors",
        size === "board"
          ? "px-6 py-2 text-4xl sm:text-6xl"
          : "px-4 py-1.5 text-2xl",
        isExpired
          ? "bg-team-red/15 text-team-red ring-team-red/40"
          : isLow
            ? "animate-pulse bg-amber-400/15 text-amber-300 ring-amber-400/40"
            : timer.running
              ? "bg-emerald-400/10 text-emerald-200 ring-emerald-400/30"
              : "bg-white/5 text-zinc-200 ring-white/15",
      ].join(" ")}
    >
      {format(displayMs)}
    </span>
  );
}
