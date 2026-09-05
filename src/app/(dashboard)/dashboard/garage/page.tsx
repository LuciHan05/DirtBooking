"use client";

import { Bike } from "lucide-react";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { RevealGroup, RevealItem } from "@/components/ui/reveal";
import { useAuthStore } from "@/stores/auth-store";
import { SEED_GARAGE } from "@/lib/db/seed";

export default function GaragePage() {
  const user = useAuthStore((s) => s.user);
  const garage = SEED_GARAGE.filter((b) => b.userId === user?.id);

  return (
    <>
      <DashboardHeader
        title="Garaj Digital"
        subtitle="Motocicletele tale, gata pentru următoarea sesiune"
      />
      <div className="flex-1 overflow-y-auto p-6">
        <RevealGroup className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" stagger={0.06}>
          {garage.map((bike) => (
            <RevealItem key={bike.id}>
              <GlassCard glow="yamaha" className="glass-edge h-full p-6 transition-transform duration-200 hover:-translate-y-0.5">
                <Bike className="size-8 text-yamaha mb-3" />
                <h3 className="font-heading text-lg font-semibold">
                  {bike.make} {bike.model}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {bike.year} · {bike.displacement}
                </p>
                <Button variant="outline" size="sm" className="mt-4">
                  Editează
                </Button>
              </GlassCard>
            </RevealItem>
          ))}
          <RevealItem>
            <GlassCard className="glass-edge flex h-full flex-col items-center justify-center p-6 border-dashed">
              <Button variant="ghost" className="text-muted-foreground">
                + Adaugă moto
              </Button>
            </GlassCard>
          </RevealItem>
        </RevealGroup>
      </div>
    </>
  );
}
