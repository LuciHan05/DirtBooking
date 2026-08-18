"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle } from "lucide-react";
import { MainLayout } from "@/components/layout/main-layout";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";

export default function GlobalError({
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
    <MainLayout>
      <div className="mx-auto flex min-h-[70vh] max-w-lg flex-col items-center justify-center px-4 text-center">
        <GlassCard strong className="w-full p-10">
          <AlertTriangle className="mx-auto mb-4 size-12 text-destructive" />
          <h1 className="font-heading text-xl font-semibold">
            Ceva nu a mers bine
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            A apărut o eroare neașteptată. Poți încerca din nou sau te poți
            întoarce la pagina principală.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Button className="glow-ktm" onClick={() => reset()}>
              Încearcă din nou
            </Button>
            <Link href="/">
              <Button variant="outline">Înapoi acasă</Button>
            </Link>
          </div>
        </GlassCard>
      </div>
    </MainLayout>
  );
}
