"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789/\\<>[]{}*#%$";

interface ScrambleTextProps {
  text: string;
  className?: string;
  /** Seconds before the effect starts. */
  delay?: number;
  /** Frames each character stays scrambled before locking in. */
  speed?: number;
}

/**
 * Resolves text out of noise, one character at a time.
 *
 * The final string is what renders on the server and what a reduced-motion
 * reader sees — the effect only ever replaces already-correct text, so the
 * content is never dependent on the animation running.
 */
export function ScrambleText({
  text,
  className,
  delay = 0,
  speed = 2,
}: ScrambleTextProps) {
  const reduced = useReducedMotion();
  const [output, setOutput] = useState(text);
  const frame = useRef(0);
  const raf = useRef<number | null>(null);

  useEffect(() => {
    if (reduced) return;

    const chars = text.split("");
    // Each character locks in at its own moment, so the string resolves
    // left-to-right instead of snapping all at once.
    const settleAt = chars.map((_, i) => i * speed + Math.random() * speed * 4);
    const total = Math.max(...settleAt) + speed * 4;

    frame.current = 0;

    const tick = () => {
      const f = frame.current;
      setOutput(
        chars
          .map((char, i) => {
            if (char === " ") return " ";
            if (f >= settleAt[i]) return char;
            return GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
          })
          .join("")
      );

      frame.current += 1;
      if (frame.current <= total) {
        raf.current = requestAnimationFrame(tick);
      } else {
        setOutput(text);
      }
    };

    const timeout = setTimeout(() => {
      raf.current = requestAnimationFrame(tick);
    }, delay * 1000);

    return () => {
      clearTimeout(timeout);
      if (raf.current !== null) cancelAnimationFrame(raf.current);
    };
  }, [text, delay, speed, reduced]);

  return (
    <span className={cn("tabular-nums", className)} aria-label={text}>
      <span aria-hidden>{reduced ? text : output}</span>
    </span>
  );
}
