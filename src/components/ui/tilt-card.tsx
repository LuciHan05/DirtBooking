"use client";

import { useRef } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion,
} from "framer-motion";
import { springSnappy, springTracking } from "@/lib/animations";
import { cn } from "@/lib/utils";

export type TiltAccent = "ktm" | "yamaha" | "kawasaki" | "none";

const SPOT_COLOR: Record<TiltAccent, string> = {
  ktm: "oklch(0.78 0.13 202 / 20%)",
  yamaha: "oklch(0.63 0.17 272 / 20%)",
  kawasaki: "oklch(0.72 0.15 155 / 20%)",
  none: "oklch(1 0 0 / 8%)",
};

const BORDER_GLOW: Record<TiltAccent, string> = {
  ktm: "glow-border-ktm",
  yamaha: "glow-border-yamaha",
  kawasaki: "glow-border-kawasaki",
  none: "",
};

interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
  accent?: TiltAccent;
  /** Max rotation in degrees. Subtle beats dramatic — 5–8 is the useful range. */
  max?: number;
  /** Cursor-tracked highlight on the surface. */
  spotlight?: boolean;
  /** Slight lift toward the viewer on hover. */
  lift?: boolean;
}

/**
 * A card that tilts toward the pointer.
 *
 * Rotation is driven by springs so it stays interruptible: move the pointer
 * mid-settle and the motion re-targets from its current value and velocity
 * rather than restarting. X and Y are separate springs — a single spring on
 * a 2D distance desyncs when the two axes carry different velocities.
 *
 * Fine pointers only: it is decorative, and on touch it would fight the
 * scroll gesture. Disabled entirely under prefers-reduced-motion.
 */
export function TiltCard({
  children,
  className,
  accent = "ktm",
  max = 7,
  spotlight = true,
  lift = true,
}: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const frame = useRef<number | null>(null);
  const reduced = useReducedMotion();

  const px = useMotionValue(0);
  const py = useMotionValue(0);

  const sx = useSpring(px, springTracking);
  const sy = useSpring(py, springTracking);

  const rotateX = useTransform(sy, [-0.5, 0.5], [max, -max]);
  const rotateY = useTransform(sx, [-0.5, 0.5], [-max, max]);

  function handlePointerMove(e: React.PointerEvent<HTMLDivElement>) {
    if (reduced || e.pointerType !== "mouse") return;
    const el = ref.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const nx = (e.clientX - rect.left) / rect.width;
    const ny = (e.clientY - rect.top) / rect.height;

    px.set(nx - 0.5);
    py.set(ny - 0.5);

    if (!spotlight) return;
    // Batch the custom-property writes into one frame: each write
    // recalculates styles for the card's subtree.
    if (frame.current !== null) return;
    frame.current = requestAnimationFrame(() => {
      frame.current = null;
      el.style.setProperty("--spot-x", `${nx * 100}%`);
      el.style.setProperty("--spot-y", `${ny * 100}%`);
    });
  }

  function handlePointerEnter(e: React.PointerEvent<HTMLDivElement>) {
    if (reduced || e.pointerType !== "mouse" || !spotlight) return;
    ref.current?.style.setProperty("--spot-o", "1");
  }

  function handlePointerLeave() {
    px.set(0);
    py.set(0);
    if (frame.current !== null) {
      cancelAnimationFrame(frame.current);
      frame.current = null;
    }
    ref.current?.style.setProperty("--spot-o", "0");
  }

  return (
    <div
      className="h-full [perspective:1100px]"
      onPointerMove={handlePointerMove}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
    >
      <motion.div
        ref={ref}
        className={cn(
          "h-full rounded-2xl [transform-style:preserve-3d] will-change-transform",
          spotlight && "spotlight",
          BORDER_GLOW[accent],
          className
        )}
        style={{
          rotateX: reduced ? 0 : rotateX,
          rotateY: reduced ? 0 : rotateY,
          ...({ "--spot-color": SPOT_COLOR[accent] } as React.CSSProperties),
        }}
        whileHover={reduced || !lift ? undefined : { y: -4 }}
        transition={springSnappy}
      >
        {children}
      </motion.div>
    </div>
  );
}
