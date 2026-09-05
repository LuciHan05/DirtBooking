import type { Variants, Transition } from "framer-motion";

/* ─── Easing ────────────────────────────────────────────────────────────────
   The built-in CSS/JS easings are too weak for UI. `ease-in` is never used:
   it delays the first frame, which is the moment the user watches closest. */

export const EASE_OUT: [number, number, number, number] = [0.23, 1, 0.32, 1];
export const EASE_IN_OUT: [number, number, number, number] = [0.77, 0, 0.175, 1];
export const EASE_DRAWER: [number, number, number, number] = [0.32, 0.72, 0, 1];

/* ─── Springs ───────────────────────────────────────────────────────────────
   Critically damped by default (no overshoot). Bounce is reserved for motion
   that follows a real gesture — a drag release, a pointer-driven tilt. */

export const springSnappy: Transition = {
  type: "spring",
  bounce: 0,
  duration: 0.34,
};

export const springSmooth: Transition = {
  type: "spring",
  bounce: 0,
  duration: 0.5,
};

/** Only for momentum-driven motion (pointer tilt, drag release). */
export const springPhysical: Transition = {
  type: "spring",
  bounce: 0.22,
  duration: 0.45,
};

/** Raw config for useSpring() on pointer-tracked motion values. */
export const springTracking = {
  stiffness: 260,
  damping: 28,
  mass: 0.6,
} as const;

/* ─── Variants ──────────────────────────────────────────────────────────── */

export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: EASE_OUT },
  },
};

export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.4, ease: EASE_OUT },
  },
};

/** Enter states never start from scale(0) — nothing appears out of nothing. */
export const revealUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: EASE_OUT },
  },
};

export const revealScale: Variants = {
  hidden: { opacity: 0, scale: 0.96 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: EASE_OUT },
  },
};

/** Stagger stays short — long delays read as a slow interface. */
export const revealGroup: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.06, delayChildren: 0.04 },
  },
};

/** Word-by-word headline reveal. */
export const wordReveal: Variants = {
  hidden: { opacity: 0, y: "0.4em" },
  visible: {
    opacity: 1,
    y: "0em",
    transition: { duration: 0.6, ease: EASE_OUT },
  },
};

/** Shared viewport config so every scroll reveal fires at the same threshold. */
export const viewportOnce = { once: true, margin: "-12% 0px -12% 0px" } as const;
