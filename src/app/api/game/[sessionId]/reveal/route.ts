import { NextResponse } from "next/server";
import { revealCard } from "@/lib/game/store";
import { toPublicState } from "@/lib/game/selectors";

export async function POST(
  req: Request,
  ctx: { params: Promise<{ sessionId: string }> },
) {
  const { sessionId } = await ctx.params;
  const body = (await req.json().catch(() => null)) as { cardId?: string } | null;
  if (!body?.cardId) {
    return NextResponse.json({ error: "Missing cardId" }, { status: 400 });
  }

  const game = await revealCard(sessionId, body.cardId);
  if (!game) {
    return NextResponse.json({ error: "Game not found" }, { status: 404 });
  }
  return NextResponse.json(toPublicState(game));
}
