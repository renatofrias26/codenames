"use client";

import type { GameCounts, GameStatus, TeamColor } from "@/lib/game/types";

interface ScoreBarProps {
  counts: GameCounts;
  currentTurn: TeamColor;
  status: GameStatus;
  size?: "board" | "compact";
}

function statusLabel(status: GameStatus, currentTurn: TeamColor): string {
  if (status === "red-wins") return "Red wins";
  if (status === "blue-wins") return "Blue wins";
  return `${currentTurn === "red" ? "Red" : "Blue"} team's turn`;
}

export function ScoreBar({
  counts,
  currentTurn,
  status,
  size = "compact",
}: ScoreBarProps) {
  const over = status !== "playing";
  return (
    <div className="flex w-full items-stretch justify-between gap-2 sm:gap-4">
      <TeamScore
        color="red"
        remaining={counts.redRemaining}
        total={counts.redTotal}
        active={!over && currentTurn === "red"}
        size={size}
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
          {statusLabel(status, currentTurn)}
        </span>
      </div>

      <TeamScore
        color="blue"
        remaining={counts.blueRemaining}
        total={counts.blueTotal}
        active={!over && currentTurn === "blue"}
        size={size}
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
}: {
  color: TeamColor;
  remaining: number;
  total: number;
  active: boolean;
  size: "board" | "compact";
}) {
  const isRed = color === "red";
  const isBoard = size === "board";
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
          {color}
        </span>
        <span
          className={[
            "text-zinc-400",
            isBoard ? "text-xs sm:text-sm" : "text-[9px]",
          ].join(" ")}
        >
          of {total} left
        </span>
      </span>
    </div>
  );
}
