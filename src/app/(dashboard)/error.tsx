"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-1 items-center justify-center p-6">
      <GlassCard className="w-full max-w-md p-10 text-center">
        <AlertTriangle className="mx-auto mb-4 size-10 text-destructive" />
        <h1 className="font-heading text-lg font-semibold">
          Ceva nu a mers bine
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          A apărut o eroare la încărcarea acestei pagini din panou.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Button className="glow-ktm" onClick={() => reset()}>
            Încearcă din nou
          </Button>
          <Link href="/dashboard">
            <Button variant="outline">Înapoi la panou</Button>
          </Link>
        </div>
      </GlassCard>
    </div>
  );
}
