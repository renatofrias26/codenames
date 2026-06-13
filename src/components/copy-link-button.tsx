"use client";

import { useState } from "react";
import { Button } from "@heroui/react";

export function CopyLinkButton({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  };

  return (
    <Button size="sm" variant="outline" onPress={() => void copy()}>
      {copied ? "Copied!" : "Copy link"}
    </Button>
  );
}
