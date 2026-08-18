import { Logo } from "@/components/layout/logo";
import { GlassCard } from "@/components/ui/glass-card";

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
}

export function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center px-4 py-12 noise-overlay">
      <div className="pointer-events-none fixed inset-0 bg-grid-pattern" aria-hidden />
      <div
        className="pointer-events-none absolute left-1/2 top-0 size-[500px] -translate-x-1/2 rounded-full bg-ktm/8 blur-3xl"
        aria-hidden
      />

      <div className="relative mb-8">
        <Logo />
      </div>

      <GlassCard strong className="relative w-full max-w-md p-8">
        <div className="mb-6 text-center">
          <h1 className="font-heading text-2xl font-bold">{title}</h1>
          <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p>
        </div>
        {children}
      </GlassCard>
    </div>
  );
}
