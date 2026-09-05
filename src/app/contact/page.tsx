import { Mail, MapPin, Phone } from "lucide-react";
import { MainLayout } from "@/components/layout/main-layout";
import { GlassCard } from "@/components/ui/glass-card";
import { ContactForm } from "@/components/contact/contact-form";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/reveal";
import { APP_NAME, APP_COUNTRY } from "@/lib/constants";

export const metadata = {
  title: "Contact",
  description: `Ai o întrebare despre ${APP_NAME}? Scrie-ne — echipa noastră din ${APP_COUNTRY} îți răspunde în 24h.`,
};

const contactInfo = [
  {
    icon: Mail,
    label: "Email",
    value: "contact@dirtbooking.ro",
    accent: "text-ktm",
  },
  {
    icon: Phone,
    label: "Telefon",
    value: "+40 721 000 000",
    accent: "text-yamaha",
  },
  {
    icon: MapPin,
    label: "Sediu",
    value: "Brașov, România",
    accent: "text-kawasaki",
  },
];

export default function ContactPage() {
  return (
    <MainLayout>
      <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
        <Reveal className="text-center">
          <p className="text-sm font-medium uppercase tracking-[0.22em] text-primary">
            Contact
          </p>
          <h1 className="mt-2 font-heading text-4xl font-bold sm:text-5xl">
            Suntem aici să te ajutăm
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            Ai o întrebare despre o rezervare, vrei să-ți listezi traseul sau
            ai găsit o problemă tehnică? Scrie-ne.
          </p>
        </Reveal>

        <div className="mt-12 grid gap-8 lg:grid-cols-3">
          <RevealGroup className="space-y-4 lg:col-span-1" stagger={0.08}>
            {contactInfo.map((info) => (
              <RevealItem key={info.label}>
                <GlassCard className="glass-edge flex items-center gap-4 p-5 transition-transform duration-200 hover:-translate-y-0.5">
                  <div className="rounded-xl bg-white/5 p-3">
                    <info.icon className={`size-5 ${info.accent}`} />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">{info.label}</p>
                    <p className="font-medium">{info.value}</p>
                  </div>
                </GlassCard>
              </RevealItem>
            ))}
          </RevealGroup>

          <Reveal className="lg:col-span-2" delay={0.1}>
            <ContactForm />
          </Reveal>
        </div>
      </div>
    </MainLayout>
  );
}
