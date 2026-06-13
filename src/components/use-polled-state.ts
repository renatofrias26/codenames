"use client";

import { useCallback, useEffect, useRef, useState } from "react";

interface PolledState<T> {
  data: T | null;
  error: string | null;
  refresh: () => Promise<void>;
  setData: (value: T) => void;
}

/**
 * Polls a JSON endpoint on an interval and whenever the tab regains focus.
 * Used to keep the board and spymaster views loosely in sync.
 */
export function usePolledState<T>(
  url: string,
  intervalMs = 2000,
  initial: T | null = null,
): PolledState<T> {
  const [data, setData] = useState<T | null>(initial);
  const [error, setError] = useState<string | null>(null);
  const urlRef = useRef(url);
  urlRef.current = url;

  const refresh = useCallback(async () => {
    try {
      const res = await fetch(urlRef.current, { cache: "no-store" });
      if (!res.ok) {
        setError(res.status === 401 ? "Not authorized" : "Game unavailable");
        return;
      }
      const json = (await res.json()) as T;
      setData(json);
      setError(null);
    } catch {
      setError("Connection lost");
    }
  }, []);

  useEffect(() => {
    let active = true;
    const tick = () => {
      if (active && document.visibilityState === "visible") {
        void refresh();
      }
    };

    void refresh();
    const id = window.setInterval(tick, intervalMs);
    document.addEventListener("visibilitychange", tick);

    return () => {
      active = false;
      window.clearInterval(id);
      document.removeEventListener("visibilitychange", tick);
    };
  }, [refresh, intervalMs]);

  return { data, error, refresh, setData };
}
