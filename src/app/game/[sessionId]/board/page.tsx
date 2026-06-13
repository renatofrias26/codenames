import { notFound } from "next/navigation";
import { getGame } from "@/lib/game/store";
import { toPublicState } from "@/lib/game/selectors";
import { BoardView } from "@/components/board-view";

interface BoardPageProps {
  params: Promise<{ sessionId: string }>;
}

export default async function BoardPage({ params }: BoardPageProps) {
  const { sessionId } = await params;
  const game = await getGame(sessionId);
  if (!game) notFound();

  return <BoardView sessionId={sessionId} initialState={toPublicState(game)} />;
}
