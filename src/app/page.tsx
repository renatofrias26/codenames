import { CreateGameButton } from "@/components/create-game-button";

export default function Home() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-10 p-6 text-center">
      <div className="flex flex-col items-center gap-4">
        <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium uppercase tracking-widest text-zinc-400">
          In-person party game
        </span>
        <h1 className="brand text-5xl tracking-tight sm:text-7xl">
          <span className="text-team-red">Code</span>
          <span className="text-team-blue">names</span>
        </h1>
        <p className="max-w-md text-balance text-zinc-400">
          One shared screen shows the board. Each spymaster scans a QR code to
          see the secret key on their phone. Give clues out loud, beat the
          timer.
        </p>
      </div>

      <div className="grid w-full max-w-lg gap-4 sm:grid-cols-2">
        <div className="panel flex flex-col gap-3 p-5 text-left">
          <div className="flex flex-col gap-1">
            <span className="brand text-lg text-zinc-200">Classic</span>
            <span className="text-xs text-zinc-400">
              Two teams, 4+ players. Red vs Blue — first to find all their
              agents wins.
            </span>
          </div>
          <CreateGameButton mode="classic" />
        </div>
        <div className="panel flex flex-col gap-3 p-5 text-left ring-emerald-500/20">
          <div className="flex flex-col gap-1">
            <span className="brand text-lg text-emerald-400">Duet</span>
            <span className="text-xs text-zinc-400">
              Cooperative, 2 players. Work together to find all 15 agents
              before hitting an assassin.
            </span>
          </div>
          <CreateGameButton mode="duet" variant="secondary" />
        </div>
      </div>

      <ol className="grid w-full max-w-xl gap-3 text-left sm:grid-cols-3">
        {[
          { n: "1", t: "Open the board", d: "Create a game and put the board on a TV or laptop." },
          { n: "2", t: "Scan to spy", d: "Each spymaster scans their team's QR code on a phone." },
          { n: "3", t: "Play", d: "Give clues aloud, tap cards to reveal, watch the timer." },
        ].map((step) => (
          <li
            key={step.n}
            className="panel flex flex-col gap-1 p-4 text-sm"
          >
            <span className="brand text-2xl text-zinc-500">{step.n}</span>
            <span className="font-semibold text-zinc-200">{step.t}</span>
            <span className="text-zinc-400">{step.d}</span>
          </li>
        ))}
      </ol>
    </main>
  );
}
