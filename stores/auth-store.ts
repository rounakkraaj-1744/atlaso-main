import { create } from "zustand";

interface AuthUser {
  id: string;
  email?: string;
}

interface AuthStore {
  user?: AuthUser;
  setUser: (user?: AuthUser) => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: undefined,
  setUser: (user) => set({ user }),
}));
