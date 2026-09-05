import { Logo } from "@/components/layout/logo";
import { GlassCard } from "@/components/ui/glass-card";
import { Reveal } from "@/components/ui/reveal";

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
}

export function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4 py-12 noise-overlay">
      <div
        className="pointer-events-none fixed inset-0 bg-grid-pattern bg-grid-fade"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute left-1/2 top-0 size-[520px] -translate-x-1/2 rounded-full bg-ktm/10 blur-[110px] animate-aurora"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute bottom-[-14rem] right-1/4 size-[420px] rounded-full bg-yamaha/8 blur-[110px] animate-aurora-slow"
        aria-hidden
      />

      <Reveal className="relative mb-8" distance={16}>
        <Logo />
      </Reveal>

      <Reveal className="relative w-full max-w-md" delay={0.1} distance={20}>
        <GlassCard strong className="glass-edge p-8">
          <div className="mb-6 text-center">
            <h1 className="font-heading text-2xl font-bold">{title}</h1>
            <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p>
          </div>
          {children}
        </GlassCard>
      </Reveal>
    </div>
  );
}
