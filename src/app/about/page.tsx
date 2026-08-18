import { MapPin, Users, Target, Heart } from "lucide-react";
import { MainLayout } from "@/components/layout/main-layout";
import { GlassCard } from "@/components/ui/glass-card";
import { APP_NAME, APP_COUNTRY } from "@/lib/constants";

export const metadata = {
  title: "Despre noi",
  description: `Povestea ${APP_NAME} — platforma care conectează riderii enduro și motocross cu proprietarii de trasee din ${APP_COUNTRY}.`,
};

const values = [
  {
    icon: MapPin,
    title: "Comunitate locală",
    description:
      "Construim punți între rideri și proprietarii de trasee din fiecare colț al țării, de la Bucovina la Maramureș.",
    accent: "ktm" as const,
  },
  {
    icon: Target,
    title: "Siguranță întâi",
    description:
      "Declarațiile digitale și informațiile clare despre dificultate ajută fiecare rider să aleagă traseul potrivit.",
    accent: "yamaha" as const,
  },
  {
    icon: Heart,
    title: "Pasiune pentru off-road",
    description:
      "Suntem rideri înainte de toate. DirtBooking există pentru că am simțit noi înșine lipsa unei platforme unificate.",
    accent: "kawasaki" as const,
  },
];

export default function AboutPage() {
  return (
    <MainLayout>
      <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="text-sm font-medium uppercase tracking-widest text-primary">
            Despre {APP_NAME}
          </p>
          <h1 className="mt-2 font-heading text-4xl font-bold sm:text-5xl">
            Construim comunitatea enduro din {APP_COUNTRY}
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            {APP_NAME} s-a născut dintr-o frustrare simplă: găsirea unui
            traseu enduro bun și rezervarea unei sesiuni implica zeci de
            mesaje pe grupuri de Facebook. Am construit platforma pe care
            ne-am fi dorit-o noi înșine.
          </p>
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-3">
          {values.map((value) => (
            <GlassCard key={value.title} glow={value.accent} className="p-6">
              <div
                className={`mb-4 inline-flex rounded-xl p-3 ${
                  value.accent === "ktm"
                    ? "bg-ktm/15 text-ktm"
                    : value.accent === "yamaha"
                      ? "bg-yamaha/15 text-yamaha"
                      : "bg-kawasaki/15 text-kawasaki"
                }`}
              >
                <value.icon className="size-6" />
              </div>
              <h3 className="font-heading text-lg font-semibold">
                {value.title}
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                {value.description}
              </p>
            </GlassCard>
          ))}
        </div>

        <GlassCard strong className="mt-16 p-8 sm:p-12">
          <div className="grid gap-8 sm:grid-cols-2 sm:items-center">
            <div>
              <h2 className="font-heading text-2xl font-bold sm:text-3xl">
                Povestea noastră
              </h2>
              <div className="mt-4 space-y-4 text-muted-foreground">
                <p>
                  Totul a pornit în 2025, când un grup de rideri din
                  Transilvania a decis să transforme un traseu forestier
                  privat într-o pistă enduro deschisă publicului. Problema?
                  Nu exista niciun instrument simplu pentru programări,
                  plăți sau declarații de răspundere.
                </p>
                <p>
                  Astăzi, {APP_NAME} conectează zeci de proprietari de trasee
                  cu mii de rideri din toată {APP_COUNTRY}, oferind
                  rezervări în timp real, declarații digitale semnate pe loc
                  și un canal direct de comunicare cu fiecare gazdă.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: "Trasee active", value: "85+" },
                { label: "Rideri înscriși", value: "8.000+" },
                { label: "Județe acoperite", value: "41" },
                { label: "Rating mediu", value: "4,8/5" },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-xl border border-white/5 bg-white/[3%] p-4 text-center"
                >
                  <p className="font-heading text-2xl font-bold text-gradient-ktm">
                    {stat.value}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </GlassCard>

        <div className="mt-16 flex flex-col items-center gap-3 text-center">
          <Users className="size-8 text-primary" />
          <h2 className="font-heading text-2xl font-bold">
            Ești proprietar de traseu?
          </h2>
          <p className="max-w-md text-muted-foreground">
            Alătură-te comunității de proprietari și listează-ți traseul
            gratuit în câteva minute.
          </p>
        </div>
      </div>
    </MainLayout>
  );
}
