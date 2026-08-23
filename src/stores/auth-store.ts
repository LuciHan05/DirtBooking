import { create } from "zustand";
import type { User, UserRole } from "@/types";
import { createClient } from "@/lib/supabase/client";
import { fetchProfileAsUser } from "@/lib/supabase/profile";
import { useMessagesStore } from "@/stores/messages-store";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  _hasHydrated: boolean;
  setHasHydrated: (v: boolean) => void;
  setUser: (user: User | null) => void;
  login: (email: string, password: string) => Promise<{ error?: string }>;
  register: (data: {
    email: string;
    password: string;
    name: string;
    role: UserRole;
  }) => Promise<{ error?: string }>;
  logout: () => Promise<void>;
  updateProfile: (data: {
    name: string;
    avatarUrl?: string;
  }) => Promise<{ error?: string }>;
  changePassword: (
    currentPassword: string,
    newPassword: string
  ) => Promise<{ error?: string }>;
}

export const useAuthStore = create<AuthState>()((set, get) => ({
  user: null,
  isAuthenticated: false,
  _hasHydrated: false,
  setHasHydrated: (v) => set({ _hasHydrated: v }),
  setUser: (user) => set({ user, isAuthenticated: Boolean(user) }),

  login: async (email, password) => {
    const supabase = createClient();
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error || !data.user) {
      return { error: "Email sau parolă incorectă." };
    }
    const user = await fetchProfileAsUser(supabase, data.user.id);
    set({ user, isAuthenticated: Boolean(user) });
    return {};
  },

  register: async ({ email, password, name, role }) => {
    const supabase = createClient();
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name, role } },
    });

    if (error) {
      const msg = error.message.toLowerCase();
      if (msg.includes("already registered") || msg.includes("already exists")) {
        return { error: "Există deja un cont cu acest email." };
      }
      return { error: error.message };
    }

    if (!data.session || !data.user) {
      return {
        error:
          "Contul a fost creat, dar necesită confirmare prin email înainte de autentificare.",
      };
    }

    const user = await fetchProfileAsUser(supabase, data.user.id);
    set({ user, isAuthenticated: Boolean(user) });
    return {};
  },

  logout: async () => {
    const supabase = createClient();
    useMessagesStore.getState().unsubscribeRealtime();
    await supabase.auth.signOut();
    set({ user: null, isAuthenticated: false });
  },

  updateProfile: async ({ name, avatarUrl }) => {
    const current = get().user;
    if (!current) return { error: "Nu ești autentificat." };
    const supabase = createClient();
    const { error } = await supabase
      .from("profiles")
      .update({ name, avatar_url: avatarUrl ?? null })
      .eq("id", current.id);
    if (error) return { error: error.message };
    set({ user: { ...current, name, avatarUrl } });
    return {};
  },

  changePassword: async (currentPassword, newPassword) => {
    const current = get().user;
    if (!current) return { error: "Nu ești autentificat." };
    const supabase = createClient();
    const { error: verifyError } = await supabase.auth.signInWithPassword({
      email: current.email,
      password: currentPassword,
    });
    if (verifyError) return { error: "Parola curentă este incorectă." };
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });
    if (error) return { error: error.message };
    return {};
  },
}));
