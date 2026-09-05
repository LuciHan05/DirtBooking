"use client";

import { useEffect, useRef } from "react";
import { animate, useInView, useReducedMotion } from "framer-motion";
import { EASE_OUT } from "@/lib/animations";

interface AnimatedCounterProps {
  value: number;
  /** Decimal places — Romanian formatting uses a comma separator. */
  decimals?: number;
  prefix?: string;
  suffix?: string;
  /** Seconds. Counters are seen once, so a longer run is fine here. */
  duration?: number;
  className?: string;
}

function format(value: number, decimals: number) {
  return value.toLocaleString("ro-RO", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

/**
 * Counts up when it scrolls into view.
 *
 * The final value is rendered on the server, so the number is correct with no
 * JavaScript and for anyone who prefers reduced motion. Updates are written
 * straight to the text node rather than through state — one number changing
 * 60 times a second should not re-render a React tree.
 */
export function AnimatedCounter({
  value,
  decimals = 0,
  prefix = "",
  suffix = "",
  duration = 1.4,
  className,
}: AnimatedCounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });
  const reduced = useReducedMotion();
  const hasRun = useRef(false);

  // Reset to zero once on the client so the count has somewhere to start.
  useEffect(() => {
    if (reduced || hasRun.current || !ref.current) return;
    ref.current.textContent = `${prefix}${format(0, decimals)}${suffix}`;
  }, [reduced, prefix, suffix, decimals]);

  useEffect(() => {
    if (!inView || reduced || hasRun.current) return;
    hasRun.current = true;

    const controls = animate(0, value, {
      duration,
      ease: EASE_OUT,
      onUpdate: (latest) => {
        if (ref.current) {
          ref.current.textContent = `${prefix}${format(latest, decimals)}${suffix}`;
        }
      },
    });

    return () => controls.stop();
  }, [inView, reduced, value, duration, decimals, prefix, suffix]);

  return (
    <span ref={ref} className={className}>
      {`${prefix}${format(value, decimals)}${suffix}`}
    </span>
  );
}
