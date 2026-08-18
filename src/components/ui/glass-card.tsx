import { cn } from "@/lib/utils";

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  glow?: "ktm" | "yamaha" | "kawasaki" | "none";
  strong?: boolean;
}

/**
 * Glassmorphism card with optional neon glow on hover.
 */
export function GlassCard({
  className,
  glow = "none",
  strong = false,
  children,
  ...props
}: GlassCardProps) {
  const glowClass = {
    ktm: "glow-border-ktm",
    yamaha: "glow-border-yamaha transition-shadow duration-300",
    kawasaki: "transition-shadow duration-300 hover:shadow-[0_0_24px_oklch(0.72_0.19_145/20%)]",
    none: "",
  }[glow];

  return (
    <div
      className={cn(
        "rounded-2xl",
        strong ? "glass-strong" : "glass",
        glowClass,
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
