import type { SupabaseClient } from "@supabase/supabase-js";
import type { User } from "@/types";
import type { DbProfile } from "@/types/database";

export async function fetchProfileAsUser(
  supabase: SupabaseClient,
  userId: string
): Promise<User | null> {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();

  if (error || !data) return null;

  const profile = data as DbProfile;
  return {
    id: profile.id,
    email: profile.email,
    name: profile.name,
    role: profile.role,
    avatarUrl: profile.avatar_url ?? undefined,
    dirtPoints: profile.dirt_points,
  };
}
