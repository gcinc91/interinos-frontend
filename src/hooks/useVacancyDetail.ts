import { useQuery } from "@tanstack/react-query"

import { fetchVacancy } from "@/services/api"

export function useVacancyDetail(id: number | null) {
  return useQuery({
    queryKey: ["vacancy", id],
    queryFn: () => fetchVacancy(id as number),
    enabled: id !== null,
    staleTime: 60_000,
  })
}
