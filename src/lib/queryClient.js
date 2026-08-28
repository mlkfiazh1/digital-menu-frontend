import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 30_000,
    },
  },
});

export const queryKeys = {
  me: ["me"],
  businesses: ["businesses"],
  menu: (slug) => ["menu", slug],
};
