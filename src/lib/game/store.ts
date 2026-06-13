import type { Game, GameStatus, TeamColor } from "./types";
import { createBoard, createGame, createTimer } from "./setup";
import { resolveRemainingMs } from "./selectors";

export type TimerAction = "start" | "pause" | "reset";

/**
 * In-memory game store kept on globalThis so it survives dev HMR reloads and is
 * shared within a single warm server instance. Swap this implementation for a
 * KV/Redis adapter to support multi-instance deployments.
 */
const globalStore = globalThis as typeof globalThis & {
  __codenamesGames?: Map<string, Game>;
};

const games: Map<string, Game> =
  globalStore.__codenamesGames ?? (globalStore.__codenamesGames = new Map());

function touch(game: Game): Game {
  game.updatedAt = Date.now();
  return game;
}

export async function createNewGame(): Promise<Game> {
  const game = createGame();
  games.set(game.id, game);
  return game;
}

export async function getGame(id: string): Promise<Game | null> {
  return games.get(id) ?? null;
}

function recomputeStatus(game: Game): GameStatus {
  const lastRevealed = game.lastRevealedRole;
  if (lastRevealed === "assassin") {
    const loser = game.currentTurn;
    return loser === "red" ? "blue-wins" : "red-wins";
  }
  const redLeft = game.cards.some((c) => c.role === "red" && !c.revealed);
  const blueLeft = game.cards.some((c) => c.role === "blue" && !c.revealed);
  if (!redLeft) return "red-wins";
  if (!blueLeft) return "blue-wins";
  return "playing";
}

export async function revealCard(
  id: string,
  cardId: string,
): Promise<Game | null> {
  const game = games.get(id);
  if (!game) return null;
  if (game.status !== "playing") return game;

  const card = game.cards.find((c) => c.id === cardId);
  if (!card || card.revealed) return game;

  card.revealed = true;
  game.lastRevealedRole = card.role;
  game.status = recomputeStatus(game);

  if (game.status !== "playing") {
    game.timer.running = false;
    game.timer.endsAt = null;
  }

  return touch(game);
}

export async function endTurn(id: string): Promise<Game | null> {
  const game = games.get(id);
  if (!game) return null;
  if (game.status !== "playing") return game;

  game.currentTurn = game.currentTurn === "red" ? "blue" : "red";
  game.timer = createTimer(game.timer.durationMs / 1000);
  return touch(game);
}

export async function updateTimer(
  id: string,
  action: TimerAction,
): Promise<Game | null> {
  const game = games.get(id);
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

  return touch(game);
}

export async function resetGame(id: string): Promise<Game | null> {
  const game = games.get(id);
  if (!game) return null;

  const { cards, startingTeam } = createBoard();
  game.cards = cards;
  game.startingTeam = startingTeam;
  game.currentTurn = startingTeam;
  game.status = "playing";
  game.timer = createTimer(game.timer.durationMs / 1000);
  game.lastRevealedRole = undefined;
  return touch(game);
}

export async function isTeamTokenValid(
  id: string,
  team: TeamColor,
  token: string,
): Promise<boolean> {
  const game = games.get(id);
  if (!game) return false;
  const expected = team === "red" ? game.redToken : game.blueToken;
  return Boolean(token) && token === expected;
}
