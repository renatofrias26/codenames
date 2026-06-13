import { NextResponse } from "next/server";
import { createNewGame } from "@/lib/game/store";
import type { GameMode } from "@/lib/game/types";

const VALID_MODES: GameMode[] = ["classic", "duet"];

export async function POST(req: Request) {
  try {
    const body = (await req.json().catch(() => null)) as { mode?: string } | null;
    const mode: GameMode =
      body?.mode && VALID_MODES.includes(body.mode as GameMode)
        ? (body.mode as GameMode)
        : "classic";
    const game = await createNewGame(mode);
    return NextResponse.json({ id: game.id });
  } catch (err) {
    console.error("[sessions] failed to create game", err);
    return NextResponse.json({ error: "Failed to create game" }, { status: 500 });
  }
}
