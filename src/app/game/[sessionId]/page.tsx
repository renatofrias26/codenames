import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getGame } from "@/lib/game/store";
import { buildGameLinks } from "@/lib/urls";
import { toQrDataUrl } from "@/lib/qr";
import { CopyLinkButton } from "@/components/copy-link-button";
import { t } from "@/lib/i18n";

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
  const m = t(game.language);

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-col gap-8 p-6">
      <header className="flex flex-col items-center gap-3 text-center animate-fade-in-up">
        <h1 className="brand text-3xl tracking-tight sm:text-4xl">
          {isDuet ? m.hub.readyTitleDuet : m.hub.readyTitleClassic}
        </h1>
        <p className="max-w-md text-sm text-zinc-400">
          {isDuet ? m.hub.readyDescDuet : m.hub.readyDescClassic}
        </p>
        <Link
          href={links.board.replace(/^https?:\/\/[^/]+/, "")}
          className="mt-2 inline-flex items-center gap-2 rounded-full bg-white/90 px-6 py-2.5 text-sm font-semibold text-zinc-900 shadow-lg backdrop-blur-sm transition hover:bg-white active:scale-95"
        >
          {m.hub.openBoard}
          <svg viewBox="0 0 16 16" fill="currentColor" className="h-3.5 w-3.5" aria-hidden="true">
            <path d="M3 8a.75.75 0 0 1 .75-.75h6.19L8.22 5.53a.75.75 0 0 1 1.06-1.06l3 3a.75.75 0 0 1 0 1.06l-3 3a.75.75 0 0 1-1.06-1.06l1.72-1.72H3.75A.75.75 0 0 1 3 8Z" />
          </svg>
        </Link>
      </header>

      <section
        className="grid gap-5 sm:grid-cols-2 animate-fade-in-up"
        style={{ animationDelay: "100ms" }}
      >
        <QrCard
          title={isDuet ? m.common.playerA : m.common.redSpymaster}
          team="red"
          qr={redQr}
          link={links.red}
          copyLabel={m.common.copyLink}
          copiedLabel={m.common.copied}
        />
        <QrCard
          title={isDuet ? m.common.playerB : m.common.blueSpymaster}
          team="blue"
          qr={blueQr}
          link={links.blue}
          copyLabel={m.common.copyLink}
          copiedLabel={m.common.copied}
        />
      </section>

      <p
        className="text-center text-xs text-zinc-500 animate-fade-in-up"
        style={{ animationDelay: "200ms" }}
      >
        {isDuet ? m.hub.footerDuet : m.hub.footerClassic}
      </p>
    </main>
  );
}

function QrCard({
  title,
  team,
  qr,
  link,
  copyLabel,
  copiedLabel,
}: {
  title: string;
  team: "red" | "blue";
  qr: string;
  link: string;
  copyLabel: string;
  copiedLabel: string;
}) {
  const isRed = team === "red";
  return (
    <div
      className={[
        "panel spin-border flex flex-col items-center gap-4 p-6 ring-1",
        isRed ? "spin-border-red ring-team-red/30" : "spin-border-blue ring-team-blue/30",
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
      <CopyLinkButton value={link} copyLabel={copyLabel} copiedLabel={copiedLabel} />
    </div>
  );
}
