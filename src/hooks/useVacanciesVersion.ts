import { useQuery } from "@tanstack/react-query"

import { fetchVacanciesVersion } from "@/services/api"

export function useVacanciesVersion() {
  return useQuery({
    queryKey: ["vacancies-version"],
    queryFn: fetchVacanciesVersion,
    refetchInterval: 60_000,
    staleTime: 30_000,
  })
}
