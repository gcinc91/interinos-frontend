import { useMutation } from "@tanstack/react-query"

import { fetchDistances } from "@/services/api"
import type { DistanceDestination } from "@/types/api"

export function useDistance() {
  return useMutation({
    mutationFn: ({
      origin,
      destination,
    }: {
      origin: { lat: number; lon: number }
      destination: DistanceDestination
    }) => fetchDistances(origin, [destination]),
  })
}
