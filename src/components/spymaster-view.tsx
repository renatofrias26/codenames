"use client";

import { useCallback } from "react";
import { Button } from "@heroui/react";
import type { SpymasterGameState, TeamColor } from "@/lib/game/types";
import { usePolledState } from "./use-polled-state";
import { BoardGrid } from "./board-grid";
import { ScoreBar } from "./score-bar";
import { TimerDisplay } from "./timer-display";

interface SpymasterViewProps {
  sessionId: string;
  team: TeamColor;
  token: string;
  initialState: SpymasterGameState;
}

export function SpymasterView({
  sessionId,
  team,
  token,
  initialState,
}: SpymasterViewProps) {
  const base = `/api/game/${sessionId}`;
  const url = `${base}/spymaster?team=${team}&token=${encodeURIComponent(token)}`;
  const { data, error, refresh } = usePolledState<SpymasterGameState>(
    url,
    2500,
    initialState,
  );
  const state = data ?? initialState;
  const isMyTurn = state.currentTurn === team && state.status === "playing";
  const over = state.status !== "playing";
  const timerRunning = state.timer.running;
  const isDuet = state.mode === "duet";
  const playerLabel = isDuet
    ? `Player ${team === "red" ? "A" : "B"}`
    : `${team} spymaster`;

  const post = useCallback(
    async (path: string, body?: unknown) => {
      const res = await fetch(`${base}${path}`, {
        method: "POST",
        headers: body ? { "Content-Type": "application/json" } : undefined,
        body: body ? JSON.stringify(body) : undefined,
        cache: "no-store",
      });
      if (res.ok) await refresh();
    },
    [base, refresh],
  );

  return (
    <div className="spy-layout mx-auto w-full max-w-md p-3 landscape:max-w-none landscape:p-4">
      <header
        className={[
          "spy-header panel flex items-center justify-between gap-2 px-3 py-2.5",
          team === "red" ? "ring-team-red/30" : "ring-team-blue/30",
        ].join(" ")}
      >
        <div className="flex flex-col">
          <span
            className={[
              "brand text-base uppercase tracking-wide",
              team === "red" ? "text-team-red" : "text-team-blue",
            ].join(" ")}
          >
            {playerLabel}
          </span>
          <span className="text-[10px] uppercase tracking-wide text-zinc-500">
            🤫 Keep this screen hidden
          </span>
        </div>
        <Button
          size="sm"
          variant="secondary"
          onPress={() => void post("/reset")}
        >
          New game
        </Button>
      </header>

      <div className="spy-meta panel flex flex-col gap-3 px-3 py-3">
        <ScoreBar
          counts={state.counts}
          currentTurn={state.currentTurn}
          status={state.status}
          mode={state.mode}
        />
        <div className="flex items-center justify-center gap-3">
          <TimerDisplay timer={state.timer} />
          <Button
            size="sm"
            variant="secondary"
            isIconOnly
            aria-label="Reset timer"
            onPress={() => void post("/timer", { action: "reset" })}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4"
              aria-hidden="true"
            >
              <path d="M3 12a9 9 0 1 0 3-6.7L3 8" />
              <path d="M3 3v5h5" />
            </svg>
          </Button>
        </div>
      </div>

      <p
        className={[
          "spy-status rounded-xl px-3 py-2 text-center text-sm font-medium",
          over
            ? "bg-white/5 text-zinc-300"
            : isMyTurn
              ? "bg-emerald-500/15 text-emerald-300"
              : "bg-white/5 text-zinc-400",
        ].join(" ")}
      >
        {error
          ? error
          : over
            ? "Game over — tap New game to play again."
            : isMyTurn
              ? "Your turn — tap a card to reveal it on the board."
              : "Waiting for the other team…"}
      </p>

      <div className="spy-board flex items-start justify-center">
        <BoardGrid
          cards={state.cards}
          mode="spymaster"
          onReveal={(cardId) => void post("/reveal", { cardId })}
          disabled={!isMyTurn}
        />
      </div>

      <Legend isDuet={isDuet} className="spy-legend" />

      <div className="spy-actions flex gap-2">
        {timerRunning ? (
          <Button
            fullWidth
            variant="secondary"
            onPress={() => void post("/timer", { action: "pause" })}
          >
            Pause timer
          </Button>
        ) : (
          <Button
            fullWidth
            variant="primary"
            isDisabled={over}
            onPress={() => void post("/timer", { action: "start" })}
          >
            Start timer
          </Button>
        )}
        <Button
          fullWidth
          variant="secondary"
          isDisabled={over}
          onPress={() => void post("/turn")}
        >
          End turn
        </Button>
      </div>
    </div>
  );
}

function Legend({ isDuet, className }: { isDuet: boolean; className?: string }) {
  const classicItems = [
    { label: "Red", className: "face-red" },
    { label: "Blue", className: "face-blue" },
    { label: "Neutral", className: "face-neutral" },
    { label: "Assassin", className: "face-assassin" },
  ];
  const duetItems = [
    { label: "Agent", className: "face-agent" },
    { label: "Assassin", className: "face-assassin" },
    { label: "Bystander", className: "face-neutral" },
  ];
  const items = isDuet ? duetItems : classicItems;
  return (
    <div
      className={[
        "flex flex-wrap justify-center gap-3 text-xs text-zinc-400",
        className ?? "",
      ].join(" ")}
    >
      {items.map((item) => (
        <span key={item.label} className="flex items-center gap-1.5">
          <span className={`h-3 w-3 rounded ${item.className}`} />
          {item.label}
        </span>
      ))}
    </div>
  );
}
