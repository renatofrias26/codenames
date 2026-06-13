export type TeamColor = "red" | "blue";

export type CardRole = "red" | "blue" | "neutral" | "assassin";

export type GameStatus = "playing" | "red-wins" | "blue-wins";

export interface Card {
  id: string;
  word: string;
  role: CardRole;
  revealed: boolean;
}

export interface TimerState {
  /** Configured turn length in milliseconds. */
  durationMs: number;
  /** Whether the timer is currently counting down. */
  running: boolean;
  /** Epoch ms when the timer will hit zero, when running. */
  endsAt: number | null;
  /** Remaining ms captured while paused. */
  remainingMs: number;
}

export interface Game {
  id: string;
  cards: Card[];
  startingTeam: TeamColor;
  currentTurn: TeamColor;
  status: GameStatus;
  timer: TimerState;
  redToken: string;
  blueToken: string;
  /** Role of the most recently revealed card, used to resolve win state. */
  lastRevealedRole?: CardRole;
  createdAt: number;
  updatedAt: number;
}

/** Card as exposed to the public board: unrevealed roles are hidden. */
export interface PublicCard {
  id: string;
  word: string;
  revealed: boolean;
  role: CardRole | null;
}

export interface GameCounts {
  redTotal: number;
  blueTotal: number;
  redRemaining: number;
  blueRemaining: number;
}

export interface PublicTimer {
  durationMs: number;
  running: boolean;
  /** Remaining ms computed at projection time. */
  remainingMs: number;
}

export interface PublicGameState {
  id: string;
  cards: PublicCard[];
  startingTeam: TeamColor;
  currentTurn: TeamColor;
  status: GameStatus;
  counts: GameCounts;
  timer: PublicTimer;
}

/** Spymaster view: full card roles are always visible. */
export interface SpymasterGameState extends Omit<PublicGameState, "cards"> {
  team: TeamColor;
  cards: Card[];
}
