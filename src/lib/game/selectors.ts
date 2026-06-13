import type {
  Card,
  Game,
  GameCounts,
  PublicCard,
  PublicGameState,
  PublicTimer,
  SpymasterGameState,
  TeamColor,
} from "./types";

/** Remaining timer ms resolved against the current wall clock. */
export function resolveRemainingMs(game: Game, now = Date.now()): number {
  const { timer } = game;
  if (timer.running && timer.endsAt !== null) {
    return Math.max(0, timer.endsAt - now);
  }
  return Math.max(0, timer.remainingMs);
}

function countRole(cards: Card[], role: TeamColor) {
  const total = cards.filter((c) => c.role === role).length;
  const remaining = cards.filter((c) => c.role === role && !c.revealed).length;
  return { total, remaining };
}

export function computeCounts(game: Game): GameCounts {
  const red = countRole(game.cards, "red");
  const blue = countRole(game.cards, "blue");
  return {
    redTotal: red.total,
    blueTotal: blue.total,
    redRemaining: red.remaining,
    blueRemaining: blue.remaining,
  };
}

function projectTimer(game: Game, now: number): PublicTimer {
  return {
    durationMs: game.timer.durationMs,
    running: game.timer.running,
    remainingMs: resolveRemainingMs(game, now),
  };
}

/** Board projection: unrevealed roles are stripped so the screen can't leak the key. */
export function toPublicState(game: Game, now = Date.now()): PublicGameState {
  const cards: PublicCard[] = game.cards.map((card) => ({
    id: card.id,
    word: card.word,
    revealed: card.revealed,
    role: card.revealed ? card.role : null,
  }));

  return {
    id: game.id,
    cards,
    startingTeam: game.startingTeam,
    currentTurn: game.currentTurn,
    status: game.status,
    counts: computeCounts(game),
    timer: projectTimer(game, now),
  };
}

/** Spymaster projection: full card roles are always included. */
export function toSpymasterState(
  game: Game,
  team: TeamColor,
  now = Date.now(),
): SpymasterGameState {
  return {
    id: game.id,
    team,
    cards: game.cards.map((card) => ({ ...card })),
    startingTeam: game.startingTeam,
    currentTurn: game.currentTurn,
    status: game.status,
    counts: computeCounts(game),
    timer: projectTimer(game, now),
  };
}
