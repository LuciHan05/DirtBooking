"use client";

import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { ProfileForm } from "@/components/dashboard/profile-form";
import { PasswordForm } from "@/components/dashboard/password-form";

export default function ProfilePage() {
  return (
    <>
      <DashboardHeader
        title="Profilul meu"
        subtitle="Gestionează informațiile contului tău"
      />
      <div className="flex-1 overflow-y-auto p-6">
        <div className="mx-auto max-w-2xl space-y-6">
          <ProfileForm />
          <PasswordForm />
        </div>
      </div>
    </>
  );
}
