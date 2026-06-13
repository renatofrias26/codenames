import { NextResponse } from "next/server";
import { endTurn } from "@/lib/game/store";
import { toPublicState } from "@/lib/game/selectors";

export async function POST(
  _req: Request,
  ctx: { params: Promise<{ sessionId: string }> },
) {
  const { sessionId } = await ctx.params;
  const game = await endTurn(sessionId);
  if (!game) {
    return NextResponse.json({ error: "Game not found" }, { status: 404 });
  }
  return NextResponse.json(toPublicState(game));
}
