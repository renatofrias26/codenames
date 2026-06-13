"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@heroui/react";
import type { GameMode } from "@/lib/game/types";

export function CreateGameButton({
  mode = "classic",
  label,
  variant = "primary",
}: {
  mode?: GameMode;
  label?: string;
  variant?: "primary" | "secondary";
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const create = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode }),
      });
      if (!res.ok) throw new Error("Failed to create game");
      const { id } = (await res.json()) as { id: string };
      router.push(`/game/${id}`);
    } catch {
      setLoading(false);
    }
  };

  const defaultLabel = mode === "duet" ? "Play Duet (2 players)" : "Play Classic (4+ players)";

  return (
    <Button
      size="lg"
      variant={variant}
      isPending={loading}
      onPress={() => void create()}
    >
      {loading ? "Creating…" : (label ?? defaultLabel)}
    </Button>
  );
}
