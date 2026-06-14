"use client";

import { useEffect } from "react";

/**
 * Theme names recognised by the aurora/glare token system in globals.css.
 * Each one maps to an `html[data-theme="…"]` block of color tokens.
 */
export type AppTheme = "classic" | "red" | "blue" | "duet";

/**
 * Drives the ambient background + card glare palette by setting
 * `data-theme` on the <html> element while the calling view is mounted.
 *
 * Reusable: drop `useAppTheme("red")` into any client view to retint the
 * whole app. Tweak the actual colors/speeds in globals.css (AURORA tokens).
 */
export function useAppTheme(theme: AppTheme): void {
  useEffect(() => {
    const root = document.documentElement;
    const previous = root.dataset.theme;
    root.dataset.theme = theme;
    return () => {
      if (previous) {
        root.dataset.theme = previous;
      } else {
        delete root.dataset.theme;
      }
    };
  }, [theme]);
}
