"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RoleSelector } from "@/components/auth/role-selector";
import { useAuthStore } from "@/stores/auth-store";
import type { UserRole } from "@/types";

export function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const register = useAuthStore((s) => s.register);
  const defaultRole =
    searchParams.get("role") === "host" ? "host" : "rider";
  const [role, setRole] = useState<UserRole>(defaultRole);
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState("");
  const [pending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    if (!agreed) {
      setError("Trebuie să accepți termenii și condițiile.");
      return;
    }
    const form = new FormData(e.currentTarget);
    startTransition(() => {
      const result = register({
        email: form.get("email") as string,
        password: form.get("password") as string,
        name: form.get("name") as string,
        role,
      });
      if (result.error) {
        setError(result.error);
      } else {
        router.push("/dashboard");
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label>Sunt...</Label>
        <RoleSelector value={role} onChange={setRole} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="name">Nume complet</Label>
        <Input
          id="name"
          name="name"
          placeholder="Alex Popescu"
          required
          autoComplete="name"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="reg-email">Email</Label>
        <Input
          id="reg-email"
          name="email"
          type="email"
          placeholder="tu@exemplu.ro"
          required
          autoComplete="email"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="reg-password">Parolă</Label>
        <Input
          id="reg-password"
          name="password"
          type="password"
          placeholder="Minim 8 caractere"
          required
          minLength={8}
          autoComplete="new-password"
        />
      </div>

      <label className="flex items-start gap-3 cursor-pointer">
        <Checkbox
          checked={agreed}
          onCheckedChange={(v) => setAgreed(v === true)}
          className="mt-0.5"
        />
        <span className="text-sm text-muted-foreground">
          Sunt de acord cu{" "}
          <Link href="/terms" className="text-primary hover:underline">
            Termenii
          </Link>{" "}
          și{" "}
          <Link href="/privacy" className="text-primary hover:underline">
            Politica de confidențialitate
          </Link>
        </span>
      </label>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <Button
        type="submit"
        className="w-full glow-ktm"
        disabled={pending || !agreed}
      >
        {pending ? (
          <>
            <Loader2 className="size-4 animate-spin" />
            Se creează contul...
          </>
        ) : (
          "Creează Cont"
        )}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        Ai deja cont?{" "}
        <Link href="/login" className="text-primary hover:underline">
          Autentifică-te
        </Link>
      </p>
    </form>
  );
}
