import { create } from "zustand";
import { persist } from "zustand/middleware";

interface User {
  id: string;
  nome: string;
  email: string;
  role: "cliente" | "profissional" | "admin_loja";
}

interface AuthState {
  accessToken: string | null;
  user: User | null;
  login: (token: string, user: User) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      user: null,
      login: (token, user) => set({ accessToken: token, user }),
      logout: () => set({ accessToken: null, user: null }),
    }),
    { name: "auth-storage" }
  )
);