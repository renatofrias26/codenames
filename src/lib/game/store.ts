import { Redis } from "@upstash/redis";
import type { Game, GameLanguage, GameMode, GameStatus, TeamColor } from "./types";
import { createBoard, createDuetBoard, createGame, createTimer } from "./setup";
import { resolveRemainingMs } from "./selectors";

export type TimerAction = "start" | "pause" | "reset";

// ---------------------------------------------------------------------------
// Storage backend
// ---------------------------------------------------------------------------

/**
 * Use Upstash Redis when the env vars are present (Vercel deployment).
 * Fall back to the in-memory Map for local dev without KV configured.
 */
const redis =
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
    ? new Redis({
        url: process.env.UPSTASH_REDIS_REST_URL,
        token: process.env.UPSTASH_REDIS_REST_TOKEN,
      })
    : null;

/** Games expire 48 hours after the last write. */
const GAME_TTL_SECONDS = 48 * 60 * 60;

const key = (id: string) => `codenames:game:${id}`;

const globalStore = globalThis as typeof globalThis & {
  __codenamesGames?: Map<string, Game>;
};
const memStore: Map<string, Game> =
  globalStore.__codenamesGames ??
  (globalStore.__codenamesGames = new Map<string, Game>());

async function load(id: string): Promise<Game | null> {
  if (redis) {
    return redis.get<Game>(key(id));
  }
  return memStore.get(id) ?? null;
}

async function save(game: Game): Promise<void> {
  if (redis) {
    await redis.set(key(game.id), game, { ex: GAME_TTL_SECONDS });
  } else {
    memStore.set(game.id, game);
  }
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function touch(game: Game): Game {
  game.updatedAt = Date.now();
  return game;
}

function recomputeStatus(game: Game): GameStatus {
  if (game.lastRevealedRole === "assassin") {
    if (game.mode === "duet") return "players-lose";
    const loser = game.currentTurn;
    return loser === "red" ? "blue-wins" : "red-wins";
  }
  if (game.mode === "duet") {
    const allFound = game.cards
      .filter((c) => c.duet?.a === "agent" || c.duet?.b === "agent")
      .every((c) => c.revealed);
    return allFound ? "players-win" : "playing";
  }
  const redLeft = game.cards.some((c) => c.role === "red" && !c.revealed);
  const blueLeft = game.cards.some((c) => c.role === "blue" && !c.revealed);
  if (!redLeft) return "red-wins";
  if (!blueLeft) return "blue-wins";
  return "playing";
}

// ---------------------------------------------------------------------------
// Public async API (interface unchanged)
// ---------------------------------------------------------------------------

export async function createNewGame(
  mode: GameMode = "classic",
  language: GameLanguage = "en",
): Promise<Game> {
  const game = createGame(mode, language);
  await save(game);
  return game;
}

export async function getGame(id: string): Promise<Game | null> {
  return load(id);
}

export async function revealCard(
  id: string,
  cardId: string,
): Promise<Game | null> {
  const game = await load(id);
  if (!game) return null;
  if (game.status !== "playing") return game;

  const card = game.cards.find((c) => c.id === cardId);
  if (!card || card.revealed) return game;

  card.revealed = true;

  if (game.mode === "duet" && card.duet) {
    // Assassin check from the active player's perspective.
    const player = game.currentTurn === "red" ? "a" : "b";
    game.lastRevealedRole = card.duet[player] === "assassin" ? "assassin" : undefined;
  } else {
    game.lastRevealedRole = card.role;
  }
  game.status = recomputeStatus(game);

  if (game.status !== "playing") {
    game.timer.running = false;
    game.timer.endsAt = null;
  }

  touch(game);
  await save(game);
  return game;
}

export async function endTurn(id: string): Promise<Game | null> {
  const game = await load(id);
  if (!game) return null;
  if (game.status !== "playing") return game;

  game.currentTurn = game.currentTurn === "red" ? "blue" : "red";
  game.timer = createTimer(game.timer.durationMs / 1000);

  touch(game);
  await save(game);
  return game;
}

export async function updateTimer(
  id: string,
  action: TimerAction,
): Promise<Game | null> {
  const game = await load(id);
  if (!game) return null;
  const now = Date.now();
  const { timer } = game;

  switch (action) {
    case "start": {
      if (game.status !== "playing") break;
      const remaining = resolveRemainingMs(game, now);
      if (!timer.running && remaining > 0) {
        timer.running = true;
        timer.endsAt = now + remaining;
      }
      break;
    }
    case "pause": {
      if (timer.running) {
        timer.remainingMs = resolveRemainingMs(game, now);
        timer.running = false;
        timer.endsAt = null;
      }
      break;
    }
    case "reset": {
      timer.running = false;
      timer.endsAt = null;
      timer.remainingMs = timer.durationMs;
      break;
    }
  }

  touch(game);
  await save(game);
  return game;
}

export async function resetGame(id: string): Promise<Game | null> {
  const game = await load(id);
  if (!game) return null;

  const { cards, startingTeam } =
    game.mode === "duet"
      ? createDuetBoard(game.language)
      : createBoard(game.language);
  game.cards = cards;
  game.startingTeam = startingTeam;
  game.currentTurn = startingTeam;
  game.status = "playing";
  game.timer = createTimer(game.timer.durationMs / 1000);
  game.lastRevealedRole = undefined;

  touch(game);
  await save(game);
  return game;
}

export async function isTeamTokenValid(
  id: string,
  team: TeamColor,
  token: string,
): Promise<boolean> {
  const game = await load(id);
  if (!game) return false;
  const expected = team === "red" ? game.redToken : game.blueToken;
  return Boolean(token) && token === expected;
}
