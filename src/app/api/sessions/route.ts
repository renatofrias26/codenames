import { NextResponse } from "next/server";
import { createNewGame } from "@/lib/game/store";

export async function POST() {
  const game = await createNewGame();
  return NextResponse.json({ id: game.id });
}
