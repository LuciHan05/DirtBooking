import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";

interface MainLayoutProps {
  children: React.ReactNode;
  /** Hide footer on auth/dashboard pages */
  hideFooter?: boolean;
}

/**
 * Public-facing shell: sticky header + scrollable content + footer.
 */
export function MainLayout({ children, hideFooter = false }: MainLayoutProps) {
  return (
    <div className="noise-overlay relative flex min-h-screen flex-col">
      {/* Background texture stays fixed so the page scrolls over it rather
          than dragging it along — the grid reads as depth, not wallpaper. */}
      <div
        className="pointer-events-none fixed inset-0 bg-grid-pattern opacity-70"
        aria-hidden
      />
      <SiteHeader />
      <main className="relative flex-1">{children}</main>
      {!hideFooter && <SiteFooter />}
    </div>
  );
}
