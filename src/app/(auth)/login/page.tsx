import { AuthLayout } from "@/components/auth/auth-layout";
import { LoginForm } from "@/components/auth/login-form";

export const metadata = {
  title: "Autentificare",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ redirect?: string }>;
}) {
  const { redirect } = await searchParams;

  return (
    <AuthLayout
      title="Bine ai revenit!"
      subtitle="Autentifică-te pentru a gestiona rezervările și garajul tău digital."
    >
      <LoginForm redirectTo={redirect} />
    </AuthLayout>
  );
}
