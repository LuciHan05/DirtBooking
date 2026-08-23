"use client";

import { useState, useTransition } from "react";
import { Loader2 } from "lucide-react";
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
import { useAuthStore } from "@/stores/auth-store";
import { useFleetStore } from "@/stores/fleet-store";
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
  const isEditing = Boolean(bike);

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
            <select
              id="status"
              value={status}
              onChange={(e) => setStatus(e.target.value as FleetBikeRecord["status"])}
              className="flex h-8 w-full rounded-lg border border-input bg-input/30 px-2.5 text-sm"
            >
              {STATUS_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Anulează
            </Button>
            <Button type="submit" className="glow-ktm" disabled={pending}>
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
