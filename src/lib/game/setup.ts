import { nanoid } from "nanoid";
import type { Card, CardRole, DuetRole, Game, GameLanguage, GameMode, TeamColor, TimerState } from "./types";
import { getWordList } from "./words";

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

export function createBoard(
  language: GameLanguage = "en",
): { cards: Card[]; startingTeam: TeamColor } {
  const startingTeam: TeamColor = Math.random() < 0.5 ? "red" : "blue";
  const words = shuffle(getWordList(language)).slice(0, BOARD_SIZE);
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

/**
 * Duet distribution (25 cards, each player sees 9 agents + 3 assassins):
 *  3  both-agent
 *  4  A-agent / B-bystander
 *  4  B-agent / A-bystander
 *  2  A-agent / B-assassin
 *  2  B-agent / A-assassin
 *  1  both-assassin
 *  9  both-bystander
 * ──
 * 25  total
 */
export function createDuetBoard(
  language: GameLanguage = "en",
): { cards: Card[]; startingTeam: TeamColor } {
  const startingTeam: TeamColor = Math.random() < 0.5 ? "red" : "blue";
  const words = shuffle(getWordList(language)).slice(0, BOARD_SIZE);

  const duetRoles: { a: DuetRole; b: DuetRole }[] = shuffle([
    ...Array.from({ length: 3 }, () => ({ a: "agent" as DuetRole, b: "agent" as DuetRole })),
    ...Array.from({ length: 4 }, () => ({ a: "agent" as DuetRole, b: "bystander" as DuetRole })),
    ...Array.from({ length: 4 }, () => ({ a: "bystander" as DuetRole, b: "agent" as DuetRole })),
    ...Array.from({ length: 2 }, () => ({ a: "agent" as DuetRole, b: "assassin" as DuetRole })),
    ...Array.from({ length: 2 }, () => ({ a: "assassin" as DuetRole, b: "agent" as DuetRole })),
    ...Array.from({ length: 1 }, () => ({ a: "assassin" as DuetRole, b: "assassin" as DuetRole })),
    ...Array.from({ length: 9 }, () => ({ a: "bystander" as DuetRole, b: "bystander" as DuetRole })),
  ]);

  const cards: Card[] = words.map((word, i) => ({
    id: nanoid(8),
    word,
    role: "neutral" as CardRole, // unused in duet; duet field is authoritative
    duet: duetRoles[i],
    revealed: false,
  }));

  return { cards, startingTeam };
}

export function createGame(
  mode: GameMode = "classic",
  language: GameLanguage = "en",
): Game {
  const { cards, startingTeam } =
    mode === "duet" ? createDuetBoard(language) : createBoard(language);
  const now = Date.now();
  return {
    id: nanoid(10),
    mode,
    language,
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
