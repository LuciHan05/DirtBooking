import Link from "next/link";
import { Check, X } from "lucide-react";
import { MainLayout } from "@/components/layout/main-layout";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { APP_NAME } from "@/lib/constants";

export const metadata = {
  title: "Prețuri pentru proprietari",
  description: `Planurile ${APP_NAME} pentru proprietarii de trasee enduro — de la listare gratuită la analytics avansat.`,
};

const plans = [
  {
    name: "Start",
    price: "Gratuit",
    period: "",
    description: "Perfect pentru primul tău traseu listat.",
    accent: "kawasaki" as const,
    featured: false,
    features: [
      { label: "1 traseu listat", included: true },
      { label: "Rezervări nelimitate", included: true },
      { label: "Chat cu riderii", included: true },
      { label: "Declarații digitale", included: true },
      { label: "Poziționare prioritară în căutări", included: false },
      { label: "Statistici avansate", included: false },
      { label: "Gestionare flotă de motociclete", included: false },
    ],
  },
  {
    name: "Pro",
    price: "149 lei",
    period: "/lună",
    description: "Pentru proprietarii cu trasee active și flotă de închiriat.",
    accent: "ktm" as const,
    featured: true,
    features: [
      { label: "Până la 5 trasee listate", included: true },
      { label: "Rezervări nelimitate", included: true },
      { label: "Chat cu riderii", included: true },
      { label: "Declarații digitale", included: true },
      { label: "Poziționare prioritară în căutări", included: true },
      { label: "Statistici avansate", included: true },
      { label: "Gestionare flotă de motociclete", included: true },
    ],
  },
  {
    name: "Business",
    price: "Personalizat",
    period: "",
    description: "Pentru rețele de trasee și organizatori de evenimente.",
    accent: "yamaha" as const,
    featured: false,
    features: [
      { label: "Trasee nelimitate", included: true },
      { label: "Rezervări nelimitate", included: true },
      { label: "Chat cu riderii", included: true },
      { label: "Declarații digitale", included: true },
      { label: "Poziționare prioritară în căutări", included: true },
      { label: "Statistici avansate", included: true },
      { label: "Manager de cont dedicat", included: true },
    ],
  },
];

const accentText = {
  ktm: "text-ktm",
  yamaha: "text-yamaha",
  kawasaki: "text-kawasaki",
};

export default function PricingPage() {
  return (
    <MainLayout>
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="text-sm font-medium uppercase tracking-widest text-primary">
            Pentru Proprietari
          </p>
          <h1 className="mt-2 font-heading text-4xl font-bold sm:text-5xl">
            Un plan pentru fiecare traseu
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            Începe gratuit și treci la un plan superior când traseul tău
            crește. Fără costuri ascunse.
          </p>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-3 lg:items-start">
          {plans.map((plan) => (
            <GlassCard
              key={plan.name}
              glow={plan.accent}
              strong={plan.featured}
              className={cn(
                "relative flex h-full flex-col p-8",
                plan.featured && "lg:-translate-y-4 lg:scale-[1.03]"
              )}
            >
              {plan.featured && (
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 glow-ktm">
                  Cel mai popular
                </Badge>
              )}
              <h2 className="font-heading text-xl font-bold">{plan.name}</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {plan.description}
              </p>
              <p className="mt-6">
                <span
                  className={cn(
                    "font-heading text-4xl font-bold",
                    accentText[plan.accent]
                  )}
                >
                  {plan.price}
                </span>
                <span className="text-muted-foreground">{plan.period}</span>
              </p>

              <ul className="mt-6 flex-1 space-y-3">
                {plan.features.map((feature) => (
                  <li
                    key={feature.label}
                    className="flex items-center gap-2 text-sm"
                  >
                    {feature.included ? (
                      <Check className="size-4 shrink-0 text-kawasaki" />
                    ) : (
                      <X className="size-4 shrink-0 text-muted-foreground/50" />
                    )}
                    <span
                      className={
                        feature.included ? "" : "text-muted-foreground/60"
                      }
                    >
                      {feature.label}
                    </span>
                  </li>
                ))}
              </ul>

              <Link href="/register" className="mt-8">
                <Button
                  className={cn(
                    "w-full",
                    plan.featured && "glow-ktm"
                  )}
                  variant={plan.featured ? "default" : "outline"}
                >
                  {plan.price === "Personalizat"
                    ? "Contactează-ne"
                    : "Începe acum"}
                </Button>
              </Link>
            </GlassCard>
          ))}
        </div>

        <p className="mt-10 text-center text-xs text-muted-foreground">
          Notă: platforma este momentan în fază demo — plățile pentru
          planurile Pro și Business nu sunt încă procesate live.
        </p>
      </div>
    </MainLayout>
  );
}
