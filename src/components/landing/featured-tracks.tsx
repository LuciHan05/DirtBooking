import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { TrackCard } from "@/components/tracks/track-card";
import { Button } from "@/components/ui/button";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/reveal";
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
    <section className="relative px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <Reveal className="mb-12 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.22em] text-primary">
              Trasee Recomandate
            </p>
            <h2 className="mt-3 font-heading text-3xl font-bold sm:text-4xl">
              Unde se dă tura săptămâna asta
            </h2>
            <p className="mt-3 max-w-lg leading-relaxed text-muted-foreground">
              Piste enduro selectate din România, cu condiții bune și locuri
              libere.
            </p>
          </div>
          <Link href="/tracks">
            <Button variant="outline" className="press group gap-2">
              Vezi Toate
              <ArrowRight className="size-4 transition-transform duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:translate-x-0.5" />
            </Button>
          </Link>
        </Reveal>

        {isLoading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-white/[4%]"
              >
                <div
                  className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/[6%] to-transparent animate-shimmer"
                  aria-hidden
                />
              </div>
            ))}
          </div>
        ) : display.length === 0 ? (
          <Reveal className="rounded-2xl border border-dashed border-white/10 p-12 text-center">
            <p className="text-muted-foreground">
              Încă nu există trasee listate. Fii primul proprietar care adaugă
              un traseu!
            </p>
            <Link href="/register?role=host">
              <Button className="press mt-5 glow-ktm">
                Înregistrează-te ca Proprietar
              </Button>
            </Link>
          </Reveal>
        ) : (
          <RevealGroup
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
            stagger={0.07}
          >
            {display.map((track, i) => (
              <RevealItem key={track.id} className="h-full">
                <TrackCard track={track} glow={glows[i % glows.length]} />
              </RevealItem>
            ))}
          </RevealGroup>
        )}
      </div>
    </section>
  );
}
