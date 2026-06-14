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

  const colorClasses =
    variant === "emerald"
      ? "bg-gradient-to-br from-emerald-400 to-emerald-600 text-emerald-950 shadow-emerald-500/20 hover:shadow-emerald-500/30"
      : "bg-gradient-to-br from-sky-400 to-blue-600 text-white shadow-blue-500/20 hover:shadow-blue-500/30";

  return (
    <Button
      type="button"
      isDisabled={loading}
      onPress={() => void create()}
      className={[
        "flex h-11 items-center justify-center",
        "font-semibold shadow-lg",
        "transition-all duration-200 hover:opacity-90",
        "active:scale-[0.98]",
        colorClasses,
        fullWidth ? "w-full" : "px-6",
        loading ? "cursor-not-allowed opacity-60" : "cursor-pointer",
      ].join(" ")}
    >
      {displayLabel}
    </Button>
  );
}
