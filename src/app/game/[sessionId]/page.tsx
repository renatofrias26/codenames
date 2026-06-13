import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getGame } from "@/lib/game/store";
import { buildGameLinks } from "@/lib/urls";
import { toQrDataUrl } from "@/lib/qr";
import { CopyLinkButton } from "@/components/copy-link-button";

interface HubPageProps {
  params: Promise<{ sessionId: string }>;
}

export default async function HubPage({ params }: HubPageProps) {
  const { sessionId } = await params;
  const game = await getGame(sessionId);
  if (!game) notFound();

  const links = await buildGameLinks(game);
  const [redQr, blueQr] = await Promise.all([
    toQrDataUrl(links.red),
    toQrDataUrl(links.blue),
  ]);

  const isDuet = game.mode === "duet";

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-col gap-8 p-6">
      <header className="flex flex-col items-center gap-3 text-center">
        <h1 className="brand text-3xl tracking-tight sm:text-4xl">
          {isDuet ? "Duet game ready" : "Game ready"}
        </h1>
        <p className="max-w-md text-sm text-zinc-400">
          {isDuet
            ? "Open the board on your shared screen, then each player scans their QR code."
            : "Open the board on your shared screen, then have each spymaster scan their team's QR code on a phone. Keep this page private."}
        </p>
        <Link
          href={links.board.replace(/^https?:\/\/[^/]+/, "")}
          className="mt-2 inline-flex items-center gap-2 rounded-full bg-emerald-500 px-6 py-3 font-semibold text-emerald-950 shadow-lg shadow-emerald-500/20 transition hover:bg-emerald-400"
        >
          📺 Open the board
        </Link>
      </header>

      <section className="grid gap-5 sm:grid-cols-2">
        <QrCard
          title={isDuet ? "Player A" : "Red spymaster"}
          team="red"
          qr={redQr}
          link={links.red}
        />
        <QrCard
          title={isDuet ? "Player B" : "Blue spymaster"}
          team="blue"
          qr={blueQr}
          link={links.blue}
        />
      </section>

      <p className="text-center text-xs text-zinc-500">
        {isDuet
          ? "Each player should open their own link — they see different key cards."
          : "Anyone with a spymaster link can see that team's key, so only share each QR code with its spymaster."}
      </p>
    </main>
  );
}

function QrCard({
  title,
  team,
  qr,
  link,
}: {
  title: string;
  team: "red" | "blue";
  qr: string;
  link: string;
}) {
  const isRed = team === "red";
  return (
    <div
      className={[
        "panel flex flex-col items-center gap-4 p-6 ring-1",
        isRed ? "ring-team-red/30" : "ring-team-blue/30",
      ].join(" ")}
    >
      <h2
        className={[
          "brand text-xl uppercase tracking-wide",
          isRed ? "text-team-red" : "text-team-blue",
        ].join(" ")}
      >
        {title}
      </h2>
      <Image
        src={qr}
        alt={`${title} QR code`}
        width={320}
        height={320}
        className="h-44 w-44 rounded-xl bg-white p-2 shadow-lg shadow-black/30 sm:h-52 sm:w-52"
        unoptimized
      />
      <CopyLinkButton value={link} />
    </div>
  );
}
