import { notFound } from "next/navigation";
import { getGame, isTeamTokenValid } from "@/lib/game/store";
import { toSpymasterState } from "@/lib/game/selectors";
import { SpymasterView } from "@/components/spymaster-view";
import { Unauthorized } from "@/components/unauthorized";

interface SpymasterPageProps {
  params: Promise<{ sessionId: string }>;
  searchParams: Promise<{ token?: string }>;
}

export default async function RedSpymasterPage({
  params,
  searchParams,
}: SpymasterPageProps) {
  const { sessionId } = await params;
  const { token = "" } = await searchParams;

  const game = await getGame(sessionId);
  if (!game) notFound();

  if (!(await isTeamTokenValid(sessionId, "red", token))) {
    return <Unauthorized team="red" />;
  }

  return (
    <SpymasterView
      sessionId={sessionId}
      team="red"
      token={token}
      initialState={toSpymasterState(game, "red")}
    />
  );
}
