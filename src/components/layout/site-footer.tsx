import Link from "next/link";
import { Logo } from "@/components/layout/logo";
import { APP_NAME, APP_TAGLINE, APP_COUNTRY } from "@/lib/constants";
import { Separator } from "@/components/ui/separator";

const footerLinks = {
  produs: [
    { label: "Explorează Trasee", href: "/tracks" },
    { label: "Hartă", href: "/map" },
    { label: "Pentru Proprietari", href: "/pricing" },
  ],
  companie: [
    { label: "Despre", href: "/about" },
    { label: "Contact", href: "/contact" },
    { label: "Blog", href: "/blog" },
  ],
  legal: [
    { label: "Confidențialitate", href: "/privacy" },
    { label: "Termeni", href: "/terms" },
    { label: "Declarații", href: "/waivers" },
  ],
};

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-white/5">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4">
            <Logo />
            <p className="text-sm text-muted-foreground">
              {APP_TAGLINE} Platforma all-in-one pentru rideri enduro din{" "}
              {APP_COUNTRY} — descoperă trasee, rezervă sesiuni și contactează
              proprietarii.
            </p>
          </div>

          {Object.entries(footerLinks).map(([section, links]) => (
            <div key={section}>
              <h4 className="mb-3 font-heading text-sm font-semibold uppercase tracking-wider text-foreground">
                {section}
              </h4>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-primary"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <Separator className="my-8 bg-white/5" />

        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} {APP_NAME}. Pentru comunitatea
            off-road din {APP_COUNTRY}.
          </p>
        </div>
      </div>
    </footer>
  );
}
