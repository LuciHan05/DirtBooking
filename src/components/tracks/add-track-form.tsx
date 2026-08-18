"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { GlassCard } from "@/components/ui/glass-card";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { AMENITY_OPTIONS, BOOKING_TIME_SLOTS } from "@/lib/constants";
import { DIFFICULTY_LABELS, SOIL_LABELS } from "@/lib/format";
import { useAuthStore } from "@/stores/auth-store";
import { useTracksStore } from "@/stores/tracks-store";
import type { TrackDifficulty, SoilCondition } from "@/types";

interface AddTrackFormProps {
  /** Când e prezent, formularul editează traseul existent în loc să creeze unul nou. */
  trackId?: string;
}

export function AddTrackForm({ trackId }: AddTrackFormProps) {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const addTrack = useTracksStore((s) => s.addTrack);
  const updateTrack = useTracksStore((s) => s.updateTrack);
  const record = useTracksStore((s) =>
    trackId ? s.tracks.find((t) => t.id === trackId) : undefined
  );
  const isEditing = Boolean(trackId);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const [images, setImages] = useState<string[]>(record?.images ?? []);
  const [amenities, setAmenities] = useState<string[]>(
    record?.amenities ?? []
  );
  const [difficulty, setDifficulty] = useState<TrackDifficulty>(
    record?.difficulty ?? "intermediate"
  );
  const [soilCondition, setSoilCondition] = useState<SoilCondition>(
    record?.soilCondition ?? "prime"
  );
  const [slotDate, setSlotDate] = useState("");
  const [selectedSlots, setSelectedSlots] = useState<string[]>([]);
  const [slots, setSlots] = useState<{ date: string; times: string[] }[]>([]);

  function handleImageAdd(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setImages((prev) => [...prev, url]);
  }

  function toggleAmenity(amenity: string) {
    setAmenities((prev) =>
      prev.includes(amenity)
        ? prev.filter((a) => a !== amenity)
        : [...prev, amenity]
    );
  }

  function addSlotGroup() {
    if (!slotDate || selectedSlots.length === 0) return;
    setSlots((prev) => [...prev, { date: slotDate, times: [...selectedSlots] }]);
    setSlotDate("");
    setSelectedSlots([]);
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!user || user.role !== "host") {
      setError("Doar proprietarii pot adăuga trasee.");
      return;
    }
    setError("");
    const form = new FormData(e.currentTarget);

    const base = {
      title: form.get("title") as string,
      description: form.get("description") as string,
      city: form.get("city") as string,
      county: form.get("county") as string,
      address: (form.get("address") as string) || "",
      pricePerSession: Number(form.get("price")),
      difficulty,
      amenities,
      soilCondition,
      images,
    };

    startTransition(() => {
      if (isEditing && trackId) {
        updateTrack(trackId, base);
        router.push(`/tracks/${trackId}`);
      } else {
        const newId = addTrack({
          ...base,
          hostId: user.id,
          hostName: user.name,
          slots,
        });
        router.push(`/tracks/${newId}`);
      }
    });
  }

  return (
    <>
      <DashboardHeader
        title={isEditing ? "Editează Traseu" : "Adaugă Traseu"}
        subtitle={
          isEditing
            ? "Actualizează detaliile traseului tău"
            : "Completează detaliile pentru noul tău traseu enduro"
        }
      />
      <div className="flex-1 overflow-y-auto p-6">
        <GlassCard className="mx-auto max-w-2xl p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Titlu Traseu</Label>
              <Input
                id="title"
                name="title"
                placeholder="Ex: Pista Enduro Iacobeni"
                defaultValue={record?.title}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descriere</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Descrie traseul, dificultatea, ce oferă..."
                rows={4}
                defaultValue={record?.description}
                required
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="city">Oraș</Label>
                <Input id="city" name="city" placeholder="Suceava" defaultValue={record?.city} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="county">Județ</Label>
                <Input id="county" name="county" placeholder="Suceava" defaultValue={record?.county} required />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Adresă</Label>
              <Input id="address" name="address" placeholder="DJ177, Iacobeni" defaultValue={record?.address} />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="price">Preț per sesiune (RON)</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  min={1}
                  placeholder="220"
                  defaultValue={record?.pricePerSession}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="difficulty">Dificultate</Label>
                <select
                  id="difficulty"
                  value={difficulty}
                  onChange={(e) =>
                    setDifficulty(e.target.value as TrackDifficulty)
                  }
                  className="flex h-8 w-full rounded-lg border border-input bg-input/30 px-2.5 text-sm"
                >
                  {(
                    Object.entries(DIFFICULTY_LABELS) as [
                      TrackDifficulty,
                      string,
                    ][]
                  ).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="soil">Condiție teren</Label>
                <select
                  id="soil"
                  value={soilCondition}
                  onChange={(e) =>
                    setSoilCondition(e.target.value as SoilCondition)
                  }
                  className="flex h-8 w-full rounded-lg border border-input bg-input/30 px-2.5 text-sm"
                >
                  {(
                    Object.entries(SOIL_LABELS) as [SoilCondition, string][]
                  ).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Facilități</Label>
              <div className="grid grid-cols-2 gap-2">
                {AMENITY_OPTIONS.map((amenity) => (
                  <label
                    key={amenity}
                    className="flex items-center gap-2 cursor-pointer text-sm"
                  >
                    <Checkbox
                      checked={amenities.includes(amenity)}
                      onCheckedChange={() => toggleAmenity(amenity)}
                    />
                    {amenity}
                  </label>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Imagini</Label>
              <div className="flex flex-wrap gap-2 mb-2">
                {images.map((url) => (
                  <div
                    key={url}
                    className="relative size-20 rounded-lg overflow-hidden"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={url} alt="" className="size-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setImages((p) => p.filter((i) => i !== url))}
                      className="absolute top-1 right-1 rounded-full bg-black/60 p-0.5"
                    >
                      <X className="size-3" />
                    </button>
                  </div>
                ))}
              </div>
              <Label
                htmlFor="image-upload"
                className="flex cursor-pointer items-center gap-2 rounded-lg border border-dashed border-white/20 p-4 text-sm text-muted-foreground hover:border-primary/30"
              >
                <Upload className="size-4" />
                Încarcă imagine (local)
              </Label>
              <input
                id="image-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageAdd}
              />
            </div>

            {isEditing ? (
              <p className="text-xs text-muted-foreground">
                Sloturile disponibile existente rămân neschimbate. Le poți
                gestiona din pagina traseului.
              </p>
            ) : (
              <div className="space-y-3 rounded-xl border border-white/10 p-4">
                <Label>Sloturi disponibile</Label>
                <Input
                  type="date"
                  value={slotDate}
                  onChange={(e) => setSlotDate(e.target.value)}
                />
                <div className="flex flex-wrap gap-2">
                  {BOOKING_TIME_SLOTS.map((time) => (
                    <Button
                      key={time}
                      type="button"
                      size="sm"
                      variant={
                        selectedSlots.includes(time) ? "default" : "outline"
                      }
                      onClick={() =>
                        setSelectedSlots((prev) =>
                          prev.includes(time)
                            ? prev.filter((t) => t !== time)
                            : [...prev, time]
                        )
                      }
                    >
                      {time}
                    </Button>
                  ))}
                </div>
                <Button type="button" variant="secondary" onClick={addSlotGroup}>
                  Adaugă zi cu ore
                </Button>
                {slots.length > 0 && (
                  <ul className="text-sm text-muted-foreground space-y-1">
                    {slots.map((s) => (
                      <li key={s.date}>
                        {s.date}: {s.times.join(", ")}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}

            {error && <p className="text-sm text-destructive">{error}</p>}

            <Button type="submit" className="w-full glow-ktm" disabled={pending}>
              {pending ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  {isEditing ? "Se salvează..." : "Se publică..."}
                </>
              ) : isEditing ? (
                "Salvează Modificările"
              ) : (
                "Publică Traseul"
              )}
            </Button>
          </form>
        </GlassCard>
      </div>
    </>
  );
}
