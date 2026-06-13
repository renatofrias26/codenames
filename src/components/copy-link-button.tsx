"use client";

import { useState } from "react";
import { Button } from "@heroui/react";

export function CopyLinkButton({
  value,
  copyLabel = "Copy link",
  copiedLabel = "Copied!",
}: {
  value: string;
  copyLabel?: string;
  copiedLabel?: string;
}) {
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
      {copied ? copiedLabel : copyLabel}
    </Button>
  );
}
