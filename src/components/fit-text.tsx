"use client";

import { useLayoutEffect, useRef, useState } from "react";

/**
 * Renders text on a single line, scaling it down (never up) so it always fits
 * the width of its container. Recomputes on container resize.
 */
export function FitText({ text }: { text: string }) {
  const outerRef = useRef<HTMLSpanElement>(null);
  const innerRef = useRef<HTMLSpanElement>(null);
  const [scale, setScale] = useState(1);

  useLayoutEffect(() => {
    const outer = outerRef.current;
    const inner = innerRef.current;
    if (!outer || !inner) return;

    const fit = () => {
      const available = outer.clientWidth;
      const natural = inner.scrollWidth;
      if (available > 0 && natural > 0) {
        setScale(Math.min(1, available / natural));
      }
    };

    fit();
    const observer = new ResizeObserver(fit);
    observer.observe(outer);
    return () => observer.disconnect();
  }, [text]);

  return (
    <span
      ref={outerRef}
      className="relative z-10 flex w-full items-center justify-center overflow-hidden"
    >
      <span
        ref={innerRef}
        className="whitespace-nowrap"
        style={{ transform: `scale(${scale})`, transformOrigin: "center" }}
      >
        {text}
      </span>
    </span>
  );
}
