import Link from "next/link";
import { Compass } from "lucide-react";
import { MainLayout } from "@/components/layout/main-layout";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Pagină negăsită",
};

export default function NotFound() {
  return (
    <MainLayout>
      <div className="mx-auto flex min-h-[70vh] max-w-lg flex-col items-center justify-center px-4 text-center">
        <GlassCard strong className="w-full p-10">
          <Compass className="mx-auto mb-4 size-12 text-primary" />
          <p className="font-heading text-5xl font-bold text-gradient-ktm">
            404
          </p>
          <h1 className="mt-3 font-heading text-xl font-semibold">
            Ai ieșit de pe traseu
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Pagina pe care o cauți nu există sau a fost mutată.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link href="/">
              <Button className="glow-ktm">Înapoi acasă</Button>
            </Link>
            <Link href="/tracks">
              <Button variant="outline">Explorează trasee</Button>
            </Link>
          </div>
        </GlassCard>
      </div>
    </MainLayout>
  );
}
