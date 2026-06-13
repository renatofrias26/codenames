"use client";

import type { CardRole } from "@/lib/game/types";
import { FitText } from "./fit-text";

export interface BoardCard {
  id: string;
  word: string;
  revealed: boolean;
  role: CardRole | null;
}

interface BoardGridProps {
  cards: BoardCard[];
  mode: "public" | "spymaster";
  size?: "board" | "compact";
  onReveal?: (cardId: string) => void;
  disabled?: boolean;
}

const FACE_CLASS: Record<CardRole, string> = {
  red: "face-red",
  blue: "face-blue",
  neutral: "face-neutral",
  assassin: "face-assassin",
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

  return (
    <div
      className={
        isBoard
          ? "grid w-full grid-cols-5 gap-2 sm:gap-3 lg:gap-4"
          : "grid w-full grid-cols-5 gap-1.5 sm:gap-2"
      }
    >
      {cards.map((card) => {
        const clickable = interactive && !card.revealed;
        return (
          <button
            key={card.id}
            type="button"
            disabled={!clickable}
            onClick={clickable ? () => onReveal?.(card.id) : undefined}
            className={[
              "card-face",
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
