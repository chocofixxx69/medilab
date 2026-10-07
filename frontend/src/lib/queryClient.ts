import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 30, // 30 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

export const queryKeys = {
  auth: {
    all: ["auth"] as const,
    me: () => ["auth", "me"] as const,
  },
  patients: {
    all: ["patients"] as const,
    lists: () => ["patients", "list"] as const,
    list: (params?: Record<string, unknown>) => ["patients", "list", params] as const,
    detail: (id: string) => ["patients", "detail", id] as const,
    history: (id: string) => ["patients", "history", id] as const,
    search: (query: string) => ["patients", "search", query] as const,
  },
  reports: {
    all: ["reports"] as const,
    lists: () => ["reports", "list"] as const,
    list: (params?: Record<string, unknown>) => ["reports", "list", params] as const,
    detail: (id: string) => ["reports", "detail", id] as const,
    preview: (id: string) => ["reports", "preview", id] as const,
  },
};
