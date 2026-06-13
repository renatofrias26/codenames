import { nanoid } from "nanoid";
import type { Card, CardRole, Game, TeamColor, TimerState } from "./types";
import { WORD_LIST } from "./words";

export const BOARD_SIZE = 25;
export const DEFAULT_TURN_SECONDS = 120;

/** Fisher-Yates shuffle returning a new array. */
function shuffle<T>(input: readonly T[]): T[] {
  const arr = [...input];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function buildRoleDeck(startingTeam: TeamColor): CardRole[] {
  const otherTeam: TeamColor = startingTeam === "red" ? "blue" : "red";
  const roles: CardRole[] = [];
  // Starting team gets 9, the other gets 8, plus 7 neutral and 1 assassin.
  for (let i = 0; i < 9; i++) roles.push(startingTeam);
  for (let i = 0; i < 8; i++) roles.push(otherTeam);
  for (let i = 0; i < 7; i++) roles.push("neutral");
  roles.push("assassin");
  return shuffle(roles);
}

export function createBoard(): { cards: Card[]; startingTeam: TeamColor } {
  const startingTeam: TeamColor = Math.random() < 0.5 ? "red" : "blue";
  const words = shuffle(WORD_LIST).slice(0, BOARD_SIZE);
  const roles = buildRoleDeck(startingTeam);

  const cards: Card[] = words.map((word, index) => ({
    id: nanoid(8),
    word,
    role: roles[index],
    revealed: false,
  }));

  return { cards, startingTeam };
}

export function createTimer(seconds = DEFAULT_TURN_SECONDS): TimerState {
  const durationMs = seconds * 1000;
  return {
    durationMs,
    running: false,
    endsAt: null,
    remainingMs: durationMs,
  };
}

export function createGame(): Game {
  const { cards, startingTeam } = createBoard();
  const now = Date.now();
  return {
    id: nanoid(10),
    cards,
    startingTeam,
    currentTurn: startingTeam,
    status: "playing",
    timer: createTimer(),
    redToken: nanoid(16),
    blueToken: nanoid(16),
    createdAt: now,
    updatedAt: now,
  };
}
