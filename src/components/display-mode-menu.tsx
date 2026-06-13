"use client";

import { useEffect, useRef, useState } from "react";
import { t } from "@/lib/i18n";
import type { GameLanguage } from "@/lib/game/types";

export type DisplayMode = "auto" | "tv" | "compact";

const STORAGE_KEY = "codenames-display-mode";

function readStored(): DisplayMode {
  if (typeof window === "undefined") return "auto";
  const v = window.localStorage.getItem(STORAGE_KEY);
  return v === "tv" || v === "compact" || v === "auto" ? v : "auto";
}

/**
 * Resolves a DisplayMode into the layout class applied to .board-layout.
 * In "auto" it follows the viewport; otherwise it forces the chosen layout.
 */
export function useResolvedLayout(mode: DisplayMode): string {
  const [layout, setLayout] = useState("is-portrait");

  useEffect(() => {
    if (mode !== "auto") {
      setLayout(mode === "tv" ? "is-tv" : "is-compact");
      return;
    }
    const tv = window.matchMedia("(orientation: landscape) and (min-width: 1024px)");
    const compact = window.matchMedia("(orientation: landscape) and (max-width: 1023px)");
    const update = () =>
      setLayout(tv.matches ? "is-tv" : compact.matches ? "is-compact" : "is-portrait");
    update();
    tv.addEventListener("change", update);
    compact.addEventListener("change", update);
    return () => {
      tv.removeEventListener("change", update);
      compact.removeEventListener("change", update);
    };
  }, [mode]);

  return layout;
}

export function useDisplayMode(): [DisplayMode, (m: DisplayMode) => void] {
  const [mode, setMode] = useState<DisplayMode>("auto");

  useEffect(() => {
    setMode(readStored());
  }, []);

  const update = (m: DisplayMode) => {
    setMode(m);
    try {
      window.localStorage.setItem(STORAGE_KEY, m);
    } catch {
      // ignore storage failures (private mode, etc.)
    }
  };

  return [mode, update];
}

export function DisplayModeMenu({
  mode,
  onChange,
  language = "en",
}: {
  mode: DisplayMode;
  onChange: (m: DisplayMode) => void;
  language?: GameLanguage;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const d = t(language).display;
  const options: { key: DisplayMode; label: string; hint: string }[] = [
    { key: "auto", label: d.auto, hint: d.autoDesc },
    { key: "tv", label: d.tv, hint: d.tvDesc },
    { key: "compact", label: d.phone, hint: d.phoneDesc },
  ];

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        title={d.settings}
        aria-haspopup="menu"
        aria-expanded={open}
        className="flex items-center justify-center rounded-full border border-white/10 bg-white/5 p-1.5 text-zinc-400 transition hover:border-white/25 hover:text-zinc-200"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5" aria-hidden="true">
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
        </svg>
        <span className="sr-only">{d.settings}</span>
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 top-full z-50 mt-2 w-52 overflow-hidden rounded-xl border border-white/10 bg-zinc-900/95 p-1 shadow-2xl shadow-black/50 backdrop-blur-md"
        >
          <p className="px-3 pb-1 pt-2 text-[10px] font-semibold uppercase tracking-widest text-zinc-500">
            {d.mode}
          </p>
          {options.map((opt) => {
            const active = opt.key === mode;
            return (
              <button
                key={opt.key}
                type="button"
                role="menuitemradio"
                aria-checked={active}
                onClick={() => {
                  onChange(opt.key);
                  setOpen(false);
                }}
                className={[
                  "flex w-full items-center justify-between gap-2 rounded-lg px-3 py-2 text-left text-sm transition",
                  active ? "bg-white/10 text-zinc-100" : "text-zinc-300 hover:bg-white/5",
                ].join(" ")}
              >
                <span className="flex flex-col">
                  <span className="font-medium">{opt.label}</span>
                  <span className="text-[11px] text-zinc-500">{opt.hint}</span>
                </span>
                {active && (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 text-emerald-400" aria-hidden="true">
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
