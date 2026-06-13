import { headers } from "next/headers";
import type { Game } from "./game/types";

/**
 * Resolve the absolute base URL for building shareable links.
 * Works across localhost, a LAN IP during home testing, and Vercel by reading
 * the forwarded host/proto headers of the current request.
 */
export async function getBaseUrl(): Promise<string> {
  const h = await headers();

  const forwardedHost = h.get("x-forwarded-host") ?? h.get("host");
  if (forwardedHost) {
    const proto =
      h.get("x-forwarded-proto") ??
      (forwardedHost.startsWith("localhost") || forwardedHost.startsWith("127.")
        ? "http"
        : "https");
    return `${proto}://${forwardedHost}`;
  }

  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  return process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";
}

export interface GameLinks {
  hub: string;
  board: string;
  red: string;
  blue: string;
}

export async function buildGameLinks(game: Game): Promise<GameLinks> {
  const base = await getBaseUrl();
  const root = `${base}/game/${game.id}`;
  return {
    hub: root,
    board: `${root}/board`,
    red: `${root}/red?token=${game.redToken}`,
    blue: `${root}/blue?token=${game.blueToken}`,
  };
}
