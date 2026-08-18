export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  content: string[];
  author: string;
  category: string;
  publishedAt: string;
  image: string;
  accent: "ktm" | "yamaha" | "kawasaki";
}

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "ghid-echipament-enduro-incepatori",
    title: "Ghid de echipament enduro pentru începători",
    excerpt:
      "Ce ai nevoie cu adevărat înainte de prima ta tură enduro — de la cască la protecții, fără cheltuieli inutile.",
    content: [
      "Enduro-ul este un sport tehnic, iar echipamentul potrivit face diferența între o tură distractivă și una periculoasă. Pentru început, nu ai nevoie de cel mai scump echipament de pe piață — ai nevoie de echipament care te protejează cu adevărat.",
      "Casca este cea mai importantă achiziție. Alege un model omologat, cu vizibilitate bună și greutate redusă. Urmează ochelarii de protecție, mănușile cu întărituri la încheieturi și cizmele enduro rigide, care protejează glezna în cazul unei căzături laterale.",
      "Protecțiile pentru piept, coate și genunchi sunt esențiale mai ales pe trasee tehnice cu bolovani sau rădăcini. Nu subestima nici hidratarea — un rucsac cu rezervor de apă te ține concentrat pe traseele lungi.",
      "În final, verifică regulamentul fiecărui traseu înainte de rezervare — mulți proprietari cer echipament minim obligatoriu (cască + mănuși) pentru a permite accesul pe pistă.",
    ],
    author: "Echipa DirtBooking",
    category: "Ghiduri",
    publishedAt: "2026-06-02T09:00:00Z",
    image:
      "https://images.unsplash.com/photo-1622185131049-4755b415bb02?w=1200&q=80",
    accent: "ktm",
  },
  {
    slug: "top-5-trasee-enduro-transilvania",
    title: "Top 5 trasee enduro din Transilvania de vizitat în acest sezon",
    excerpt:
      "De la prologuri tehnice la trasee prietenoase pentru începători — cele mai apreciate piste din inima Carpaților.",
    content: [
      "Transilvania rămâne una dintre cele mai căutate zone pentru enduro din România, datorită reliefului variat — de la păduri dese la poteci stâncoase de munte.",
      "Pista Enduro Iacobeni din Suceava oferă 15 km de traseu tehnic prin păduri, cu priveliști spectaculoase spre Obcinele Bucovinei. E ideală pentru riderii cu experiență medie-avansată.",
      "Prologul Hard Enduro din Sibiu este pentru riderii experimentați — bolovani, rădăcini și coborâri stâncoase în Munții Cibin. Nu e recomandat pentru începători.",
      "Pentru cei care abia încep, Școala Enduro din Cluj oferă mini-loopuri sigure, cu coaching inclus și echipament de închiriat la fața locului.",
      "Indiferent de nivel, verifică mereu condițiile terenului afișate pe pagina traseului — praf, noroi sau pământ ideal — înainte de a pleca la drum.",
    ],
    author: "Andrei Mureșan",
    category: "Destinații",
    publishedAt: "2026-05-20T09:00:00Z",
    image:
      "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=1200&q=80",
    accent: "yamaha",
  },
  {
    slug: "cum-iti-listezi-primul-traseu",
    title: "Cum îți listezi primul traseu ca proprietar",
    excerpt:
      "Un ghid rapid pentru proprietarii de terenuri care vor să-și transforme pasiunea pentru off-road într-o sursă de venit.",
    content: [
      "Ai un teren potrivit pentru enduro sau motocross și te gândești să-l deschizi publicului? Procesul de listare pe DirtBooking durează sub 10 minute.",
      "Începe cu detaliile de bază: titlu, descriere, locație și tipul de teren. Adaugă poze de calitate — traseele cu imagini clare primesc de până la 3 ori mai multe rezervări.",
      "Setează prețul per sesiune ținând cont de dificultate, facilități (parcare, dușuri, atelier) și cererea din zona ta. Poți ajusta oricând prețul din panoul de proprietar.",
      "Nu uita de sloturile disponibile — cu cât oferi mai multă flexibilitate orară, cu atât crește rata de rezervare. Iar declarațiile digitale de răspundere sunt gestionate automat de platformă, fără hârtii.",
    ],
    author: "Echipa DirtBooking",
    category: "Pentru Proprietari",
    publishedAt: "2026-05-05T09:00:00Z",
    image:
      "https://images.unsplash.com/photo-1591637333184-19aa84b3e01f?w=1200&q=80",
    accent: "kawasaki",
  },
];

export function getBlogPost(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((p) => p.slug === slug);
}
