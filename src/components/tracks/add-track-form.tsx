"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { GlassCard } from "@/components/ui/glass-card";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { AMENITY_OPTIONS, BOOKING_TIME_SLOTS } from "@/lib/constants";
import { DIFFICULTY_LABELS, SOIL_LABELS } from "@/lib/format";
import { useAuthStore } from "@/stores/auth-store";
import { useTracksStore } from "@/stores/tracks-store";
import { createClient } from "@/lib/supabase/client";
import { LocationPickerLoader } from "@/components/map/location-picker-loader";
import type { TrackDifficulty, SoilCondition } from "@/types";
import type { TrackRecord } from "@/lib/db/schema";

const DEFAULT_LAT = 45.9432;
const DEFAULT_LNG = 24.9668;

interface AddTrackFormProps {
  /** Când e prezent, formularul editează traseul existent în loc să creeze unul nou. */
  trackId?: string;
}

/**
 * Așteaptă încărcarea traseelor din Supabase înainte de a monta formularul
 * propriu-zis — altfel, la accesare directă/refresh a paginii de editare,
 * câmpurile s-ar inițializa goale (traseul încă nu ajunsese în store).
 */
export function AddTrackForm({ trackId }: AddTrackFormProps) {
  const hasLoaded = useTracksStore((s) => s.hasLoaded);
  const record = useTracksStore((s) =>
    trackId ? s.tracks.find((t) => t.id === trackId) : undefined
  );

  if (trackId && !hasLoaded) {
    return (
      <div className="flex flex-1 items-center justify-center p-6">
        <div className="size-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  if (trackId && hasLoaded && !record) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-2 p-6 text-center">
        <p className="font-heading text-lg font-semibold">Traseul nu a fost găsit</p>
        <p className="text-sm text-muted-foreground">
          Poate a fost șters sau linkul e greșit.
        </p>
      </div>
    );
  }

  return <AddTrackFormInner key={record?.id ?? "new"} trackId={trackId} record={record} />;
}

interface AddTrackFormInnerProps {
  trackId?: string;
  record?: TrackRecord;
}

function AddTrackFormInner({ trackId, record }: AddTrackFormInnerProps) {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const addTrack = useTracksStore((s) => s.addTrack);
  const updateTrack = useTracksStore((s) => s.updateTrack);
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
  const [lat, setLat] = useState(record?.lat ?? DEFAULT_LAT);
  const [lng, setLng] = useState(record?.lng ?? DEFAULT_LNG);
  const [locationPicked, setLocationPicked] = useState(Boolean(record));
  const [slotDate, setSlotDate] = useState("");
  const [selectedSlots, setSelectedSlots] = useState<string[]>([]);
  const [slots, setSlots] = useState<{ date: string; times: string[] }[]>([]);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imageError, setImageError] = useState("");

  async function handleImageAdd(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    setImageError("");
    setUploadingImage(true);
    const supabase = createClient();
    const path = `${user.id}/${Date.now()}-${file.name}`;
    const { error } = await supabase.storage
      .from("track-images")
      .upload(path, file);
    if (error) {
      setImageError("Încărcarea imaginii a eșuat.");
      setUploadingImage(false);
      e.target.value = "";
      return;
    }
    const { data } = supabase.storage.from("track-images").getPublicUrl(path);
    setImages((prev) => [...prev, data.publicUrl]);
    setUploadingImage(false);
    e.target.value = "";
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
    if (!locationPicked) {
      setError("Alege locația traseului pe hartă.");
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
      lat,
      lng,
      pricePerSession: Number(form.get("price")),
      difficulty,
      amenities,
      soilCondition,
      images,
    };

    startTransition(async () => {
      if (isEditing && trackId) {
        const result = await updateTrack(trackId, base);
        if (result.error) {
          setError(result.error);
          return;
        }
        router.push(`/tracks/${trackId}`);
      } else {
        const result = await addTrack({
          ...base,
          hostId: user.id,
          hostName: user.name,
          slots,
        });
        if (result.error || !result.id) {
          setError(result.error ?? "Eroare la publicarea traseului.");
          return;
        }
        router.push(`/tracks/${result.id}`);
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

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Locație pe hartă</Label>
                {locationPicked && (
                  <span className="text-xs text-muted-foreground">
                    {lat.toFixed(4)}, {lng.toFixed(4)}
                  </span>
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                Dă click pe hartă (sau trage marcatorul) ca să indici locația
                exactă a traseului.
              </p>
              <div className="h-64 overflow-hidden rounded-xl border border-white/10">
                <LocationPickerLoader
                  lat={lat}
                  lng={lng}
                  zoom={locationPicked ? 12 : 7}
                  onChange={(newLat, newLng) => {
                    setLat(newLat);
                    setLng(newLng);
                    setLocationPicked(true);
                  }}
                />
              </div>
              {!locationPicked && (
                <p className="text-xs text-ktm">Locația nu a fost aleasă încă.</p>
              )}
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
                <Select
                  value={difficulty}
                  onValueChange={(v) => setDifficulty(v as TrackDifficulty)}
                >
                  <SelectTrigger id="difficulty" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {(
                      Object.entries(DIFFICULTY_LABELS) as [
                        TrackDifficulty,
                        string,
                      ][]
                    ).map(([value, label]) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="soil">Condiție teren</Label>
                <Select
                  value={soilCondition}
                  onValueChange={(v) => setSoilCondition(v as SoilCondition)}
                >
                  <SelectTrigger id="soil" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {(
                      Object.entries(SOIL_LABELS) as [SoilCondition, string][]
                    ).map(([value, label]) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
                className="flex cursor-pointer items-center gap-2 rounded-lg border border-dashed border-white/20 p-4 text-sm text-muted-foreground hover:border-primary/30 aria-disabled:pointer-events-none aria-disabled:opacity-50"
                aria-disabled={uploadingImage}
              >
                {uploadingImage ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <Upload className="size-4" />
                )}
                {uploadingImage ? "Se încarcă..." : "Încarcă imagine"}
              </Label>
              <input
                id="image-upload"
                type="file"
                accept="image/*"
                className="hidden"
                disabled={uploadingImage}
                onChange={handleImageAdd}
              />
              {imageError && (
                <p className="text-sm text-destructive">{imageError}</p>
              )}
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
