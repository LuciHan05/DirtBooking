"use client";

import { useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { fetchProfileAsUser } from "@/lib/supabase/profile";
import { useAuthStore } from "@/stores/auth-store";
import { useTracksStore } from "@/stores/tracks-store";
import { useFleetStore } from "@/stores/fleet-store";
import { useReviewsStore } from "@/stores/reviews-store";

/** Verifică sesiunea Supabase și pornește încărcarea traseelor înainte de a afișa UI dependent de auth. */
export function StoreHydration({ children }: { children: React.ReactNode }) {
  const hasHydrated = useAuthStore((s) => s._hasHydrated);
  const setHasHydrated = useAuthStore((s) => s.setHasHydrated);
  const setUser = useAuthStore((s) => s.setUser);

  useEffect(() => {
    const supabase = createClient();
    let active = true;

    useTracksStore.getState().fetchTracks();
    useFleetStore.getState().fetchFleet();
    useReviewsStore.getState().fetchReviews();

    async function init() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!active) return;
      if (user) {
        const profileUser = await fetchProfileAsUser(supabase, user.id);
        if (active) setUser(profileUser);
      }
      if (active) setHasHydrated(true);
    }
    init();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!active) return;
      if (event === "SIGNED_OUT" || !session) {
        setUser(null);
        return;
      }
      if (
        event === "SIGNED_IN" ||
        event === "TOKEN_REFRESHED" ||
        event === "USER_UPDATED"
      ) {
        const profileUser = await fetchProfileAsUser(
          supabase,
          session.user.id
        );
        if (active) setUser(profileUser);
      }
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, [setHasHydrated, setUser]);

  if (!hasHydrated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="size-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  return <>{children}</>;
}
