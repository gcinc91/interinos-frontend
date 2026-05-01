import { useMutation } from "@tanstack/react-query"

import { geocodeAddress } from "@/services/api"

export function useGeocode() {
  return useMutation({
    mutationFn: (address: string) => geocodeAddress(address),
  })
}
