import { useQuery } from "@tanstack/react-query"

import { fetchRoute } from "@/services/api"

export function useRoute(
  origin: { lat: number; lon: number } | null,
  destination: { lat: number; lon: number } | null
) {
  return useQuery({
    queryKey: ["route", origin?.lat, origin?.lon, destination?.lat, destination?.lon],
    queryFn: () => fetchRoute(origin!, destination!),
    enabled: !!origin && !!destination,
    staleTime: 10 * 60 * 1000,
    retry: 1,
  })
}
