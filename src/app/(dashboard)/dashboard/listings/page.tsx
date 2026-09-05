"use client";

import Link from "next/link";
import { MapPinned, Plus, Pencil, Trash2 } from "lucide-react";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Magnetic } from "@/components/ui/magnetic";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/reveal";
import { useAuthStore } from "@/stores/auth-store";
import { useTracksStore } from "@/stores/tracks-store";
import { DIFFICULTY_LABELS, formatLocation, formatPrice } from "@/lib/format";

export default function ListingsPage() {
  const user = useAuthStore((s) => s.user);
  const allTracks = useTracksStore((s) => s.tracks);
  const deleteTrack = useTracksStore((s) => s.deleteTrack);
  const tracks = user
    ? allTracks.filter((t) => t.hostId === user.id)
    : [];

  async function handleDelete(id: string, title: string) {
    if (window.confirm(`Ștergi traseul „${title}"? Această acțiune nu poate fi anulată.`)) {
      await deleteTrack(id);
    }
  }

  return (
    <>
      <DashboardHeader
        title="Traseele mele"
        subtitle="Gestionează listările tale"
      />
      <div className="flex-1 overflow-y-auto p-6">
        <div className="mb-6 flex justify-end">
          <Magnetic strength={6}>
            <Link href="/dashboard/listings/new">
              <Button className="press glow-ktm gap-2">
                <Plus className="size-4" />
                Adaugă Traseu
              </Button>
            </Link>
          </Magnetic>
        </div>

        {tracks.length === 0 ? (
          <Reveal>
            <GlassCard className="glass-edge p-12 text-center">
              <MapPinned className="mx-auto size-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">
                Nu ai trasee listate încă.
              </p>
              <Link href="/dashboard/listings/new">
                <Button className="press mt-4">Adaugă primul traseu</Button>
              </Link>
            </GlassCard>
          </Reveal>
        ) : (
          <RevealGroup className="space-y-4" stagger={0.05}>
            {tracks.map((track) => (
              <RevealItem key={track.id}>
                <GlassCard className="glass-edge p-5 transition-transform duration-200 hover:-translate-y-0.5">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <Link
                        href={`/tracks/${track.id}`}
                        className="font-heading font-semibold hover:text-primary"
                      >
                        {track.title}
                      </Link>
                      <p className="text-sm text-muted-foreground">
                        {formatLocation(track.city, track.county)}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant="outline">
                        {DIFFICULTY_LABELS[track.difficulty]}
                      </Badge>
                      <span className="font-heading font-bold">
                        {formatPrice(track.pricePerSession)}
                      </span>
                      <Link href={`/dashboard/listings/${track.id}/edit`}>
                        <Button variant="outline" size="icon-sm" aria-label="Editează">
                          <Pencil className="size-3.5" />
                        </Button>
                      </Link>
                      <Button
                        variant="outline"
                        size="icon-sm"
                        className="text-destructive"
                        aria-label="Șterge"
                        onClick={() => handleDelete(track.id, track.title)}
                      >
                        <Trash2 className="size-3.5" />
                      </Button>
                    </div>
                  </div>
                </GlassCard>
              </RevealItem>
            ))}
          </RevealGroup>
        )}
      </div>
    </>
  );
}
