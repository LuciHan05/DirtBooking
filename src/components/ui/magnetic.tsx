"use client";

import { useRef } from "react";
import { motion, useMotionValue, useSpring, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

interface MagneticProps {
  children: React.ReactNode;
  className?: string;
  /** How far the element is allowed to travel toward the pointer, in px. */
  strength?: number;
}

/**
 * Pulls its child gently toward the pointer.
 *
 * Purely decorative, so it is limited to fine pointers and switched off under
 * prefers-reduced-motion. The spring keeps it interruptible: the element
 * returns from wherever it currently is, carrying its velocity, instead of
 * snapping back from a fixed start.
 */
export function Magnetic({ children, className, strength = 10 }: MagneticProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 240, damping: 22, mass: 0.5 });
  const sy = useSpring(y, { stiffness: 240, damping: 22, mass: 0.5 });

  function handleMove(e: React.PointerEvent<HTMLDivElement>) {
    if (reduced || e.pointerType !== "mouse") return;
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    x.set(((e.clientX - rect.left) / rect.width - 0.5) * strength * 2);
    y.set(((e.clientY - rect.top) / rect.height - 0.5) * strength * 2);
  }

  function handleLeave() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.div
      ref={ref}
      className={cn("inline-flex", className)}
      style={{ x: reduced ? 0 : sx, y: reduced ? 0 : sy }}
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
    >
      {children}
    </motion.div>
  );
}
