"use client";

import { useAuthStore } from "@/stores/auth-store";
import { RiderDashboard } from "@/components/dashboard/rider-dashboard";
import { HostDashboard } from "@/components/dashboard/host-dashboard";

export default function DashboardPage() {
  const user = useAuthStore((s) => s.user);
  return user?.role === "host" ? <HostDashboard /> : <RiderDashboard />;
}
