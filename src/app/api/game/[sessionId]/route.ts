import { NextResponse } from "next/server";
import { getGame } from "@/lib/game/store";
import { toPublicState } from "@/lib/game/selectors";

export const dynamic = "force-dynamic";

export async function GET(
  _req: Request,
  ctx: { params: Promise<{ sessionId: string }> },
) {
  const { sessionId } = await ctx.params;
  const game = await getGame(sessionId);
  if (!game) {
    return NextResponse.json({ error: "Game not found" }, { status: 404 });
  }
  return NextResponse.json(toPublicState(game));
}
