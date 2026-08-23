"use client";

import { useAuthStore } from "@/stores/auth-store";
import { useBookingsStore } from "@/stores/bookings-store";
import { useMessagesStore } from "@/stores/messages-store";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated, _hasHydrated } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (_hasHydrated && !isAuthenticated) {
      router.replace("/login?redirect=/dashboard");
    }
  }, [_hasHydrated, isAuthenticated, router]);

  useEffect(() => {
    if (_hasHydrated && isAuthenticated && user) {
      useBookingsStore.getState().fetchBookings();
      useMessagesStore.getState().fetchMessages();
      useMessagesStore.getState().subscribeRealtime(user.id);
    }
  }, [_hasHydrated, isAuthenticated, user]);

  if (!_hasHydrated) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="size-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="relative flex min-h-screen noise-overlay">
      <div className="pointer-events-none fixed inset-0 bg-grid-pattern" aria-hidden />
      {children}
    </div>
  );
}
