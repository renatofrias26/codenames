export type TeamColor = "red" | "blue";

/** Classic card role (red/blue/neutral/assassin) + 'found' for revealed duet cards on the public board. */
export type CardRole = "red" | "blue" | "neutral" | "assassin" | "found";

/** Per-player role in Duet mode. */
export type DuetRole = "agent" | "assassin" | "bystander";

export type GameMode = "classic" | "duet";

/** Language used for the board's word list (and the in-game UI). */
export type GameLanguage = "en" | "pt";

export type GameStatus =
  | "playing"
  | "red-wins"
  | "blue-wins"
  | "players-win"   // duet: all agents revealed
  | "players-lose"; // duet: assassin triggered

export interface Card {
  id: string;
  word: string;
  /** Used in classic mode. Set to "neutral" for all duet cards. */
  role: CardRole;
  /** Present only in duet mode: the role from each player's perspective. */
  duet?: { a: DuetRole; b: DuetRole };
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
  mode: GameMode;
  language: GameLanguage;
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
  /** Duet only: total agent cards (both players combined). */
  agentTotal?: number;
  /** Duet only: remaining unrevealed agents. */
  agentRemaining?: number;
}

export interface PublicTimer {
  durationMs: number;
  running: boolean;
  /** Remaining ms computed at projection time. */
  remainingMs: number;
}

export interface PublicGameState {
  id: string;
  mode: GameMode;
  language: GameLanguage;
  cards: PublicCard[];
  startingTeam: TeamColor;
  currentTurn: TeamColor;
  status: GameStatus;
  counts: GameCounts;
  timer: PublicTimer;
}

/**
 * Card as seen by a specific spymaster.
 * Classic: role is a CardRole. Duet: role is a DuetRole (agent/assassin/bystander).
 */
export interface SpymasterCard {
  id: string;
  word: string;
  revealed: boolean;
  role: CardRole | DuetRole;
}

/** Spymaster view: role visible from that player's perspective. */
export interface SpymasterGameState extends Omit<PublicGameState, "cards"> {
  team: TeamColor;
  cards: SpymasterCard[];
}
