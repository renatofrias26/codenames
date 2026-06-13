"use client";

import { useEffect, useState } from "react";
import { CreateGameButton } from "@/components/create-game-button";
import { LANGUAGES, t } from "@/lib/i18n";
import type { GameLanguage } from "@/lib/game/types";

const STORAGE_KEY = "codenames-language";

function useLanguage(): [GameLanguage, (lang: GameLanguage) => void] {
  const [language, setLanguage] = useState<GameLanguage>("en");

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY) as GameLanguage | null;
    if (stored === "en" || stored === "pt") {
      setLanguage(stored);
      return;
    }
    const guess = navigator.language?.toLowerCase().startsWith("pt") ? "pt" : "en";
    setLanguage(guess);
  }, []);

  const update = (lang: GameLanguage) => {
    setLanguage(lang);
    window.localStorage.setItem(STORAGE_KEY, lang);
  };

  return [language, update];
}

export function Landing() {
  const [language, setLanguage] = useLanguage();
  const m = t(language);

  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-12 p-6 text-center">
      {/* Language switcher */}
      <div className="absolute right-4 top-4 flex items-center gap-1 rounded-full border border-white/10 bg-white/5 p-1 animate-fade-in-up">
        {LANGUAGES.map((lang) => {
          const active = lang.code === language;
          return (
            <button
              key={lang.code}
              type="button"
              onClick={() => setLanguage(lang.code)}
              aria-pressed={active}
              aria-label={lang.label}
              className={[
                "rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide transition-colors",
                active
                  ? "bg-white/90 text-zinc-900"
                  : "text-zinc-400 hover:text-zinc-200",
              ].join(" ")}
            >
              {lang.short}
            </button>
          );
        })}
      </div>

      {/* Hero */}
      <div className="flex flex-col items-center gap-4 animate-fade-in-up">
        <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium uppercase tracking-widest text-zinc-400">
          {m.landing.badge}
        </span>
        <h1 className="brand text-5xl tracking-tight sm:text-7xl">
          <span className="text-team-red">Code</span>
          <span className="text-team-blue">names</span>
        </h1>
        <p className="max-w-md text-balance text-zinc-400">{m.landing.heroDesc}</p>
      </div>

      {/* Mode cards */}
      <div
        className="grid w-full max-w-2xl gap-4 sm:grid-cols-2 animate-fade-in-up"
        style={{ animationDelay: "120ms" }}
      >
        {/* Classic */}
        <div
          className="group relative overflow-hidden rounded-2xl border border-white/10 p-6 text-left transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
          style={{
            background:
              "radial-gradient(ellipse at 15% 60%, rgba(255,90,96,0.13) 0%, transparent 55%), radial-gradient(ellipse at 85% 60%, rgba(93,139,255,0.13) 0%, transparent 55%), rgba(255,255,255,0.03)",
          }}
        >
          <div className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 ring-1 ring-inset ring-white/20 transition-opacity duration-300 group-hover:opacity-100" />

          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <span className="rounded-full bg-white/[0.08] px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-widest text-zinc-400">
                {m.landing.classicPlayers}
              </span>
            </div>

            {/* Red / Blue split bar */}
            <div className="flex h-1.5 overflow-hidden rounded-full">
              <div className="flex-1 bg-team-red/70" />
              <div className="flex-1 bg-team-blue/70" />
            </div>

            <div className="flex flex-col gap-1.5">
              <span className="brand text-2xl text-zinc-100">
                {m.landing.classicTitle}
              </span>
              <span className="text-sm leading-relaxed text-zinc-400">
                {m.landing.classicDesc}
              </span>
            </div>

            <CreateGameButton
              mode="classic"
              language={language}
              label={m.landing.playClassic}
              fullWidth
            />
          </div>
        </div>

        {/* Duet */}
        <div
          className="group relative overflow-hidden rounded-2xl border border-white/10 p-6 text-left transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
          style={{
            background:
              "radial-gradient(ellipse at 50% 85%, rgba(74,222,128,0.12) 0%, transparent 55%), rgba(255,255,255,0.03)",
          }}
        >
          <div className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 ring-1 ring-inset ring-emerald-400/20 transition-opacity duration-300 group-hover:opacity-100" />

          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <span className="rounded-full bg-white/[0.08] px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-widest text-zinc-400">
                {m.landing.duetPlayers}
              </span>
            </div>

            {/* 15 agent dots */}
            <div className="flex gap-0.5">
              {Array.from({ length: 15 }, (_, i) => (
                <div key={i} className="h-1.5 flex-1 rounded-full bg-emerald-400/60" />
              ))}
            </div>

            <div className="flex flex-col gap-1.5">
              <span className="brand text-2xl text-emerald-400">
                {m.landing.duetTitle}
              </span>
              <span className="text-sm leading-relaxed text-zinc-400">
                {m.landing.duetDesc}
              </span>
            </div>

            <CreateGameButton
              mode="duet"
              language={language}
              variant="emerald"
              label={m.landing.playDuet}
              fullWidth
            />
          </div>
        </div>
      </div>

      {/* Steps */}
      <ol
        className="grid w-full max-w-xl gap-3 text-left sm:grid-cols-3 animate-fade-in-up"
        style={{ animationDelay: "220ms" }}
      >
        {m.landing.steps.map((step, i) => (
          <li key={i} className="panel flex flex-col gap-1 p-4 text-sm">
            <span className="brand text-2xl text-zinc-500">{i + 1}</span>
            <span className="font-semibold text-zinc-200">{step.t}</span>
            <span className="text-zinc-400">{step.d}</span>
          </li>
        ))}
      </ol>
    </main>
  );
}
