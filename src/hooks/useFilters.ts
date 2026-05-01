import { useQuery } from "@tanstack/react-query"

import { fetchFilters } from "@/services/api"

export function useFilters() {
  return useQuery({
    queryKey: ["filters"],
    queryFn: fetchFilters,
    staleTime: 5 * 60_000,
  })
}
