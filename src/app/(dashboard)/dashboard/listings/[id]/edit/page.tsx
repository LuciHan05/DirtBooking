"use client";

import { useParams } from "next/navigation";
import { AddTrackForm } from "@/components/tracks/add-track-form";

export default function EditListingPage() {
  const params = useParams();
  const id = params.id as string;
  return <AddTrackForm trackId={id} />;
}
