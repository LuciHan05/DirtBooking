import Link from "next/link";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";

export function CtaSection() {
  return (
    <section className="px-4 py-20 sm:px-6 lg:px-8">
      <GlassCard strong className="mx-auto max-w-4xl overflow-hidden p-8 sm:p-12">
        <div className="relative text-center">
          <h2 className="relative font-heading text-3xl font-bold sm:text-4xl">
            Gata de off-road?
          </h2>
          <p className="relative mx-auto mt-4 max-w-lg text-muted-foreground">
            Alătură-te comunității de rideri și proprietari din România.
            Creează-ți contul gratuit și rezervă prima sesiune.
          </p>
          <div className="relative mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link href="/register">
              <Button size="lg" className="glow-ktm px-8">
                Creează Cont Gratuit
              </Button>
            </Link>
            <Link href="/tracks">
              <Button size="lg" variant="outline">
                Explorează Trasee
              </Button>
            </Link>
          </div>
        </div>
      </GlassCard>
    </section>
  );
}
