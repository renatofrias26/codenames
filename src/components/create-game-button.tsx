"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@heroui/react";

export function CreateGameButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const create = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/sessions", { method: "POST" });
      if (!res.ok) throw new Error("Failed to create game");
      const { id } = (await res.json()) as { id: string };
      router.push(`/game/${id}`);
    } catch {
      setLoading(false);
    }
  };

  return (
    <Button
      size="lg"
      variant="primary"
      isPending={loading}
      onPress={() => void create()}
    >
      {loading ? "Creating…" : "Create new game"}
    </Button>
  );
}
