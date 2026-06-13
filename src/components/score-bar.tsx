"use client";

import type {
  GameCounts,
  GameLanguage,
  GameMode,
  GameStatus,
  TeamColor,
} from "@/lib/game/types";
import { fmt, t } from "@/lib/i18n";

interface ScoreBarProps {
  counts: GameCounts;
  currentTurn: TeamColor;
  status: GameStatus;
  mode?: GameMode;
  language?: GameLanguage;
  size?: "board" | "compact";
  /** "bar" = wide horizontal layout (portrait / TV top bar);
   *  "sidebar" = vertical stacked layout (phone-landscape narrow column). */
  variant?: "bar" | "sidebar";
}

function statusLabel(
  status: GameStatus,
  currentTurn: TeamColor,
  mode: GameMode,
  language: GameLanguage,
): string {
  const s = t(language).score;
  if (status === "players-win") return s.youWon;
  if (status === "players-lose") return s.gameOver;
  if (status === "red-wins") return s.redWins;
  if (status === "blue-wins") return s.blueWins;
  if (mode === "duet") return currentTurn === "red" ? s.playerATurn : s.playerBTurn;
  return currentTurn === "red" ? s.redTurn : s.blueTurn;
}

export function ScoreBar({
  counts,
  currentTurn,
  status,
  mode = "classic",
  language = "en",
  size = "compact",
  variant = "bar",
}: ScoreBarProps) {
  const over = status !== "playing";
  const isBoard = size === "board";
  const m = t(language).score;

  if (variant === "sidebar") {
    return (
      <SidebarScore
        counts={counts}
        currentTurn={currentTurn}
        status={status}
        mode={mode}
        language={language}
      />
    );
  }

  if (mode === "duet") {
    const found = (counts.agentTotal ?? 15) - (counts.agentRemaining ?? 0);
    const total = counts.agentTotal ?? 15;
    const pct = total > 0 ? (found / total) * 100 : 0;
    const label = statusLabel(status, currentTurn, mode, language);
    const turnColor =
      status === "players-win"
        ? "text-emerald-400"
        : status === "players-lose"
          ? "text-team-red"
          : currentTurn === "red"
            ? "text-emerald-300"
            : "text-sky-300";

    return (
      <div className="flex w-full flex-col items-center gap-2">
        <div className="flex w-full items-center justify-between gap-3">
          <span className={["brand", isBoard ? "text-4xl sm:text-6xl" : "text-3xl", "text-emerald-400"].join(" ")}>
            {found}
            <span className={["text-zinc-500", isBoard ? "text-xl sm:text-2xl" : "text-base"].join(" ")}>
              /{total}
            </span>
          </span>
          <span className={["rounded-full px-3 py-1 font-semibold tracking-wide", isBoard ? "text-base sm:text-xl" : "text-xs", turnColor].join(" ")}>
            {over ? (status === "players-win" ? "🏆 " : "💀 ") : ""}
            {label}
          </span>
          <span className={["text-zinc-400", isBoard ? "text-sm" : "text-[10px]"].join(" ")}>
            {m.agents}
          </span>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full bg-emerald-400 transition-all duration-500"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="flex w-full items-stretch justify-between gap-2 sm:gap-4">
      <TeamScore
        color="red"
        remaining={counts.redRemaining}
        total={counts.redTotal}
        active={!over && currentTurn === "red"}
        size={size}
        language={language}
      />

      <div className="flex flex-1 flex-col items-center justify-center text-center">
        <span
          className={[
            "rounded-full px-3 py-1 font-semibold tracking-wide",
            size === "board" ? "text-base sm:text-xl" : "text-xs",
            over
              ? status === "red-wins"
                ? "bg-team-red/15 text-team-red"
                : "bg-team-blue/15 text-team-blue"
              : currentTurn === "red"
                ? "bg-team-red/15 text-team-red"
                : "bg-team-blue/15 text-team-blue",
          ].join(" ")}
        >
          {over ? "🏆 " : ""}
          {statusLabel(status, currentTurn, mode, language)}
        </span>
      </div>

      <TeamScore
        color="blue"
        remaining={counts.blueRemaining}
        total={counts.blueTotal}
        active={!over && currentTurn === "blue"}
        size={size}
        language={language}
      />
    </div>
  );
}

function TeamScore({
  color,
  remaining,
  total,
  active,
  size,
  language,
}: {
  color: TeamColor;
  remaining: number;
  total: number;
  active: boolean;
  size: "board" | "compact";
  language: GameLanguage;
}) {
  const isRed = color === "red";
  const isBoard = size === "board";
  const m = t(language).score;
  return (
    <div
      className={[
        "relative flex items-center gap-3 rounded-2xl px-3 py-2 ring-1 transition-all sm:px-5",
        isRed
          ? "bg-team-red/10 ring-team-red/30"
          : "bg-team-blue/10 ring-team-blue/30",
        active
          ? isRed
            ? "ring-2 ring-team-red/80 shadow-lg shadow-team-red/20"
            : "ring-2 ring-team-blue/80 shadow-lg shadow-team-blue/20"
          : "opacity-80",
      ].join(" ")}
    >
      <span
        className={[
          "brand tabular-nums leading-none",
          isBoard ? "text-4xl sm:text-6xl" : "text-3xl",
          isRed ? "text-team-red" : "text-team-blue",
        ].join(" ")}
      >
        {remaining}
      </span>
      <span className="flex flex-col text-left leading-tight">
        <span
          className={[
            "font-semibold uppercase tracking-wide",
            isBoard ? "text-sm sm:text-base" : "text-[10px]",
            isRed ? "text-team-red" : "text-team-blue",
          ].join(" ")}
        >
          {isRed ? m.red : m.blue}
        </span>
        <span
          className={[
            "text-zinc-400",
            isBoard ? "text-xs sm:text-sm" : "text-[9px]",
          ].join(" ")}
        >
          {fmt(m.ofLeft, total)}
        </span>
      </span>
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * Sidebar variant — purpose-built for the narrow phone-landscape
 * column. Vertical scoreboard with a turn banner + stacked team rows.
 * ------------------------------------------------------------------ */
function SidebarScore({
  counts,
  currentTurn,
  status,
  mode,
  language,
}: {
  counts: GameCounts;
  currentTurn: TeamColor;
  status: GameStatus;
  mode: GameMode;
  language: GameLanguage;
}) {
  const over = status !== "playing";
  const label = statusLabel(status, currentTurn, mode, language);
  const m = t(language).score;

  if (mode === "duet") {
    const total = counts.agentTotal ?? 15;
    const found = total - (counts.agentRemaining ?? 0);
    const pct = total > 0 ? (found / total) * 100 : 0;
    const won = status === "players-win";
    const lost = status === "players-lose";
    return (
      <div className="flex w-full flex-col gap-2.5">
        <div
          className={[
            "rounded-lg px-3 py-1.5 text-center text-xs font-semibold tracking-wide",
            won
              ? "bg-emerald-500/15 text-emerald-300"
              : lost
                ? "bg-team-red/15 text-team-red"
                : "bg-emerald-500/10 text-emerald-300/90",
          ].join(" ")}
        >
          {won ? "🏆 " : lost ? "💀 " : ""}
          {label}
        </div>
        <div className="flex items-end justify-between">
          <span className="brand text-4xl leading-none tabular-nums text-emerald-400">
            {found}
            <span className="text-xl text-zinc-500">/{total}</span>
          </span>
          <span className="pb-1 text-[10px] uppercase tracking-wide text-zinc-400">
            {m.agents}
          </span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full bg-emerald-400 transition-all duration-500"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>
    );
  }

  const bannerColor =
    over
      ? status === "red-wins"
        ? "bg-team-red/20 text-team-red"
        : "bg-team-blue/20 text-team-blue"
      : currentTurn === "red"
        ? "bg-team-red/15 text-team-red"
        : "bg-team-blue/15 text-team-blue";

  return (
    <div className="flex w-full flex-col gap-2">
      <div
        className={[
          "rounded-lg px-3 py-1.5 text-center text-xs font-semibold tracking-wide",
          bannerColor,
        ].join(" ")}
      >
        {over ? "🏆 " : ""}
        {label}
      </div>

      <SidebarTeamRow
        color="red"
        remaining={counts.redRemaining}
        total={counts.redTotal}
        active={!over && currentTurn === "red"}
        language={language}
      />
      <SidebarTeamRow
        color="blue"
        remaining={counts.blueRemaining}
        total={counts.blueTotal}
        active={!over && currentTurn === "blue"}
        language={language}
      />
    </div>
  );
}

function SidebarTeamRow({
  color,
  remaining,
  total,
  active,
  language,
}: {
  color: TeamColor;
  remaining: number;
  total: number;
  active: boolean;
  language: GameLanguage;
}) {
  const isRed = color === "red";
  const m = t(language).score;
  return (
    <div
      className={[
        "relative flex items-center gap-2.5 overflow-hidden rounded-xl px-3 py-2 ring-1 transition-all",
        isRed ? "bg-team-red/10" : "bg-team-blue/10",
        active
          ? isRed
            ? "ring-2 ring-team-red/70 shadow-lg shadow-team-red/20"
            : "ring-2 ring-team-blue/70 shadow-lg shadow-team-blue/20"
          : isRed
            ? "opacity-60 ring-team-red/25"
            : "opacity-60 ring-team-blue/25",
      ].join(" ")}
    >
      <span
        className={[
          "h-7 w-1.5 shrink-0 rounded-full",
          isRed ? "bg-team-red" : "bg-team-blue",
        ].join(" ")}
        aria-hidden="true"
      />
      <div className="flex min-w-0 flex-col leading-tight">
        <span
          className={[
            "text-sm font-bold uppercase tracking-wide",
            isRed ? "text-team-red" : "text-team-blue",
          ].join(" ")}
        >
          {isRed ? m.red : m.blue}
        </span>
        <span className="text-[10px] uppercase tracking-wide text-zinc-400">
          {fmt(m.ofLeft, total)}
        </span>
      </div>
      <span
        className={[
          "brand ml-auto text-4xl leading-none tabular-nums",
          isRed ? "text-team-red" : "text-team-blue",
        ].join(" ")}
      >
        {remaining}
      </span>
    </div>
  );
}

