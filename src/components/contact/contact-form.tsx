"use client";

import { useState, useTransition } from "react";
import { CheckCircle2, Loader2, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { GlassCard } from "@/components/ui/glass-card";

export function ContactForm() {
  const [pending, startTransition] = useTransition();
  const [sent, setSent] = useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    startTransition(() => {
      setTimeout(() => setSent(true), 600);
    });
  }

  if (sent) {
    return (
      <GlassCard className="flex flex-col items-center gap-3 p-10 text-center">
        <CheckCircle2 className="size-12 text-kawasaki" />
        <h3 className="font-heading text-xl font-semibold">
          Mesaj trimis!
        </h3>
        <p className="text-sm text-muted-foreground">
          Îți vom răspunde în cel mult 24 de ore la adresa de email
          furnizată.
        </p>
      </GlassCard>
    );
  }

  return (
    <GlassCard className="p-6 sm:p-8">
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="name">Nume</Label>
            <Input id="name" name="name" placeholder="Numele tău" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="tu@exemplu.ro"
              required
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="subject">Subiect</Label>
          <Input id="subject" name="subject" placeholder="Cu ce te putem ajuta?" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="message">Mesaj</Label>
          <Textarea
            id="message"
            name="message"
            rows={5}
            placeholder="Scrie-ne detalii despre întrebarea sau problema ta..."
            required
          />
        </div>
        <Button type="submit" className="w-full gap-2 glow-ktm sm:w-auto" disabled={pending}>
          {pending ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Se trimite...
            </>
          ) : (
            <>
              <Send className="size-4" />
              Trimite mesajul
            </>
          )}
        </Button>
      </form>
    </GlassCard>
  );
}
