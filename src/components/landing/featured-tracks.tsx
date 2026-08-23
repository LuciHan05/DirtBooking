import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { TrackCard } from "@/components/tracks/track-card";
import { Button } from "@/components/ui/button";
import type { Track } from "@/types";

const glows = ["ktm", "yamaha", "kawasaki", "ktm", "yamaha"] as const;

interface FeaturedTracksSectionProps {
  tracks: Track[];
  isLoading?: boolean;
}

export function FeaturedTracksSection({
  tracks,
  isLoading = false,
}: FeaturedTracksSectionProps) {
  // Cele mai recent adăugate trasee apar primele (tracks e deja ordonat
  // după created_at descrescător din store) — un traseu nou trebuie să
  // fie vizibil imediat pe pagina principală, nu ascuns după cele vechi.
  const display = tracks.slice(0, 6);

  return (
    <section className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-medium uppercase tracking-widest text-primary">
              Trasee Recomandate
            </p>
            <h2 className="mt-2 font-heading text-3xl font-bold sm:text-4xl">
              Unde se dă tura săptămâna asta
            </h2>
            <p className="mt-2 max-w-lg text-muted-foreground">
              Piste enduro selectate din România, cu condiții bune și locuri
              libere.
            </p>
          </div>
          <Link href="/tracks">
            <Button variant="outline" className="gap-2">
              Vezi Toate
              <ArrowRight className="size-4" />
            </Button>
          </Link>
        </div>

        {isLoading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="aspect-[4/5] animate-pulse rounded-2xl bg-white/5" />
            ))}
          </div>
        ) : display.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-white/10 p-12 text-center">
            <p className="text-muted-foreground">
              Încă nu există trasee listate. Fii primul proprietar care adaugă
              un traseu!
            </p>
            <Link href="/register?role=host">
              <Button className="mt-4 glow-ktm">Înregistrează-te ca Proprietar</Button>
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {display.map((track, i) => (
              <TrackCard
                key={track.id}
                track={track}
                glow={glows[i % glows.length]}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
