"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Calendar,
  Wrench,
  MessageSquare,
  MapPinned,
  BarChart3,
  Bike,
  Plus,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useState } from "react";
import { Logo } from "@/components/layout/logo";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/stores/auth-store";
import { NAV_LINKS, ROLE_LABELS } from "@/lib/constants";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  "/dashboard": LayoutDashboard,
  "/dashboard/bookings": Calendar,
  "/dashboard/garage": Bike,
  "/dashboard/messages": MessageSquare,
  "/dashboard/listings": MapPinned,
  "/dashboard/listings/new": Plus,
  "/dashboard/fleet": Wrench,
  "/dashboard/analytics": BarChart3,
};

export function DashboardSidebar() {
  const pathname = usePathname();
  const { user } = useAuthStore();
  const [collapsed, setCollapsed] = useState(false);

  const links =
    user?.role === "host" ? NAV_LINKS.host : NAV_LINKS.rider;

  return (
    <aside
      className={cn(
        "glass-strong glass-edge relative z-10 flex h-full flex-col border-r border-white/5 transition-all duration-300 shrink-0",
        collapsed ? "w-[68px]" : "w-64"
      )}
    >
      <div className="flex h-16 items-center justify-between border-b border-white/5 px-4">
        {!collapsed && <Logo />}
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={() => setCollapsed(!collapsed)}
          className={cn(collapsed && "mx-auto")}
          aria-label={collapsed ? "Extinde meniul" : "Restrânge meniul"}
        >
          {collapsed ? (
            <ChevronRight className="size-4" />
          ) : (
            <ChevronLeft className="size-4" />
          )}
        </Button>
      </div>

      {user && !collapsed && (
        <div className="border-b border-white/5 px-4 py-3">
          <p className="truncate text-sm font-medium">{user.name}</p>
          <Badge
            variant="outline"
            className="mt-1 border-primary/30 bg-primary/10 text-primary text-xs"
          >
            {ROLE_LABELS[user.role]}
          </Badge>
        </div>
      )}

      <nav className="flex-1 space-y-1 p-3 overflow-y-auto">
        {links.map((link) => {
          const isActive =
            link.href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname.startsWith(link.href);
          const Icon = ICONS[link.href] ?? LayoutDashboard;

          return (
            <Link
              key={link.href}
              href={link.href}
              title={collapsed ? link.label : undefined}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary/15 text-primary"
                  : "text-muted-foreground hover:bg-white/5 hover:text-foreground",
                collapsed && "justify-center px-2"
              )}
            >
              <Icon className="size-5 shrink-0" />
              {!collapsed && link.label}
            </Link>
          );
        })}
      </nav>

      {!collapsed && user?.role === "rider" && user.dirtPoints !== undefined && (
        <div className="border-t border-white/5 p-4">
          <p className="text-xs text-muted-foreground">Puncte Dirt</p>
          <p className="font-heading text-2xl font-bold text-dirt">
            {user.dirtPoints}
          </p>
        </div>
      )}
    </aside>
  );
}
