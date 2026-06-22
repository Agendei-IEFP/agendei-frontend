import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { UserDTO } from "@/types/api";

interface AuthState {
  accessToken: string | null;
  user: UserDTO | null;
  login: (token: string, user: UserDTO) => void;
  logout: () => void;
  setAccessToken: (token: string) => void;
  setUser: (user: UserDTO) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      user: null,
      login: (token, user) => set({ accessToken: token, user }),
      logout: () => set({ accessToken: null, user: null }),
      setAccessToken: (token) => set({ accessToken: token }),
      setUser: (user) => set({ user }),
    }),
    {
      name: "auth-storage",

      partialize: (state) => ({ user: state.user }),
    },
  ),
);
