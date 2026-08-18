import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User, UserRole } from "@/types";
import type { LocalUserCredential, Profile } from "@/lib/db/schema";
import { SEED_CREDENTIALS } from "@/lib/db/seed";
import { generateId } from "@/lib/db/mappers";

interface AuthState {
  user: User | null;
  credentials: LocalUserCredential[];
  isAuthenticated: boolean;
  _hasHydrated: boolean;
  setHasHydrated: (v: boolean) => void;
  login: (email: string, password: string) => { error?: string };
  register: (data: {
    email: string;
    password: string;
    name: string;
    role: UserRole;
  }) => { error?: string };
  logout: () => void;
  updateProfile: (data: { name: string; avatarUrl?: string }) => void;
  changePassword: (
    currentPassword: string,
    newPassword: string
  ) => { error?: string };
}

function profileToUser(p: Profile): User {
  return {
    id: p.id,
    email: p.email,
    name: p.name,
    role: p.role,
    dirtPoints: p.dirtPoints,
  };
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      credentials: SEED_CREDENTIALS,
      isAuthenticated: false,
      _hasHydrated: false,
      setHasHydrated: (v) => set({ _hasHydrated: v }),

      login: (email, password) => {
        const cred = get().credentials.find(
          (c) =>
            c.email.toLowerCase() === email.toLowerCase() &&
            c.password === password
        );
        if (!cred) {
          return { error: "Email sau parolă incorectă." };
        }
        const user = profileToUser(cred.profile);
        set({ user, isAuthenticated: true });
        return {};
      },

      register: ({ email, password, name, role }) => {
        const exists = get().credentials.some(
          (c) => c.email.toLowerCase() === email.toLowerCase()
        );
        if (exists) {
          return { error: "Există deja un cont cu acest email." };
        }
        const profile: Profile = {
          id: generateId("user"),
          email,
          name,
          role,
          dirtPoints: 0,
          createdAt: new Date().toISOString(),
        };
        const cred: LocalUserCredential = { email, password, profile };
        const user = profileToUser(profile);
        set((s) => ({
          credentials: [...s.credentials, cred],
          user,
          isAuthenticated: true,
        }));
        return {};
      },

      logout: () => set({ user: null, isAuthenticated: false }),

      updateProfile: ({ name, avatarUrl }) => {
        const current = get().user;
        if (!current) return;
        set((s) => ({
          user: { ...current, name, avatarUrl },
          credentials: s.credentials.map((c) =>
            c.profile.id === current.id
              ? { ...c, profile: { ...c.profile, name, avatarUrl } }
              : c
          ),
        }));
      },

      changePassword: (currentPassword, newPassword) => {
        const current = get().user;
        if (!current) return { error: "Nu ești autentificat." };
        const cred = get().credentials.find(
          (c) => c.profile.id === current.id
        );
        if (!cred || cred.password !== currentPassword) {
          return { error: "Parola curentă este incorectă." };
        }
        set((s) => ({
          credentials: s.credentials.map((c) =>
            c.profile.id === current.id
              ? { ...c, password: newPassword }
              : c
          ),
        }));
        return {};
      },
    }),
    {
      name: "dirtbooking-auth",
      partialize: (s) => ({
        user: s.user,
        credentials: s.credentials,
        isAuthenticated: s.isAuthenticated,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
