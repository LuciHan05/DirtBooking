"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthStore } from "@/stores/auth-store";

export function LoginForm({ redirectTo }: { redirectTo?: string }) {
  const router = useRouter();
  const login = useAuthStore((s) => s.login);
  const [error, setError] = useState("");
  const [pending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    const form = new FormData(e.currentTarget);
    const email = form.get("email") as string;
    const password = form.get("password") as string;

    startTransition(async () => {
      const result = await login(email, password);
      if (result.error) {
        setError(result.error);
      } else {
        router.push(redirectTo ?? "/dashboard");
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="rounded-lg border border-primary/20 bg-primary/5 p-3 text-xs text-muted-foreground">
        <strong className="text-primary">Demo localhost:</strong> rider@exemplu.ro
        / proprietar@dirtbooking.ro — parola: <code>demo1234</code>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="rider@exemplu.ro"
          required
          autoComplete="email"
        />
      </div>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="password">Parolă</Label>
          <Link
            href="/forgot-password"
            className="text-xs text-primary hover:underline"
          >
            Ai uitat parola?
          </Link>
        </div>
        <Input
          id="password"
          name="password"
          type="password"
          placeholder="••••••••"
          required
          autoComplete="current-password"
        />
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <Button type="submit" className="w-full glow-ktm" disabled={pending}>
        {pending ? (
          <>
            <Loader2 className="size-4 animate-spin" />
            Se autentifică...
          </>
        ) : (
          "Autentificare"
        )}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        Nu ai cont?{" "}
        <Link href="/register" className="text-primary hover:underline">
          Creează unul
        </Link>
      </p>
    </form>
  );
}
