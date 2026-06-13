"use client";

import Link from "next/link";
import type { PublicGameState } from "@/lib/game/types";
import { usePolledState } from "./use-polled-state";
import { BoardGrid } from "./board-grid";
import { ScoreBar } from "./score-bar";
import { TimerDisplay } from "./timer-display";
import { t } from "@/lib/i18n";
import {
  DisplayModeMenu,
  useDisplayMode,
  useResolvedLayout,
} from "./display-mode-menu";

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

  const [displayMode, setDisplayMode] = useDisplayMode();
  const layoutClass = useResolvedLayout(displayMode);
  const isSidebar = layoutClass === "is-compact";
  const m = t(state.language);

  return (
    <div className={`board-layout ${layoutClass}`}>
      {/* Info panel — top bar in portrait/TV, right sidebar on phone landscape */}
      <div className="board-info panel p-4 sm:px-6">
        <span className="board-brand brand text-lg tracking-tight text-zinc-300 sm:text-2xl">
          Codenames
        </span>

        <div className="board-timer">
          <TimerDisplay timer={state.timer} size="board" />
        </div>

        <div className="board-qr flex items-center gap-2">
          <Link
            href={`/game/${sessionId}`}
            className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-zinc-400 transition hover:border-white/25 hover:text-zinc-200"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-3 w-3" aria-hidden="true">
              <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/>
              <path d="M14 14h2v2h-2zM18 14h3M14 18h2M18 18h3v3M21 14v3"/>
            </svg>
            <span className="board-qr-label">{m.display.qrCodes}</span>
          </Link>
          <DisplayModeMenu mode={displayMode} onChange={setDisplayMode} language={state.language} />
        </div>

        <div className="board-score">
          <ScoreBar
            counts={state.counts}
            currentTurn={state.currentTurn}
            status={state.status}
            mode={state.mode}
            language={state.language}
            size="board"
            variant={isSidebar ? "sidebar" : "bar"}
          />
          {error && <p className="mt-1 text-sm text-amber-400">{error}</p>}
        </div>
      </div>

      {/* 5×5 card grid */}
      <div className="board-grid-area">
        <BoardGrid cards={state.cards} mode="public" size="board" />
      </div>
    </div>
  );
}
