"use client";

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
