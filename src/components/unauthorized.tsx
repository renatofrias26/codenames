import type { TeamColor } from "@/lib/game/types";

export function Unauthorized({ team }: { team: TeamColor }) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-3 p-6 text-center">
      <h1 className="text-xl font-bold text-amber-400">Spymaster link invalid</h1>
      <p className="max-w-sm text-sm text-zinc-400">
        This {team} spymaster link is missing or has an incorrect access token.
        Scan the QR code from the host&apos;s game screen to join.
      </p>
    </main>
  );
}
