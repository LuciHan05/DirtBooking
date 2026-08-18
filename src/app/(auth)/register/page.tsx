import { Suspense } from "react";
import { AuthLayout } from "@/components/auth/auth-layout";
import { RegisterForm } from "@/components/auth/register-form";

export const metadata = {
  title: "Cont Nou",
};

export default function RegisterPage() {
  return (
    <AuthLayout
      title="Alătură-te DirtBooking"
      subtitle="Creează-ți contul ca rider sau proprietar de traseu."
    >
      <Suspense
        fallback={
          <div className="h-96 animate-pulse rounded-lg bg-muted" />
        }
      >
        <RegisterForm />
      </Suspense>
    </AuthLayout>
  );
}
