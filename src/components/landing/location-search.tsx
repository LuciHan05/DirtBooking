"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Search, MapPin } from "lucide-react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { POPULAR_LOCATIONS } from "@/lib/constants";

export function LocationSearch() {
  const router = useRouter();
  const [query, setQuery] = useState("");

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const params = query ? `?location=${encodeURIComponent(query)}` : "";
    router.push(`/tracks${params}`);
  }

  return (
    <motion.form
      onSubmit={handleSearch}
      className="mx-auto w-full max-w-2xl"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4, duration: 0.5 }}
    >
      <div className="glass-strong flex flex-col gap-3 rounded-2xl p-3 sm:flex-row sm:items-center sm:p-2">
        <div className="relative flex flex-1 items-center">
          <MapPin className="absolute left-3 size-5 text-primary" />
          <Input
            type="text"
            placeholder="Caută după oraș sau județ..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="h-12 border-0 bg-transparent pl-11 text-base focus-visible:ring-0"
          />
        </div>
        <Button type="submit" size="lg" className="glow-ktm h-12 gap-2 px-8">
          <Search className="size-5" />
          Caută Trasee
        </Button>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
        <span className="text-xs text-muted-foreground">Populare:</span>
        {POPULAR_LOCATIONS.map((loc) => (
          <button
            key={loc}
            type="button"
            onClick={() => {
              setQuery(loc);
              router.push(`/tracks?location=${encodeURIComponent(loc)}`);
            }}
            className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-muted-foreground transition-colors hover:border-primary/30 hover:text-primary"
          >
            {loc}
          </button>
        ))}
      </div>
    </motion.form>
  );
}
