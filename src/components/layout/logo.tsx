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
      className={cn("group flex items-center gap-2.5", className)}
    >
      <div className="relative flex size-9 items-center justify-center rounded-xl bg-primary/15 ring-1 ring-primary/30 transition-all group-hover:glow-ktm">
        <Mountain className="size-5 text-primary" strokeWidth={2.5} />
      </div>
      {showText && (
        <span className="font-heading text-xl font-bold tracking-wide">
          <span className="text-gradient-ktm">{APP_NAME}</span>
        </span>
      )}
    </Link>
  );
}
