import { ShieldCheck, FileSignature, AlertTriangle } from "lucide-react";
import { MainLayout } from "@/components/layout/main-layout";
import { GlassCard } from "@/components/ui/glass-card";
import { MyWaivers } from "@/components/waivers/my-waivers";
import { APP_NAME } from "@/lib/constants";

export const metadata = {
  title: "Declarații pe proprie răspundere",
  description: `Cum funcționează declarațiile digitale pe proprie răspundere pe ${APP_NAME}.`,
};

const points = [
  {
    icon: FileSignature,
    title: "Semnătură digitală",
    description:
      "La fiecare rezervare, semnezi declarația direct pe telefon sau computer, fără hârtie.",
    accent: "ktm" as const,
  },
  {
    icon: ShieldCheck,
    title: "Valabilă pe traseu",
    description:
      "Declarația e asociată rezervării tale și confirmată instant proprietarului traseului.",
    accent: "kawasaki" as const,
  },
  {
    icon: AlertTriangle,
    title: "Înțelege riscurile",
    description:
      "Sporturile motor off-road implică riscuri reale. Citește cu atenție înainte de a semna.",
    accent: "yamaha" as const,
  },
];

const accentClasses = {
  ktm: "bg-ktm/15 text-ktm",
  yamaha: "bg-yamaha/15 text-yamaha",
  kawasaki: "bg-kawasaki/15 text-kawasaki",
};

export default function WaiversPage() {
  return (
    <MainLayout>
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <p className="text-sm font-medium uppercase tracking-widest text-primary">
          Siguranță
        </p>
        <h1 className="mt-2 font-heading text-4xl font-bold">
          Declarații pe proprie răspundere
        </h1>
        <p className="mt-4 text-muted-foreground">
          Fiecare rezervare pe {APP_NAME} include o declarație digitală pe
          proprie răspundere, semnată electronic înainte de tură.
        </p>

        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          {points.map((point) => (
            <GlassCard key={point.title} glow={point.accent} className="p-5">
              <div className={`mb-3 inline-flex rounded-xl p-2.5 ${accentClasses[point.accent]}`}>
                <point.icon className="size-5" />
              </div>
              <h3 className="font-heading font-semibold">{point.title}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground">
                {point.description}
              </p>
            </GlassCard>
          ))}
        </div>

        <GlassCard className="mt-10 p-6 sm:p-8">
          <h2 className="font-heading text-lg font-semibold">
            Textul standard al declarației
          </h2>
          <p className="mt-3 leading-relaxed text-muted-foreground">
            &bdquo;Declar că particip la activitățile off-road pe propria
            răspundere, că port echipament de protecție adecvat și că
            accept regulile traseului. Înțeleg riscurile inerente
            sporturilor cu motor și exonerez organizatorul de răspundere
            pentru accidente cauzate de neglijența mea.&rdquo;
          </p>
          <p className="mt-3 text-xs text-muted-foreground">
            Unii proprietari pot adăuga clauze suplimentare specifice
            traseului lor — acestea vor fi afișate la momentul rezervării.
          </p>
        </GlassCard>

        <div className="mt-12">
          <h2 className="mb-4 font-heading text-xl font-semibold">
            Declarațiile tale semnate
          </h2>
          <MyWaivers />
        </div>
      </div>
    </MainLayout>
  );
}
