"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import { EASE_OUT, viewportOnce } from "@/lib/animations";
import { cn } from "@/lib/utils";

type RevealDirection = "up" | "down" | "left" | "right" | "none";

const offsets: Record<RevealDirection, { x: number; y: number }> = {
  up: { x: 0, y: 1 },
  down: { x: 0, y: -1 },
  left: { x: 1, y: 0 },
  right: { x: -1, y: 0 },
  none: { x: 0, y: 0 },
};

interface RevealProps {
  children: React.ReactNode;
  className?: string;
  /** Where the element travels in from. */
  direction?: RevealDirection;
  /** Travel distance in px. */
  distance?: number;
  /** Seconds. Keep small — long entrance delays read as a slow page. */
  delay?: number;
  duration?: number;
}

/**
 * Scroll-triggered entrance. Fires once, never blocks interaction, and
 * degrades to a plain cross-fade when the user prefers reduced motion.
 *
 * Animates only transform + opacity (no `filter: blur()`) so the browser
 * stays on the compositor thread — this runs on every card in a staggered
 * grid at once, and blur forces a repaint per element.
 */
export function Reveal({
  children,
  className,
  direction = "up",
  distance = 24,
  delay = 0,
  duration = 0.55,
}: RevealProps) {
  const reduced = useReducedMotion();
  const offset = offsets[direction];

  const variants: Variants = reduced
    ? {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { duration: 0.2, delay } },
      }
    : {
        hidden: {
          opacity: 0,
          x: offset.x * distance,
          y: offset.y * distance,
        },
        visible: {
          opacity: 1,
          x: 0,
          y: 0,
          transition: { duration, delay, ease: EASE_OUT },
        },
      };

  return (
    <motion.div
      className={cn(className)}
      variants={variants}
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
    >
      {children}
    </motion.div>
  );
}

/**
 * Parent for a staggered group. Children should be <RevealItem>, which
 * inherits the parent's animation state instead of observing the viewport
 * on their own.
 */
export function RevealGroup({
  children,
  className,
  stagger = 0.06,
  delayChildren = 0.04,
}: {
  children: React.ReactNode;
  className?: string;
  stagger?: number;
  delayChildren?: number;
}) {
  return (
    <motion.div
      className={cn(className)}
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: stagger, delayChildren } },
      }}
    >
      {children}
    </motion.div>
  );
}

export function RevealItem({
  children,
  className,
  distance = 20,
}: {
  children: React.ReactNode;
  className?: string;
  distance?: number;
}) {
  const reduced = useReducedMotion();

  const variants: Variants = reduced
    ? {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { duration: 0.2 } },
      }
    : {
        hidden: { opacity: 0, y: distance },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.5, ease: EASE_OUT },
        },
      };

  return (
    <motion.div className={cn(className)} variants={variants}>
      {children}
    </motion.div>
  );
}
