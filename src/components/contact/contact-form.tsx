"use client";

import { useState, useTransition } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Loader2, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { GlassCard } from "@/components/ui/glass-card";
import { EASE_OUT } from "@/lib/animations";

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
      <GlassCard className="glass-edge flex flex-col items-center gap-3 p-10 text-center">
        <motion.div
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", bounce: 0.4, duration: 0.6 }}
        >
          <CheckCircle2 className="size-12 text-kawasaki" />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15, ease: EASE_OUT }}
        >
          <h3 className="font-heading text-xl font-semibold">
            Mesaj trimis!
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Îți vom răspunde în cel mult 24 de ore la adresa de email
            furnizată.
          </p>
        </motion.div>
      </GlassCard>
    );
  }

  return (
    <GlassCard className="glass-edge p-6 sm:p-8">
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
        <Button type="submit" className="press w-full gap-2 glow-ktm sm:w-auto" disabled={pending}>
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
