import Link from "next/link";
import { Mountain } from "lucide-react";
import { cn } from "@/lib/utils";
import { APP_NAME } from "@/lib/constants";

interface LogoProps {
  className?: string;
  showText?: boolean;
}

export function Logo({ className, showText = true }: LogoProps) {
  return (
    <Link
      href="/"
      className={cn("group press flex items-center gap-2.5", className)}
    >
      <span className="relative flex size-9 items-center justify-center overflow-hidden rounded-xl bg-primary/12 ring-1 ring-primary/25 transition-shadow duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:shadow-[0_0_20px_oklch(0.78_0.13_202/28%)]">
        {/* Light sweeps across the mark on hover — fine pointers only. */}
        <span
          className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-[650ms] ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:translate-x-full motion-reduce:hidden"
          aria-hidden
        />
        <Mountain
          className="size-5 text-primary transition-transform duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:scale-110"
          strokeWidth={2.5}
        />
      </span>
      {showText && (
        <span className="font-heading text-xl font-bold tracking-tight">
          <span className="text-gradient-ktm">{APP_NAME}</span>
        </span>
      )}
    </Link>
  );
}
