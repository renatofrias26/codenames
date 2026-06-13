import { NextResponse } from "next/server";
import { getGame } from "@/lib/game/store";
import { toSpymasterState } from "@/lib/game/selectors";
import type { TeamColor } from "@/lib/game/types";

export const dynamic = "force-dynamic";

export async function GET(
  req: Request,
  ctx: { params: Promise<{ sessionId: string }> },
) {
  const { sessionId } = await ctx.params;
  const { searchParams } = new URL(req.url);
  const team = searchParams.get("team") as TeamColor | null;
  const token = searchParams.get("token") ?? "";

  if (team !== "red" && team !== "blue") {
    return NextResponse.json({ error: "Invalid team" }, { status: 400 });
  }

  const game = await getGame(sessionId);
  if (!game) {
    return NextResponse.json({ error: "Game not found" }, { status: 404 });
  }

  const expected = team === "red" ? game.redToken : game.blueToken;
  if (!token || token !== expected) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json(toSpymasterState(game, team));
}
