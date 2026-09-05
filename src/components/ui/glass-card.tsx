import { cn } from "@/lib/utils";

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  glow?: "ktm" | "yamaha" | "kawasaki" | "none";
  strong?: boolean;
  /** Bright top rim — light catching the edge of the material. */
  edge?: boolean;
}

/**
 * Translucent surface. Weight encodes hierarchy: `strong` is for structural
 * chrome (header, hero panels), the default for content sitting on top of it.
 * Never stack two light glass surfaces — legibility collapses.
 */
export function GlassCard({
  className,
  glow = "none",
  strong = false,
  edge = true,
  children,
  ...props
}: GlassCardProps) {
  const glowClass = {
    ktm: "glow-border-ktm",
    yamaha: "glow-border-yamaha",
    kawasaki: "glow-border-kawasaki",
    none: "",
  }[glow];

  return (
    <div
      className={cn(
        "rounded-2xl",
        strong ? "glass-strong" : "glass",
        edge && "glass-edge",
        glowClass,
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
