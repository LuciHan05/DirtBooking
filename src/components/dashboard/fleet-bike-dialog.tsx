"use client";

import { useState, useTransition } from "react";
import { Loader2, Upload, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuthStore } from "@/stores/auth-store";
import { useFleetStore } from "@/stores/fleet-store";
import { createClient } from "@/lib/supabase/client";
import type { FleetBikeRecord } from "@/lib/db/schema";

interface FleetBikeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  bike?: FleetBikeRecord;
}

const STATUS_OPTIONS: { value: FleetBikeRecord["status"]; label: string }[] = [
  { value: "available", label: "Disponibil" },
  { value: "rented", label: "Închiriat" },
  { value: "maintenance", label: "Service" },
];

export function FleetBikeDialog({ open, onOpenChange, bike }: FleetBikeDialogProps) {
  const user = useAuthStore((s) => s.user);
  const addBike = useFleetStore((s) => s.addBike);
  const updateBike = useFleetStore((s) => s.updateBike);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const [status, setStatus] = useState<FleetBikeRecord["status"]>(
    bike?.status ?? "available"
  );
  const [imageUrl, setImageUrl] = useState<string | undefined>(bike?.imageUrl);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imageError, setImageError] = useState("");
  const isEditing = Boolean(bike);

  async function handleImageAdd(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    setImageError("");
    setUploadingImage(true);
    const supabase = createClient();
    const path = `fleet/${user.id}/${Date.now()}-${file.name}`;
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
    setImageUrl(data.publicUrl);
    setUploadingImage(false);
    e.target.value = "";
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!user) return;
    setError("");
    const form = new FormData(e.currentTarget);
    const input = {
      make: form.get("make") as string,
      model: form.get("model") as string,
      year: Number(form.get("year")),
      hourlyRate: Number(form.get("hourlyRate")),
      status,
      imageUrl,
    };

    startTransition(async () => {
      const result =
        isEditing && bike
          ? await updateBike(bike.id, input)
          : await addBike({ ...input, hostId: user.id });
      if (result.error) {
        setError(result.error);
        return;
      }
      onOpenChange(false);
    });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass-strong sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Editează motocicleta" : "Adaugă moto în flotă"}
          </DialogTitle>
          <DialogDescription>
            Motocicletele din flotă pot fi închiriate de rideri la traseele
            tale.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Poză</Label>
            {imageUrl ? (
              <div className="relative h-32 w-full overflow-hidden rounded-lg">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={imageUrl} alt="" className="size-full object-cover" />
                <button
                  type="button"
                  onClick={() => setImageUrl(undefined)}
                  className="absolute top-1.5 right-1.5 rounded-full bg-black/60 p-1"
                  aria-label="Șterge poza"
                >
                  <X className="size-3.5" />
                </button>
              </div>
            ) : (
              <>
                <Label
                  htmlFor="bike-image-upload"
                  className="flex cursor-pointer items-center gap-2 rounded-lg border border-dashed border-white/20 p-4 text-sm text-muted-foreground hover:border-primary/30 aria-disabled:pointer-events-none aria-disabled:opacity-50"
                  aria-disabled={uploadingImage}
                >
                  {uploadingImage ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <Upload className="size-4" />
                  )}
                  {uploadingImage ? "Se încarcă..." : "Încarcă poză"}
                </Label>
                <input
                  id="bike-image-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  disabled={uploadingImage}
                  onChange={handleImageAdd}
                />
              </>
            )}
            {imageError && <p className="text-sm text-destructive">{imageError}</p>}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="make">Marcă</Label>
              <Input id="make" name="make" placeholder="KTM" defaultValue={bike?.make} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="model">Model</Label>
              <Input id="model" name="model" placeholder="EXC 250" defaultValue={bike?.model} required />
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="year">An</Label>
              <Input
                id="year"
                name="year"
                type="number"
                min={1990}
                max={2030}
                placeholder="2024"
                defaultValue={bike?.year}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="hourlyRate">Preț/oră (RON)</Label>
              <Input
                id="hourlyRate"
                name="hourlyRate"
                type="number"
                min={1}
                placeholder="120"
                defaultValue={bike?.hourlyRate}
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="status">Stare</Label>
            <Select
              value={status}
              onValueChange={(v) => setStatus(v as FleetBikeRecord["status"])}
            >
              <SelectTrigger id="status" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {STATUS_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Anulează
            </Button>
            <Button type="submit" className="glow-ktm" disabled={pending || uploadingImage}>
              {pending ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Se salvează...
                </>
              ) : isEditing ? (
                "Salvează"
              ) : (
                "Adaugă"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
