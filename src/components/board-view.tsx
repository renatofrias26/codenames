"use client";

import Link from "next/link";
import type { PublicGameState } from "@/lib/game/types";
import { usePolledState } from "./use-polled-state";
import { BoardGrid } from "./board-grid";
import { ScoreBar } from "./score-bar";
import { TimerDisplay } from "./timer-display";

interface BoardViewProps {
  sessionId: string;
  initialState: PublicGameState;
}

export function BoardView({ sessionId, initialState }: BoardViewProps) {
  const { data, error } = usePolledState<PublicGameState>(
    `/api/game/${sessionId}`,
    2000,
    initialState,
  );

  const state = data ?? initialState;

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-[1600px] flex-col gap-4 p-4 sm:gap-6 sm:p-6 lg:p-8">
      <header className="panel flex flex-col items-center gap-3 px-4 py-3 sm:px-6 sm:py-4">
        <div className="flex w-full items-center justify-between gap-4">
          <span className="brand text-lg tracking-tight text-zinc-300 sm:text-2xl">
            Codenames
          </span>
          <TimerDisplay timer={state.timer} size="board" />
          <span className="hidden text-sm text-zinc-500 sm:block">
            Spymasters control the board
          </span>
          <Link
            href={`/game/${sessionId}`}
            className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-zinc-400 transition hover:border-white/25 hover:text-zinc-200"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-3 w-3" aria-hidden="true">
              <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/>
              <path d="M14 14h2v2h-2zM18 14h3M14 18h2M18 18h3v3M21 14v3"/>
            </svg>
            QR codes
          </Link>
        </div>
        <ScoreBar
          counts={state.counts}
          currentTurn={state.currentTurn}
          status={state.status}
          size="board"
        />
        {error && <p className="text-sm text-amber-400">{error}</p>}
      </header>

      <div className="flex flex-1 items-center justify-center">
        <BoardGrid cards={state.cards} mode="public" size="board" />
      </div>
    </div>
  );
}
