"use client";

import { useState, useTransition } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GlassCard } from "@/components/ui/glass-card";
import { useAuthStore } from "@/stores/auth-store";

export function PasswordForm() {
  const changePassword = useAuthStore((s) => s.changePassword);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setSaved(false);
    const form = new FormData(e.currentTarget);
    const current = form.get("current") as string;
    const next = form.get("next") as string;
    const confirm = form.get("confirm") as string;

    if (next !== confirm) {
      setError("Parolele noi nu coincid.");
      return;
    }
    if (next.length < 6) {
      setError("Parola nouă trebuie să aibă cel puțin 6 caractere.");
      return;
    }

    startTransition(() => {
      const result = changePassword(current, next);
      if (result.error) {
        setError(result.error);
      } else {
        setSaved(true);
        e.currentTarget.reset();
      }
    });
  }

  return (
    <GlassCard className="p-6 sm:p-8">
      <h2 className="mb-4 font-heading text-lg font-semibold">Schimbă parola</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="current">Parola curentă</Label>
          <Input id="current" name="current" type="password" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="next">Parola nouă</Label>
          <Input id="next" name="next" type="password" required minLength={6} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="confirm">Confirmă parola nouă</Label>
          <Input id="confirm" name="confirm" type="password" required minLength={6} />
        </div>

        {error && <p className="text-sm text-destructive">{error}</p>}

        <div className="flex items-center gap-3">
          <Button type="submit" variant="outline" disabled={pending}>
            {pending ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Se actualizează...
              </>
            ) : (
              "Actualizează parola"
            )}
          </Button>
          {saved && !pending && (
            <span className="flex items-center gap-1.5 text-sm text-kawasaki">
              <CheckCircle2 className="size-4" />
              Parolă actualizată
            </span>
          )}
        </div>
      </form>
    </GlassCard>
  );
}
