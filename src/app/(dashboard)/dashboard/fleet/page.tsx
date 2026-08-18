"use client";

import { Wrench } from "lucide-react";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/stores/auth-store";
import { SEED_FLEET } from "@/lib/db/seed";
import { formatPrice } from "@/lib/format";

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
  const fleet = SEED_FLEET.filter((b) => b.hostId === user?.id);

  return (
    <>
      <DashboardHeader
        title="Gestionare Flotă"
        subtitle="Inventarul tău de moto închiriate"
      />
      <div className="flex-1 overflow-y-auto p-6">
        <div className="mb-4 flex justify-end">
          <Button className="glow-ktm">Adaugă moto în flotă</Button>
        </div>
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
                <Button variant="outline" size="sm" className="flex-1">
                  Editează
                </Button>
              </div>
            </GlassCard>
          ))}
        </div>
      </div>
    </>
  );
}
