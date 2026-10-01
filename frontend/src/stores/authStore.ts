import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { User, AuthTokens } from "@/types";

export interface AuthState {
  user: User | null;
  tokens: AuthTokens | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  // Actions
  setUser: (user: User | null) => void;
  setTokens: (tokens: AuthTokens | null) => void;
  setAuth: (data: { user: User; accessToken: string; refreshToken: string }) => void;
  setAccessToken: (token: string | null) => void;
  login: (user: User, tokens: AuthTokens) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
  updateUser: (updates: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      tokens: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: true,

      setUser: (user) =>
        set({
          user,
          isAuthenticated: !!user,
        }),

      setTokens: (tokens) =>
        set({
          tokens,
          accessToken: tokens?.access_token || null,
          refreshToken: tokens?.refresh_token || null,
        }),

      setAuth: (data) =>
        set({
          user: data.user,
          accessToken: data.accessToken,
          refreshToken: data.refreshToken,
          tokens: {
            access_token: data.accessToken,
            refresh_token: data.refreshToken,
            token_type: "bearer",
          },
          isAuthenticated: true,
          isLoading: false,
        }),

      setAccessToken: (accessToken) =>
        set((state) => ({
          accessToken,
          tokens: state.tokens
            ? { ...state.tokens, access_token: accessToken || "" }
            : accessToken
            ? { access_token: accessToken, refresh_token: "", token_type: "bearer" }
            : null,
        })),

      login: (user, tokens) =>
        set({
          user,
          tokens,
          accessToken: tokens.access_token,
          refreshToken: tokens.refresh_token,
          isAuthenticated: true,
          isLoading: false,
        }),

      logout: () =>
        set({
          user: null,
          tokens: null,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
          isLoading: false,
        }),

      setLoading: (isLoading) => set({ isLoading }),

      updateUser: (updates) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...updates } : null,
        })),
    }),
    {
      name: "medinote-auth",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        tokens: state.tokens,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

// Selectors
export const selectUser = (state: AuthState) => state.user;
export const selectTokens = (state: AuthState) => state.tokens;
export const selectIsAuthenticated = (state: AuthState) => state.isAuthenticated;
export const selectAccessToken = (state: AuthState) => state.tokens?.access_token || state.accessToken;
