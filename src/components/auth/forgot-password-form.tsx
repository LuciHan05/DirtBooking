"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";
import { EASE_OUT } from "@/lib/animations";

export function ForgotPasswordForm() {
  const [pending, startTransition] = useTransition();
  const [sent, setSent] = useState(false);
  const [email, setEmail] = useState("");

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    startTransition(async () => {
      const supabase = createClient();
      // Nu dezvăluim dacă emailul există sau nu — comportament standard de securitate.
      await supabase.auth
        .resetPasswordForEmail(email, {
          redirectTo:
            typeof window !== "undefined"
              ? `${window.location.origin}/login`
              : undefined,
        })
        .catch(() => {});
      setSent(true);
    });
  }

  if (sent) {
    return (
      <motion.div
        className="space-y-4 text-center"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: EASE_OUT }}
      >
        <motion.div
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", bounce: 0.4, duration: 0.6, delay: 0.1 }}
        >
          <CheckCircle2 className="mx-auto size-12 text-kawasaki" />
        </motion.div>
        <p className="text-sm text-muted-foreground">
          Dacă există un cont cu adresa {email}, vei primi un email cu
          instrucțiuni de resetare.
        </p>
        <Link href="/login" className="block text-sm text-primary hover:underline">
          Înapoi la autentificare
        </Link>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Introdu adresa de email folosită la înregistrare și îți vom trimite
        un link pentru resetarea parolei.
      </p>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="rider@exemplu.ro"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
        />
      </div>
      <Button type="submit" className="w-full glow-ktm press" disabled={pending}>
        {pending ? (
          <>
            <Loader2 className="size-4 animate-spin" />
            Se trimite...
          </>
        ) : (
          "Trimite link de resetare"
        )}
      </Button>
      <p className="text-center text-sm text-muted-foreground">
        Ți-ai amintit parola?{" "}
        <Link href="/login" className="text-primary hover:underline">
          Autentifică-te
        </Link>
      </p>
    </form>
  );
}
