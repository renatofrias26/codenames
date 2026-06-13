import { NextResponse } from "next/server";
import { updateTimer, type TimerAction } from "@/lib/game/store";
import { toPublicState } from "@/lib/game/selectors";

const VALID_ACTIONS: TimerAction[] = ["start", "pause", "reset"];

export async function POST(
  req: Request,
  ctx: { params: Promise<{ sessionId: string }> },
) {
  const { sessionId } = await ctx.params;
  const body = (await req.json().catch(() => null)) as { action?: string } | null;
  const action = body?.action as TimerAction | undefined;

  if (!action || !VALID_ACTIONS.includes(action)) {
    return NextResponse.json({ error: "Invalid timer action" }, { status: 400 });
  }

  const game = await updateTimer(sessionId, action);
  if (!game) {
    return NextResponse.json({ error: "Game not found" }, { status: 404 });
  }
  return NextResponse.json(toPublicState(game));
}
