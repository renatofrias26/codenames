"use client";

import { useCallback } from "react";
import { Button } from "@heroui/react";
import type { SpymasterGameState, TeamColor } from "@/lib/game/types";
import { t } from "@/lib/i18n";
import { usePolledState } from "./use-polled-state";
import { useAppTheme } from "./use-app-theme";
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
  const m = t(state.language);

  // Retint the ambient background + card glare to match this view.
  useAppTheme(isDuet ? "duet" : team);
  const playerLabel = isDuet
    ? team === "red"
      ? m.common.playerA
      : m.common.playerB
    : team === "red"
      ? m.common.redSpymaster
      : m.common.blueSpymaster;

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
            {m.spy.keepHidden}
          </span>
        </div>
        <Button
          size="sm"
          variant="secondary"
          onPress={() => void post("/reset")}
        >
          {m.spy.newGame}
        </Button>
      </header>

      <div className="spy-meta panel flex flex-col gap-3 px-3 py-3">
        <ScoreBar
          counts={state.counts}
          currentTurn={state.currentTurn}
          status={state.status}
          mode={state.mode}
          language={state.language}
        />
        <div className="flex items-center justify-center gap-3">
          <TimerDisplay timer={state.timer} />
          <Button
            size="sm"
            variant="secondary"
            isIconOnly
            aria-label={m.spy.resetTimer}
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
            ? m.spy.gameOverHint
            : isMyTurn
              ? m.spy.yourTurnHint
              : m.spy.waiting}
      </p>

      <div className="spy-board flex items-start justify-center">
        <BoardGrid
          cards={state.cards}
          mode="spymaster"
          onReveal={(cardId) => void post("/reveal", { cardId })}
          disabled={!isMyTurn}
        />
      </div>

      <Legend isDuet={isDuet} language={state.language} className="spy-legend" />

      <div className="spy-actions flex gap-2">
        {timerRunning ? (
          <Button
            fullWidth
            variant="secondary"
            onPress={() => void post("/timer", { action: "pause" })}
          >
            {m.spy.pauseTimer}
          </Button>
        ) : (
          <Button
            fullWidth
            variant="primary"
            isDisabled={over}
            onPress={() => void post("/timer", { action: "start" })}
          >
            {m.spy.startTimer}
          </Button>
        )}
        <Button
          fullWidth
          variant="secondary"
          isDisabled={over}
          onPress={() => void post("/turn")}
        >
          {m.spy.endTurn}
        </Button>
      </div>
    </div>
  );
}

function Legend({
  isDuet,
  language,
  className,
}: {
  isDuet: boolean;
  language: SpymasterGameState["language"];
  className?: string;
}) {
  const s = t(language).spy;
  const classicItems = [
    { label: s.legendRed, className: "face-red" },
    { label: s.legendBlue, className: "face-blue" },
    { label: s.legendNeutral, className: "face-neutral" },
    { label: s.legendAssassin, className: "face-assassin" },
  ];
  const duetItems = [
    { label: s.legendAgent, className: "face-agent" },
    { label: s.legendAssassin, className: "face-assassin" },
    { label: s.legendBystander, className: "face-neutral" },
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
