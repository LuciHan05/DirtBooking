"use client";

import dynamic from "next/dynamic";
import { Loader2 } from "lucide-react";

export const LocationPickerLoader = dynamic(
  () => import("@/components/map/location-picker-map"),
  {
    ssr: false,
    loading: () => (
      <div className="flex size-full items-center justify-center bg-white/[2%]">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    ),
  }
);
