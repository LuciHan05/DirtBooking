"use client";

import { useState } from "react";
import { Wrench, Plus, Trash2 } from "lucide-react";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FleetBikeDialog } from "@/components/dashboard/fleet-bike-dialog";
import { useAuthStore } from "@/stores/auth-store";
import { useFleetStore } from "@/stores/fleet-store";
import { formatPrice } from "@/lib/format";
import type { FleetBikeRecord } from "@/lib/db/schema";

const statusLabels = {
  available: "Disponibil",
  rented: "Închiriat",
  maintenance: "Service",
};

const statusColors = {
  available: "border-kawasaki/30 text-kawasaki",
  rented: "border-yamaha/30 text-yamaha",
  maintenance: "border-ktm/30 text-ktm",
};

export default function FleetPage() {
  const user = useAuthStore((s) => s.user);
  const allFleet = useFleetStore((s) => s.fleet);
  const deleteBike = useFleetStore((s) => s.deleteBike);
  const fleet = user ? allFleet.filter((b) => b.hostId === user.id) : [];

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingBike, setEditingBike] = useState<FleetBikeRecord | undefined>();

  function openAdd() {
    setEditingBike(undefined);
    setDialogOpen(true);
  }

  function openEdit(bike: FleetBikeRecord) {
    setEditingBike(bike);
    setDialogOpen(true);
  }

  async function handleDelete(bike: FleetBikeRecord) {
    if (window.confirm(`Ștergi ${bike.make} ${bike.model} din flotă?`)) {
      await deleteBike(bike.id);
    }
  }

  return (
    <>
      <DashboardHeader
        title="Gestionare Flotă"
        subtitle="Inventarul tău de moto închiriate"
      />
      <div className="flex-1 overflow-y-auto p-6">
        <div className="mb-4 flex justify-end">
          <Button className="glow-ktm gap-2" onClick={openAdd}>
            <Plus className="size-4" />
            Adaugă moto în flotă
          </Button>
        </div>

        {fleet.length === 0 ? (
          <GlassCard className="p-12 text-center">
            <Wrench className="mx-auto size-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">
              Nu ai motociclete în flotă încă.
            </p>
            <Button className="mt-4" onClick={openAdd}>
              Adaugă prima motocicletă
            </Button>
          </GlassCard>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {fleet.map((bike) => (
              <GlassCard key={bike.id} className="p-6">
                <div className="flex items-start justify-between">
                  <Wrench className="size-6 text-muted-foreground" />
                  <Badge variant="outline" className={statusColors[bike.status]}>
                    {statusLabels[bike.status]}
                  </Badge>
                </div>
                <h3 className="mt-3 font-heading text-lg font-semibold">
                  {bike.make} {bike.model}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {bike.year} · {formatPrice(bike.hourlyRate)}/oră
                </p>
                <div className="mt-4 flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => openEdit(bike)}
                  >
                    Editează
                  </Button>
                  <Button
                    variant="outline"
                    size="icon-sm"
                    className="text-destructive"
                    aria-label="Șterge"
                    onClick={() => handleDelete(bike)}
                  >
                    <Trash2 className="size-3.5" />
                  </Button>
                </div>
              </GlassCard>
            ))}
          </div>
        )}
      </div>

      <FleetBikeDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        bike={editingBike}
      />
    </>
  );
}
