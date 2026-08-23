"use client";

import { useState, useTransition } from "react";
import { Calendar, Loader2, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GlassCard } from "@/components/ui/glass-card";
import { useTracksStore } from "@/stores/tracks-store";
import { BOOKING_TIME_SLOTS } from "@/lib/constants";
import { formatDate } from "@/lib/format";

interface TrackSlotsManagerProps {
  trackId: string;
  availableSlots: Record<string, string[]>;
}

export function TrackSlotsManager({ trackId, availableSlots }: TrackSlotsManagerProps) {
  const addSlots = useTracksStore((s) => s.addSlots);
  const removeSlot = useTracksStore((s) => s.removeSlot);
  const [pending, startTransition] = useTransition();
  const [removingKey, setRemovingKey] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [slotDate, setSlotDate] = useState("");
  const [selectedTimes, setSelectedTimes] = useState<string[]>([]);

  const dates = Object.keys(availableSlots).sort();

  function toggleTime(time: string) {
    setSelectedTimes((prev) =>
      prev.includes(time) ? prev.filter((t) => t !== time) : [...prev, time]
    );
  }

  function handleAdd() {
    if (!slotDate || selectedTimes.length === 0) return;
    setError("");
    startTransition(async () => {
      const result = await addSlots(trackId, [{ date: slotDate, times: selectedTimes }]);
      if (result.error) {
        setError(result.error);
        return;
      }
      setSlotDate("");
      setSelectedTimes([]);
    });
  }

  function handleRemove(date: string, time: string) {
    const key = `${date}-${time}`;
    setRemovingKey(key);
    setError("");
    startTransition(async () => {
      const result = await removeSlot(trackId, date, time);
      if (result.error) setError(result.error);
      setRemovingKey(null);
    });
  }

  return (
    <GlassCard className="p-6">
      <h2 className="mb-3 flex items-center gap-2 font-heading text-lg font-semibold">
        <Calendar className="size-5 text-ktm" />
        Gestionează sloturile disponibile
      </h2>
      <p className="mb-4 text-sm text-muted-foreground">
        Riderii pot rezerva doar orele pe care le adaugi aici. Vizibil doar
        ție, ca proprietar.
      </p>

      {dates.length === 0 ? (
        <p className="mb-4 text-sm text-ktm">
          Acest traseu nu are niciun slot disponibil — riderii nu pot rezerva
          până nu adaugi cel puțin unul.
        </p>
      ) : (
        <div className="mb-4 space-y-2">
          {dates.map((date) => (
            <div
              key={date}
              className="flex flex-wrap items-center gap-2 rounded-xl border border-white/5 bg-white/[3%] p-3"
            >
              <span className="text-sm font-medium capitalize">
                {formatDate(date)}
              </span>
              {availableSlots[date].map((time) => {
                const key = `${date}-${time}`;
                return (
                  <span
                    key={time}
                    className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-xs"
                  >
                    {time}
                    <button
                      type="button"
                      onClick={() => handleRemove(date, time)}
                      disabled={pending}
                      aria-label={`Șterge slotul ${date} ${time}`}
                      className="text-muted-foreground hover:text-destructive disabled:opacity-50"
                    >
                      {removingKey === key ? (
                        <Loader2 className="size-3 animate-spin" />
                      ) : (
                        <X className="size-3" />
                      )}
                    </button>
                  </span>
                );
              })}
            </div>
          ))}
        </div>
      )}

      <div className="space-y-3 rounded-xl border border-dashed border-white/10 p-4">
        <Label htmlFor="new-slot-date">Adaugă o zi nouă</Label>
        <Input
          id="new-slot-date"
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
              variant={selectedTimes.includes(time) ? "default" : "outline"}
              onClick={() => toggleTime(time)}
            >
              {time}
            </Button>
          ))}
        </div>
        <Button
          type="button"
          className="gap-2 glow-ktm"
          size="sm"
          disabled={!slotDate || selectedTimes.length === 0 || pending}
          onClick={handleAdd}
        >
          {pending ? (
            <Loader2 className="size-3.5 animate-spin" />
          ) : (
            <Plus className="size-3.5" />
          )}
          Adaugă sloturi
        </Button>
        {error && <p className="text-sm text-destructive">{error}</p>}
      </div>
    </GlassCard>
  );
}
