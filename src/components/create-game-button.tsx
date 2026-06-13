"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@heroui/react";
import type { GameLanguage, GameMode } from "@/lib/game/types";

export function CreateGameButton({
  mode = "classic",
  language = "en",
  label,
  variant = "primary",
  fullWidth = false,
}: {
  mode?: GameMode;
  language?: GameLanguage;
  label?: string;
  variant?: "primary" | "secondary" | "emerald";
  fullWidth?: boolean;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const create = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode, language }),
      });
      if (!res.ok) throw new Error("Failed to create game");
      const { id } = (await res.json()) as { id: string };
      router.push(`/game/${id}`);
    } catch {
      setLoading(false);
    }
  };

  const defaultLabel = mode === "duet" ? "Play Duet (2 players)" : "Play Classic (4+ players)";
  const creatingLabel = language === "pt" ? "Criando…" : "Creating…";
  const displayLabel = loading ? creatingLabel : (label ?? defaultLabel);

  if (variant === "emerald") {
    return (
      <button
        type="button"
        disabled={loading}
        onClick={() => void create()}
        className={[
          "flex h-11 items-center justify-center rounded-xl",
          "bg-gradient-to-br from-emerald-400 to-emerald-600",
          "font-semibold text-emerald-950 shadow-lg shadow-emerald-500/20",
          "transition-all duration-200 hover:opacity-90 hover:shadow-emerald-500/30",
          "active:scale-[0.98]",
          fullWidth ? "w-full" : "px-6",
          loading ? "cursor-not-allowed opacity-60" : "cursor-pointer",
        ].join(" ")}
      >
        {displayLabel}
      </button>
    );
  }

  return (
    <Button
      size="lg"
      variant={variant}
      isPending={loading}
      onPress={() => void create()}
      fullWidth={fullWidth}
    >
      {loading ? creatingLabel : (label ?? defaultLabel)}
    </Button>
  );
}
