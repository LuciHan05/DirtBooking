import { cn } from "@/lib/utils";

/**
 * Ambient background light for the hero.
 *
 * Everything here is CSS-driven and animates only transform and opacity, so it
 * runs off the main thread and keeps its frame rate while the page is still
 * loading and hydrating. The global reduced-motion rule freezes it in place.
 */
export function Aurora({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-0 overflow-hidden",
        className
      )}
      aria-hidden
    >
      <div className="absolute -left-40 -top-40 size-[38rem] rounded-full bg-ktm/12 blur-[110px] animate-aurora" />
      <div className="absolute -right-32 top-0 size-[32rem] rounded-full bg-yamaha/12 blur-[110px] animate-aurora-slow" />
      <div className="absolute bottom-[-14rem] left-1/3 size-[30rem] rounded-full bg-kawasaki/8 blur-[120px] animate-aurora [animation-delay:-8s]" />

      {/* A slow horizontal sweep — reads as a scan line across the panel. */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent animate-scan" />
    </div>
  );
}
