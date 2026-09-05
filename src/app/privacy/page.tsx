import { MainLayout } from "@/components/layout/main-layout";
import { GlassCard } from "@/components/ui/glass-card";
import { Reveal } from "@/components/ui/reveal";
import { APP_NAME } from "@/lib/constants";

export const metadata = {
  title: "Politica de confidențialitate",
  description: `Cum colectează, folosește și protejează ${APP_NAME} datele tale personale.`,
};

const sections = [
  {
    title: "1. Ce date colectăm",
    body: "Colectăm datele pe care ni le furnizezi direct — nume, email, rol (rider sau proprietar) — precum și date generate de utilizarea platformei: rezervări, mesaje, recenzii și motociclete adăugate în garajul digital.",
  },
  {
    title: "2. Cum folosim datele",
    body: "Folosim datele tale pentru a-ți crea și gestiona contul, a procesa rezervări, a facilita comunicarea cu proprietarii de trasee și a îmbunătăți experiența pe platformă. Nu vindem datele tale către terți.",
  },
  {
    title: "3. Stocarea datelor (fază demo)",
    body: `${APP_NAME} rulează momentan într-o fază demo locală — datele de cont sunt stocate în browserul tău (localStorage) și nu sunt trimise către un server extern. La activarea backend-ului live, această secțiune va fi actualizată cu detalii despre stocarea în cloud.`,
  },
  {
    title: "4. Partajarea informațiilor",
    body: "Informațiile de profil (nume, recenzii) pot fi vizibile altor utilizatori ai platformei, conform funcționalității publice a aplicației (ex. numele riderului pe o recenzie).",
  },
  {
    title: "5. Drepturile tale",
    body: "Ai dreptul de a accesa, corecta sau șterge datele tale personale în orice moment. Pentru cereri legate de date, contactează-ne la adresa contact@dirtbooking.ro.",
  },
  {
    title: "6. Cookie-uri",
    body: "Folosim stocare locală (localStorage) pentru a-ți păstra sesiunea și preferințele. Nu folosim cookie-uri de tracking publicitar.",
  },
  {
    title: "7. Modificări ale politicii",
    body: "Putem actualiza această politică periodic pentru a reflecta schimbări legale sau funcționale ale platformei. Vei fi notificat prin platformă în cazul unor modificări semnificative.",
  },
];

export default function PrivacyPage() {
  return (
    <MainLayout>
      <Reveal className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <p className="text-sm font-medium uppercase tracking-[0.22em] text-primary">
          Legal
        </p>
        <h1 className="mt-2 font-heading text-4xl font-bold">
          Politica de confidențialitate
        </h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Ultima actualizare: 1 iulie 2026
        </p>

        <GlassCard className="glass-edge mt-8 space-y-8 p-6 sm:p-8">
          {sections.map((section) => (
            <div key={section.title}>
              <h2 className="font-heading text-lg font-semibold">
                {section.title}
              </h2>
              <p className="mt-2 leading-relaxed text-muted-foreground">
                {section.body}
              </p>
            </div>
          ))}
        </GlassCard>
      </Reveal>
    </MainLayout>
  );
}
