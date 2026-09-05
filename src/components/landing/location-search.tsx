"use client";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { Search, MapPin } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { POPULAR_LOCATIONS } from "@/lib/constants";
import { EASE_OUT, springSnappy } from "@/lib/animations";

export function LocationSearch() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);
  const shellRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const params = query ? `?location=${encodeURIComponent(query)}` : "";
    router.push(`/tracks${params}`);
  }

  // The focus ring is a real surface change, not a border colour swap:
  // the panel lifts, brightens and picks up a glow all on the same curve.
  function handlePointerMove(e: React.PointerEvent<HTMLDivElement>) {
    if (reduced || e.pointerType !== "mouse") return;
    const el = shellRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--spot-x", `${((e.clientX - rect.left) / rect.width) * 100}%`);
    el.style.setProperty("--spot-y", `${((e.clientY - rect.top) / rect.height) * 100}%`);
    el.style.setProperty("--spot-o", "1");
  }

  return (
    <motion.form
      onSubmit={handleSearch}
      className="mx-auto w-full max-w-2xl"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.6, ease: EASE_OUT }}
    >
      <motion.div
        ref={shellRef}
        onPointerMove={handlePointerMove}
        onPointerLeave={() =>
          shellRef.current?.style.setProperty("--spot-o", "0")
        }
        animate={
          reduced
            ? undefined
            : {
                scale: focused ? 1.015 : 1,
                boxShadow: focused
                  ? "0 0 0 1px oklch(0.78 0.13 202 / 40%), 0 18px 44px oklch(0.78 0.13 202 / 14%)"
                  : "0 0 0 1px oklch(1 0 0 / 8%), 0 10px 30px oklch(0 0 0 / 30%)",
              }
        }
        transition={springSnappy}
        className="glass-strong glass-edge spotlight flex flex-col gap-3 rounded-2xl p-3 sm:flex-row sm:items-center sm:p-2"
      >
        <div className="relative flex flex-1 items-center">
          <MapPin
            className={`absolute left-3 size-5 transition-colors duration-200 ${
              focused ? "text-primary" : "text-muted-foreground"
            }`}
          />
          <Input
            type="text"
            placeholder="Caută după oraș sau județ..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            className="h-12 border-0 bg-transparent pl-11 text-base focus-visible:ring-0"
          />
        </div>
        <Button
          type="submit"
          size="lg"
          className="press group h-12 gap-2 px-8 shadow-[0_0_28px_oklch(0.78_0.13_202/22%)]"
        >
          <Search className="size-5 transition-transform duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:scale-110" />
          Caută Trasee
        </Button>
      </motion.div>

      <motion.div
        className="mt-4 flex flex-wrap items-center justify-center gap-2"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: 0.04, delayChildren: 0.75 } },
        }}
      >
        <span className="text-xs text-muted-foreground">Populare:</span>
        {POPULAR_LOCATIONS.map((loc) => (
          <motion.button
            key={loc}
            type="button"
            variants={{
              hidden: { opacity: 0, y: 8, scale: 0.94 },
              visible: {
                opacity: 1,
                y: 0,
                scale: 1,
                transition: { duration: 0.35, ease: EASE_OUT },
              },
            }}
            whileTap={reduced ? undefined : { scale: 0.96 }}
            transition={{ duration: 0.14, ease: EASE_OUT }}
            onClick={() => {
              setQuery(loc);
              router.push(`/tracks?location=${encodeURIComponent(loc)}`);
            }}
            className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-muted-foreground transition-colors duration-200 hover:border-primary/40 hover:bg-primary/10 hover:text-primary"
          >
            {loc}
          </motion.button>
        ))}
      </motion.div>
    </motion.form>
  );
}
