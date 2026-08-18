import { MainLayout } from "@/components/layout/main-layout";
import { GlassCard } from "@/components/ui/glass-card";
import { APP_NAME, APP_COUNTRY } from "@/lib/constants";

export const metadata = {
  title: "Termeni și condiții",
  description: `Termenii și condițiile de utilizare a platformei ${APP_NAME}.`,
};

const sections = [
  {
    title: "1. Acceptarea termenilor",
    body: `Prin accesarea sau utilizarea platformei ${APP_NAME}, confirmi că ai citit, înțeles și acceptat acești termeni și condiții, precum și Politica de Confidențialitate. Dacă nu ești de acord, te rugăm să nu folosești platforma.`,
  },
  {
    title: "2. Descrierea serviciului",
    body: `${APP_NAME} este o platformă care conectează rideri enduro/motocross cu proprietari de trasee din ${APP_COUNTRY}, facilitând căutarea, rezervarea și comunicarea între părți. Nu suntem proprietari ai traseelor listate și nu operăm direct sesiunile de conducere.`,
  },
  {
    title: "3. Conturi de utilizator",
    body: "Ești responsabil pentru păstrarea confidențialității datelor de autentificare și pentru toate activitățile desfășurate din contul tău. Informațiile furnizate la înregistrare trebuie să fie corecte și actuale.",
  },
  {
    title: "4. Rezervări și anulări",
    body: "Rezervările sunt confirmate în funcție de disponibilitatea slotului ales. Politica de anulare poate varia în funcție de fiecare proprietar de traseu — verifică detaliile specifice înainte de a rezerva.",
  },
  {
    title: "5. Declarația pe proprie răspundere",
    body: "Activitățile off-road implică riscuri inerente. Prin semnarea declarației digitale la rezervare, confirmi că participi pe propria răspundere și că deții echipamentul de protecție adecvat. Consultă pagina Declarații pentru detalii complete.",
  },
  {
    title: "6. Conduita utilizatorilor",
    body: "Te angajezi să folosești platforma cu bună-credință, să nu publici conținut fraudulos, ofensator sau înșelător și să respecți proprietarii de trasee și ceilalți rideri în comunicările din platformă.",
  },
  {
    title: "7. Limitarea răspunderii",
    body: `${APP_NAME} facilitează conexiunea dintre rideri și proprietari, dar nu este responsabilă pentru accidente, daune materiale sau conflicte apărute în cadrul sesiunilor rezervate prin platformă.`,
  },
  {
    title: "8. Modificarea termenilor",
    body: "Ne rezervăm dreptul de a actualiza acești termeni periodic. Continuarea utilizării platformei după publicarea modificărilor reprezintă acceptarea noilor termeni.",
  },
];

export default function TermsPage() {
  return (
    <MainLayout>
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <p className="text-sm font-medium uppercase tracking-widest text-primary">
          Legal
        </p>
        <h1 className="mt-2 font-heading text-4xl font-bold">
          Termeni și condiții
        </h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Ultima actualizare: 1 iulie 2026
        </p>

        <GlassCard className="mt-8 space-y-8 p-6 sm:p-8">
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
      </div>
    </MainLayout>
  );
}
