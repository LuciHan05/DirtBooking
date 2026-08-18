"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
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
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { SignaturePad } from "@/components/booking/signature-pad";
import { useAuthStore } from "@/stores/auth-store";
import { useTracksStore } from "@/stores/tracks-store";
import { useBookingsStore } from "@/stores/bookings-store";
import { formatPrice } from "@/lib/format";
import type { Track } from "@/types";

interface BookingModalProps {
  track: Track;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function BookingModal({ track, open, onOpenChange }: BookingModalProps) {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const bookSlot = useTracksStore((s) => s.bookSlot);
  const createBooking = useBookingsStore((s) => s.create);
  const [pending, startTransition] = useTransition();
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [waiverAccepted, setWaiverAccepted] = useState(false);
  const [signature, setSignature] = useState<string | null>(null);
  const [error, setError] = useState("");

  const availableDates = Object.keys(track.availableSlots).sort();
  const timesForDate = selectedDate
    ? track.availableSlots[selectedDate] ?? []
    : [];

  const canConfirm =
    selectedDate && selectedTime && waiverAccepted && signature && !pending;

  function handleConfirm() {
    if (!canConfirm || !signature || !user) return;
    setError("");
    startTransition(() => {
      const slotOk = bookSlot(track.id, selectedDate, selectedTime);
      if (!slotOk) {
        setError("Slotul nu mai este disponibil.");
        return;
      }
      createBooking({
        trackId: track.id,
        trackName: track.name,
        riderId: user.id,
        riderName: user.name,
        slotDate: selectedDate,
        timeSlot: selectedTime,
        totalPrice: track.pricePerSession,
        signatureData: signature,
      });
      onOpenChange(false);
      router.push("/dashboard/bookings");
    });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass-strong max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Rezervă sesiune</DialogTitle>
          <DialogDescription>
            {track.name} — {formatPrice(track.pricePerSession)} / sesiune
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="booking-date">Data sesiunii</Label>
            {availableDates.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Nu există sloturi disponibile momentan.
              </p>
            ) : (
              <Input
                id="booking-date"
                type="date"
                list="available-dates"
                value={selectedDate}
                onChange={(e) => {
                  setSelectedDate(e.target.value);
                  setSelectedTime("");
                }}
              />
            )}
            <datalist id="available-dates">
              {availableDates.map((d) => (
                <option key={d} value={d} />
              ))}
            </datalist>
          </div>

          {selectedDate && (
            <div className="space-y-2">
              <Label>Ora</Label>
              {timesForDate.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  Nicio oră disponibilă în această zi.
                </p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {timesForDate.map((time) => (
                    <Button
                      key={time}
                      type="button"
                      size="sm"
                      variant={selectedTime === time ? "default" : "outline"}
                      onClick={() => setSelectedTime(time)}
                    >
                      {time}
                    </Button>
                  ))}
                </div>
              )}
            </div>
          )}

          <div className="rounded-xl border border-white/10 bg-white/[3%] p-4 text-sm text-muted-foreground">
            <p className="font-medium text-foreground mb-2">
              Declarație pe proprie răspundere
            </p>
            <p>
              Declar că particip la activitățile off-road pe propria răspundere,
              că port echipament de protecție adecvat și că accept regulile
              traseului. Înțeleg riscurile inerente sporturilor cu motor și
              exonerez organizatorul de răspundere pentru accidente cauzate de
              neglijența mea.
            </p>
          </div>

          <label className="flex items-start gap-3 cursor-pointer">
            <Checkbox
              checked={waiverAccepted}
              onCheckedChange={(v) => setWaiverAccepted(v === true)}
              className="mt-0.5"
            />
            <span className="text-sm">
              Am citit și accept declarația pe proprie răspundere
            </span>
          </label>

          <div className="space-y-2">
            <Label>Semnătură digitală</Label>
            <SignaturePad onChange={setSignature} />
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Anulează
          </Button>
          <Button
            className="glow-ktm"
            disabled={!canConfirm}
            onClick={handleConfirm}
          >
            {pending ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Se procesează...
              </>
            ) : (
              "Confirmă Rezervarea"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
