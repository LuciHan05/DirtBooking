import { AuthLayout } from "@/components/auth/auth-layout";
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";

export const metadata = {
  title: "Am uitat parola",
};

export default function ForgotPasswordPage() {
  return (
    <AuthLayout
      title="Ai uitat parola?"
      subtitle="Nicio problemă, te ajutăm să recuperezi accesul la cont."
    >
      <ForgotPasswordForm />
    </AuthLayout>
  );
}
