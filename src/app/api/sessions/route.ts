import { NextResponse } from "next/server";
import { createNewGame } from "@/lib/game/store";
import type { GameLanguage, GameMode } from "@/lib/game/types";

const VALID_MODES: GameMode[] = ["classic", "duet"];
const VALID_LANGUAGES: GameLanguage[] = ["en", "pt"];

export async function POST(req: Request) {
  try {
    const body = (await req.json().catch(() => null)) as
      | { mode?: string; language?: string }
      | null;
    const mode: GameMode =
      body?.mode && VALID_MODES.includes(body.mode as GameMode)
        ? (body.mode as GameMode)
        : "classic";
    const language: GameLanguage =
      body?.language && VALID_LANGUAGES.includes(body.language as GameLanguage)
        ? (body.language as GameLanguage)
        : "en";
    const game = await createNewGame(mode, language);
    return NextResponse.json({ id: game.id });
  } catch (err) {
    console.error("[sessions] failed to create game", err);
    return NextResponse.json({ error: "Failed to create game" }, { status: 500 });
  }
}
