import { MainLayout } from "@/components/layout/main-layout";
import { MapPageClient } from "@/components/map/map-page-client";

export const metadata = {
  title: "Hartă Trasee",
  description:
    "Hartă interactivă cu toate traseele enduro și motocross din România.",
};

export default function MapPage() {
  return (
    <MainLayout hideFooter>
      <MapPageClient />
    </MainLayout>
  );
}
