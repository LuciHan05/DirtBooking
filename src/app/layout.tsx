import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Rajdhani } from "next/font/google";
import "./globals.css";
import { APP_NAME, APP_TAGLINE, APP_COUNTRY } from "@/lib/constants";
import { StoreHydration } from "@/components/providers/store-hydration";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const rajdhani = Rajdhani({
  variable: "--font-rajdhani",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: `${APP_NAME} — ${APP_TAGLINE}`,
    template: `%s | ${APP_NAME}`,
  },
  description: `Descoperă trasee enduro în ${APP_COUNTRY}, rezervă sesiuni, semnează declarații digitale și contactează proprietarii.`,
  keywords: [
    "enduro romania",
    "motocross romania",
    "rezervare trasee",
    "dirt bike",
    "off-road",
  ],
};

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ro"
      className={`dark ${geistSans.variable} ${geistMono.variable} ${rajdhani.variable} h-full`}
    >
      <body className="min-h-full flex flex-col">
        <StoreHydration>{children}</StoreHydration>
      </body>
    </html>
  );
}
