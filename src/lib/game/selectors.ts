import type {
  Card,
  DuetRole,
  Game,
  GameCounts,
  PublicCard,
  PublicGameState,
  PublicTimer,
  SpymasterCard,
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
  if (game.mode === "duet") {
    const agentCards = game.cards.filter(
      (c) => c.duet?.a === "agent" || c.duet?.b === "agent",
    );
    const agentTotal = agentCards.length;
    const agentRemaining = agentCards.filter((c) => !c.revealed).length;
    return {
      redTotal: 0,
      blueTotal: 0,
      redRemaining: 0,
      blueRemaining: 0,
      agentTotal,
      agentRemaining,
    };
  }
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
    // In duet, reveal only that the card was found (not which team/role).
    role: card.revealed ? (game.mode === "duet" ? "found" : card.role) : null,
  }));

  return {
    id: game.id,
    mode: game.mode,
    language: game.language ?? "en",
    cards,
    startingTeam: game.startingTeam,
    currentTurn: game.currentTurn,
    status: game.status,
    counts: computeCounts(game),
    timer: projectTimer(game, now),
  };
}

/** Spymaster projection: roles shown from that player's perspective. */
export function toSpymasterState(
  game: Game,
  team: TeamColor,
  now = Date.now(),
): SpymasterGameState {
  let cards: SpymasterCard[];

  if (game.mode === "duet") {
    const player = team === "red" ? "a" : "b";
    cards = game.cards.map((card) => ({
      id: card.id,
      word: card.word,
      revealed: card.revealed,
      role: (card.duet?.[player] ?? "bystander") as DuetRole,
    }));
  } else {
    cards = game.cards.map((card) => ({
      id: card.id,
      word: card.word,
      revealed: card.revealed,
      role: card.role,
    }));
  }

  return {
    id: game.id,
    mode: game.mode,
    language: game.language ?? "en",
    team,
    cards,
    startingTeam: game.startingTeam,
    currentTurn: game.currentTurn,
    status: game.status,
    counts: computeCounts(game),
    timer: projectTimer(game, now),
  };
}
