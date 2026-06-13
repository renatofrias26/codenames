"use client";

import { useRef, useEffect } from "react";
import type { CardRole, DuetRole } from "@/lib/game/types";
import { FitText } from "./fit-text";

export type AnyRole = CardRole | DuetRole;

export interface BoardCard {
  id: string;
  word: string;
  revealed: boolean;
  role: AnyRole | null;
}

interface BoardGridProps {
  cards: BoardCard[];
  mode: "public" | "spymaster";
  size?: "board" | "compact";
  onReveal?: (cardId: string) => void;
  disabled?: boolean;
}

const FACE_CLASS: Record<AnyRole, string> = {
  // Classic
  red: "face-red",
  blue: "face-blue",
  neutral: "face-neutral",
  assassin: "face-assassin",
  found: "face-found",
  // Duet spymaster
  agent: "face-agent",
  bystander: "face-neutral",
};

function faceClasses(card: BoardCard, mode: "public" | "spymaster"): string {
  if (mode === "spymaster" && card.role) {
    return `${FACE_CLASS[card.role]} ${card.revealed ? "card-done" : ""}`;
  }
  if (card.revealed && card.role) {
    return `${FACE_CLASS[card.role]} animate-pop`;
  }
  return "face-cover";
}

export function BoardGrid({
  cards,
  mode,
  size = "compact",
  onReveal,
  disabled,
}: BoardGridProps) {
  const interactive = Boolean(onReveal) && !disabled;
  const isBoard = size === "board";

  // Track whether this is the initial mount to stagger card entrance only once
  const mountedRef = useRef(false);
  const isInitialMount = !mountedRef.current;
  useEffect(() => {
    mountedRef.current = true;
  }, []);

  return (
    <div
      className={
        isBoard
          ? "grid w-full grid-cols-5 gap-2 sm:gap-3 lg:gap-4"
          : "grid w-full grid-cols-5 gap-1.5 sm:gap-2"
      }
    >
      {cards.map((card, i) => {
        const clickable = interactive && !card.revealed;
        return (
          <button
            key={card.id}
            type="button"
            disabled={!clickable}
            onClick={clickable ? () => onReveal?.(card.id) : undefined}
            style={isInitialMount ? { animationDelay: `${i * 22}ms` } : undefined}
            className={[
              "card-face",
              isInitialMount ? "animate-stagger-in" : "",
              isBoard
                ? "aspect-[3/2] text-sm sm:text-xl lg:text-2xl xl:text-3xl"
                : "aspect-[4/3] min-h-12 text-[10px] sm:text-sm",
              clickable ? "card-tappable" : "cursor-default",
              faceClasses(card, mode),
            ].join(" ")}
          >
            <FitText text={card.word} />
          </button>
        );
      })}
    </div>
  );
}
