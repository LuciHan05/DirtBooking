import Link from "next/link";
import {
  Search,
  Calendar,
  FileSignature,
  Flag,
  MapPinned,
  ClipboardList,
  Users,
  Wallet,
} from "lucide-react";
import { MainLayout } from "@/components/layout/main-layout";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { APP_NAME } from "@/lib/constants";

export const metadata = {
  title: "Cum funcționează",
  description: `Cum rezervi o sesiune enduro sau cum îți listezi traseul pe ${APP_NAME}, pas cu pas.`,
};

const riderSteps = [
  {
    icon: Search,
    title: "Caută un traseu",
    description:
      "Filtrează după oraș, județ, dificultate sau tip de teren și găsește pista potrivită pentru tine.",
    accent: "ktm" as const,
  },
  {
    icon: Calendar,
    title: "Alege data și ora",
    description:
      "Vezi sloturile disponibile în timp real și rezervă sesiunea care ți se potrivește.",
    accent: "yamaha" as const,
  },
  {
    icon: FileSignature,
    title: "Semnează declarația",
    description:
      "Completează declarația pe proprie răspundere direct din aplicație, cu semnătură digitală.",
    accent: "kawasaki" as const,
  },
  {
    icon: Flag,
    title: "Mergi și condu",
    description:
      "Prezintă-te la traseu la ora rezervată. Rezervarea ta e confirmată instant.",
    accent: "ktm" as const,
  },
];

const hostSteps = [
  {
    icon: MapPinned,
    title: "Listează traseul",
    description:
      "Adaugă detalii, poze, facilități și preț per sesiune în câteva minute.",
    accent: "yamaha" as const,
  },
  {
    icon: ClipboardList,
    title: "Setează sloturi",
    description:
      "Definește zilele și orele disponibile — ai control total asupra calendarului.",
    accent: "kawasaki" as const,
  },
  {
    icon: Users,
    title: "Primește rezervări",
    description:
      "Riderii rezervă direct, semnează declarația de răspundere, iar tu confirmi sau anulezi sesiunile.",
    accent: "ktm" as const,
  },
  {
    icon: Wallet,
    title: "Gestionează afacerea",
    description:
      "Urmărește venituri, flota de motociclete și statistici din panoul de proprietar.",
    accent: "yamaha" as const,
  },
];

const accentClasses = {
  ktm: "bg-ktm/15 text-ktm",
  yamaha: "bg-yamaha/15 text-yamaha",
  kawasaki: "bg-kawasaki/15 text-kawasaki",
};

function StepGrid({ steps }: { steps: typeof riderSteps }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2">
      {steps.map((step, i) => (
        <GlassCard key={step.title} glow={step.accent} className="relative p-6">
          <span className="absolute right-5 top-5 font-heading text-3xl font-bold text-white/10">
            {String(i + 1).padStart(2, "0")}
          </span>
          <div className={`mb-4 inline-flex rounded-xl p-3 ${accentClasses[step.accent]}`}>
            <step.icon className="size-6" />
          </div>
          <h3 className="font-heading text-lg font-semibold">{step.title}</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            {step.description}
          </p>
        </GlassCard>
      ))}
    </div>
  );
}

export default function HowItWorksPage() {
  return (
    <MainLayout>
      <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="text-sm font-medium uppercase tracking-widest text-primary">
            Cum funcționează
          </p>
          <h1 className="mt-2 font-heading text-4xl font-bold sm:text-5xl">
            De la căutare la primul tur
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            Fie că ești rider sau proprietar de traseu, {APP_NAME} face
            procesul simplu și rapid.
          </p>
        </div>

        <Tabs defaultValue="rider" className="mt-12">
          <TabsList className="mx-auto h-10 w-full max-w-sm">
            <TabsTrigger value="rider" className="h-9">
              Pentru Rideri
            </TabsTrigger>
            <TabsTrigger value="host" className="h-9">
              Pentru Proprietari
            </TabsTrigger>
          </TabsList>
          <TabsContent value="rider" className="mt-8">
            <StepGrid steps={riderSteps} />
            <div className="mt-10 text-center">
              <Link href="/tracks">
                <Button size="lg" className="glow-ktm">
                  Explorează trasee
                </Button>
              </Link>
            </div>
          </TabsContent>
          <TabsContent value="host" className="mt-8">
            <StepGrid steps={hostSteps} />
            <div className="mt-10 text-center">
              <Link href="/register">
                <Button size="lg" className="glow-yamaha">
                  Listează-ți traseul
                </Button>
              </Link>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}
