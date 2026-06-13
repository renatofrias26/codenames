import { CreateGameButton } from "@/components/create-game-button";

export default function Home() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-12 p-6 text-center">
      {/* Hero */}
      <div className="flex flex-col items-center gap-4 animate-fade-in-up">
        <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium uppercase tracking-widest text-zinc-400">
          In-person party game
        </span>
        <h1 className="brand text-5xl tracking-tight sm:text-7xl">
          <span className="text-team-red">Code</span>
          <span className="text-team-blue">names</span>
        </h1>
        <p className="max-w-md text-balance text-zinc-400">
          One shared screen shows the board. Each spymaster scans a QR code to
          see the secret key on their phone. Give clues out loud, beat the timer.
        </p>
      </div>

      {/* Mode cards */}
      <div
        className="grid w-full max-w-2xl gap-4 sm:grid-cols-2 animate-fade-in-up"
        style={{ animationDelay: "120ms" }}
      >
        {/* Classic */}
        <div
          className="group relative overflow-hidden rounded-2xl border border-white/10 p-6 text-left transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
          style={{
            background:
              "radial-gradient(ellipse at 15% 60%, rgba(255,90,96,0.13) 0%, transparent 55%), radial-gradient(ellipse at 85% 60%, rgba(93,139,255,0.13) 0%, transparent 55%), rgba(255,255,255,0.03)",
          }}
        >
          {/* Hover ring */}
          <div className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 ring-1 ring-inset ring-white/20 transition-opacity duration-300 group-hover:opacity-100" />

          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <span className="rounded-full bg-white/[0.08] px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-widest text-zinc-400">
                4+ players
              </span>
            </div>

            {/* Red / Blue split bar */}
            <div className="flex h-1.5 overflow-hidden rounded-full">
              <div className="flex-1 bg-team-red/70" />
              <div className="flex-1 bg-team-blue/70" />
            </div>

            <div className="flex flex-col gap-1.5">
              <span className="brand text-2xl text-zinc-100">Classic</span>
              <span className="text-sm leading-relaxed text-zinc-400">
                Red vs Blue. Two teams race to find all their agents — without
                touching the assassin.
              </span>
            </div>

            <CreateGameButton mode="classic" label="Play Classic" fullWidth />
          </div>
        </div>

        {/* Duet */}
        <div
          className="group relative overflow-hidden rounded-2xl border border-white/10 p-6 text-left transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
          style={{
            background:
              "radial-gradient(ellipse at 50% 85%, rgba(74,222,128,0.12) 0%, transparent 55%), rgba(255,255,255,0.03)",
          }}
        >
          <div className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 ring-1 ring-inset ring-emerald-400/20 transition-opacity duration-300 group-hover:opacity-100" />

          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <span className="rounded-full bg-white/[0.08] px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-widest text-zinc-400">
                2 players
              </span>
            </div>

            {/* 15 agent dots */}
            <div className="flex gap-0.5">
              {Array.from({ length: 15 }, (_, i) => (
                <div key={i} className="h-1.5 flex-1 rounded-full bg-emerald-400/60" />
              ))}
            </div>

            <div className="flex flex-col gap-1.5">
              <span className="brand text-2xl text-emerald-400">Duet</span>
              <span className="text-sm leading-relaxed text-zinc-400">
                Cooperative, 2 players. Work together to find all 15 agents
                before you hit an assassin.
              </span>
            </div>

            <CreateGameButton mode="duet" variant="emerald" label="Play Duet" fullWidth />
          </div>
        </div>
      </div>

      {/* Steps */}
      <ol
        className="grid w-full max-w-xl gap-3 text-left sm:grid-cols-3 animate-fade-in-up"
        style={{ animationDelay: "220ms" }}
      >
        {[
          { n: "1", t: "Open the board", d: "Create a game and put the board on a TV or laptop." },
          { n: "2", t: "Scan to spy", d: "Each spymaster scans their team's QR code on a phone." },
          { n: "3", t: "Play", d: "Give clues aloud, tap cards to reveal, watch the timer." },
        ].map((step) => (
          <li key={step.n} className="panel flex flex-col gap-1 p-4 text-sm">
            <span className="brand text-2xl text-zinc-500">{step.n}</span>
            <span className="font-semibold text-zinc-200">{step.t}</span>
            <span className="text-zinc-400">{step.d}</span>
          </li>
        ))}
      </ol>
    </main>
  );
}
