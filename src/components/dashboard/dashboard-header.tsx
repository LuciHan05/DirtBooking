"use client";

import { LogOut, Search } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuthStore } from "@/stores/auth-store";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { NotificationsPopover } from "@/components/dashboard/notifications-popover";

interface DashboardHeaderProps {
  title: string;
  subtitle?: string;
}

export function DashboardHeader({ title, subtitle }: DashboardHeaderProps) {
  const router = useRouter();
  const { user, logout } = useAuthStore();

  function handleLogout() {
    logout();
    router.push("/");
  }

  const initials = user?.name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) ?? "?";

  return (
    <header className="glass-edge sticky top-0 z-30 flex h-16 items-center justify-between border-b border-white/5 bg-background/70 px-6 backdrop-blur-md">
      <div>
        <h1 className="font-heading text-xl font-bold">{title}</h1>
        {subtitle && (
          <p className="text-sm text-muted-foreground">{subtitle}</p>
        )}
      </div>

      <div className="flex items-center gap-3">
        <div className="relative hidden sm:block">
          <Input
            placeholder="Caută..."
            className="peer h-9 w-48 pl-9 transition-shadow duration-200 focus-visible:shadow-[0_0_0_1px_oklch(0.78_0.13_202/40%)] lg:w-64"
          />
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground transition-colors duration-200 peer-focus:text-primary" />
        </div>
        <NotificationsPopover />
        <Link href="/dashboard/profile" aria-label="Profilul meu">
          <Avatar className="press size-8 ring-1 ring-transparent transition-shadow duration-200 hover:ring-primary/40">
            {user?.avatarUrl && <AvatarImage src={user.avatarUrl} alt={user.name} />}
            <AvatarFallback className="bg-primary/20 text-primary text-xs">
              {initials}
            </AvatarFallback>
          </Avatar>
        </Link>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleLogout}
          aria-label="Deconectare"
        >
          <LogOut className="size-5" />
        </Button>
      </div>
    </header>
  );
}
