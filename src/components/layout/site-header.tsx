"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
} from "framer-motion";
import { Menu, X, LogOut, LayoutDashboard } from "lucide-react";
import { Logo } from "@/components/layout/logo";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { NAV_LINKS, ROLE_LABELS } from "@/lib/constants";
import { useAuthStore } from "@/stores/auth-store";
import { EASE_DRAWER, EASE_OUT } from "@/lib/animations";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const { user, isAuthenticated, logout } = useAuthStore();

  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, "change", (latest) => {
    // Hysteresis so the header can't flicker around a single threshold.
    setScrolled((prev) => (prev ? latest > 8 : latest > 24));
  });

  const navLinks = isAuthenticated
    ? user?.role === "host"
      ? NAV_LINKS.host
      : NAV_LINKS.rider
    : NAV_LINKS.public;

  return (
    <header className="sticky top-0 z-50 w-full">
      <motion.div
        className="glass-strong border-b border-white/5"
        animate={{
          backgroundColor: scrolled
            ? "oklch(0.07 0.012 250 / 88%)"
            : "oklch(0.08 0.012 250 / 62%)",
        }}
        transition={{ duration: 0.25, ease: EASE_OUT }}
      >
        <div
          className={cn(
            "mx-auto flex max-w-7xl items-center justify-between px-4 transition-[height] duration-200 ease-out sm:px-6 lg:px-8",
            scrolled ? "h-14" : "h-16"
          )}
        >
          <Logo />

          <nav className="hidden items-center gap-1 md:flex">
            {navLinks.map((link) => {
              const active =
                pathname === link.href || pathname.startsWith(`${link.href}/`);

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "relative rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-200",
                    active
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {/* One shared pill that travels between links, rather than
                      each link fading its own background in and out. */}
                  {active && (
                    <motion.span
                      layoutId="nav-active"
                      className="absolute inset-0 -z-10 rounded-lg bg-white/[7%] ring-1 ring-white/10"
                      transition={{ type: "spring", bounce: 0.18, duration: 0.5 }}
                    />
                  )}
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <div className="hidden items-center gap-3 md:flex">
            {isAuthenticated && user ? (
              <>
                <Badge
                  variant="outline"
                  className="border-primary/30 bg-primary/10 text-primary"
                >
                  {ROLE_LABELS[user.role]}
                </Badge>
                <Link href="/dashboard">
                  <Button variant="ghost" size="sm" className="press gap-2">
                    <LayoutDashboard className="size-4" />
                    Panou
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  size="sm"
                  className="press gap-2"
                  onClick={logout}
                >
                  <LogOut className="size-4" />
                  Deconectare
                </Button>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" size="sm" className="press">
                    Autentificare
                  </Button>
                </Link>
                <Link href="/register">
                  <Button size="sm" className="press glow-ktm">
                    Cont Nou
                  </Button>
                </Link>
              </>
            )}
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="press md:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? "Închide meniul" : "Deschide meniul"}
            aria-expanded={mobileOpen}
          >
            <AnimatePresence initial={false} mode="wait">
              <motion.span
                key={mobileOpen ? "close" : "open"}
                initial={{ opacity: 0, rotate: -70, scale: 0.85 }}
                animate={{ opacity: 1, rotate: 0, scale: 1 }}
                exit={{ opacity: 0, rotate: 70, scale: 0.85 }}
                transition={{ duration: 0.18, ease: EASE_OUT }}
                className="flex"
              >
                {mobileOpen ? (
                  <X className="size-5" />
                ) : (
                  <Menu className="size-5" />
                )}
              </motion.span>
            </AnimatePresence>
          </Button>
        </div>

        {/* Hairline that only shows once content is scrolling underneath. */}
        <motion.div
          className="h-px w-full bg-gradient-to-r from-transparent via-primary/30 to-transparent"
          animate={{ opacity: scrolled ? 1 : 0 }}
          transition={{ duration: 0.25, ease: EASE_OUT }}
          aria-hidden
        />
      </motion.div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.32, ease: EASE_DRAWER }}
            className="glass-strong overflow-hidden border-b border-white/5 md:hidden"
          >
            <motion.nav
              className="flex flex-col gap-1 px-4 py-4"
              initial="hidden"
              animate="visible"
              variants={{
                hidden: {},
                visible: { transition: { staggerChildren: 0.04 } },
              }}
            >
              {navLinks.map((link) => (
                <motion.div
                  key={link.href}
                  variants={{
                    hidden: { opacity: 0, x: -10 },
                    visible: {
                      opacity: 1,
                      x: 0,
                      transition: { duration: 0.28, ease: EASE_OUT },
                    },
                  }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="block rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-white/5 hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
              <div className="mt-3 flex flex-col gap-2 border-t border-white/5 pt-3">
                {isAuthenticated ? (
                  <>
                    <Link href="/dashboard" onClick={() => setMobileOpen(false)}>
                      <Button variant="outline" className="press w-full">
                        Panou
                      </Button>
                    </Link>
                    <Button
                      variant="ghost"
                      className="press w-full"
                      onClick={() => {
                        logout();
                        setMobileOpen(false);
                      }}
                    >
                      Deconectare
                    </Button>
                  </>
                ) : (
                  <>
                    <Link href="/login" onClick={() => setMobileOpen(false)}>
                      <Button variant="outline" className="press w-full">
                        Autentificare
                      </Button>
                    </Link>
                    <Link href="/register" onClick={() => setMobileOpen(false)}>
                      <Button className="press w-full glow-ktm">Cont Nou</Button>
                    </Link>
                  </>
                )}
              </div>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
