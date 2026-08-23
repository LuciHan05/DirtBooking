"use client";

import { useState } from "react";
import Image from "next/image";
import { MapPinned } from "lucide-react";
import { cn } from "@/lib/utils";

interface TrackImageProps {
  src?: string;
  alt: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
}

/**
 * Poză de traseu cu fallback vizual — evită un card/hero complet negru
 * atunci când traseul nu are nicio poză încărcată sau link-ul e stricat.
 */
export function TrackImage({ src, alt, className, sizes, priority }: TrackImageProps) {
  const [errored, setErrored] = useState(false);

  if (!src || errored) {
    return (
      <div
        className={cn(
          "flex items-center justify-center bg-gradient-to-br from-ktm/15 via-card to-yamaha/10",
          className
        )}
      >
        <MapPinned className="size-10 text-muted-foreground/30" />
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      priority={priority}
      className={className}
      onError={() => setErrored(true)}
    />
  );
}
