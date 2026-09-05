"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function TracksSearch({
  initialLocation = "",
  className,
}: {
  initialLocation?: string;
  className?: string;
}) {
  const router = useRouter();
  const [query, setQuery] = useState(initialLocation);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const params = query ? `?location=${encodeURIComponent(query)}` : "";
    router.push(`/tracks${params}`);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={cn("glass glass-edge flex max-w-md gap-2 rounded-xl p-1.5", className)}
    >
      <Input
        placeholder="Filtrează după oraș sau județ..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="border-0 bg-transparent focus-visible:ring-0"
      />
      <Button type="submit" variant="outline" size="icon" className="shrink-0">
        <Search className="size-4" />
      </Button>
    </form>
  );
}
